export type WordBook = {
  id: "zh-en" | "zh-fr" | "zh-it" | "zh-lo" | "zh-es";
  title: string;
  wordCount: number;
  coverPrompt: string;
};

export const wordBooks: WordBook[] = [
  {
    id: "zh-en",
    title: "中文 - 英语",
    wordCount: 3200,
    coverPrompt:
      "realistic modern language textbook cover, Chinese to English vocabulary book, clean typography, gradient blue and teal, minimal design, studio lighting, centered composition",
  },
  {
    id: "zh-fr",
    title: "中文 - 法语",
    wordCount: 2600,
    coverPrompt:
      "realistic modern language textbook cover, Chinese to French vocabulary book, clean typography, pastel blue, white background, minimal design, studio lighting, centered composition",
  },
  {
    id: "zh-it",
    title: "中文 - 意大利语",
    wordCount: 2400,
    coverPrompt:
      "realistic modern language textbook cover, Chinese to Italian vocabulary book, clean typography, green and white theme, minimal design, studio lighting, centered composition",
  },
  {
    id: "zh-lo",
    title: "中文 - 老挝语",
    wordCount: 1800,
    coverPrompt:
      "realistic modern language textbook cover, Chinese to Lao vocabulary book, clean typography, warm teal theme, minimal design, studio lighting, centered composition",
  },
  {
    id: "zh-es",
    title: "中文 - 西班牙语",
    wordCount: 2800,
    coverPrompt:
      "realistic modern language textbook cover, Chinese to Spanish vocabulary book, clean typography, orange and teal accents, minimal design, studio lighting, centered composition",
  },
];

