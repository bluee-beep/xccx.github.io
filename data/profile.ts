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

  // ---- 自我介绍（保留） ----
  bio: [
    '你好，我是 Xccx。我对「把事情做出来」这件事有近乎固执的兴趣——从想法、到设计、再到可运行的代码，全程亲力亲为。',
    '目前在学习与探索的方向：界面设计、前端工程、产品思维，以及它们如何组合成真正有价值的东西。',
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
