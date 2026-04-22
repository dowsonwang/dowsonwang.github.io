import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronLeft, SendHorizonal, Trash2 } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";
import { vocabWords } from "@/mocks/vocabWords";

type Msg = { id: string; role: "user" | "assistant"; content: string; streaming?: boolean };

const STORAGE_KEY = "ai_tool_mini_dict_v1";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function buildReply(query: string) {
  const q = normalize(query);
  const found = vocabWords.find((w) => w.term.toLowerCase() === q.toLowerCase());
  if (found) {
    const ex = found.example.sentence.replace("_____", found.term);
    const phon = found.phonetic ? `音标：${found.phonetic}\n` : "";
    return `单词：${found.term}\n${phon}释义：${found.meaning}\n例句：${ex}`;
  }
  const hasLatin = /[A-Za-z]/.test(q);
  const hint = hasLatin ? "（未收录，示例解释）" : "（未收录，示例翻译）";
  const example = hasLatin ? `例句：I used “${q}” in a sentence.` : `例句：${q}（示例）`;
  return `查询：${q}${hint}\n释义：稍后将补齐更准确的解释。\n${example}`;
}

function loadMsgs(): Msg[] {
  const hello: Msg = { id: uid("m"), role: "assistant", content: "Hello，请问你要查询什么单词？" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [hello];
    const parsed = JSON.parse(raw) as Array<Partial<Msg>>;
    if (!Array.isArray(parsed) || parsed.length === 0) return [hello];
    const normalized = parsed
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ id: String(m.id ?? uid("m")), role: m.role as Msg["role"], content: String(m.content ?? "") }));
    return normalized.length > 0 ? normalized : [hello];
  } catch {
    return [hello];
  }
}

function saveMsgs(msgs: Msg[]) {
  const safe = msgs.map((m) => ({ id: m.id, role: m.role, content: m.content }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
}

export default function MiniDict() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(() => loadMsgs());
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);

  useEffect(() => {
    saveMsgs(messages);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    };
  }, []);

  const canSend = useMemo(() => normalize(draft).length > 0, [draft]);

  const clear = () => {
    if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
    const hello: Msg = { id: uid("m"), role: "assistant", content: "Hello，请问你要查询什么单词？" };
    setMessages([hello]);
    setDraft("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const send = (text: string) => {
    const q = normalize(text);
    if (!q) return;
    if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
    const userMsg: Msg = { id: uid("m"), role: "user", content: q };
    const replyId = uid("m");
    const full = buildReply(q);
    const reply: Msg = { id: replyId, role: "assistant", content: "", streaming: true };
    setMessages((prev) => [...prev, userMsg, reply]);
    setDraft("");

    let i = 0;
    streamTimerRef.current = window.setInterval(() => {
      i += 1;
      const next = full.slice(0, Math.min(full.length, i));
      setMessages((prev) =>
        prev.map((m) => (m.id === replyId ? { ...m, content: next, streaming: next.length < full.length } : m)),
      );
      if (i >= full.length) {
        if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, 12);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    send(draft);
  };

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.08),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,249,255,0.78))]">
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">AI小词典</div>
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
                        {m.content || m.streaming ? (
                          <span>
                            {m.content}
                            {m.streaming ? <span className="ml-1 inline-block w-[6px] animate-pulse">▍</span> : null}
                          </span>
                        ) : (
                          "Hello，请问你要查询什么单词？"
                        )}
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
                  <div
                    className={cn(
                      "max-w-[84%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                      "bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white shadow-[0_14px_34px_rgba(8,184,255,0.20)]",
                    )}
                  >
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
            <div className="mr-[52px] text-[12px] font-semibold text-zinc-400">输入单词即可查询</div>
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="请输入单词…"
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
