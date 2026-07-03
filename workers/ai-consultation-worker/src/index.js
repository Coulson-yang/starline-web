import { INSTITUTION_KNOWLEDGE } from "./knowledge.js";

const SYSTEM_PROMPT = `
你是英创起点官网上的家长课程咨询助手。你面对的是家长，不是内部运营人员。

必须遵守：
1. 只基于机构知识库回答，不编造价格、地址、优惠、排期、老师来源地。
2. 如果知识库没有明确写清楚，必须自然说明“这个需要老师再确认一下”。
3. 回复要像真人微信沟通，亲切、自然、简洁，不要官方腔。
4. 每次回复控制在 60-160 个中文字符左右。
5. 不承诺保证提分、一定开口、一定有效、学完必然领先同龄人。
6. 家长问价格时，先简短解释课程价值，再说明知识库里的价格。
7. 家长问孩子基础差、害羞、坐不住时，先安抚，再建议试听或让老师看孩子状态。
8. 家长投诉或情绪不好时，先安抚，并建议转人工老师处理。
9. 每次回复尽量给一个下一步动作，例如询问孩子年级、英语基础、预约试听、请老师确认。
10. 不要声称自己是真人老师，不要索要敏感个人信息。

只输出 JSON，不要输出 Markdown。格式：
{
  "reply": "给家长看的回复",
  "handoffRequired": false,
  "suggestedQuestions": ["孩子零基础可以学吗？", "怎么预约试听？", "你们怎么收费？"]
}
`.trim();

export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
    }

    if (!env.DEEPSEEK_API_KEY) {
      return jsonResponse({ error: "DeepSeek API key is not configured" }, 500, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
    }

    const message = String(payload.message || "").trim();
    const history = Array.isArray(payload.history) ? payload.history.slice(-8) : [];

    if (!message) {
      return jsonResponse({ error: "Message is required" }, 400, corsHeaders);
    }

    if (message.length > 500) {
      return jsonResponse({ error: "Message is too long" }, 400, corsHeaders);
    }

    try {
      const completion = await callDeepSeek(env, message, history);
      return jsonResponse(completion, 200, corsHeaders);
    } catch (error) {
      return jsonResponse(
        {
          reply: "刚刚咨询助手有点忙。您可以稍后再试，或者先预约试听，让老师根据孩子情况给您更准确的建议。",
          handoffRequired: true,
          suggestedQuestions: ["怎么预约试听？", "孩子零基础可以吗？", "你们怎么收费？"],
          error: error instanceof Error ? error.message : "Unknown error",
        },
        200,
        corsHeaders,
      );
    }
  },
};

async function callDeepSeek(env, message, history) {
  const baseUrl = env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = env.DEEPSEEK_MODEL || "deepseek-v4-pro";

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `【机构知识库】\n${INSTITUTION_KNOWLEDGE}` },
    ...normalizeHistory(history),
    { role: "user", content: message },
  ];

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed: ${response.status} ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  return parseAssistantJson(content);
}

function normalizeHistory(history) {
  return history
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: String(item?.content || "").slice(0, 500),
    }))
    .filter((item) => item.content);
}

function parseAssistantJson(content) {
  try {
    const parsed = JSON.parse(content);
    return {
      reply: String(parsed.reply || "").trim() || "这个问题我需要请老师确认一下，您可以先说下孩子几年级和英语基础吗？",
      handoffRequired: Boolean(parsed.handoffRequired),
      suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
        ? parsed.suggestedQuestions.map((item) => String(item)).slice(0, 4)
        : ["孩子零基础可以学吗？", "怎么预约试听？", "你们怎么收费？"],
    };
  } catch {
    return {
      reply: content.slice(0, 220) || "这个问题我需要请老师确认一下，您可以先说下孩子几年级和英语基础吗？",
      handoffRequired: false,
      suggestedQuestions: ["孩子零基础可以学吗？", "怎么预约试听？", "你们怎么收费？"],
    };
  }
}

function buildCorsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  const origin = allowedOrigin === "*" || allowedOrigin === requestOrigin ? allowedOrigin === "*" ? "*" : requestOrigin : allowedOrigin;

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
