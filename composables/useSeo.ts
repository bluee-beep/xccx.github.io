// ==================== SEO 薄封装 ====================
// 每页 useSeoMeta 统一风格：标题拼接站点名 + 描述
import { useSeoMeta } from '#imports'

interface SeoOptions {
  title?: string
  description?: string
}

export function useSeo(options: SeoOptions = {}) {
  const siteName = 'Xccx'
  const baseDescription = 'Xccx 的个人品牌网站：设计 × 工程 × 产品。'

  useSeoMeta({
    title: options.title ? `${options.title} — ${siteName}` : `${siteName} — Personal Brand`,
    description: options.description ?? baseDescription,
    ogTitle: options.title ? `${options.title} — ${siteName}` : `${siteName} — Personal Brand`,
    ogDescription: options.description ?? baseDescription,
    ogType: 'website',
  })
}
