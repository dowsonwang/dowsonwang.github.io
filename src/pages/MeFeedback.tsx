import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, SendHorizonal } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

export default function MeFeedback() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => normalize(draft).length > 0, [draft]);

  const showToast = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 1400);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setDraft("");
    showToast("已提交，感谢反馈");
  };

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),radial-gradient(900px_700px_at_90%_20%,rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">反馈问题</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 px-4 pb-8 pt-6">
          <div className="rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-[0_18px_55px_rgba(8,184,255,0.08)] backdrop-blur">
            <div className="text-[14px] font-semibold text-zinc-900">问题描述</div>
            <div className="mt-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="请描述你遇到的问题…"
                rows={8}
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-[14px] leading-relaxed text-zinc-900 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => showToast("提交后将由我们尽快处理")}
              className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-zinc-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-600)]" />
              提交后我们会尽快处理
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/60 bg-white/85 p-3 backdrop-blur">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]",
              canSubmit ? "bg-[color:var(--brand-600)]" : "bg-zinc-200 text-zinc-500 shadow-none active:scale-100",
            )}
          >
            <SendHorizonal className="h-5 w-5" />
            提交反馈
          </button>
        </form>

        {toast ? (
          <div className="pointer-events-none fixed inset-0 z-[60]">
            <div className="absolute bottom-[92px] left-1/2 w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 rounded-2xl bg-zinc-900/85 px-4 py-3 text-center text-[13px] font-medium text-white backdrop-blur">
              {toast}
            </div>
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
}

