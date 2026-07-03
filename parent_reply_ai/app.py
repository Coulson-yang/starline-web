from __future__ import annotations

import json
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

from llm_client import DeepSeekAPIError, DeepSeekClient, DeepSeekConfigError
from prompts import build_messages


APP_DIR = Path(__file__).resolve().parent
KNOWLEDGE_DOC_PATH = APP_DIR / "institution_knowledge.md"


def load_knowledge_document() -> str:
    if not KNOWLEDGE_DOC_PATH.exists():
        return ""
    return KNOWLEDGE_DOC_PATH.read_text(encoding="utf-8")


def clear_input() -> None:
    st.session_state.parent_message = ""
    st.session_state.analysis_result = None


def reload_knowledge_document() -> None:
    st.session_state.knowledge_base = load_knowledge_document()
    st.session_state.knowledge_status = "已读取本地机构知识文档"
    st.session_state.knowledge_error = ""


def init_state() -> None:
    if "knowledge_base" not in st.session_state:
        try:
            reload_knowledge_document()
        except Exception as exc:  # noqa: BLE001 - show readable setup errors in UI.
            st.session_state.knowledge_base = ""
            st.session_state.knowledge_status = "网站资料读取失败"
            st.session_state.knowledge_error = str(exc)
    if "parent_message" not in st.session_state:
        st.session_state.parent_message = ""
    if "analysis_result" not in st.session_state:
        st.session_state.analysis_result = None


def render_copy_button(text: str, button_key: str) -> None:
    text_json = json.dumps(text, ensure_ascii=False)
    button_id = f"copy_{button_key}"
    status_id = f"status_{button_key}"

    components.html(
        f"""
        <div style="display:flex;align-items:center;gap:8px;height:42px;">
          <button
            id="{button_id}"
            style="
              border:0;
              border-radius:8px;
              background:#14532d;
              color:white;
              cursor:pointer;
              font-size:14px;
              font-weight:600;
              padding:10px 16px;
              width:86px;
            "
          >
            复制
          </button>
          <span id="{status_id}" style="font-size:13px;color:#166534;"></span>
        </div>
        <script>
          const btn = document.getElementById("{button_id}");
          const status = document.getElementById("{status_id}");
          const text = {text_json};

          function fallbackCopy(value) {{
            const area = document.createElement("textarea");
            area.value = value;
            area.style.position = "fixed";
            area.style.left = "-9999px";
            document.body.appendChild(area);
            area.focus();
            area.select();
            document.execCommand("copy");
            document.body.removeChild(area);
          }}

          btn.addEventListener("click", async () => {{
            try {{
              if (navigator.clipboard && window.isSecureContext) {{
                await navigator.clipboard.writeText(text);
              }} else {{
                fallbackCopy(text);
              }}
              status.textContent = "已复制";
              setTimeout(() => status.textContent = "", 1600);
            }} catch (err) {{
              status.textContent = "复制失败，可手动选中复制";
              status.style.color = "#b91c1c";
            }}
          }});
        </script>
        """,
        height=52,
    )


def safe_get(data: dict, key: str, default: str = "未提供") -> str:
    value = data.get(key, default)
    if value is None or value == "":
        return default
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    return str(value)


def render_analysis(result: dict) -> None:
    key_info = result.get("key_info") or {}
    if not isinstance(key_info, dict):
        key_info = {}

    st.subheader("AI 分析结果")
    st.markdown(f"**家长意图分类：** {safe_get(result, 'intent_category', '未识别')}")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"**孩子年龄：** {safe_get(key_info, 'child_age')}")
        st.markdown(f"**孩子年级：** {safe_get(key_info, 'child_grade')}")
        st.markdown(f"**英语基础：** {safe_get(key_info, 'english_level')}")
        st.markdown(f"**意向等级：** {safe_get(key_info, 'intent_level', '未判断')}")
    with col2:
        st.markdown(f"**家长主要需求：** {safe_get(key_info, 'main_need')}")
        st.markdown(f"**家长顾虑：** {safe_get(key_info, 'concerns')}")
        st.markdown(f"**推荐下一步动作：** {safe_get(key_info, 'recommended_next_action', '未提供')}")

    notes = result.get("analysis_notes") or []
    if isinstance(notes, str):
        notes = [notes]
    if notes:
        with st.expander("分析备注 / 需要人工确认的信息", expanded=True):
            for note in notes:
                st.info(str(note))


def render_reply_cards(result: dict) -> None:
    replies = result.get("replies") or {}
    if not isinstance(replies, dict):
        st.warning("AI 返回的 replies 字段格式不正确。")
        return

    reply_specs = [
        ("温柔耐心版", "gentle"),
        ("成交推进版", "closing"),
        ("简短微信版", "short"),
    ]

    st.subheader("可复制微信回复")
    for title, reply_key in reply_specs:
        text = safe_get(replies, reply_key, "AI 未返回该版本回复")
        left, right = st.columns([0.82, 0.18], vertical_alignment="center")
        with left:
            st.text_area(
                title,
                value=text,
                height=138,
                key=f"reply_text_{reply_key}",
                label_visibility="visible",
            )
        with right:
            st.write("")
            render_copy_button(text, reply_key)


def main() -> None:
    st.set_page_config(
        page_title="英语外教启蒙机构家长咨询 AI 回复助手",
        page_icon="💬",
        layout="wide",
    )
    init_state()

    st.markdown(
        """
        <style>
        .block-container { padding-top: 2rem; padding-bottom: 3rem; }
        div[data-testid="stTextArea"] textarea { line-height: 1.6; }
        .small-muted { color: #64748b; font-size: 14px; }
        </style>
        """,
        unsafe_allow_html=True,
    )

    client = DeepSeekClient()

    st.title("英语外教启蒙机构家长咨询 AI 回复助手")
    st.caption("本地 Streamlit 版本：后台读取机构知识文档，手动粘贴家长消息后生成 3 个微信回复版本。")

    with st.sidebar:
        st.header("DeepSeek 配置")
        st.write(f"Base URL：`{client.settings.base_url}`")
        st.write(f"模型：`{client.settings.model}`")
        if client.is_configured:
            st.success("已检测到 API Key")
        else:
            st.error("未检测到 API Key，请先配置 .env 文件。")

        if st.button("测试 API 连接", use_container_width=True):
            if not client.is_configured:
                st.error("未配置 DEEPSEEK_API_KEY，请先在 .env 文件中填写 API Key。")
            else:
                with st.spinner("正在测试 DeepSeek API 连接..."):
                    try:
                        test_result = client.test_connection()
                        st.success(f"连接成功：{test_result}")
                    except (DeepSeekConfigError, DeepSeekAPIError) as exc:
                        st.error(str(exc))

        st.divider()
        st.header("机构资料")
        if st.session_state.get("knowledge_base"):
            st.success(st.session_state.get("knowledge_status", "已读取网站资料"))
        else:
            st.error(st.session_state.get("knowledge_status", "未读取到网站资料"))
        if st.session_state.get("knowledge_error"):
            st.caption(st.session_state.knowledge_error)
        st.caption(f"来源：{KNOWLEDGE_DOC_PATH}")
        if st.button("重新加载知识文档", use_container_width=True):
            try:
                reload_knowledge_document()
                st.success("已重新加载知识文档。")
            except Exception as exc:  # noqa: BLE001 - show readable setup errors in UI.
                st.session_state.knowledge_base = ""
                st.session_state.knowledge_status = "知识文档读取失败"
                st.session_state.knowledge_error = str(exc)
                st.error(str(exc))

    st.header("一、家长消息输入")
    st.text_area(
        "粘贴家长原始消息",
        key="parent_message",
        height=170,
        placeholder="例如：孩子现在二年级，英语基础不太好，可以报吗？",
    )

    action_col1, action_col2, action_col3 = st.columns([0.22, 0.18, 0.6])
    with action_col1:
        generate_clicked = st.button("生成回复", type="primary", use_container_width=True)
    with action_col2:
        st.button("清空输入", on_click=clear_input, use_container_width=True)

    if generate_clicked:
        parent_message = st.session_state.parent_message.strip()
        knowledge_base = st.session_state.knowledge_base.strip()

        if not client.is_configured:
            st.error("未配置 DEEPSEEK_API_KEY，请先复制 .env.example 为 .env，并填写你的 DeepSeek API Key。")
        elif not knowledge_base:
            st.error("未读取到本地机构知识文档，请先检查 institution_knowledge.md 是否存在。")
        elif not parent_message:
            st.warning("请先粘贴家长消息。")
        else:
            with st.spinner("正在分析家长意图并生成微信回复..."):
                try:
                    messages = build_messages(knowledge_base, parent_message)
                    st.session_state.analysis_result = client.generate_reply(messages)
                except (DeepSeekConfigError, DeepSeekAPIError) as exc:
                    st.session_state.analysis_result = None
                    st.error(str(exc))

    st.divider()

    st.header("二、AI 分析和回复")
    if st.session_state.analysis_result:
        render_analysis(st.session_state.analysis_result)
        st.divider()
        render_reply_cards(st.session_state.analysis_result)
    else:
        st.info("点击“生成回复”后，这里会显示家长意图、关键信息和 3 个微信回复版本。")


if __name__ == "__main__":
    main()
