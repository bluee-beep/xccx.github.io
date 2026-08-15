// ==================== 首页叙事章节（核心扩展点） ====================
// 「章节是数据，不是组件」——新增模块只需在数组中追加条目
// 当前为占位文案，TODO: 替换为真实个人内容

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
  /** 数字条目（如 5年经验 / 30+ 项目） */
  stats?: { label: string; value: string }[]
}

export const chapters: ChapterItem[] = [
  {
    id: 'manifesto',
    no: 'Nº001',
    kicker: 'Manifesto',
    title: ['做一个', '长期主义者'],
    paragraphs: [
      '你好，我是 Xccx。设计、工程与产品的交叉点是我最感兴趣的地方——既看得懂像素，也写得动代码。',
      '这个网站是我给自己造的一间工作室：记录思考、展示作品、连接同路人。',
    ],
  },
  {
    id: 'capabilities',
    no: 'Nº002',
    kicker: 'What I do',
    title: ['设计 × 工程', '× 产品'],
    paragraphs: [
      '从界面设计到前端实现，从产品构思到落地交付，我习惯把一件事从想法推到现实。',
      'TODO: 在此补充你的技能栈与经历描述。',
    ],
    variant: 'feature',
    // TODO: 替换为真实数字
    stats: [
      { value: '12+', label: '完成项目' },
      { value: '3', label: '领域探索' },
      { value: '∞', label: '好奇心' },
    ],
  },
  {
    id: 'works',
    no: 'Nº003',
    kicker: 'Selected works',
    title: ['作品', '在路上'],
    paragraphs: [
      '正在整理过往项目，稍后在这里展出。TODO: 替换为真实作品条目（或新建 pages/works 独立路由）。',
    ],
  },
  {
    id: 'contact',
    no: 'Nº004',
    kicker: "Let's talk",
    title: ['聊聊你的', '项目'],
    paragraphs: [
      '如果你有想法、合作或只是好奇，欢迎来信。我会尽量在 48 小时内回复。',
    ],
  },
]
