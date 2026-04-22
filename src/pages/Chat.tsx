import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Languages, Phone, SendHorizonal, Video, Volume2 } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { chatMessagesById, chatSummaries, ChatMessage } from "@/mocks/chats";
import { teachers } from "@/mocks/teachers";
import { topics } from "@/mocks/topics";
import { cn } from "@/lib/utils";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function AiAvatar({ seed }: { seed: string }) {
  const prompt =
    "realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus";
  return (
    <img
      alt=""
      loading="lazy"
      className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-white/60"
      src={makeAiImageUrl(`${prompt}, subtle variation seed ${seed}`, "square")}
    />
  );
}

function UserAvatar() {
  const prompt =
    "realistic portrait photo of a friendly person, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus";
  return (
    <img
      alt=""
      loading="lazy"
      className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-white/60"
      src={makeAiImageUrl(`${prompt}, subtle variation seed user`, "square")}
    />
  );
}

function mockTranslate(text: string) {
  const hasLatin = /[A-Za-z]/.test(text);
  if (hasLatin) return `中文翻译（mock）：${text}`;
  return `English (mock): ${text}`;
}

export default function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const summary = useMemo(() => {
    if (!params.chatId) return undefined;
    return chatSummaries.find((c) => c.id === params.chatId);
  }, [params.chatId]);

  const teacherId = searchParams.get("teacherId") ?? summary?.teacherId ?? undefined;
  const topicId = searchParams.get("topicId") ?? summary?.topicId ?? undefined;
  const teacher = useMemo(() => teachers.find((t) => t.id === teacherId), [teacherId]);
  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);

  const initialMessages = useMemo(() => {
    const chatId = params.chatId;
    if (chatId && chatMessagesById[chatId]) return chatMessagesById[chatId];

    const intro = topic
      ? `我们用「${topic.title}」来练习。你先用一句话开场，然后我会纠错并追问。`
      : "我们开始口语练习吧：你先随便说一句今天的状态，我来接话。";

    const hello = teacher ? `你好，我是 ${teacher.name}。` : "你好，我是你的 AI 外教。";
    const message: ChatMessage = { id: uid("m"), role: "assistant", content: `${hello}${intro}`, createdAt: "现在" };
    return [message];
  }, [params.chatId, teacher, topic]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [translateOn, setTranslateOn] = useState(false);
  const [callSheetOpen, setCallSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const title = teacher ? teacher.name : "对话";

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1500);
  };

  const speak = (text: string) => {
    const speech = window.speechSynthesis;
    if (!speech) {
      showToast("当前环境不支持朗读");
      return;
    }
    speech.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = /[A-Za-z]/.test(text) ? "en-US" : "zh-CN";
    speech.speak(utter);
  };

  const send = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: uid("m"), role: "user", content: trimmed, createdAt: "现在" }]);
    setDraft("");
    setTyping(true);

    window.setTimeout(() => {
      const replyBase = topic
        ? `不错。我们继续围绕「${topic.title}」：请用更具体的细节扩展一下，并补充一个原因。`
        : "不错。再来一句更自然的表达：你可以加上原因或具体例子。";
      setMessages((prev) => [...prev, { id: uid("m"), role: "assistant", content: replyBase, createdAt: "现在" }]);
      setTyping(false);
    }, 650);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typing) return;
    send(draft);
  };

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
        <header className="flex items-center justify-between border-b border-white/60 bg-white/70 px-3 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-900 shadow-sm active:scale-[0.98]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-[16px] font-semibold text-zinc-900">{title}</div>
          <div className="w-9" />
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" ? <AiAvatar seed={teacherId ?? "teacher"} /> : null}
                <div className={cn("max-w-[78%]", m.role === "user" && "flex flex-col items-end")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                      m.role === "user"
                        ? "bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white shadow-[0_14px_34px_rgba(8,184,255,0.22)]"
                        : "border border-white/60 bg-white/80 text-zinc-900 backdrop-blur",
                    )}
                  >
                    {m.content}
                  </div>

                  {m.role === "assistant" ? (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTranslateOn((v) => !v)}
                        className={cn(
                          "grid h-7 w-7 place-items-center rounded-full border border-white/60 bg-white/75 text-zinc-700 backdrop-blur active:scale-[0.98]",
                          translateOn && "text-[color:var(--brand-600)]",
                        )}
                        aria-label="翻译"
                      >
                        <Languages className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => speak(m.content)}
                        className="grid h-7 w-7 place-items-center rounded-full border border-white/60 bg-white/75 text-zinc-700 backdrop-blur active:scale-[0.98]"
                        aria-label="朗读"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}

                  {m.role === "assistant" && translateOn ? (
                    <div className="mt-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-[12px] leading-relaxed text-zinc-600 backdrop-blur">
                      {mockTranslate(m.content)}
                    </div>
                  ) : null}
                </div>
                {m.role === "user" ? <UserAvatar /> : null}
              </div>
            ))}
            {typing ? (
              <div className="flex items-end gap-2">
                <AiAvatar seed={teacherId ?? "teacher"} />
                <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-[14px] text-zinc-500 backdrop-blur">
                  正在输入…
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/60 bg-white/85 p-3 backdrop-blur">
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => setCallSheetOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 text-zinc-800 shadow-sm active:scale-[0.98]"
              aria-label="发起通话"
            >
              <Phone className="h-4 w-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="输入一句话开始练习…"
              className="h-9 flex-1 bg-transparent text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={typing || !draft.trim()}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white transition active:scale-[0.98]",
                (typing || !draft.trim()) && "bg-zinc-300 text-zinc-100 active:scale-100",
              )}
            >
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div
          className={cn(
            "absolute inset-0 z-50 flex items-end justify-center",
            callSheetOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
          aria-hidden={!callSheetOpen}
        >
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              callSheetOpen ? "bg-black/35" : "bg-black/0",
            )}
            onClick={() => setCallSheetOpen(false)}
          />
          <section
            className={cn(
              "relative w-full bg-[#F2F3F5] px-3 pb-3 pt-2 transition-transform duration-300",
              callSheetOpen ? "translate-y-0" : "translate-y-full",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="选择通话方式"
          >
            <div className="overflow-hidden rounded-2xl bg-white">
              <button
                type="button"
                onClick={() => {
                  setCallSheetOpen(false);
                  const sp = new URLSearchParams();
                  if (teacherId) sp.set("teacherId", teacherId);
                  navigate(`/call/audio?${sp.toString()}`);
                }}
                className="flex w-full items-center gap-3 px-4 py-4 text-[16px] font-semibold text-zinc-900 active:bg-zinc-50"
              >
                <Phone className="h-5 w-5 text-zinc-700" />
                语音通话
              </button>
              <div className="h-px bg-zinc-100" />
              <button
                type="button"
                onClick={() => {
                  setCallSheetOpen(false);
                  const sp = new URLSearchParams();
                  if (teacherId) sp.set("teacherId", teacherId);
                  navigate(`/call/video?${sp.toString()}`);
                }}
                className="flex w-full items-center gap-3 px-4 py-4 text-[16px] font-semibold text-zinc-900 active:bg-zinc-50"
              >
                <Video className="h-5 w-5 text-zinc-700" />
                视频通话
              </button>
            </div>
          </section>
        </div>

        {toast ? (
          <div className="fixed bottom-[92px] left-1/2 z-[60] w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 rounded-2xl bg-zinc-900/85 px-4 py-3 text-center text-[13px] font-medium text-white backdrop-blur">
            {toast}
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
}
