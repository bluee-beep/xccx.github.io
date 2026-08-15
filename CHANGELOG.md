# 变更日志

> 每完成一小步实现，在此追加记录，并同步提交 git（中文语义化 commit）。

## v1.0.0 — 2026-08-15

### 里程碑完成（M0–M7）

- **脚手架**：Nuxt 3.21 手动脚手架（绕开 nuxi 默认 Nuxt 4 模板降级问题），git 仓库初始化
- **设计系统**：CSS 四件套（tokens/base/utilities/main）+ Space Grotesk / JetBrains Mono 自托管
- **首页叙事**：数据驱动四章节（`data/chapters.ts`），Hero 全屏首屏 + 结尾 CTA
- **动效三件套**：Lenis 平滑滚动（手写 composable）/ v-reveal 入场指令 / Splitting 逐字动画
- **页面**：关于我（数据驱动 timeline/skills）+ 404 复古蓝屏彩蛋（blank layout）
- **构建**：`scripts/fix-404.mjs` 解决 Nuxt 官方 404.html SPA 模板问题；favicon + OG 图
- **部署**：GitHub Pages 项目站点上线 `https://bluee-beep.github.io/xccx.github.io/`

## v1.0.1 — 2026-08-15

### Logo 接入（用户原创矢量作品）

- **logo.svg**：用户手绘矢量 X 字标（单字母 X，透明底白字，2172×724）接入 Header，替换原文字 logo
- **favicon.svg**：裁切 X 交叉中心 + 黑底（64px 下可辨识）
- **og-image.svg**：黑底 + X 字标 + tagline 标语
- 资源路径手动拼接 baseURL（`useRuntimeConfig().app.baseURL`）

## 开始填充内容
