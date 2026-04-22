import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield, ScrollText } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";

export default function MeAbout() {
  const navigate = useNavigate();
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">关于</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6">
          <div className="rounded-3xl border border-white/60 bg-white/75 p-5 backdrop-blur">
            <div className="text-[16px] font-semibold text-zinc-900">AI练口语</div>
            <div className="mt-2 text-[13px] font-medium text-zinc-500">版本 v1.0.0</div>
          </div>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/me/privacy")}
              className="flex w-full items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-4 py-4 text-left backdrop-blur active:scale-[0.995]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-[14px] font-semibold text-zinc-900">隐私政策</div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/me/terms")}
              className="flex w-full items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-4 py-4 text-left backdrop-blur active:scale-[0.995]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <ScrollText className="h-5 w-5" />
                </div>
                <div className="text-[14px] font-semibold text-zinc-900">用户协议</div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
