import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";

export default function MePrivacy() {
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">隐私政策</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6">
          <div className="whitespace-pre-line rounded-[28px] border border-white/60 bg-white/80 px-4 py-4 text-[13px] leading-relaxed text-zinc-700 backdrop-blur">
            {`隐私政策（示例）

更新日期：2026-04-22
生效日期：2026-04-22

1. 我们收集的信息
为提供「AI练口语」服务，我们可能会收集以下信息：
- 你主动输入的文本内容（如：单词查询、对话练习、反馈内容）
- 设备与日志信息（如：浏览器类型、基础错误日志），用于改进稳定性

2. 信息的使用方式
我们使用上述信息用于：
- 提供与改进产品功能
- 保障产品安全与稳定
- 处理用户反馈与问题排查

3. 信息的共享与披露
我们不会出售你的个人信息。除法律法规要求或获得你的明确授权外，我们不会向第三方披露你的个人信息。

4. 信息的存储与保护
我们会采取合理的安全措施保护你的信息，防止泄露、损毁或丢失。

5. 你的权利
你可以随时：
- 清除本地记录（如：工具内的历史记录）
- 向我们提出关于个人信息的查询与更正请求

6. 政策更新
我们可能会适时更新本政策，并在页面中展示最新版本。

如你对本政策有疑问，请通过「反馈问题」联系我们。`}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

