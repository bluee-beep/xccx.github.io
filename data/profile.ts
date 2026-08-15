// ==================== 关于页数据（占位，TODO: 替换为真实信息） ====================

export interface TimelineItem {
  year: string
  title: string
  desc: string
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export const profile = {
  name: 'Xccx',
  role: '设计 × 工程 × 产品',

  bio: [
    '你好，我是 Xccx。我对「把事情做出来」这件事有近乎固执的兴趣——从想法、到设计、再到可运行的代码，全程亲力亲为。',
    '目前在学习与探索的方向：界面设计、前端工程、产品思维，以及它们如何组合成真正有价值的东西。',
  ],

  // TODO: 替换为真实经历
  timeline: [
    { year: '2026', title: '搭建个人品牌网站', desc: '这个站本身就是一个持续迭代的作品。' },
    { year: '2025', title: '探索设计 × 工程', desc: '从界面设计进入前端工程，开始做完整的作品。' },
    { year: '2024', title: '开始上路', desc: '第一次认真思考：我想做出什么样的东西。' },
  ] as TimelineItem[],

  // TODO: 替换为真实技能
  skills: [
    { category: '设计', skills: ['界面设计', '品牌视觉', '设计系统'] },
    { category: '工程', skills: ['TypeScript', 'Vue / Nuxt', 'CSS 工程化'] },
    { category: '产品', skills: ['需求分析', '原型', '项目管理'] },
  ] as SkillGroup[],
}
