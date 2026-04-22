import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { teachers } from "@/mocks/teachers";
import { cn } from "@/lib/utils";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function AiAvatar({ seed, size }: { seed: string; size: number }) {
  const prompt =
    "realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus";

  return (
    <img
      alt=""
      loading="lazy"
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-1 ring-zinc-200"
      src={makeAiImageUrl(`${prompt}, subtle variation seed ${seed}`, "square_hd")}
    />
  );
}

function formatDuration(totalSec: number) {
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function AudioCall() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const teacherId = sp.get("teacherId") ?? undefined;
  const teacher = useMemo(() => teachers.find((t) => t.id === teacherId), [teacherId]);

  const [phase, setPhase] = useState<"calling" | "connected">("calling");
  const [muted, setMuted] = useState(false);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("connected"), 5000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "connected") return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const name = teacher?.name ?? "AI外教";

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="grid place-items-center">
            <div className="grid h-[120px] w-[120px] place-items-center rounded-full border border-zinc-200">
              <AiAvatar seed={teacherId ?? "teacher"} size={92} />
            </div>
          </div>

          {phase === "calling" ? (
            <div className="mt-6 text-center">
              <div className="text-[16px] font-semibold text-zinc-900">{name}</div>
              <div className="mt-2 text-[13px] font-medium text-zinc-500">正在呼叫…</div>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <div className="text-[18px] font-semibold text-zinc-900">{name}</div>
              <div className="mt-2 text-[13px] font-medium text-zinc-500">通话中 {formatDuration(sec)}</div>
            </div>
          )}
        </div>

        <div className="pb-12">
          {phase === "calling" ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="grid h-14 w-14 place-items-center rounded-full bg-[#E85B5B] text-white active:scale-[0.98]"
                aria-label="挂断"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setMuted((v) => !v)}
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-full bg-zinc-100 text-zinc-800 active:scale-[0.98]",
                  muted && "bg-zinc-200",
                )}
                aria-label="麦克风静音"
              >
                {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="grid h-14 w-14 place-items-center rounded-full bg-[#E85B5B] text-white active:scale-[0.98]"
                aria-label="挂断"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

