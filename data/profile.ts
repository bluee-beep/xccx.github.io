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
    // TODO: 替换为真实教育经历
    { year: '2024—', school: '待填写', degree: '待填写', desc: '待补充专业方向与学习内容。' },
  ] as EducationItem[],

  skills: [
    { category: '设计', skills: ['界面设计', '品牌视觉', '设计系统'] },
    { category: '工程', skills: ['TypeScript', 'Vue / Nuxt', 'CSS 工程化'] },
    { category: '产品', skills: ['需求分析', '原型', '项目管理'] },
  ] as SkillGroup[],

  // ---- 板块三：项目经历（先空着） ----
  projects: [] as ProjectItem[],

  // ---- 板块四：个人特长、兴趣爱好 ----
  interests: [
    // TODO: 替换为真实特长与兴趣
    { name: '待填写', desc: '待补充你的特长或爱好。' },
  ] as InterestItem[],
}
