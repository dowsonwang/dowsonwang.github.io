import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-end justify-center",
        open && "pointer-events-auto",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/0 transition-opacity duration-200",
          open && "bg-black/35",
        )}
        onClick={onClose}
      />
      <section
        className={cn(
          "relative w-full max-w-[390px] translate-y-full rounded-t-[24px] bg-white shadow-[0_-20px_50px_rgba(15,23,42,0.18)] transition-transform duration-300",
          open && "translate-y-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between px-4 pb-2 pt-4">
          <div className="text-[15px] font-semibold text-zinc-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-zinc-700 active:scale-[0.98]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[66vh] overflow-y-auto px-4 pb-5">{children}</div>
      </section>
    </div>
  );
}
