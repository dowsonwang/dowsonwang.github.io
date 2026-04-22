import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { chatSummaries } from "@/mocks/chats";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

function AiAvatar({ seed }: { seed: string }) {
  const prompt =
    "realistic portrait photo of a friendly language tutor, clean studio lighting, natural skin texture, neutral background, modern casual outfit, 35mm photography, sharp focus";

  return (
    <img
      alt=""
      loading="lazy"
      className="h-12 w-12 rounded-full object-cover shadow-sm ring-1 ring-white/60"
      src={makeAiImageUrl(`${prompt}, subtle variation seed ${seed}`, "square")}
    />
  );
}

export default function Chats() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
        <header className="flex items-center border-b border-white/60 bg-white/70 px-3 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-[14px] font-semibold text-zinc-800 active:opacity-80"
          >
            <ChevronLeft className="h-5 w-5" />
            返回
          </button>
          <div className="flex-1 text-center text-[16px] font-semibold text-zinc-900">对话</div>
          <div className="w-[56px]" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2">
            {chatSummaries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/chat/${c.id}`)}
                className="block w-full pb-2 last:pb-0"
              >
                <div className="flex items-center gap-3 rounded-2xl bg-white/75 px-3 py-3 shadow-sm ring-1 ring-white/60 backdrop-blur transition active:scale-[0.995]">
                  <AiAvatar seed={c.teacherId} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate text-[15px] font-semibold text-zinc-900">
                        {c.teacherName}
                      </div>
                      <div className="shrink-0 text-[11px] font-medium text-zinc-400">{c.updatedAt}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="min-w-0 truncate text-[13px] text-zinc-600">{c.lastMessage}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
