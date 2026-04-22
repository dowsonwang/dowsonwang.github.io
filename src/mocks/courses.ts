export type CourseLanguage = "英语" | "法语" | "意大利语" | "老挝语" | "西班牙语";
export type CourseType = "英语课程" | "电影语言课";

export type Course = {
  id: string;
  title: string;
  language: CourseLanguage;
  type: CourseType;
  outlinePages: string[];
  coverPrompt: string;
  videoUrl: string;
};

export const courseLanguages: Array<"全部" | CourseLanguage> = ["全部", "英语", "法语", "意大利语", "老挝语", "西班牙语"];
export const courseTypes: Array<"全部" | CourseType> = ["全部", "英语课程", "电影语言课"];

const videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const courses: Course[] = [
  {
    id: "c_en_movie_1",
    title: "电影台词精听：Forrest Gump ①",
    language: "英语",
    type: "电影语言课",
    outlinePages: [
      `# Forrest Gump 精听（第 1 页）

## 课程目标
- 熟悉电影语速
- 掌握连读与重音
- 学会自然停顿

## 练习方式
- 听一句 · 跟一句
- 标注重音与语调
- 影子跟读 3 轮`,
      `# Forrest Gump 精听（第 2 页）

## 高频表达
- I'm gonna…
- You never know…
- It happens.

## 发音要点
- /t/ /d/ 弱读与省音
- 元音拉长与收尾
- 句尾降调`,
      `# Forrest Gump 精听（第 3 页）

## 复盘清单
- 是否能听清关键词
- 是否能跟上节奏
- 是否能说出关键短语

## 作业
- 选 10 秒片段
- 连续跟读 5 次
- 录音自检并改进`,
    ],
    coverPrompt:
      "cinematic movie still style, language learning course cover, soft gradient background, minimal typography, modern card design, English movie line listening, high quality, studio lighting",
    videoUrl,
  },
  {
    id: "c_en_basic_1",
    title: "零基础口语：自我介绍",
    language: "英语",
    type: "英语课程",
    outlinePages: [
      `# 自我介绍（第 1 页）

## 目标句型
- Hi, I'm …
- I'm from …
- I work as …

## 练习
- 3 句连说
- 录音回放纠音`,
      `# 自我介绍（第 2 页）

## 进阶表达
- Nice to meet you.
- I'm currently…
- In my free time, I…

## 易错点
- from /frʌm/
- currently 重音`,
      `# 自我介绍（第 3 页）

## 口语任务
- 30 秒自我介绍
- 加 1 个兴趣爱好
- 加 1 个目标`,
    ],
    coverPrompt:
      "modern online course cover, English speaking basics, clean typography, blue teal gradient, minimal design, high quality",
    videoUrl,
  },
  {
    id: "c_fr_basic_1",
    title: "法语入门：打招呼与礼貌用语",
    language: "法语",
    type: "英语课程",
    outlinePages: [
      `# 法语礼貌用语（第 1 页）

## 核心词
- Bonjour
- Merci
- Pardon

## 场景
- 打招呼
- 道谢
- 请人重复`,
      `# 法语礼貌用语（第 2 页）

## 发音提示
- 鼻化元音
- r 的位置
- 轻重音`,
      `# 法语礼貌用语（第 3 页）

## 口语任务
- 用 3 句完成一次“问路”对话`,
    ],
    coverPrompt:
      "modern online course cover, French beginner lesson, clean typography, pastel blue and white, minimal design, high quality",
    videoUrl,
  },
  {
    id: "c_es_basic_1",
    title: "西班牙语：旅行点餐常用句",
    language: "西班牙语",
    type: "英语课程",
    outlinePages: [
      `# 旅行点餐（第 1 页）

## 常用句
- Quiero…
- Por favor
- La cuenta, por favor`,
      `# 旅行点餐（第 2 页）

## 对话模板
- 点单
- 询价
- 结账`,
      `# 旅行点餐（第 3 页）

## 任务
- 角色扮演：服务员 vs 顾客`,
    ],
    coverPrompt:
      "modern online course cover, Spanish travel phrases, orange teal accents, clean typography, minimal design, high quality",
    videoUrl,
  },
  {
    id: "c_it_basic_1",
    title: "意大利语：咖啡馆点单",
    language: "意大利语",
    type: "英语课程",
    outlinePages: [
      `# 咖啡馆点单（第 1 页）

## 关键词
- Un caffè
- Per favore
- Grazie`,
      `# 咖啡馆点单（第 2 页）

## 对话
- 询问口味
- 选择带走
- 付款`,
      `# 咖啡馆点单（第 3 页）

## 任务
- 30 秒完成一次点单对话`,
    ],
    coverPrompt:
      "modern online course cover, Italian cafe phrases, green and white theme, clean typography, minimal design, high quality",
    videoUrl,
  },
  {
    id: "c_lo_basic_1",
    title: "老挝语：日常问候",
    language: "老挝语",
    type: "英语课程",
    outlinePages: [
      `# 老挝语问候（第 1 页）

## 词汇
- ສະບາຍດີ
- ຂອບໃຈ`,
      `# 老挝语问候（第 2 页）

## 场景
- 初次见面
- 表达感谢
- 表达抱歉`,
      `# 老挝语问候（第 3 页）

## 任务
- 用 3 句完成一次打招呼对话`,
    ],
    coverPrompt:
      "modern online course cover, Lao language basics, warm teal theme, clean typography, minimal design, high quality",
    videoUrl,
  },
];
