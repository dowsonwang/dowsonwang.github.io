export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="px-4 pb-8 pt-5">
      <div className="text-[18px] font-semibold text-zinc-900">{title}</div>
      <div className="mt-4 rounded-2xl border border-white/60 bg-white/75 p-5 text-[14px] text-zinc-600 backdrop-blur">
        这个页面后续一步一步补齐，这里先做成可点击的占位，用于演示导航。
      </div>
    </div>
  );
}
