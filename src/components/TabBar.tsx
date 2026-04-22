import { NavLink } from "react-router-dom";
import { BookOpen, House, User, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "首页", Icon: House },
  { to: "/vocab", label: "AI背单词", Icon: BookOpen },
  { to: "/videos", label: "视频", Icon: Video },
  { to: "/me", label: "我的", Icon: User },
];

export default function TabBar() {
  return (
    <nav className="grid h-[72px] grid-cols-4 border-t border-white/60 bg-white/75 backdrop-blur">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 text-[11px] text-zinc-500 transition",
              isActive && "text-[color:var(--brand-600)]",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn(
                  "h-[22px] w-[22px]",
                  isActive ? "text-[color:var(--brand-600)]" : "text-zinc-600",
                )}
              />
              <span className="leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
