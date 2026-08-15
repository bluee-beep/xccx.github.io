// ==================== XCCX 个人站 — Nuxt 配置 ====================
// baseURL 走环境变量注入（GitHub Pages 用户站点为 '/'，项目站点为 '/repo/'）
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: process.env.BASE_URL ?? '/',
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'Xccx — Personal Brand',
      meta: [
        { name: 'description', content: 'Xccx 的个人品牌网站：设计 × 工程 × 产品。' },
      ],
    },
  },

  // SSG 输出：显式列出全部路由，保证 404.html 被生成（GH Pages 回退依赖它）
  nitro: {
    prerender: {
      routes: ['/', '/about', '/404'],
    },
  },
})
