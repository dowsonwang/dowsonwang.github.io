import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Maximize2, Pause, Play } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { courses } from "@/mocks/courses";
import { cn } from "@/lib/utils";

function MinimalPlayer({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime || 0);
    const onLoaded = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      await v.play();
      return;
    }
    v.pause();
  };

  const full = async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await el.requestFullscreen();
  };

  const pct = duration > 0 ? Math.min(1, current / duration) : 0;

  return (
    <div ref={wrapRef} className="relative aspect-video w-full overflow-hidden bg-black">
      <video ref={videoRef} className="h-full w-full object-cover" src={src} playsInline />

      <button
        type="button"
        onClick={toggle}
        className="absolute inset-0 grid place-items-center text-white/0 transition active:scale-[0.995]"
        aria-label={playing ? "暂停" : "播放"}
      >
        <div className="grid h-16 w-16 place-items-center rounded-full bg-black/40 text-white backdrop-blur">
          {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-[1px]" />}
        </div>
      </button>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2 pt-6">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${Math.round(pct * 100)}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-white/90">
          <button type="button" onClick={toggle} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur active:scale-[0.99]" aria-label={playing ? "暂停" : "播放"}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
          </button>
          <button
            type="button"
            onClick={full}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur active:scale-[0.99]"
            aria-label="全屏"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoCourse() {
  const navigate = useNavigate();
  const params = useParams();
  const course = useMemo(() => courses.find((c) => c.id === params.courseId), [params.courseId]);

  if (!course) {
    return (
      <PhoneFrame>
        <div className="flex h-full items-center justify-center text-[14px] font-semibold text-zinc-500">课程不存在</div>
      </PhoneFrame>
    );
  }

  const outlineText = course.outlinePages.join("\n\n");

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <header className="flex items-center justify-between px-3 pb-2 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-800 active:scale-[0.98]"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-[16px] font-semibold text-zinc-900">AI课程</div>
          <div className="w-9" />
        </header>

        <div className="px-4 pb-3">
          <div className="overflow-hidden rounded-2xl shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
            <MinimalPlayer src={course.videoUrl} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="text-[18px] font-semibold text-zinc-900">{course.title}</div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#D7E7F7] bg-[#F2F7FF] px-3 py-1 text-[11px] font-semibold text-[#2563EB]">
                {course.language}
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold",
                  course.type === "电影语言课"
                    ? "border-[#D7E7F7] bg-[#F2F7FF] text-[#2563EB]"
                    : "border-[#DFF5EA] bg-[#ECF7EE] text-[#2F855A]",
                )}
              >
                {course.type}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[14px] font-semibold text-zinc-900">课程大纲</div>
            <div className="mt-3 whitespace-pre-line rounded-2xl border border-zinc-200/70 bg-zinc-50 px-4 py-4 text-[13px] leading-relaxed text-zinc-700">
              {outlineText}
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
