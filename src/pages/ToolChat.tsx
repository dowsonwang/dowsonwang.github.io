import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronLeft, SendHorizonal, Trash2 } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string; streaming?: boolean };

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

type ToolId =
  | "sentence-parse"
  | "essay-polish"
  | "word-memory"
  | "sentence-polish"
  | "grammar"
  | "zh-en"
  | "synonyms"
  | "eq-reply"
  | "long-sentence";

type ToolConfig = {
  title: string;
  placeholder: string;
  hint: string;
  hello: string;
  buildReply: (input: string) => string;
};

function buildConfig(id: ToolId): ToolConfig {
  if (id === "sentence-parse") {
    return {
      title: "句子成分分析",
      placeholder: "请输入英文句子…",
      hint: "输入一句英文句子即可分析",
      hello: "请发送一句英文句子，我来分析句子成分。",
      buildReply: (input) =>
        `句子：${input}\n\n结构拆解（示例）：\n- 主语：…\n- 谓语：…\n- 宾语：…\n- 修饰/从句：…\n\n要点：\n- 先找谓语动词，再定位主语\n- 从句用连接词识别（that/which/when/if 等）`,
    };
  }
  if (id === "essay-polish") {
    return {
      title: "作文批改润色",
      placeholder: "请输入一段英文…",
      hint: "输入一段英文即可润色",
      hello: "把你的英文段落发我，我来做纠错与润色。",
      buildReply: (input) =>
        `原文：\n${input}\n\n润色版（示例）：\n${input}\n\n建议：\n- 调整用词更自然\n- 句子结构更清晰\n- 逻辑连接更顺畅`,
    };
  }
  if (id === "word-memory") {
    return {
      title: "单词记忆助手",
      placeholder: "请输入要记的单词…",
      hint: "输入单词即可给你记忆法",
      hello: "发一个单词，我给你记忆法、联想和例句。",
      buildReply: (input) =>
        `单词：${input}\n\n记忆法（示例）：\n- 联想：…\n- 拆分：…\n\n例句（示例）：\nI tried to use “${input}” in a sentence.\n\n搭配（示例）：\n- ${input} + …`,
    };
  }
  if (id === "sentence-polish") {
    return {
      title: "句子润色扩写",
      placeholder: "请输入一句话…",
      hint: "输入一句话即可润色/扩写",
      hello: "把你的句子发我，我给你更自然的表达。",
      buildReply: (input) =>
        `原句：${input}\n\n润色（3 个版本）：\n1) ${input}\n2) ${input}\n3) ${input}\n\n扩写（示例）：\n${input}（补充原因/细节/语气）`,
    };
  }
  if (id === "grammar") {
    return {
      title: "语法讲解",
      placeholder: "请输入句子或语法点…",
      hint: "输入句子即可讲解语法",
      hello: "发一句英文或一个语法点，我来用简单方式讲清楚。",
      buildReply: (input) =>
        `讲解对象：${input}\n\n语法要点（示例）：\n- 结构：…\n- 用法：…\n- 常见错误：…\n\n例句（示例）：\n- …\n- …`,
    };
  }
  if (id === "zh-en") {
    return {
      title: "中译英助手",
      placeholder: "请输入中文…",
      hint: "输入中文即可生成英文表达",
      hello: "把中文发我，我给你更自然的英文表达（多版本）。",
      buildReply: (input) =>
        `中文：${input}\n\n英文表达（3 个版本）：\n1) …\n2) …\n3) …\n\n更口语版：\n- …`,
    };
  }
  if (id === "synonyms") {
    return {
      title: "同义词替换",
      placeholder: "请输入句子或关键词…",
      hint: "输入关键词/句子即可替换",
      hello: "发一个词或一句话，我帮你做同义替换（更地道）。",
      buildReply: (input) =>
        `原文：${input}\n\n可替换词（示例）：\n- … → … / … / …\n\n改写句子（示例）：\n- …`,
    };
  }
  if (id === "eq-reply") {
    return {
      title: "高情商英文回复",
      placeholder: "请输入对方的话…",
      hint: "输入对方的话即可生成回复",
      hello: "把对方的话发我，我给你礼貌得体的英文回复。",
      buildReply: (input) =>
        `对方：${input}\n\n回复（3 个版本）：\n1) …\n2) …\n3) …\n\n更委婉版：\n- …`,
    };
  }
  return {
    title: "长难句解析",
    placeholder: "请输入英文长句…",
    hint: "输入长难句即可解析",
    hello: "发一条英文长难句，我来拆结构并解释。",
    buildReply: (input) =>
      `原句：${input}\n\n结构拆解（示例）：\n- 主句：…\n- 从句：…\n- 修饰：…\n\n直译（示例）：\n- …\n\n意译（示例）：\n- …`,
  };
}

function loadMsgs(key: string, hello: string): Msg[] {
  const first: Msg = { id: uid("m"), role: "assistant", content: hello };
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [first];
    const parsed = JSON.parse(raw) as Array<Partial<Msg>>;
    if (!Array.isArray(parsed) || parsed.length === 0) return [first];
    const normalized = parsed
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ id: String(m.id ?? uid("m")), role: m.role as Msg["role"], content: String(m.content ?? "") }));
    return normalized.length > 0 ? normalized : [first];
  } catch {
    return [first];
  }
}

function saveMsgs(key: string, msgs: Msg[]) {
  const safe = msgs.map((m) => ({ id: m.id, role: m.role, content: m.content }));
  localStorage.setItem(key, JSON.stringify(safe));
}

export default function ToolChat({ toolId }: { toolId: ToolId }) {
  const navigate = useNavigate();
  const config = useMemo(() => buildConfig(toolId), [toolId]);
  const storageKey = `ai_tool_${toolId}_v1`;
  const [messages, setMessages] = useState<Msg[]>(() => loadMsgs(storageKey, config.hello));
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);

  useEffect(() => {
    saveMsgs(storageKey, messages);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, storageKey]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    };
  }, []);

  const canSend = useMemo(() => normalize(draft).length > 0, [draft]);

  const clear = () => {
    if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
    const hello: Msg = { id: uid("m"), role: "assistant", content: config.hello };
    setMessages([hello]);
    setDraft("");
    localStorage.removeItem(storageKey);
  };

  const send = (text: string) => {
    const q = normalize(text);
    if (!q) return;
    if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
    const userMsg: Msg = { id: uid("m"), role: "user", content: q };
    const replyId = uid("m");
    const full = config.buildReply(q);
    const reply: Msg = { id: replyId, role: "assistant", content: "", streaming: true };
    setMessages((prev) => [...prev, userMsg, reply]);
    setDraft("");

    let i = 0;
    streamTimerRef.current = window.setInterval(() => {
      i += 1;
      const next = full.slice(0, Math.min(full.length, i));
      setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: next, streaming: next.length < full.length } : m)));
      if (i >= full.length) {
        if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, 10);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    send(draft);
  };

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.08),transparent_60%),radial-gradient(900px_700px_at_90%_20%,rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,249,255,0.78))]">
        <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur">
          <div className="relative flex items-center px-3 py-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-900 shadow-sm active:scale-[0.98]"
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">{config.title}</div>
            <div className="ml-auto w-9" />
          </div>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" ? (
                  <div className="flex items-start gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#08B8FF,#10B981)] text-white shadow-[0_12px_30px_rgba(8,184,255,0.22)]">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="relative max-w-[84%]">
                      {m.streaming ? (
                        <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-[linear-gradient(135deg,rgba(8,184,255,0.30),rgba(16,185,129,0.22),rgba(255,255,255,0.0))] blur-xl animate-pulse" />
                      ) : null}
                      <div
                        className={cn(
                          "whitespace-pre-line rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                          m.streaming
                            ? "border border-white/70 bg-[linear-gradient(135deg,rgba(8,184,255,0.14),rgba(16,185,129,0.10),rgba(255,255,255,0.86))] text-zinc-900 backdrop-blur"
                            : "border border-white/60 bg-white/85 text-zinc-900 backdrop-blur",
                        )}
                      >
                        <span>
                          {m.content}
                          {m.streaming ? <span className="ml-1 inline-block w-[6px] animate-pulse">▍</span> : null}
                        </span>
                      </div>
                      {m.streaming ? (
                        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-zinc-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-600)] animate-pulse" />
                          正在生成结果…
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[84%] whitespace-pre-line rounded-2xl bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-500)] px-4 py-3 text-[14px] leading-relaxed text-white shadow-[0_14px_34px_rgba(8,184,255,0.20)]">
                    {m.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/60 bg-white/85 p-3 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 text-[12px] font-semibold text-zinc-700 shadow-sm backdrop-blur active:scale-[0.99]"
            >
              <Trash2 className="h-3.5 w-3.5 text-zinc-500" />
              清除记录
            </button>
            <div className="mr-[52px] text-[12px] font-semibold text-zinc-400">{config.hint}</div>
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={config.placeholder}
              className="h-11 flex-1 rounded-2xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none"
            />
            <button
              type="submit"
              disabled={!canSend}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-2xl text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]",
                canSend ? "bg-[color:var(--brand-600)]" : "bg-zinc-200 text-zinc-500 shadow-none active:scale-100",
              )}
              aria-label="发送"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </PhoneFrame>
  );
}
