import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_900px_at_15%_0%,rgba(8,184,255,0.10),transparent_55%),radial-gradient(900px_700px_at_80%_20%,rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,#F2F9FF,#E9F4FF)] px-4 py-6">
      <div
        data-phone-frame
        className={cn(
          "mx-auto h-[812px] w-full max-w-[390px] overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.14)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
