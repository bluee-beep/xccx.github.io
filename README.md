# Xccx 个人网站

> 个人站：参考 pxpush.com 的高端营销落地页风格，Nuxt 3 SSG 静态输出，部署 GitHub Pages。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Nuxt 3（SSG / prerender） |
| 平滑滚动 | Lenis（手写 composable 封装） |
| 文字动画 | Splitting.js（逐字拆解 + stagger） |
| 入场动画 | 自研 IntersectionObserver 指令（v-reveal） |
| 样式 | 手写 CSS 设计系统（token 化，无框架） |
| 字体 | Space Grotesk / JetBrains Mono 自托管 |
| 部署 | GitHub Pages + GitHub Actions |

## 常用命令

```bash
npm run dev       # 开发（localhost:3000）
npm run generate  # SSG 构建（含 fix-404 覆盖脚本）→ .output/public
npm run preview   # 静态预览
```

## 目录结构

```
xccx.github.io/
├── .github/workflows/deploy.yml   # GH Pages 发布流水线
├── assets/css/                    # 设计系统：tokens / base / utilities / main
├── components/
│   ├── layout/                    # AppHeader / AppFooter
│   ├── ui/                        # ChapterSection / RevealText（通用组件）
│   └── home/                      # HeroSection / ChapterLoop / ContactCta
├── composables/                   # useLenis / useReveal / useSeo
├── data/                          # 单一数据源：site / chapters / profile
├── layouts/                       # default（全局壳层）/ blank（404 蓝屏）
├── pages/                         # index / about / 404
├── plugins/                       # reveal.directive（v-reveal 指令）
├── scripts/fix-404.mjs            # 构建后 404.html 覆盖（见「已知设计行为」）
└── public/                        # favicon.svg / og-image.svg
```

## 核心设计：章节是数据，不是组件

首页叙事由 `data/chapters.ts` 驱动——新增模块（作品集、博客章节等）只需向数组追加条目，不动组件结构。`ChapterSection.vue` 负责渲染，`ChapterLoop.vue` 只做循环。

## 已知设计行为（重要）

- **404.html 的 SPA 陷阱**：Nuxt prerender 对 `/404.html` 走 SPA 模板输出（`@nuxt/nitro-server` 硬编码 `PRERENDER_NO_SSR_ROUTES`），产物 body 为空。本仓库用 `scripts/fix-404.mjs` 在构建后把 `/404` 的 SSR 完整渲染（`.output/public/404/index.html`）覆盖为 `404.html`——无 JS 也显示完整蓝屏，水合后交互正常。
- **组件自动导入**：`components` 配置了 `pathPrefix: false`，组件按文件名注册（`AppHeader` 而非 `LayoutAppHeader`）。新增组件须保证文件名全站唯一。

## Roadmap（预留模块）

- [x] M0-M6：脚手架 → 设计系统 → 首页叙事 → 动效 → 关于页/404 → 构建验证
- [ ] Journal 博客：新建 `pages/journal/` + `@nuxt/content`（数据位已预留 `data/chapters.ts` 扩展点）
- [ ] 作品集独立路由：`pages/works/`（占位目录已建）
- [ ] 汉堡菜单（移动端导航）
- [ ] 替换 OG 图为 PNG（当前 SVG 占位）
- [ ] 头像/真实作品图

## TODO（待用户填写真实内容）

- `data/site.ts`：社交链接、邮箱
- `data/chapters.ts`：四章节真实文案与数字
- `data/profile.ts`：bio、时间线、技能
- `public/og-image.svg`：品牌化

## 参考

- [pxpush.com](https://pxpush.com) — 设计参考（Nuxt 3 + Lenis + Splitting + 手写 CSS）
- [Lenis](https://github.com/darkroomengineering/lenis) / [Splitting.js](https://splitting.js.org/)
