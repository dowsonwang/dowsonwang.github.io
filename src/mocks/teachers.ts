export type TeacherLanguage = "全部" | "英语" | "日语" | "法语" | "德语" | "西班牙语" | "葡萄牙语";

export type Teacher = {
  id: string;
  name: string;
  language: Exclude<TeacherLanguage, "全部">;
  badge: string;
  avatarSeed: string;
};

export const teacherLanguages: TeacherLanguage[] = [
  "全部",
  "英语",
  "日语",
  "法语",
  "德语",
  "西班牙语",
  "葡萄牙语",
];

const namePool = ["Andy", "Alice", "Mia", "Leo", "Sofia", "Noah", "Ivy", "Ethan", "Luna", "Jack"];
const badgePool = ["纠错专家", "口语助教", "情景练习", "沟通教练", "语法专家", "发音陪练", "表达润色"];

const generateByLanguage = (language: Exclude<TeacherLanguage, "全部">) => {
  return Array.from({ length: 7 }).map((_, idx): Teacher => {
    const name = namePool[(idx * 2 + language.length) % namePool.length];
    const badge = badgePool[(idx + language.length) % badgePool.length];
    const id = `t_${language}_${idx + 1}`;
    return { id, name, language, badge, avatarSeed: `${language}-${idx + 1}` };
  });
};

export const teachers: Teacher[] = (["英语", "日语", "法语", "德语", "西班牙语", "葡萄牙语"] as const).flatMap(generateByLanguage);
