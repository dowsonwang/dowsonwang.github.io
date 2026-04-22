import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";
import { teacherLanguages, teachers, type Teacher, type TeacherLanguage } from "@/mocks/teachers";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function AiPortrait({ seed }: { seed: string }) {
  const prompt =
    "realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus";

  return (
    <img
      alt=""
      loading="lazy"
      className="h-full w-full object-cover"
      src={makeAiImageUrl(`${prompt}, subtle variation seed ${seed}`, "portrait_4_3")}
    />
  );
}

function Pill({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-[9px] text-[13px] font-semibold transition active:scale-[0.98]",
        selected
          ? "bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white shadow-[0_14px_32px_rgba(8,184,255,0.28)]"
          : "border border-[#D7E7F7] bg-white/80 text-[#41506a] backdrop-blur",
      )}
    >
      {children}
    </button>
  );
}

function tagsForTeacher(t: Teacher) {
  const greenPool = ["资深外教", "语法教练", "沟通教练", "口语专家", "发音陪练", "纠错专家"];
  const bluePool = ["适合零基础", "进阶提升", "情景练习", "纠音矫正", "文化浸润", "面试训练"];
  let seed = 0;
  for (let i = 0; i < t.id.length; i += 1) seed = (seed * 31 + t.id.charCodeAt(i)) % 360;
  const tagA = greenPool[seed % greenPool.length];
  const tagB = bluePool[(seed + 3) % bluePool.length];
  return { tagA, tagB };
}

function bioForTeacher(t: Teacher) {
  const base =
    t.language === "日语"
      ? `こんにちは！我是 ${t.language} 外教 ${t.name}，擅长语法梳理与场景对话，用清晰易懂的方式带你开口。`
      : t.language === "法语"
        ? `Bonjour！我是 ${t.language} 外教 ${t.name}，注重发音与表达细节，帮你把句子说得更自然。`
        : t.language === "德语"
          ? `Hallo！我是 ${t.language} 外教 ${t.name}，主攻口语与纠错，帮助你更自信地表达观点。`
          : t.language === "西班牙语"
            ? `¡Hola! 我是 ${t.language} 外教 ${t.name}，擅长真实生活场景表达与自然接话。`
            : t.language === "葡萄牙语"
              ? `Olá! 我是 ${t.language} 外教 ${t.name}，专注实用对话与发音训练，陪你稳步进步。`
              : `大家好，我是 ${t.language} 外教 ${t.name}，擅长互动式教学，注重口语实战与表达自信。`;

  return base;
}

export default function Teachers() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<TeacherLanguage>("全部");

  const filtered = useMemo(() => {
    if (language === "全部") return teachers;
    return teachers.filter((t) => t.language === language);
  }, [language]);

  const startChat = (teacherId: string) => {
    const sp = new URLSearchParams();
    sp.set("teacherId", teacherId);
    navigate(`/chat/new?${sp.toString()}`);
  };

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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">AI外教</div>
          </div>
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {teacherLanguages.map((l) => (
                <Pill key={l} selected={l === language} onClick={() => setLanguage(l)}>
                  {l}
                </Pill>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
          <div className="space-y-4">
            {filtered.map((t) => {
              const { tagA, tagB } = tagsForTeacher(t);
              return (
                <div
                  key={t.id}
                  className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur"
                >
                  <div className="flex gap-4 p-4">
                    <div className="aspect-[3/4] w-[112px] shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                      <AiPortrait seed={t.avatarSeed} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="truncate text-[20px] font-semibold leading-none text-zinc-900">{t.name}</div>
                        <div className="shrink-0 rounded-lg border border-[color:var(--brand-600)]/40 bg-transparent px-2.5 py-1 text-[12px] font-semibold text-[color:var(--brand-600)]">
                          {t.language}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className="rounded-full bg-[#E9FBF3] px-3 py-1 text-[12px] font-semibold text-[#10B981]">
                          {tagA}
                        </div>
                        <div className="rounded-full bg-[#E8F2FF] px-3 py-1 text-[12px] font-semibold text-[#2563EB]">
                          {tagB}
                        </div>
                      </div>
                      <div className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-zinc-600">{bioForTeacher(t)}</div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => startChat(t.id)}
                          className="text-[14px] font-semibold text-[color:var(--brand-600)] active:opacity-80"
                        >
                          立即对话 &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
