import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookText, MessageSquareText, UserRound, Video, Wand2 } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";
import { cn } from "@/lib/utils";
import { teacherLanguages, teachers, type Teacher, type TeacherLanguage } from "@/mocks/teachers";
import { topicCategories, topics, type Topic, type TopicCategory } from "@/mocks/topics";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function AiImage({
  prompt,
  imageSize,
  className,
}: {
  prompt: string;
  imageSize: "portrait_4_3" | "landscape_4_3" | "square" | "square_hd";
  className: string;
}) {
  return (
    <img
      alt=""
      loading="lazy"
      className={cn("block h-full w-full object-cover", className)}
      src={makeAiImageUrl(prompt, imageSize)}
    />
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  const portraitPrompt = `realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus`;

  return (
    <div className="flex w-[74px] flex-col gap-2">
      <div className="relative">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-[0_8px_20px_rgba(15,23,42,0.10)]">
          <AiImage prompt={`${portraitPrompt}, subtle variation seed ${teacher.avatarSeed}`} imageSize="portrait_4_3" className="" />
        </div>
        <div
          className="pointer-events-none absolute -inset-1 rounded-[18px]"
          style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.65)` }}
        />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[12px] font-semibold leading-none text-zinc-900">{teacher.name}</div>
        <div className="mt-1 truncate text-[10px] leading-none text-zinc-400">{teacher.badge}</div>
      </div>
    </div>
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
        "relative shrink-0 overflow-hidden rounded-full px-4 py-[9px] text-[13px] font-semibold transition active:scale-[0.98]",
        selected
          ? "bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white"
          : "border border-[#D7E7F7] bg-white/80 text-[#41506a] backdrop-blur",
      )}
    >
      {selected ? (
        <span className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(8,184,255,0.55),rgba(16,185,129,0.32),transparent_70%)] blur-xl" />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-[14px] font-semibold text-zinc-900">{title}</div>
      {action && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="text-[12px] font-semibold text-[color:var(--brand-600)] active:opacity-80"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<TeacherLanguage>("全部");
  const [category, setCategory] = useState<TopicCategory>("场景实战");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTopic, setSheetTopic] = useState<Topic | null>(null);
  const [pickedTeacherId, setPickedTeacherId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredTeachers = useMemo(() => {
    const list = language === "全部" ? teachers : teachers.filter((t) => t.language === language);
    return list.slice(0, 7);
  }, [language]);

  const filteredTopics = useMemo(() => topics.filter((t) => t.category === category), [category]);
  const displayTopics = useMemo(() => filteredTopics.slice(0, 6), [filteredTopics]);

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1600);
  };

  const openTopic = (t: Topic) => {
    setSheetTopic(t);
    setPickedTeacherId(null);
    setSheetOpen(true);
  };

  const startChat = (opts: { teacherId: string; topicId?: string }) => {
    const search = new URLSearchParams();
    search.set("teacherId", opts.teacherId);
    if (opts.topicId) search.set("topicId", opts.topicId);
    navigate(`/chat/new?${search.toString()}`);
  };

  const quickActions = [
    {
      icon: BookText,
      label: "AI背单词",
      onClick: () => navigate("/vocab"),
      bg: "bg-gradient-to-br from-[#2F80ED] to-[#08B8FF]",
      tint: "text-white",
    },
    {
      icon: Video,
      label: "视频课程",
      onClick: () => navigate("/videos"),
      bg: "bg-gradient-to-br from-[#2DD4BF] to-[#10B981]",
      tint: "text-white",
    },
    {
      icon: Wand2,
      label: "AI工具",
      onClick: () => navigate("/tools"),
      bg: "bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9]",
      tint: "text-white",
    },
  ] as const;

  return (
    <div className="pb-6">
      <header className="sticky top-0 z-10 border-b border-white/60 bg-[linear-gradient(180deg,rgba(242,249,255,0.92),rgba(255,255,255,0.72))] backdrop-blur">
        <div className="relative flex items-center px-3 py-3">
          <button
            type="button"
            onClick={() => navigate("/chats")}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-800 shadow-sm active:scale-[0.98]"
          >
            <MessageSquareText className="h-5 w-5" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">AI练口语</div>
        </div>
      </header>

      <div className="px-4 pt-3">
        <div className="space-y-4">
        <div className="relative">
          <div className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full bg-[color:var(--brand-600)]/16 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
          <div className="relative">
            <SectionTitle title="选择你的AI外教" action="全部" onAction={() => navigate("/teachers")} />
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {teacherLanguages.map((l) => (
                <Pill key={l} selected={l === language} onClick={() => setLanguage(l)}>
                  {l}
                </Pill>
              ))}
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {filteredTeachers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => startChat({ teacherId: t.id })}
                  className="shrink-0 rounded-2xl p-1 transition active:scale-[0.99]"
                >
                  <TeacherCard teacher={t} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ icon: Icon, label, onClick, bg, tint }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(
                "relative overflow-hidden rounded-2xl px-3 py-4 text-left shadow-[0_18px_48px_rgba(8,184,255,0.16)] transition active:scale-[0.99]",
                bg,
                tint,
              )}
            >
              <div className="pointer-events-none absolute -right-4 -top-6 opacity-20">
                <Icon className="h-20 w-20" />
              </div>
              <div className="text-[16px] font-semibold tracking-wide">{label}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-white/90">
                去看看 <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        <div>
          <SectionTitle title="智能对话练习" action="更多" onAction={() => showToast("练习列表页下一步再做")} />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {topicCategories.map((c) => (
              <Pill key={c} selected={c === category} onClick={() => setCategory(c)}>
                {c}
              </Pill>
            ))}
          </div>

          {category === "场景实战" ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {displayTopics.map((t) => {
                const bgPrompt =
                  "realistic lifestyle photo background, warm natural light, modern urban scene, soft depth of field, subtle bokeh, muted colors";
                const role = (t.roleTag ?? "用户")
                  .replace(/^你扮演[:：]\s*/g, "")
                  .replace(/^你扮演\s*/g, "")
                  .trim();
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openTopic(t)}
                    className="w-full overflow-hidden rounded-2xl border border-zinc-200/60 bg-white text-left shadow-sm transition active:scale-[0.995]"
                  >
                    <div className="relative aspect-[3/4]">
                      <div className="absolute inset-0">
                        <AiImage prompt={`${bgPrompt}, scene seed ${t.id}`} imageSize="portrait_4_3" className="h-full w-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      </div>
                      <div className="absolute left-3 top-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-zinc-800 shadow-sm">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-white">
                            <UserRound className="h-3.5 w-3.5" />
                          </span>
                          扮演：{role}
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="rounded-2xl border border-white/80 bg-white/80 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                          <div className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900">{t.title}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {displayTopics.map((t) => {
                if (category === "辩论比赛") {
                  const debateBgBase =
                    "realistic photo background, modern discussion room, soft natural light, shallow depth of field, subtle bokeh, clean composition";
                  const proPrompt = `${debateBgBase}, cool blue tone, seed ${t.id} pro`;
                  const conPrompt = `${debateBgBase}, teal green tone, seed ${t.id} con`;
                  return (
                    <div
                      key={t.id}
                      onClick={() => openTopic(t)}
                      role="button"
                      tabIndex={0}
                      className="w-full overflow-hidden rounded-2xl border border-zinc-200/60 bg-white text-left shadow-sm transition active:scale-[0.995]"
                    >
                      <div className="px-4 pb-3 pt-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#1677FF]/10 px-3 py-1 text-[11px] font-semibold text-[#1677FF]">
                          辩论主题
                        </div>
                        <div className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug text-zinc-900">{t.title}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-px bg-white/70">
                        <div className="relative aspect-[3/4]">
                          <AiImage prompt={proPrompt} imageSize="portrait_4_3" className="h-full w-full" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent" />
                          <div className="absolute inset-0 flex flex-col p-3">
                            <div className="mt-auto line-clamp-3 text-[12px] font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                              {t.proContent ?? "补充正方观点内容"}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openTopic(t);
                              }}
                              className="mt-2 self-start rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-900 shadow-sm active:scale-[0.99]"
                            >
                              扮演正方
                            </button>
                          </div>
                        </div>

                        <div className="relative aspect-[3/4]">
                          <AiImage prompt={conPrompt} imageSize="portrait_4_3" className="h-full w-full" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/18 to-transparent" />
                          <div className="absolute inset-0 flex flex-col p-3">
                            <div className="mt-auto line-clamp-3 text-[12px] font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                              {t.conContent ?? "补充反方观点内容"}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openTopic(t);
                              }}
                              className="mt-2 self-start rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-900 shadow-sm active:scale-[0.99]"
                            >
                              扮演反方
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openTopic(t)}
                    className="w-full overflow-hidden rounded-2xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.60))] text-left shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur transition active:scale-[0.995]"
                  >
                    <div className="relative p-4">
                      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[color:var(--brand-600)]/12 blur-2xl" />
                      <div className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-emerald-400/10 blur-2xl" />
                      <div className="flex h-full flex-col">
                        <div className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900">{t.title}</div>
                        <div className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-zinc-600">{t.description}</div>
                        <div className="mt-3">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_12px_26px_rgba(8,184,255,0.18)]">
                            开始探讨
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        title={sheetTopic ? "选择AI外教" : "选择AI外教"}
        onClose={() => setSheetOpen(false)}
      >
        {sheetTopic ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200/60 bg-[#F6F7FB] p-4">
              <div className="text-[13px] font-semibold text-zinc-900">{sheetTopic.title}</div>
              <div className="mt-1 text-[12px] text-zinc-500">{sheetTopic.description}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {filteredTeachers.map((t) => {
                const active = t.id === pickedTeacherId;
                const portraitPrompt = `realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus`;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPickedTeacherId(t.id)}
                    className={cn(
                      "rounded-2xl border bg-white px-2 py-3 text-left transition active:scale-[0.99]",
                      active ? "border-[#1677FF] shadow-[0_10px_26px_rgba(22,119,255,0.18)]" : "border-zinc-200/70",
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-200">
                        <AiImage prompt={`${portraitPrompt}, subtle variation seed ${t.avatarSeed}`} imageSize="portrait_4_3" className="" />
                      </div>
                      <div className="mt-2 w-full">
                        <div className="truncate text-[12px] font-semibold text-zinc-900">{t.name}</div>
                        <div
                          className={cn(
                            "mt-1 truncate text-[11px] font-semibold",
                            active ? "text-[color:var(--brand-600)]" : "text-zinc-500",
                          )}
                        >
                          {t.language}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!pickedTeacherId}
              onClick={() => {
                if (!pickedTeacherId || !sheetTopic) return;
                setSheetOpen(false);
                startChat({ teacherId: pickedTeacherId, topicId: sheetTopic.id });
              }}
              className={cn(
                "mt-2 w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] py-3 text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] transition active:scale-[0.99]",
                !pickedTeacherId && "bg-zinc-300 text-zinc-100 shadow-none active:scale-100",
              )}
            >
              开始聊天
            </button>
          </div>
        ) : null}
      </BottomSheet>

      {toast ? (
        <div className="fixed bottom-[92px] left-1/2 z-[60] w-[calc(100%-32px)] max-w-[388px] -translate-x-1/2 rounded-2xl bg-zinc-900/85 px-4 py-3 text-center text-[13px] font-medium text-white backdrop-blur">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
