import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpenCheck, BookPlus, ChevronLeft, Check, Flame, Layers3, Plus, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { wordBooks, type WordBook } from "@/mocks/wordbooks";
import { clampInt, dayKey, loadVocabState, saveVocabState, type StudyPlan, type VocabState } from "@/lib/vocabStore";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function usePhoneFrameRect() {
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector<HTMLElement>("[data-phone-frame]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  return rect;
}

function PlanRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-4 py-4 backdrop-blur">
      <div className="text-[14px] font-semibold text-zinc-900">{label}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(value - 5)}
          className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 text-[16px] font-semibold text-zinc-800 active:scale-[0.98]"
          aria-label="减少"
        >
          -
        </button>
        <input
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          inputMode="numeric"
          className="h-9 w-[72px] rounded-xl border border-zinc-200 bg-white text-center text-[14px] font-semibold text-zinc-900 outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(value + 5)}
          className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 text-[16px] font-semibold text-zinc-800 active:scale-[0.98]"
          aria-label="增加"
        >
          +
        </button>
      </div>
    </div>
  );
}

function BookCard({
  book,
  onAdd,
  disabled,
  footerSlot,
}: {
  book: WordBook;
  onAdd?: () => void;
  disabled?: boolean;
  footerSlot?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[color:var(--brand-600)]/10" />
      <div className="pointer-events-none absolute -right-20 -bottom-16 h-48 w-48 rounded-full bg-emerald-400/10" />
      <div className="flex gap-4 p-4">
        <div className="aspect-[3/4] w-[108px] shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
          <img alt="" loading="lazy" className="h-full w-full object-cover" src={makeAiImageUrl(book.coverPrompt, "portrait_4_3")} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[18px] font-semibold text-zinc-900">{book.title}</div>
              <div className="mt-1 text-[12px] font-medium text-zinc-500">{book.wordCount} 词</div>
            </div>
            {onAdd ? (
              <button
                type="button"
                onClick={onAdd}
                disabled={disabled}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-2xl text-white shadow-[0_14px_40px_rgba(8,184,255,0.24)] active:scale-[0.98]",
                  disabled ? "bg-zinc-200 text-zinc-500 shadow-none active:scale-100" : "bg-[color:var(--brand-600)]",
                )}
                aria-label="添加"
              >
                {disabled ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            ) : null}
          </div>
          <div className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-zinc-600">
            选择单词书后将为你生成学习计划，按天推进更轻松。
          </div>
          {footerSlot ? <div className="mt-3">{footerSlot}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function Vocab() {
  const navigate = useNavigate();
  const [state, setState] = useState<VocabState>(() => loadVocabState());
  const [selecting, setSelecting] = useState<boolean>(() => {
    const s = loadVocabState();
    return s.books.length === 0;
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modeSheetOpen, setModeSheetOpen] = useState(false);
  const [pendingBook, setPendingBook] = useState<WordBook | null>(null);
  const [draftPlan, setDraftPlan] = useState<StudyPlan>({ dailyNew: 20, dailyReview: 30 });
  const [toast, setToast] = useState<string | null>(null);
  const phoneRect = usePhoneFrameRect();

  useEffect(() => {
    saveVocabState(state);
  }, [state]);

  const addedBookIds = useMemo(() => new Set(state.books.map((b) => b.id)), [state.books]);
  const addedBooks = useMemo(() => wordBooks.filter((b) => addedBookIds.has(b.id)), [addedBookIds]);
  const todayPlan = useMemo(() => {
    const dailyNew = state.books.reduce((sum, b) => sum + b.plan.dailyNew, 0);
    const dailyReview = state.books.reduce((sum, b) => sum + b.plan.dailyReview, 0);
    return { dailyNew, dailyReview };
  }, [state.books]);

  const totalWords = useMemo(
    () => addedBooks.reduce((sum, b) => sum + b.wordCount, 0),
    [addedBooks],
  );

  const overallProgress = totalWords > 0 ? Math.min(1, state.learnedTotal / totalWords) : 0;

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1500);
  };

  const openPlanSheet = (book: WordBook) => {
    setPendingBook(book);
    const existing = state.books.find((b) => b.id === book.id);
    setDraftPlan(existing?.plan ?? { dailyNew: 20, dailyReview: 30 });
    setSheetOpen(true);
  };

  const confirmAdd = () => {
    if (!pendingBook) return;
    const plan: StudyPlan = {
      dailyNew: clampInt(draftPlan.dailyNew, 5, 200),
      dailyReview: clampInt(draftPlan.dailyReview, 5, 300),
    };
    setState((prev) => {
      const exists = prev.books.some((b) => b.id === pendingBook.id);
      return {
        ...prev,
        books: exists
          ? prev.books.map((b) => (b.id === pendingBook.id ? { ...b, plan } : b))
          : [...prev.books, { id: pendingBook.id, addedAt: new Date().toISOString(), plan }],
      };
    });
    setSheetOpen(false);
    setSelecting(false);
    showToast("已添加单词书");
  };

  const headerTitle = selecting ? "选择单词书" : "AI背单词";

  return (
    <div className="relative min-h-full pb-6">
      <header className="sticky top-0 z-10 border-b border-white/60 bg-[linear-gradient(180deg,rgba(242,249,255,0.92),rgba(255,255,255,0.72))] backdrop-blur">
        <div className="relative flex items-center px-3 py-3">
          <button
            type="button"
            onClick={() => {
              if (selecting && state.books.length > 0) setSelecting(false);
              else navigate("/");
            }}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-900 shadow-sm active:scale-[0.98]",
              !selecting && "opacity-0 pointer-events-none",
            )}
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">{headerTitle}</div>
          <div className="w-9" />
        </div>
      </header>

      <div className="px-4 pt-4">
        {selecting ? (
          <div className="space-y-4">
            <div className="space-y-4">
              {wordBooks.map((b) => (
                <BookCard
                  key={b.id}
                  book={b}
                  onAdd={() => openPlanSheet(b)}
                  disabled={addedBookIds.has(b.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
              <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full bg-[color:var(--brand-600)]/12" />
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold text-zinc-900">今日学习计划</div>
                <div className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-600)]/12 px-3 py-1 text-[12px] font-semibold text-[color:var(--brand-600)]">
                  <Sparkles className="h-4 w-4" />
                  计划中
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-zinc-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-500">
                    <Flame className="h-4 w-4 text-orange-500" />
                    今日新词
                  </div>
                  <div className="mt-2 text-[22px] font-semibold text-zinc-900">{todayPlan.dailyNew}</div>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-4">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-500">
                    <RefreshCw className="h-4 w-4 text-emerald-600" />
                    今日复习
                  </div>
                  <div className="mt-2 text-[22px] font-semibold text-zinc-900">{todayPlan.dailyReview}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModeSheetOpen(true)}
                disabled={todayPlan.dailyNew + todayPlan.dailyReview === 0}
                className={cn(
                  "mt-4 w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] py-3 text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]",
                  todayPlan.dailyNew + todayPlan.dailyReview === 0 && "bg-zinc-300 text-zinc-100 shadow-none active:scale-100",
                )}
              >
                开始学习
              </button>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
              <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/10" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900">
                  <BarChart3 className="h-4 w-4 text-[color:var(--brand-600)]" />
                  学习记录
                </div>
                <div className="text-[12px] font-semibold text-zinc-500">{Math.round(overallProgress * 100)}%</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="text-[12px] font-semibold text-zinc-500">累计背诵</div>
                  <div className="mt-1 text-[20px] font-semibold text-zinc-900">{state.learnedTotal}</div>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                  <div className="text-[12px] font-semibold text-zinc-500">已背单词书</div>
                  <div className="mt-1 text-[20px] font-semibold text-zinc-900">{state.books.length}</div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)]"
                  style={{ width: `${Math.round(overallProgress * 100)}%` }}
                />
              </div>
              <div className="mt-2 text-[12px] font-medium text-zinc-500">{totalWords === 0 ? "添加单词书后开始统计" : `共 ${totalWords} 词`}</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold text-zinc-900">已添加的单词书</div>
              </div>
              <div className="space-y-3">
                {addedBooks.map((b) => (
                  <BookCard
                    key={b.id}
                    book={b}
                    footerSlot={
                      <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-zinc-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          新词 {state.books.find((x) => x.id === b.id)?.plan.dailyNew ?? 0}/天
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1">
                          <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                          复习 {state.books.find((x) => x.id === b.id)?.plan.dailyReview ?? 0}/天
                        </span>
                      </div>
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelecting(true)}
                className="flex w-full items-center justify-center gap-2 rounded-3xl border border-white/60 bg-white/75 px-4 py-4 text-[14px] font-semibold text-zinc-900 backdrop-blur active:scale-[0.99]"
              >
                <BookPlus className="h-5 w-5 text-[color:var(--brand-600)]" />
                添加单词书
              </button>
            </div>
          </div>
        )}
      </div>

      {sheetOpen ? (
        <div
          className={cn("fixed z-50 overflow-hidden rounded-[28px]", !phoneRect && "inset-0")}
          style={
            phoneRect
              ? { left: phoneRect.left, top: phoneRect.top, width: phoneRect.width, height: phoneRect.height }
              : undefined
          }
          onClick={() => setSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-black/35" />
          <section
            className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white shadow-[0_-20px_50px_rgba(15,23,42,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between px-4 pb-2 pt-4">
              <div className="text-[15px] font-semibold text-zinc-900">设定学习计划</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-600)]/10 px-3 py-1 text-[12px] font-semibold text-[color:var(--brand-600)]">
                <BookOpenCheck className="h-4 w-4" />
                {pendingBook?.title ?? "单词书"}
              </div>
            </header>
            <div className="max-h-[66vh] overflow-y-auto px-4 pb-5">
              <div className="space-y-3">
                <PlanRow
                  label="每天背多少个单词"
                  value={draftPlan.dailyNew}
                  onChange={(v) =>
                    setDraftPlan((p) => ({ ...p, dailyNew: clampInt(Number.isFinite(v) ? v : p.dailyNew, 5, 200) }))
                  }
                />
                <PlanRow
                  label="每天复习多少个单词"
                  value={draftPlan.dailyReview}
                  onChange={(v) =>
                    setDraftPlan((p) => ({
                      ...p,
                      dailyReview: clampInt(Number.isFinite(v) ? v : p.dailyReview, 5, 300),
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={confirmAdd}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] py-3 text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]"
                >
                  确认添加
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {modeSheetOpen ? (
        <div
          className={cn("fixed z-50 overflow-hidden rounded-[28px]", !phoneRect && "inset-0")}
          style={
            phoneRect
              ? { left: phoneRect.left, top: phoneRect.top, width: phoneRect.width, height: phoneRect.height }
              : undefined
          }
          onClick={() => setModeSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-black/35" />
          <section
            className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white shadow-[0_-20px_50px_rgba(15,23,42,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-4 pb-2 pt-4">
              <div className="text-[15px] font-semibold text-zinc-900">选择背诵方式</div>
              <div className="mt-1 text-[12px] font-medium text-zinc-500">先背新词，再复习最近学过的单词</div>
            </header>
            <div className="px-4 pb-5">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setModeSheetOpen(false);
                    navigate(`/vocab/study?mode=flash&date=${encodeURIComponent(dayKey(new Date()))}`);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-4 text-left backdrop-blur active:scale-[0.995]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--brand-600)]/12 text-[color:var(--brand-600)]">
                      <Layers3 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-zinc-900">闪卡记忆</div>
                      <div className="mt-1 text-[12px] font-medium text-zinc-500">点击显示释义 · 三轮巩固</div>
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-zinc-400">进入</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModeSheetOpen(false);
                    navigate(`/vocab/study?mode=sentence&date=${encodeURIComponent(dayKey(new Date()))}`);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-4 text-left backdrop-blur active:scale-[0.995]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600">
                      <BookOpenCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-zinc-900">例句背诵</div>
                      <div className="mt-1 text-[12px] font-medium text-zinc-500">挖空填词 · 选对才能继续</div>
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-zinc-400">进入</div>
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {toast ? (
        <div
          className={cn("fixed z-[60]", !phoneRect && "inset-0 pointer-events-none")}
          style={
            phoneRect ? { left: phoneRect.left, top: phoneRect.top, width: phoneRect.width, height: phoneRect.height } : undefined
          }
        >
          <div className="pointer-events-none absolute bottom-[92px] left-1/2 w-[calc(100%-32px)] -translate-x-1/2 rounded-2xl bg-zinc-900/85 px-4 py-3 text-center text-[13px] font-medium text-white backdrop-blur">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
