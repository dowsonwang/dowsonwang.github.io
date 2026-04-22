export type MessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ChatSummary = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherLanguage: string;
  topicId?: string;
  lastMessage: string;
  updatedAt: string;
};

export const chatSummaries: ChatSummary[] = [
  {
    id: "c_1",
    teacherId: "t_英语_1",
    teacherName: "Mia",
    teacherLanguage: "英语",
    topicId: "s_airport",
    lastMessage: "好的，我们用“机场值机”来练习：你先说你要托运一件行李。",
    updatedAt: "今天 10:18",
  },
  {
    id: "c_2",
    teacherId: "t_日语_2",
    teacherName: "Sofia",
    teacherLanguage: "日语",
    topicId: "s_cafe",
    lastMessage: "不错！这句可以更自然一些，我给你两个更地道的说法。",
    updatedAt: "昨天 21:05",
  },
  {
    id: "c_3",
    teacherId: "t_法语_3",
    teacherName: "Ivy",
    teacherLanguage: "法语",
    lastMessage: "我们先热身：用一句话描述你今天的心情。",
    updatedAt: "昨天 09:47",
  },
  {
    id: "c_4",
    teacherId: "t_德语_4",
    teacherName: "Luna",
    teacherLanguage: "德语",
    lastMessage: "很好！下一步我们练习更地道的连接词。",
    updatedAt: "周一 20:45",
  },
  {
    id: "c_5",
    teacherId: "t_西班牙语_5",
    teacherName: "Andy",
    teacherLanguage: "西班牙语",
    lastMessage: "要不要试试把这句话说得更礼貌一点？",
    updatedAt: "周一 18:12",
  },
  {
    id: "c_6",
    teacherId: "t_葡萄牙语_6",
    teacherName: "Mia",
    teacherLanguage: "葡萄牙语",
    lastMessage: "我来纠正一个小细节：时态这里需要调整。",
    updatedAt: "上周 22:31",
  },
];

export const chatMessagesById: Record<string, ChatMessage[]> = {
  c_1: [
    { id: "m1", role: "assistant", content: "我们开始练习吧：你在机场柜台，要托运一件行李。你会怎么说？", createdAt: "10:18" },
    { id: "m2", role: "user", content: "Hi, I'd like to check in and drop off one suitcase.", createdAt: "10:19" },
    { id: "m3", role: "assistant", content: "很好！可以再补一句更礼貌的开头，比如：\"Could you please help me...\"。现在我来问：你的目的地是哪里？", createdAt: "10:19" },
  ],
  c_2: [
    { id: "m1", role: "assistant", content: "今日はカフェで注文する練習をしましょう。サイズはどうしますか？", createdAt: "21:05" },
    { id: "m2", role: "user", content: "えっと…Mサイズでお願いします。", createdAt: "21:06" },
    { id: "m3", role: "assistant", content: "いいですね！もう少し丁寧に言うなら「Mサイズでお願いします。持ち帰りで。」も使えます。", createdAt: "21:06" },
  ],
};
