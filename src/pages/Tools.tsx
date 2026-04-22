import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, BookText, Brain, ChevronLeft, Languages, PenLine, Repeat2, ScanText, Smile, Sparkles, Split } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";

type ToolId =
  | "mini-dict"
  | "sentence-parse"
  | "essay-polish"
  | "word-memory"
  | "sentence-polish"
  | "grammar"
  | "zh-en"
  | "synonyms"
  | "eq-reply"
  | "long-sentence";

type ToolItem = {
  id: ToolId;
  title: string;
  desc: string;
  accent: string;
  icon: { a: string; b: string };
};

function ToolIcon({ item }: { item: ToolItem }) {
  const Icon =
    item.id === "mini-dict"
      ? BookOpen
      : item.id === "sentence-parse"
        ? Split
        : item.id === "essay-polish"
          ? PenLine
          : item.id === "word-memory"
            ? Brain
            : item.id === "sentence-polish"
              ? Sparkles
              : item.id === "grammar"
                ? BookText
                : item.id === "zh-en"
                  ? Languages
                  : item.id === "synonyms"
                    ? Repeat2
                    : item.id === "eq-reply"
                      ? Smile
                      : ScanText;

  return (
    <div className="relative h-14 w-14 shrink-0">
      <div className={cn("pointer-events-none absolute -inset-2 rounded-[18px] blur-xl", item.accent)} />
      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.90),rgba(255,255,255,0.55))] shadow-[0_18px_35px_rgba(15,23,42,0.14)]">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/70" />
        <div className="absolute -left-6 -top-7 h-16 w-16 rounded-full bg-white/70 blur-[1px]" />
        <div
          className="absolute inset-[6px] rounded-[14px]"
          style={{
            background: `linear-gradient(135deg, ${item.icon.a}, ${item.icon.b})`,
          }}
        />
        <div className="absolute inset-[6px] rounded-[14px] shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),inset_0_-10px_22px_rgba(0,0,0,0.18)]" />
        <div className="relative grid h-full w-full place-items-center">
          <Icon
            className="h-7 w-7 text-white drop-shadow-[0_10px_16px_rgba(0,0,0,0.28)]"
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
}

function ToolCard({ item, onClick }: { item: ToolItem; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-left active:scale-[0.995]">
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.62))] p-4 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
        <div className={cn("pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full opacity-55", item.accent)} />
        <div className="flex items-start gap-4">
          <ToolIcon item={item} />
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-semibold leading-snug text-zinc-900">{item.title}</div>
            <div className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-600">{item.desc}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Tools() {
  const navigate = useNavigate();

  const items = useMemo<ToolItem[]>(
    () => [
      {
        id: "mini-dict",
        title: "AI小词典",
        desc: "输入单词或短语，快速给出释义、例句与常用搭配。",
        accent: "bg-[color:var(--brand-600)]/18",
        icon: { a: "#08B8FF", b: "#10B981" },
      },
      {
        id: "sentence-parse",
        title: "句子成分分析",
        desc: "一句话拆解主谓宾、从句结构，帮你看懂复杂句。",
        accent: "bg-emerald-400/16",
        icon: { a: "#06B6D4", b: "#10B981" },
      },
      {
        id: "essay-polish",
        title: "作文批改润色",
        desc: "智能纠错 + 语气润色，让表达更地道、更有逻辑。",
        accent: "bg-sky-400/16",
        icon: { a: "#08B8FF", b: "#06B6D4" },
      },
      {
        id: "word-memory",
        title: "单词记忆助手",
        desc: "给你记忆法、联想与例句，单词更好记也更会用。",
        accent: "bg-teal-400/16",
        icon: { a: "#10B981", b: "#08B8FF" },
      },
      {
        id: "sentence-polish",
        title: "句子润色扩写",
        desc: "一键改写更自然，也可以扩写成更完整的表达。",
        accent: "bg-[color:var(--brand-600)]/16",
        icon: { a: "#06B6D4", b: "#08B8FF" },
      },
      {
        id: "grammar",
        title: "语法讲解",
        desc: "针对你的句子讲解语法点，配例句与易错提醒。",
        accent: "bg-emerald-400/16",
        icon: { a: "#10B981", b: "#06B6D4" },
      },
      {
        id: "zh-en",
        title: "中译英助手",
        desc: "中文一键转换英文，提供更自然的多种表达版本。",
        accent: "bg-[color:var(--brand-600)]/18",
        icon: { a: "#08B8FF", b: "#10B981" },
      },
      {
        id: "synonyms",
        title: "同义词替换",
        desc: "替换更准确的词，避免重复，让文案更高级。",
        accent: "bg-teal-400/16",
        icon: { a: "#06B6D4", b: "#10B981" },
      },
      {
        id: "eq-reply",
        title: "高情商英文回复",
        desc: "给出礼貌、得体的英文回复模板，适合多场景沟通。",
        accent: "bg-sky-400/16",
        icon: { a: "#08B8FF", b: "#06B6D4" },
      },
      {
        id: "long-sentence",
        title: "长难句解析",
        desc: "逐层拆分结构，标注修饰关系，把长难句看懂。",
        accent: "bg-emerald-400/16",
        icon: { a: "#10B981", b: "#08B8FF" },
      },
    ],
    [],
  );

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),radial-gradient(900px_700px_at_90%_20%,rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
        <header className="sticky top-0 z-10 border-b border-white/60 bg-[linear-gradient(180deg,rgba(242,249,255,0.92),rgba(255,255,255,0.72))] backdrop-blur">
          <div className="relative flex items-center px-3 py-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-900 shadow-sm active:scale-[0.98]"
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">AI工具</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
          <div className="space-y-4">
            {items.map((item) => (
              <ToolCard key={item.id} item={item} onClick={() => navigate(`/tool/${item.id}`)} />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
