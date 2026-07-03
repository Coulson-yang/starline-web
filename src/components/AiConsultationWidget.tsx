"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "parent" | "assistant";
  content: string;
};

type AssistantResponse = {
  reply?: string;
  handoffRequired?: boolean;
  suggestedQuestions?: string[];
};

const endpoint = process.env.NEXT_PUBLIC_AI_ASSISTANT_ENDPOINT;

const starterQuestions = ["孩子零基础可以学吗？", "你们怎么收费？", "外教是哪里的？", "怎么预约试听？"];

const unavailableReply =
  "咨询助手正在接入中。您可以先点页面里的预约试听，或者添加老师微信咨询。涉及具体价格、排期、地址和优惠，我们也会以老师确认为准。";

export function AiConsultationWidget() {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "您好呀，我是英创起点课程咨询助手。可以先简单说说孩子几年级、英语基础怎么样，我帮您初步看看适合的课程方向。",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(starterQuestions);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasEndpoint = useMemo(() => Boolean(endpoint && endpoint.trim()), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setHasAppeared(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  function openWidget() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();
    if (!text || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "parent", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    if (!hasEndpoint) {
      window.setTimeout(() => {
        setMessages((current) => [...current, { role: "assistant", content: unavailableReply }]);
        setIsSending(false);
      }, 350);
      return;
    }

    try {
      const response = await fetch(endpoint as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(-8).map((item) => ({
            role: item.role === "parent" ? "user" : "assistant",
            content: item.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as AssistantResponse;
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "这个问题我需要请老师再确认一下，您可以留下孩子年级和想了解的方向，我帮您转人工跟进。",
        },
      ]);
      if (data.suggestedQuestions?.length) {
        setSuggestedQuestions(data.suggestedQuestions.slice(0, 4));
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "刚刚网络有点不稳定。您可以稍后再试，或者直接预约试听，让老师根据孩子情况给您更准确的建议。",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  if (!hasAppeared) {
    return null;
  }

  return (
    <div className="ai-consultation-pop fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="ai-consultation-panel flex h-[620px] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-white/15 bg-[#08111f]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">英创起点 AI 咨询</p>
              <p className="text-xs text-white/55">课程问题先初步了解，重要信息以老师确认为准</p>
            </div>
            <button
              type="button"
              aria-label="关闭 AI 咨询"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-white/70 transition hover:border-white/30 hover:text-white"
            >
              ×
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "parent" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    message.role === "parent"
                      ? "max-w-[82%] rounded-lg bg-accent px-3 py-2 text-sm leading-6 text-white"
                      : "max-w-[86%] rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm leading-6 text-white/85"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isSending ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/60">正在回复...</div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-accent/60 hover:text-white"
                >
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="输入想咨询的问题"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent/70"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                发送
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={openWidget}
          className="ai-consultation-beacon group relative flex items-center gap-3 overflow-visible rounded-full border border-white/15 bg-[#08111f]/90 py-2 pl-2 pr-4 text-left shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:border-accent/60"
          aria-label="打开 AI 课程咨询"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-accent/55" />
          <span className="pointer-events-none absolute -inset-2 rounded-full border border-accent/30" />
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white shadow-lg shadow-accent/20">
            <img src="/images/brand-logo.png" alt="英创起点" className="h-[124%] w-[124%] object-contain" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-white">课程咨询</span>
            <span className="block text-xs text-white/55 group-hover:text-white/70">问年龄、价格、试听</span>
          </span>
        </button>
      )}
    </div>
  );
}
