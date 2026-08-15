// ==================== 构建后处理：404.html 覆盖 ====================
// Nuxt 官方设计：prerender 的 /404.html 是 SPA 模板（PRERENDER_NO_SSR_ROUTES 硬编码）
// 但 /404 路由本身有完整 SSR 渲染（.output/public/404/index.html）。
// 用 SSR 完整版覆盖 SPA 模板：无 JS 也显示完整蓝屏，水合后交互正常。
import { readFileSync, writeFileSync } from 'node:fs'

const from = new URL('../.output/public/404/index.html', import.meta.url)
const to = new URL('../.output/public/404.html', import.meta.url)

writeFileSync(to, readFileSync(from))
console.log('✅ 404.html 已替换为 SSR 完整版（蓝屏彩蛋）')
