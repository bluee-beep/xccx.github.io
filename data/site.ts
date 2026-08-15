// ==================== 站点元数据（单一数据源） ====================
// 导航、社交链接、联系方式统一在此维护；占位内容待用户填写

export interface NavItem {
  label: string
  to: string
}

export interface SocialItem {
  label: string
  href: string
}

export const site = {
  name: 'Xccx',
  tagline: '设计 × 工程 × 产品',

  // Hero 视频取景：素材需无缝循环（首尾衔接），放 public/videos/
  heroVideo: {
    src: '/videos/hero.mp4',
    range: 0.2, // 视频比视口大 20%，支持 ±10% 鼠标取景平移
  },

  nav: [
    { label: 'Index', to: '/' },
    // TODO: Journal 博客上线后在此追加 { label: 'Journal', to: '/journal' }
  ] as NavItem[],

  social: [
    // TODO: 填写真实账号链接
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Twitter', href: 'https://twitter.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ] as SocialItem[],

  email: 'coldbluee@163.com',
}
