import type { WordBook } from "@/mocks/wordbooks";

export type StudyPlan = { dailyNew: number; dailyReview: number };
export type AddedBook = { id: WordBook["id"]; addedAt: string; plan: StudyPlan };
export type LearnedRecord = { bookId: WordBook["id"]; wordId: string; learnedAt: string };
export type VocabState = { books: AddedBook[]; learnedTotal: number; learned: LearnedRecord[] };

export const VOCAB_STORAGE_KEY = "ai_vocab_state_v3";

export function loadVocabState(): VocabState {
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem("ai_vocab_state_v2");
      if (!legacy) throw new Error("empty");
      const parsedLegacy = JSON.parse(legacy) as Partial<{
        books: Array<{ id: WordBook["id"]; addedAt: string; plan: StudyPlan }>;
        learnedTotal: number;
      }>;
      const migrated: VocabState = {
        books: parsedLegacy.books ?? [],
        learnedTotal: parsedLegacy.learnedTotal ?? 0,
        learned: [],
      };
      saveVocabState(migrated);
      return migrated;
    }
    const parsed = JSON.parse(raw) as Partial<VocabState> & {
      books?: Array<Partial<AddedBook> & { id: WordBook["id"] }>;
      learned?: LearnedRecord[];
      learnedTotal?: number;
    };

    return {
      books:
        parsed.books?.map((b) => ({
          id: b.id,
          addedAt: b.addedAt ?? new Date().toISOString(),
          plan: { dailyNew: b.plan?.dailyNew ?? 20, dailyReview: b.plan?.dailyReview ?? 30 },
        })) ?? [],
      learnedTotal: parsed.learnedTotal ?? 0,
      learned: parsed.learned ?? [],
    };
  } catch {
    return { books: [], learnedTotal: 0, learned: [] };
  }
}

export function saveVocabState(state: VocabState) {
  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(state));
}

export function clampInt(n: number, min: number, max: number) {
  const v = Math.round(n);
  return Math.min(max, Math.max(min, v));
}

export function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
