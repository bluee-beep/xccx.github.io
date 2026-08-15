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
  /** 章节底部斜体大字（如 Wait Me） */
  footer?: string
  /** 联系方式图标胶囊（hover 显示信息；qr 字段为二维码图片名） */
  contacts?: { icon: string; label: string; value: string; qr?: string }[]
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
      '「C 语言与硬件基础」是当前的主线——正在系统补齐计算机底层与电路知识，从零搭建自己的工程能力，每一步都走得扎实，不留模糊地带。',
      '「AI 工具链」是我的加速器——查资料、读文档、写代码，AI 是最得力的搭档，但我从不让它替我思考；把学习效率拉满，把时间留给真正的理解与动手。',
      '「快速把想法变成能跑的东西」是我的习惯——从设计、动效到部署，全链路亲力亲为，做过的每一步都算数，每一个细节都是自己磨出来的。',
      '「把知识变成能力，把想法变成实物」——这是不变的目标，下一步就是走进竞赛的赛场。',
    ],
    variant: 'feature',
  },
  {
    id: 'works',
    no: 'Nº003',
    kicker: 'Selected works',
    title: ['作品', '在路上'],
    paragraphs: [
      '正在开发一款「坦克大战」小游戏——从零实现经典玩法。',
      '浪尖等我呐，不是说 8 月底提交吗，怎么一天就搞完了 (╥﹏╥)',
      '开发完成后将在此展出，敬请期待。',
    ],
    footer: 'Wait Me',
  },
  {
    id: 'contact',
    no: 'Nº004',
    kicker: "Let's talk",
    title: [], // 标题已删除（胶囊直接跟在眉题下）
    paragraphs: [
      '竞赛组队、项目合作或任何想法，欢迎联系。',
    ],
    contacts: [
      { icon: 'github', label: 'GitHub', value: 'github.com/bluee-beep' },
      { icon: 'gmail', label: '邮箱', value: 'coldbluee@163.com' },
      { icon: 'tencentqq', label: 'QQ', value: '2032212286' },
      { icon: 'wechat', label: '微信', value: 'WeChat', qr: 'wechat-qr' },
    ],
  },
]
