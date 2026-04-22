import { useState } from "react";
import { ChevronRight, HelpCircle, Info, LogOut, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

function makeAiImageUrl(prompt: string, imageSize: string) {
  return `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

type Profile = { nickname: string; avatarUrl?: string } | null;

const PROFILE_KEY = "demo_profile_v1";

const DEFAULT_AVATAR_PROMPT =
  "3d cute friendly robot avatar icon, glossy, soft lighting, blue and teal color palette, minimal background, high quality, modern app avatar";

function IconTile({ from, to, children }: { from: string; to: string; children: React.ReactNode }) {
  return (
    <div className="relative h-12 w-12 shrink-0">
      <div className="pointer-events-none absolute -inset-2 rounded-[18px] bg-[color:var(--brand-600)]/10 blur-xl" />
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.60))] shadow-[0_18px_35px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/70" />
        <div className="absolute -left-6 -top-7 h-16 w-16 rounded-full bg-white/70 blur-[1px]" />
        <div className="absolute inset-[6px] rounded-[14px]" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
        <div className="absolute inset-[6px] rounded-[14px] shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),inset_0_-10px_22px_rgba(0,0,0,0.16)]" />
        <div className="relative grid h-full w-full place-items-center text-white drop-shadow-[0_10px_16px_rgba(0,0,0,0.25)]">{children}</div>
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-4 text-left active:bg-zinc-50"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-[14px] font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-[12px] font-medium text-zinc-500">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-zinc-400" />
    </button>
  );
}

export default function Me() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<NonNullable<Profile>>;
      if (!parsed || typeof parsed.nickname !== "string") return null;
      return { nickname: parsed.nickname, avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : undefined };
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1500);
  };

  const logout = () => {
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    showToast("已退出登录");
  };

  const nickname = profile?.nickname ?? "游客用户";
  const avatarUrl =
    profile?.avatarUrl ?? makeAiImageUrl(DEFAULT_AVATAR_PROMPT, "square");

  return (
    <div className="px-4 pb-8 pt-5">
      <div className="text-center text-[16px] font-semibold text-zinc-900">我的</div>

      <section className="relative mt-4 overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,255,255,0.60))] px-4 pb-6 pt-7 shadow-[0_18px_55px_rgba(8,184,255,0.10)] backdrop-blur">
        <div className="pointer-events-none absolute -left-14 top-6 h-40 w-40 rounded-full bg-[color:var(--brand-600)]/12 blur-xl" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/10 blur-xl" />
        <div className="pointer-events-none absolute left-6 top-6 grid grid-cols-8 gap-2 opacity-40">
          {Array.from({ length: 32 }).map((_, idx) => (
            <span key={idx} className="h-1 w-1 rounded-full bg-zinc-300/80" />
          ))}
        </div>

        <div className="relative flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(8,184,255,0.35),rgba(16,185,129,0.22),transparent_70%)] blur-xl" />
            <img
              alt=""
              src={avatarUrl}
              className={cn(
                "relative h-20 w-20 rounded-full object-cover ring-2 ring-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.10)]",
                profile ? "" : "grayscale",
              )}
            />
          </div>
          <div className="mt-4 text-[18px] font-semibold text-zinc-900">{profile ? nickname : "未登录"}</div>
          {!profile ? <div className="mt-1 text-[12px] font-medium text-zinc-500">登录后解锁更多能力</div> : null}

          {!profile ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 rounded-full bg-gradient-to-r from-[color:var(--brand-600)] to-[color:var(--brand-500)] px-7 py-3 text-[14px] font-semibold text-white shadow-[0_16px_44px_rgba(8,184,255,0.22)] active:scale-[0.99]"
            >
              点击登录
            </button>
          ) : null}
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_18px_55px_rgba(8,184,255,0.08)] backdrop-blur">
        <Row
          icon={
            <IconTile from="#08B8FF" to="#10B981">
              <Share2 className="h-6 w-6" strokeWidth={2.2} />
            </IconTile>
          }
          title="分享"
          desc="把小程序分享给朋友"
          onClick={() => showToast("分享功能即将上线")}
        />
        <div className="mx-4 h-px bg-zinc-100" />
        <Row
          icon={
            <IconTile from="#06B6D4" to="#10B981">
              <HelpCircle className="h-6 w-6" strokeWidth={2.2} />
            </IconTile>
          }
          title="反馈问题"
          desc="遇到问题？告诉我们"
          onClick={() => navigate("/me/feedback")}
        />
        <div className="mx-4 h-px bg-zinc-100" />
        <Row
          icon={
            <IconTile from="#08B8FF" to="#06B6D4">
              <Info className="h-6 w-6" strokeWidth={2.2} />
            </IconTile>
          }
          title="关于"
          desc="版本信息与协议"
          onClick={() => navigate("/me/about")}
        />
        {profile ? (
          <>
            <div className="mx-4 h-px bg-zinc-100" />
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-between px-4 py-4 text-left active:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <IconTile from="#FB7185" to="#F43F5E">
                  <LogOut className="h-6 w-6" strokeWidth={2.2} />
                </IconTile>
                <div>
                  <div className="text-[14px] font-semibold text-rose-600">退出登录</div>
                  <div className="mt-1 text-[12px] font-medium text-zinc-500">切换为游客模式</div>
                </div>
              </div>
            </button>
          </>
        ) : null}
      </section>

      {toast ? (
        <div className="pointer-events-none fixed inset-0 z-[60]">
          <div className="absolute bottom-[92px] left-1/2 w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 rounded-2xl bg-zinc-900/85 px-4 py-3 text-center text-[13px] font-medium text-white backdrop-blur">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
