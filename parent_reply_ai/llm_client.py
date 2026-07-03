"""DeepSeek API client using the OpenAI SDK compatible interface."""

from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH, override=True)


class DeepSeekConfigError(RuntimeError):
    """Raised when required DeepSeek configuration is missing."""


class DeepSeekAPIError(RuntimeError):
    """Raised when the DeepSeek API request fails."""


@dataclass(frozen=True)
class DeepSeekSettings:
    api_key: str
    base_url: str
    model: str

    @classmethod
    def from_env(cls) -> "DeepSeekSettings":
        return cls(
            api_key=os.getenv("DEEPSEEK_API_KEY", "").strip(),
            base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com").strip(),
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-v4-pro").strip(),
        )


class DeepSeekClient:
    def __init__(self, settings: DeepSeekSettings | None = None) -> None:
        self.settings = settings or DeepSeekSettings.from_env()

    @property
    def is_configured(self) -> bool:
        return _is_real_api_key(self.settings.api_key)

    def _client(self) -> OpenAI:
        if not self.is_configured:
            raise DeepSeekConfigError("未配置 DEEPSEEK_API_KEY，请先在 .env 文件中填写 DeepSeek API Key。")
        return OpenAI(api_key=self.settings.api_key, base_url=self.settings.base_url)

    def test_connection(self) -> str:
        try:
            response = self._client().chat.completions.create(
                model=self.settings.model,
                messages=[
                    {"role": "system", "content": "你是 API 连通性测试助手，只回复 OK。"},
                    {"role": "user", "content": "请回复 OK"},
                ],
                temperature=0,
                max_tokens=8,
            )
            content = response.choices[0].message.content or ""
            return content.strip() or "OK"
        except DeepSeekConfigError:
            raise
        except Exception as exc:  # noqa: BLE001 - surface provider errors in UI.
            raise DeepSeekAPIError(_format_api_error(exc)) from exc

    def generate_reply(self, messages: list[dict[str, str]]) -> dict[str, Any]:
        try:
            response = self._client().chat.completions.create(
                model=self.settings.model,
                messages=messages,
                temperature=0.4,
                max_tokens=1800,
            )
            content = response.choices[0].message.content or ""
            return parse_json_response(content)
        except DeepSeekConfigError:
            raise
        except ValueError as exc:
            raise DeepSeekAPIError(f"AI 返回内容不是有效 JSON：{exc}") from exc
        except Exception as exc:  # noqa: BLE001 - surface provider errors in UI.
            raise DeepSeekAPIError(_format_api_error(exc)) from exc


def parse_json_response(content: str) -> dict[str, Any]:
    text = content.strip()
    if not text:
        raise ValueError("返回内容为空")

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError(text[:500])
        data = json.loads(match.group(0))

    if not isinstance(data, dict):
        raise ValueError("JSON 顶层必须是对象")
    return data


def _format_api_error(exc: Exception) -> str:
    message = str(exc)
    status_code = getattr(exc, "status_code", None)
    if status_code:
        return f"DeepSeek API 请求失败，状态码：{status_code}，错误信息：{message}"
    return f"DeepSeek API 请求失败：{message}"


def _is_real_api_key(api_key: str) -> bool:
    normalized = api_key.strip().lower()
    if not normalized:
        return False
    placeholder_values = {
        "your_deepseek_api_key_here",
        "your_api_key_here",
        "你的deepseek_api_key",
        "你的deepseek_api_key_here",
        "sk-xxxxxxxx",
    }
    if normalized in placeholder_values:
        return False
    if "your_" in normalized or "api_key_here" in normalized:
        return False
    return True
