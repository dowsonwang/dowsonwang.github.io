import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Clapperboard, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { courseLanguages, courseTypes, courses, type CourseLanguage, type CourseType } from "@/mocks/courses";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

export default function VideoCourses() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<CourseLanguage | "">("");
  const [type, setType] = useState<CourseType | "">("");
  const [sheet, setSheet] = useState<"language" | "type" | null>(null);
  const [phoneRect, setPhoneRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector<HTMLElement>("[data-phone-frame]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPhoneRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (language && c.language !== language) return false;
      if (type && c.type !== type) return false;
      return true;
    });
  }, [language, type]);

  const languageOptions = useMemo(() => ["", ...courseLanguages.filter((l): l is CourseLanguage => l !== "全部")], []);
  const typeOptions = useMemo(() => ["", ...courseTypes.filter((t): t is CourseType => t !== "全部")], []);

  return (
    <div className="px-4 pb-8 pt-5">
      <div className="text-center text-[16px] font-semibold text-zinc-900">视频课程</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSheet("language")}
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 px-3 py-3 text-left backdrop-blur active:scale-[0.995]"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[color:var(--brand-600)]/10" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <Languages className="h-4 w-4 text-[color:var(--brand-600)]" />
              {language || "语言"}
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSheet("type")}
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 px-3 py-3 text-left backdrop-blur active:scale-[0.995]"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/10" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
              <Clapperboard className="h-4 w-4 text-[color:var(--brand-600)]" />
              {type || "类型"}
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </div>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {filtered.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate(`/video/${c.id}`)}
            className="text-left active:scale-[0.995]"
          >
            <div className="h-full overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
              <div className="relative">
                <div className="absolute left-2 top-2 z-10 rounded-full border border-white/60 bg-white/45 px-2 py-1 text-[11px] font-semibold text-zinc-700 backdrop-blur">
                  ZH
                </div>
                <div className="aspect-video overflow-hidden bg-zinc-100">
                  <img alt="" loading="lazy" className="h-full w-full object-cover" src={makeAiImageUrl(c.coverPrompt, "landscape_16_9")} />
                </div>
              </div>
              <div className="flex h-[92px] flex-col justify-between px-3 pb-3 pt-2">
                <div className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900">{c.title}</div>
                <div className="mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                      c.type === "电影语言课"
                        ? "border-[#D7E7F7] bg-[#F2F7FF] text-[#2563EB]"
                        : "border-[#DFF5EA] bg-[#ECF7EE] text-[#2F855A]",
                    )}
                  >
                    {c.type}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {sheet ? (
        <div
          className={cn("fixed z-50 overflow-hidden rounded-[28px]", !phoneRect && "inset-0")}
          style={phoneRect ? { left: phoneRect.left, top: phoneRect.top, width: phoneRect.width, height: phoneRect.height } : undefined}
          onClick={() => setSheet(null)}
        >
          <div className="absolute inset-0 bg-black/35" />
          <section
            className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white shadow-[0_-20px_50px_rgba(15,23,42,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-4 pb-2 pt-4">
              <div className="text-[15px] font-semibold text-zinc-900">{sheet === "language" ? "选择语言" : "选择类型"}</div>
              <div className="mt-1 text-[12px] font-medium text-zinc-500">轻触选项即可筛选课程</div>
            </header>
            <div className="px-4 pb-5">
              <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white">
                {(sheet === "language" ? languageOptions : typeOptions).map((opt, idx) => {
                  const selected = sheet === "language" ? language === opt : type === opt;
                  const label = opt === "" ? "全部" : String(opt);
                  return (
                    <button
                      key={`${label}-${idx}`}
                      type="button"
                      onClick={() => {
                        if (sheet === "language") setLanguage(opt as CourseLanguage | "");
                        else setType(opt as CourseType | "");
                        setSheet(null);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-4 text-left text-[14px] font-semibold text-zinc-900 active:bg-zinc-50",
                        idx > 0 && "border-t border-zinc-100",
                      )}
                    >
                      <span>{label}</span>
                      {selected ? <Check className="h-5 w-5 text-[color:var(--brand-600)]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
