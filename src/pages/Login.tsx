import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { cn } from "@/lib/utils";

const PROFILE_KEY = "demo_profile_v1";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

export default function Login() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("小语同学");
  const avatarUrl = useMemo(() => {
    const prompt =
      "3d cute friendly robot avatar icon, glossy, soft lighting, blue and teal color palette, minimal background, high quality, modern app avatar, seed " +
      Date.now().toString(16);
    return makeAiImageUrl(prompt, "square");
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nickname.trim() || "小语同学";
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ nickname: name, avatarUrl }));
    navigate("/me", { replace: true });
  };

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]">
        <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur">
          <div className="relative flex items-center px-3 py-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-zinc-900 shadow-sm active:scale-[0.98]"
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">登录</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 px-4 pb-8 pt-6">
          <form onSubmit={onSubmit} className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_18px_55px_rgba(8,184,255,0.08)] backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(8,184,255,0.35),rgba(16,185,129,0.22),transparent_70%)] blur-xl" />
                <img
                  alt=""
                  src={avatarUrl}
                  className="relative h-16 w-16 rounded-full object-cover ring-2 ring-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-zinc-900">昵称</div>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[14px] text-zinc-900 outline-none"
                  placeholder="请输入昵称"
                />
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                "mt-5 h-11 w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]",
              )}
            >
              登录（演示）
            </button>
          </form>
        </div>
      </div>
    </PhoneFrame>
  );
}
