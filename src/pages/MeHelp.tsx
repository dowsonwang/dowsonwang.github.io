import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";

export default function MeHelp() {
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">帮助与反馈</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 px-4 pb-8 pt-6">
          <div className="rounded-3xl border border-white/60 bg-white/75 p-5 text-[14px] text-zinc-600 backdrop-blur">
            帮助与反馈页当前为占位，后续接入反馈表单与常见问题。
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

