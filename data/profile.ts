// ==================== 关于页数据（四大板块框架） ====================
// 板块：基本信息 / 教育背景与技能 / 项目经历（空） / 特长兴趣
// TODO: 以下均为占位内容，替换为真实信息

export interface EducationItem {
  year: string
  school: string
  degree: string
  desc: string
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface ProjectItem {
  title: string
  year: string
  desc: string
  tags: string[]
}

export interface InterestItem {
  name: string
  desc: string
}

export const profile = {
  name: '徐晨轩',
  role: '设计 × 工程 × 产品', // TODO: 待用户确认定位描述

  // ---- 板块一：基本信息 ----
  basic: {
    school: '燕山大学',
    major: '电子科学与技术',
    // 联系方式复用 data/site.ts（email + social）
  },

  // ---- 自我介绍 ----
  bio: [
    '你好，我是徐晨轩，燕山大学电子科学与技术 2026 级本科生。我是一个「闲不住」的人——拿到新东西就想拆开看它怎么运转，学到新知识就想立刻用起来。电子、代码、AI，对我来说不是课本上的名词，而是每天在折腾的玩具。',
    '这个网站就是最好的证明：从零开始，一个人搭起设计、动效、部署的全链路，每个细节都是一步一步迭代出来的。我习惯用 AI 工具链把学习速度拉满——查资料、读文档、写代码，AI 是我最得力的搭档，但我从不让它替我思考。',
    '现在的目标很明确：打好 C 语言和硬件底子，走进竞赛的赛场，把「想做的」变成「做出来的」。我可能不是起点最高的那个，但一定是折腾得最起劲的那个。',
  ],

  // ---- 板块二：教育背景与技能 ----
  education: [
    {
      year: '2026—2030',
      school: '燕山大学',
      degree: '本科',
      desc: '在读 · 电子科学与技术',
    },
  ] as EducationItem[],

  // TODO: 技能持续补充（按实际更新分类）
  skills: [
    { category: 'AI', skills: ['AI 工具使用'] },
    { category: '编程', skills: ['C 语言（入门）'] },
  ] as SkillGroup[],

  // ---- 板块三：项目经历（先空着） ----
  projects: [] as ProjectItem[],

  // ---- 板块四：个人特长、兴趣爱好 ----
  interests: [
    { name: 'AI 工具深度应用', desc: '熟练运用 AI 工具链辅助学习与开发，重视提示词设计。' },
    { name: '快速学习能力', desc: '习惯先跑通再深究，对新技术吸收快。' },
    { name: '文档与信息检索', desc: '擅长查阅资料、阅读英文文档，规范记录过程。' },
    { name: '技术记录习惯', desc: '习惯把学习过程沉淀成笔记，持续积累。' },
  ] as InterestItem[],
}
