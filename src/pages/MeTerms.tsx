import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";

export default function MeTerms() {
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
            <div className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold text-zinc-900">用户协议</div>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6">
          <div className="whitespace-pre-line rounded-[28px] border border-white/60 bg-white/80 px-4 py-4 text-[13px] leading-relaxed text-zinc-700 backdrop-blur">
            {`用户协议（示例）

更新日期：2026-04-22
生效日期：2026-04-22

欢迎使用「AI练口语」（以下简称“本产品”）。你在使用本产品前请仔细阅读并理解本协议。

1. 服务内容
本产品为语言学习相关工具与内容服务，包括但不限于：
- AI 对话练习与学习工具（示例功能）
- 视频课程与单词学习（示例功能）

2. 使用规则
你同意：
- 不发布违法、有害、侵权或不当内容
- 不以任何方式干扰或破坏产品的正常运行
- 不尝试绕过安全限制或进行未授权访问

3. 内容与知识产权
本产品界面、品牌标识、文案与设计元素等受法律保护。未经许可不得复制、传播或用于商业用途。

4. 免责声明
本产品输出内容仅供学习参考，不构成任何专业建议。我们会尽力保证服务稳定，但不对不可抗力或第三方原因造成的中断承担责任。

5. 协议变更
我们可能会根据业务需要更新本协议，并在页面中展示最新版本。继续使用即视为你接受更新后的协议。

6. 联系我们
如你对本协议有疑问，可通过「反馈问题」与我们联系。`}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

