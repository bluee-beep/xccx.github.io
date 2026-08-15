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

## v1.0.6 — 2026-08-15

### 修正：几何 X 仅用于 favicon

- **回滚**（git checkout ded7f14）：logo.svg / og-image.svg 恢复为**用户手绘 X 字标**（3:1）
- favicon.svg 保留几何 X（C 变体，黑底方形，标签页专用）
- 教训：favicon 与 logo 是不同场景，不可互相替换

## v1.0.5 — 2026-08-15

### ~~Logo 重设计：几何 X（C 变体）~~（已被 v1.0.6 回滚）

## v1.0.4 — 2026-08-15

### Logo 位置定稿

- Header logo 左侧边距 **32px**（四档对比 B 档，A=58/D=8px 中选定），右侧保持 gutter

## v1.0.3 — 2026-08-15

### Logo 尺寸定稿

- logo.svg 画布**回退 3:1**（2172×724，去掉 4:1 水平留白——用户不需要留白版式）
- Header logo 高度定为 **44px**（六档对比 B 档，40~58px 中选定）
- Header 高度 5rem（80px）保持

## v1.0.2 — 2026-08-15

### Logo 尺寸与比例调整（历史，已被 v1.0.3 覆盖）

- ~~4:1 画布 + 58px + header 5.5rem~~（用户不满意留白与尺寸，已回退）

## v1.0.1 — 2026-08-15

### Logo 接入（用户原创矢量作品）

- **logo.svg**：用户手绘矢量 X 字标（单字母 X，透明底白字，2172×724）接入 Header，替换原文字 logo
- **favicon.svg**：裁切 X 交叉中心 + 黑底（64px 下可辨识）
- **og-image.svg**：黑底 + X 字标 + tagline 标语
- 资源路径手动拼接 baseURL（`useRuntimeConfig().app.baseURL`）

## v1.1.0-P4 — 2026-08-15

### 视频体积优化 + 首帧海报

- 720p 重编码（21.3MB → **11.3MB**，星空素材画质无感损失）+ xfade 无缝渐变保留
- **首帧海报** `hero-poster.jpg`（70KB）：打开页面秒现星空静态图，视频流式加载后无缝接管

## v1.1.0-P3 — 2026-08-15

### 视频无缝循环处理（xfade 2 秒交叉渐变）

- 30s 素材：主体 28s + 开头 2s 尾部渐入（`xfade duration=2 offset=28`）
- 循环点（30s→0s）画面平滑过渡，无跳变
- 最终规格：1080p / 30fps / 21.3MB / 无音频

## v1.1.0-P2 — 2026-08-15

### Hero 视频素材定稿 + 取景调优

- **素材**：太空漂浮（4K 源截取前 30 秒，1080p / 23.6MB / 去音频 / crf 26）
- **平移幅度**：±15% → **±10%**（range 0.3 → 0.2）
- **视频顶到页面顶端**：Hero 上移 header 高度，视频覆盖含 header 区域
- **Header 透明化**：初始透明（视频透出），滚动 16px 后加毛玻璃背景
- **修复触屏误判**：`pointer: coarse` 判定（触屏笔记本正常启用平移）；mousemove 升级 window 级 + 坐标范围检查；canplay 兜底尺寸计算

## v1.1.0-P1 — 2026-08-15

### 首页视频视差取景背景（框架）

- `usePanorama` composable：cover 放大 + 30% 余量 → mousemove 归一化 → lerp 插值平滑跟随（±15% 平移）
- HeroSection 重构：视频取景层 + 渐变遮罩 + 文字占位层（P3 定稿）
- 容错：触屏/reduced-motion 居中静态取景、视频加载失败回退纯色、滚出首屏停止 rAF
- `data/site.ts` 新增 heroVideo 配置（src/range）
- 待 P0：用户提供无缝循环素材 → `public/videos/hero.mp4`

## 开始填充内容
