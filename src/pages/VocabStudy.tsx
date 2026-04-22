import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Volume2 } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { wordBooks } from "@/mocks/wordbooks";
import { vocabWords, type VocabWord } from "@/mocks/vocabWords";
import { addDays, dayKey, loadVocabState, saveVocabState } from "@/lib/vocabStore";
import { cn } from "@/lib/utils";

type Mode = "flash" | "sentence";
type Stage = "new" | "review";
type StudyItem = { stage: Stage; word: VocabWord };

function speak(text: string, lang?: string) {
  const speech = window.speechSynthesis;
  if (!speech) return;
  speech.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.pitch = 1;
  if (lang) u.lang = lang;
  speech.speak(u);
}

function uniqLast(arr: string[], limit: number) {
  const out: string[] = [];
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    const v = arr[i];
    if (out.includes(v)) continue;
    out.push(v);
    if (out.length >= limit) break;
  }
  return out.reverse();
}

export default function VocabStudy() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const mode = (sp.get("mode") as Mode) || "flash";
  const date = sp.get("date") || dayKey(new Date());

  const [state, setState] = useState(() => loadVocabState());
  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const listRef = useRef<StudyItem[]>([]);

  useEffect(() => {
    saveVocabState(state);
  }, [state]);

  const bookIdSet = useMemo(() => new Set(state.books.map((b) => b.id)), [state.books]);
  const activeBooks = useMemo(() => state.books.filter((b) => bookIdSet.has(b.id)), [state.books, bookIdSet]);

  const items = useMemo<StudyItem[]>(() => {
    const learnedByBook = new Map<string, Set<string>>();
    for (const b of state.books) learnedByBook.set(b.id, new Set());
    for (const r of state.learned) {
      if (!learnedByBook.has(r.bookId)) learnedByBook.set(r.bookId, new Set());
      learnedByBook.get(r.bookId)!.add(r.wordId);
    }

    const newItems: StudyItem[] = [];
    const reviewItems: StudyItem[] = [];

    for (const b of state.books) {
      const learnedIds = learnedByBook.get(b.id) ?? new Set<string>();
      const pool = vocabWords.filter((w) => w.bookId === b.id);
      const remaining = pool.filter((w) => !learnedIds.has(w.id));
      const todayNew = remaining.slice(0, b.plan.dailyNew);
      for (const w of todayNew) newItems.push({ stage: "new", word: w });

      const history = state.learned.filter((r) => r.bookId === b.id).map((r) => r.wordId);
      const reviewIds = uniqLast(history, b.plan.dailyReview);
      const byId = new Map(pool.map((w) => [w.id, w]));
      for (const id of reviewIds) {
        const w = byId.get(id);
        if (w) reviewItems.push({ stage: "review", word: w });
      }
    }

    return [...newItems, ...reviewItems];
  }, [state.books, state.learned]);

  useEffect(() => {
    listRef.current = items;
    setIndex(0);
    setRound(1);
    setRevealed(false);
    setPicked(null);
  }, [date, mode]);

  useEffect(() => {
    if (index >= items.length && items.length > 0) {
      if (round < 3) {
        setRound((r) => r + 1);
        setIndex(0);
        setRevealed(false);
        setPicked(null);
        return;
      }

      const newSet = new Set(items.filter((i) => i.stage === "new").map((i) => i.word.id));
      setState((prev) => {
        const existing = new Set(prev.learned.map((r) => `${r.bookId}:${r.wordId}`));
        const additions = items
          .filter((i) => i.stage === "new")
          .filter((i) => !existing.has(`${i.word.bookId}:${i.word.id}`))
          .map((i) => ({ bookId: i.word.bookId, wordId: i.word.id, learnedAt: new Date().toISOString() }));
        const nextState = {
          ...prev,
          learnedTotal: prev.learnedTotal + additions.length,
          learned: [...prev.learned, ...additions],
        };
        saveVocabState(nextState);
        return nextState;
      });

      navigate(`/vocab/complete?date=${encodeURIComponent(date)}&new=${newSet.size}`);
    }
  }, [index, items, navigate, round, date]);

  const total = items.length || 1;
  const current = items[Math.min(index, items.length - 1)];
  const currentBook = current ? wordBooks.find((b) => b.id === current.word.bookId) : undefined;

  const showToast = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 1200);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setRevealed(false);
    setPicked(null);
  };

  const topLabel = `第${round}/3轮  进度 ${Math.min(index + 1, total)}/${total}`;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <header className="flex items-center justify-between px-3 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-800 active:scale-[0.98]"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-[13px] font-semibold text-zinc-700">{topLabel}</div>
          <div className="w-9" />
        </header>

        {current ? (
          <div className="flex flex-1 flex-col px-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-zinc-100 px-3 py-1 text-[12px] font-semibold text-zinc-700">
                {currentBook?.title ?? "单词书"} · {current.stage === "new" ? "新词" : "复习"}
              </div>
            </div>

            {mode === "flash" ? (
              <div className="mt-14 flex flex-1 flex-col items-center">
                <div className="text-[44px] font-semibold tracking-tight text-zinc-900">{current.word.term}</div>
                {current.word.phonetic ? (
                  <button
                    type="button"
                    onClick={() => speak(current.word.term, current.word.bookId === "zh-en" ? "en-US" : undefined)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-[14px] font-semibold text-zinc-700 active:scale-[0.99]"
                  >
                    {current.word.bookId === "zh-en" ? "美" : "发"} {current.word.phonetic}
                    <Volume2 className="h-4 w-4 text-emerald-600" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => speak(current.word.term)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-[14px] font-semibold text-zinc-700 active:scale-[0.99]"
                  >
                    点击朗读
                    <Volume2 className="h-4 w-4 text-emerald-600" />
                  </button>
                )}

                {!revealed ? (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="mt-16 text-[14px] font-semibold text-zinc-400 active:opacity-80"
                  >
                    点击显示释义
                  </button>
                ) : (
                  <>
                    <div className="mt-12 px-2 text-center text-[16px] leading-relaxed text-zinc-700">{current.word.meaning}</div>
                    <div className="mt-auto w-full pb-10">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={next}
                          className="rounded-2xl bg-[#F06161] py-4 text-[16px] font-semibold text-white active:scale-[0.99]"
                        >
                          不认识
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          className="rounded-2xl bg-[#2CCB6F] py-4 text-[16px] font-semibold text-white active:scale-[0.99]"
                        >
                          认识
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-1 flex-col">
                <div className="flex justify-center">
                  <div className="rounded-full bg-[#ECF7EE] px-3 py-1 text-[12px] font-semibold text-[#2F855A]">
                    填补当前对话
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[#F5F6F7] p-5">
                  <div className="text-[16px] leading-relaxed text-zinc-900">
                    {current.word.example.sentence.replace(current.word.example.blank, "_____")}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => speak(current.word.example.sentence)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 active:scale-[0.99]"
                    >
                      提示 AI <Volume2 className="h-4 w-4 text-emerald-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pb-10">
                  <div className="grid grid-cols-3 gap-3">
                    {current.word.example.options.map((opt) => {
                      const wrong = picked && picked === opt && opt !== current.word.example.answer;
                      const right = picked === current.word.example.answer && opt === current.word.example.answer;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (picked) return;
                            setPicked(opt);
                            if (opt === current.word.example.answer) {
                              window.setTimeout(() => next(), 450);
                            } else {
                              showToast("错了，再试试");
                              window.setTimeout(() => setPicked(null), 650);
                            }
                          }}
                          className={cn(
                            "rounded-2xl border bg-white py-3 text-[14px] font-semibold text-zinc-900 active:scale-[0.99]",
                            wrong && "border-[#F06161] bg-[#FFF1F1] text-[#D64545]",
                            right && "border-[#2CCB6F] bg-[#E9FBF3] text-[#1E8E4E]",
                            !picked && "border-zinc-200",
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-center text-[12px] font-medium text-zinc-400">选对才能进入下一个</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[14px] font-semibold text-zinc-500">
            没有可学习的单词
          </div>
        )}

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
