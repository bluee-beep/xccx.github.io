// ==================== XCCX 个人站 — Nuxt 配置 ====================
// baseURL 走环境变量注入（项目站点 /xccx.github.io/，用户站点则为 '/'）
// 注意：head 中静态资源路径（favicon/og-image）需手动拼接 baseURL，
// Nuxt 不会自动为 head 的 link/meta 加前缀
const baseURL = process.env.BASE_URL ?? '/xccx.github.io/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'Xccx — Personal Brand',
      meta: [
        { name: 'description', content: 'Xccx 的个人品牌网站：设计 × 工程 × 产品。' },
        { property: 'og:title', content: 'Xccx — Personal Brand' },
        { property: 'og:description', content: 'Xccx 的个人品牌网站：设计 × 工程 × 产品。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${baseURL}og-image.svg` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
    },
  },

  css: [
    '~/assets/css/main.css',
    '@fontsource-variable/space-grotesk',
    '@fontsource-variable/jetbrains-mono',
    '@fontsource-variable/inter',
  ],

  // 组件按文件名注册（去掉目录前缀）：AppHeader 而非 LayoutAppHeader
  // 前提：全站文件名唯一（当前目录结构满足）
  components: [{ path: '~/components', pathPrefix: false }],

  // SSG 输出：显式列出全部路由，保证 404.html 被生成（GH Pages 回退依赖它）
  nitro: {
    prerender: {
      routes: ['/', '/about', '/404'],
    },
  },

  // 注：404.html 以 SPA 模式输出是 Nuxt 官方设计（PRERENDER_NO_SSR_ROUTES），
  // 客户端挂载后渲染蓝屏页，无需覆盖。
})
