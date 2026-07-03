# 英语外教启蒙机构家长咨询 AI 回复助手

这是一个本地版 Python + Streamlit Web 应用。你可以手动复制家长微信消息进来，系统会识别家长意图、提取关键信息，并生成 3 个可复制的微信回复版本。

## 项目结构

```text
parent_reply_ai/
  app.py                # Streamlit 主程序
  llm_client.py         # DeepSeek API 调用封装
  prompts.py            # 系统提示词和用户提示词模板
  institution_knowledge.md # 一次性整理好的机构咨询知识文档
  knowledge_base.txt    # 旧版本地知识库模板，当前页面默认不使用
  .env.example          # 环境变量示例
  requirements.txt      # Python 依赖
  README.md             # 启动说明
```

## 1. 创建项目文件夹

如果你从零开始创建，可以在 Windows PowerShell 中执行：

```powershell
mkdir parent_reply_ai
cd parent_reply_ai
```

当前仓库里已经创建好了 `parent_reply_ai` 文件夹，直接进入即可：

```powershell
cd parent_reply_ai
```

## 2. 创建并启用虚拟环境

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

如果 PowerShell 阻止脚本运行，可以先执行：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

然后重新启用虚拟环境。

## 3. 安装依赖

```powershell
pip install -r requirements.txt
```

## 4. 配置 .env

复制示例配置：

```powershell
copy .env.example .env
```

打开 `.env`，填入你的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
```

注意：不要把真实 API Key 提交到代码仓库。

## 5. 运行 Streamlit

最简单方式：双击 `start_parent_reply_ai.bat`。

也可以在 PowerShell 里手动运行：

```powershell
streamlit run app.py
```

浏览器会自动打开本地页面。通常地址是：

```text
http://localhost:8501
```

## 6. 测试 DeepSeek API 是否连接成功

打开页面后，看左侧栏：

1. 如果显示“未检测到 API Key”，先检查 `.env` 是否存在，且是否填写了 `DEEPSEEK_API_KEY`。
2. 点击“测试 API 连接”。
3. 如果成功，会显示“连接成功”。
4. 如果失败，页面会显示具体错误，例如 API Key 错误、模型名错误、网络连接失败等。

## 使用方式

1. 页面会在后台读取 `institution_knowledge.md` 作为机构知识库。
2. 机构知识库不会在页面正文展示，只在左侧栏显示读取状态。
3. 在“家长消息输入”里粘贴家长原始微信消息。
4. 点击“生成回复”。
5. 查看 AI 分析结果，并复制合适的微信回复版本。

## 后台知识库

`institution_knowledge.md` 是从 yingchuang-site 网站现有内容一次性整理出来的，不会在运行时实时读取网站数据。当前知识文档包含：

- 机构名称、定位、班级数量、学生数量、累计课时
- 课程类型、适合年龄、教材方向
- 学期班、假期班、VIP 班价格与课时
- 上课时间窗口、班级示例、容量与在读人数
- 老师姓名、来源地、经验年限与介绍
- 中外教联合授课方式
- 退费说明

知识文档中没有明确提供的信息，例如详细地址、当前优惠活动、完整试听流程，会被标记为需要人工确认，AI 不会编造。后续如果机构信息变化，直接编辑 `institution_knowledge.md`，然后在页面左侧点击“重新加载知识文档”即可。

## 后续扩展方向

### 扩展成家长跟进表

可以新增一个本地 `SQLite` 数据库，保存每次咨询记录：

- 家长昵称
- 孩子年龄 / 年级
- 英语基础
- 家长需求和顾虑
- 意向等级
- 最近一次沟通内容
- 下一步跟进动作
- 下次跟进时间
- 是否已试听 / 是否已报名

页面上可以增加“保存为跟进记录”“查看待跟进家长”“按意向等级筛选”等功能。

### 扩展成企业微信版本

第一阶段建议仍然保留人工确认，不自动发送：

- 接入企业微信客户联系或客服接口
- 拉取家长消息
- AI 生成建议回复
- 运营人员确认后再发送

第二阶段再考虑半自动化：

- 对常见问题自动生成草稿
- 对投诉、价格争议、退款等高风险消息强制人工介入
- 保存完整沟通记录，方便复盘转化率和跟进效果
