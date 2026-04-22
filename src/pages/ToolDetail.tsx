import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import MiniDict from "@/pages/MiniDict";
import ToolChat from "@/pages/ToolChat";

const titleById: Record<string, string> = {
  "mini-dict": "AI小词典",
  "sentence-parse": "句子成分分析",
  "essay-polish": "作文批改润色",
  "word-memory": "单词记忆助手",
  "sentence-polish": "句子润色扩写",
  grammar: "语法讲解",
  "zh-en": "中译英助手",
  synonyms: "同义词替换",
  "eq-reply": "高情商英文回复",
  "long-sentence": "长难句解析",
};

export default function ToolDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const toolId = (params.toolId ?? "").trim();
  const title = useMemo(() => titleById[toolId] ?? "AI工具", [toolId]);

  if (toolId === "mini-dict") return <MiniDict />;
  if (
    toolId === "sentence-parse" ||
    toolId === "essay-polish" ||
    toolId === "word-memory" ||
    toolId === "sentence-polish" ||
    toolId === "grammar" ||
    toolId === "zh-en" ||
    toolId === "synonyms" ||
    toolId === "eq-reply" ||
    toolId === "long-sentence"
  ) {
    return <ToolChat toolId={toolId} />;
  }

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">{title}</div>
          </div>
        </header>

        <div className="flex-1 px-4 pb-8 pt-6">
          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-600)]" />
              功能开发中
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-zinc-600">这个工具下一步开始逐个实现。</div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
