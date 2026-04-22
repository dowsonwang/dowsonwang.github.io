import { Outlet, useLocation } from "react-router-dom";
import PhoneFrame from "@/components/PhoneFrame";
import TabBar from "@/components/TabBar";

export default function TabLayout() {
  const location = useLocation();
  const key = location.pathname;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <main
          key={key}
          className="flex-1 overflow-y-auto bg-[radial-gradient(1000px_700px_at_15%_-10%,rgba(8,184,255,0.10),transparent_60%),linear-gradient(180deg,rgba(242,249,255,0.95),rgba(255,255,255,0.70))]"
        >
          <Outlet />
        </main>
        <TabBar />
      </div>
    </PhoneFrame>
  );
}
