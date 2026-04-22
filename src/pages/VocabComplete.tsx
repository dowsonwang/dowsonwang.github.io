import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import { addDays, dayKey } from "@/lib/vocabStore";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

export default function VocabComplete() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const date = sp.get("date") || dayKey(new Date());
  const newCount = Number(sp.get("new") || 0);

  const trophyUrl = useMemo(() => {
    const prompt =
      "realistic golden trophy with confetti, celebration, clean white background, soft shadow, minimal, centered, high quality 3d render";
    return makeAiImageUrl(prompt, "square_hd");
  }, []);

  const tomorrow = useMemo(() => dayKey(addDays(new Date(date), 1)), [date]);

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <img alt="" className="h-[220px] w-[220px] object-contain" src={trophyUrl} />
          <div className="mt-3 text-[18px] font-semibold text-zinc-900">恭喜你完成了今日学习！</div>
          <div className="mt-2 text-[13px] font-medium text-zinc-500">今日新词 {newCount} 个</div>
        </div>

        <div className="px-6 pb-10">
          <button
            type="button"
            onClick={() => navigate("/vocab")}
            className="w-full rounded-2xl bg-zinc-100 py-4 text-[16px] font-semibold text-zinc-900 active:scale-[0.99]"
          >
            回到首页
          </button>
          <button
            type="button"
            onClick={() => navigate(`/vocab/study?mode=flash&date=${encodeURIComponent(tomorrow)}`)}
            className="mt-4 w-full text-[14px] font-semibold text-zinc-600 active:opacity-80"
          >
            提前学习明日单词
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

