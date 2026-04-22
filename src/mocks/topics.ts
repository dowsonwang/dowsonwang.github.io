export type TopicCategory = "场景实战" | "辩论比赛" | "话题探讨";

export type Topic = {
  id: string;
  category: TopicCategory;
  title: string;
  description: string;
  sceneTag?: string;
  roleTag?: string;
  proTitle?: string;
  proContent?: string;
  conTitle?: string;
  conContent?: string;
};

export const topicCategories: TopicCategory[] = ["场景实战", "辩论比赛", "话题探讨"];

export const topics: Topic[] = [
  {
    id: "s_airport",
    category: "场景实战",
    title: "机场值机：快速确认座位与行李",
    description: "练习常见问答：托运、登机口、座位偏好。重点：礼貌提问与确认信息。",
    sceneTag: "场景·机场值机",
    roleTag: "你扮演：旅客",
  },
  {
    id: "s_cafe",
    category: "场景实战",
    title: "咖啡店点单：口味、甜度与带走",
    description: "练习点单表达与加购需求。重点：数量、尺寸、替换选项。",
    sceneTag: "场景·咖啡店",
    roleTag: "你扮演：顾客",
  },
  {
    id: "s_hotel",
    category: "场景实战",
    title: "酒店入住：办理入住与延迟退房",
    description: "练习入住流程与需求表达。重点：礼貌请求、确认时间与房型。",
    sceneTag: "场景·酒店前台",
    roleTag: "你扮演：住客",
  },
  {
    id: "s_pharmacy",
    category: "场景实战",
    title: "药店买药：描述症状与用药建议",
    description: "练习描述不适与询问建议。重点：症状词汇、频率与注意事项。",
    sceneTag: "场景·药店",
    roleTag: "你扮演：顾客",
  },
  {
    id: "s_interview",
    category: "场景实战",
    title: "面试沟通：自我介绍与优势表达",
    description: "练习结构化回答。重点：STAR 叙述、举例与礼貌收尾。",
    sceneTag: "场景·面试",
    roleTag: "你扮演：候选人",
  },
  {
    id: "s_restaurant",
    category: "场景实战",
    title: "餐厅订位：人数、时间与过敏需求",
    description: "练习订位与特殊需求表达。重点：确认信息、改期与礼貌致谢。",
    sceneTag: "场景·餐厅",
    roleTag: "你扮演：顾客",
  },
  {
    id: "d_remote",
    category: "辩论比赛",
    title: "远程办公利大于弊吗？",
    description: "练习观点陈述、反驳与总结。重点：逻辑连接词与礼貌反驳。",
    proTitle: "正方观点",
    proContent: "效率更高、通勤成本降低、工作与生活更平衡。",
    conTitle: "反方观点",
    conContent: "协作成本上升、边界模糊、长期沟通与文化难维护。",
  },
  {
    id: "d_ai",
    category: "辩论比赛",
    title: "AI 会让工作更轻松还是更焦虑？",
    description: "练习论据组织与情绪表达。重点：举例与对比。",
    proTitle: "正方观点",
    proContent: "工具增强生产力、自动化琐事、释放创造力。",
    conTitle: "反方观点",
    conContent: "替代焦虑加剧、学习成本提高、评价体系更内卷。",
  },
  {
    id: "d_school",
    category: "辩论比赛",
    title: "学校该不该减少作业量？",
    description: "练习举例与对比。重点：数据、因果与反驳结构。",
    proTitle: "正方观点",
    proContent: "减压提升效率、留出兴趣时间、促进自主学习。",
    conTitle: "反方观点",
    conContent: "基础不牢、练习不足、难以衡量学习效果。",
  },
  {
    id: "d_social",
    category: "辩论比赛",
    title: "社交媒体让人更孤独吗？",
    description: "练习情绪表达与观点组织。重点：让步与反驳。",
    proTitle: "正方观点",
    proContent: "比较焦虑、信息过载、浅层互动取代深度关系。",
    conTitle: "反方观点",
    conContent: "连接更多人、获取支持、扩大信息与机会。",
  },
  {
    id: "d_city",
    category: "辩论比赛",
    title: "大城市生活更值得吗？",
    description: "练习对比与总结。重点：机会成本与个人选择。",
    proTitle: "正方观点",
    proContent: "机会更多、资源更集中、成长更快。",
    conTitle: "反方观点",
    conContent: "压力更大、成本更高、生活质量下降。",
  },
  {
    id: "d_edu",
    category: "辩论比赛",
    title: "在线教育能替代线下课堂吗？",
    description: "练习结构化论证。重点：定义、举例与总结。",
    proTitle: "正方观点",
    proContent: "时间灵活、资源丰富、可个性化学习。",
    conTitle: "反方观点",
    conContent: "互动不足、自律要求高、学习氛围弱。",
  },
  {
    id: "t_hobby",
    category: "话题探讨",
    title: "你最近迷上的兴趣是什么？",
    description: "练习轻松聊天与追问。重点：描述细节与自然接话。",
  },
  {
    id: "t_culture",
    category: "话题探讨",
    title: "你最喜欢的城市是什么样的？",
    description: "练习叙述与对比。重点：形容词、原因表达与展开描述。",
  },
  {
    id: "t_trip",
    category: "话题探讨",
    title: "最近一次旅行最难忘的瞬间？",
    description: "练习叙事表达。重点：时间顺序、细节描写与情绪词。",
  },
  {
    id: "t_movie",
    category: "话题探讨",
    title: "哪部电影让你反复回味？",
    description: "练习观点表达。重点：原因、对比与举例。",
  },
  {
    id: "t_work",
    category: "话题探讨",
    title: "你理想的工作状态是什么？",
    description: "练习描述与展开。重点：价值观表达与举例说明。",
  },
  {
    id: "t_goal",
    category: "话题探讨",
    title: "今年你最想实现的一个目标？",
    description: "练习规划表达。重点：计划、时间点与可执行步骤。",
  },
];
