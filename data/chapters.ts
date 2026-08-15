// ==================== 首页叙事章节（核心扩展点） ====================
// 「章节是数据，不是组件」——新增模块只需在数组中追加条目
// 定位：竞赛人员选拔展示（评委视角）

export interface ChapterItem {
  /** 锚点 id，同时驱动 Header 导航 */
  id: string
  /** 章节编号，如 Nº001 */
  no: string
  /** 眉题，如 Manifesto */
  kicker: string
  /** 大标题行数组（逐行渲染，动效阶段逐行入场） */
  title: string[]
  /** 正文段落 */
  paragraphs: string[]
  /** 深浅变体：feature 用强调背景 */
  variant?: 'default' | 'feature'
  /** 数字条目 */
  stats?: { label: string; value: string }[]
}

export const chapters: ChapterItem[] = [
  {
    id: 'manifesto',
    no: 'Nº001',
    kicker: 'Intro',
    title: ['把想做的', '变成做出来的'],
    paragraphs: [
      '感谢浪尖社区的老师前辈们和每一位前来参观本站的朋友，欢迎光临。',
      '你好，我是徐晨轩，燕山大学电子科学与技术在读。',
      '拿到新东西就想拆开看它怎么运转，学到新知识就立刻用起来。这个网站就是证明——从零搭起，设计、动效、部署全程亲力亲为。',
      '目标是走进竞赛的赛场，把想做的，变成做出来的。',
    ],
    variant: 'intro', // 引言变体：段落字号加大
  },
  {
    id: 'capabilities',
    no: 'Nº002',
    kicker: 'What I do',
    title: ['电子 × AI', '× 工程'],
    paragraphs: [
      '正在系统补齐 C 语言与硬件基础，用 AI 工具链把学习效率拉满。',
      '关注电子与工程方向，习惯把想法快速变成能跑的东西。',
      '把知识变成能力，把想法变成实物——目标是走进竞赛的赛场。',
    ],
    variant: 'feature',
    // 真实数字：可随成长更新
    stats: [
      { value: '1', label: '亲手搭建的网站' },
      { value: '2', label: '技能方向' },
      { value: '∞', label: '好奇心' },
    ],
  },
  {
    id: 'works',
    no: 'Nº003',
    kicker: 'Selected works',
    title: ['作品', '在路上'],
    paragraphs: [
      '正在积累竞赛与项目作品，稍后在此展出。',
    ],
  },
  {
    id: 'contact',
    no: 'Nº004',
    kicker: "Let's talk",
    title: ['聊聊你的', '项目'],
    paragraphs: [
      '竞赛组队、项目合作或任何想法，欢迎来信。',
      '我会尽快回复。',
    ],
  },
]
