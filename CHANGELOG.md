# 变更日志

> 每完成一小步实现，在此追加记录，并同步提交 git（中文语义化 commit）。

## v2.2.0 — 2026-08-16

### 文字出现效果（pxpush 式，滚动 scrub 淡入）

- **正文段落滚动 scrub 淡入**（`components/ui/ChapterSection.vue`）：全部章节（含 Nº001 intro）段落随滚动逐段淡入——复刻 pxpush `effect__textFade` scrub 语义，零 GSAP：scroll → 段落顶部过视口 50%（中线）开始显现 → 25% 完全显现（用户验收选定的节奏）+ lerp 0.2 平滑 + 统一 rAF 循环（resize/scroll 监听均命名函数，卸载全清理）
- **Nº001「」重点词高亮**：intro 浅底上高亮用深绿 `#3d6b14`（与 Nº001 编号同色），荧光绿在浅底不可读
- SSR 安全约定沿用 v-reveal：默认可见，仅 JS 挂载后进入隐藏/淡入管线；触屏 / reduced-motion 直接可见

### 迭代记录

- 初版 Nº001 行遮罩上滑（`IntroReveal.vue`，pxpush `.line/.line__inner` + yPercent 100→0 expo-out 1s 语义）经用户验收后替换为统一 scrub 淡入，组件已移除——「全部段落同一出场方式」的一致性优先

## v2.1.0 — 2026-08-16

### 网格反色光标（pxpush 1:1 移植）

- **CursorGrid**：全屏 20 列点阵 + `mix-blend-mode: difference` + gooey 粘连滤镜（`components/ui/CursorGrid.vue`）
- 点亮时序复刻原版：瞬时亮 → ttl 0.2s 硬切熄灭（class 切换 + setTimeout，**零 GSAP 依赖**）
- 排除区：header 链接 / logo / 微信胶囊；≤1300px 宽屏关闭（原版同款）；触屏 / reduced-motion 不启用
- 层级 `--z-cursor: 1000`（盖过 CRT 扫描线罩 999）
- dev 调参：`?cursor=columns:28,ttl:0.4,gooey:0`（生产构建 dead-code 剔除）

### 移植踩坑记录（两个隐蔽根因）

- **scoped CSS 匹配失效**：格子由 JS `innerHTML` 动态生成（不带 `data-v` 标记），scoped 选择器匹配失败 → 格子零尺寸。修复：`:deep()` 穿透
- **gooey 滤镜容器尺寸归零**：SVG 设 `width:0/height:0` 导致 Chrome 中 filter 定义失效，`filter:url()` 引用失败 → 整层不可见（计算样式正常，极具迷惑性）。修复：SVG 改 `position:absolute` 保留默认尺寸（原版同款）+ 挂滤镜前 `getElementById` 验证

## v2.0.0 — 2026-08-16

### 完整版上线（tag v2.0.0）

- **单页结构定稿**：Hero 视频取景 → Nº001 Intro（灰蓝 CRT）→ 过渡 → Nº002（高亮+彗尾笔迹）→ 过渡 → Nº003（蓝黑+喷漆+Wait Me 水印）→ Nº004（联系胶囊+微信二维码）→ 页脚拖尾
- **全站 CRT 扫描线罩**：body::after 固定条纹层（0.8s 流动）
- **导航**：Nº001-004 锚点 + scroll-spy 果冻荧光横线 + 恒透明
- **页脚**：5 层 logo 拖尾（间隔/透明度/blur/变暗四重渐变）+ 版权
- **修复**：prerender 路由移除 /about（部署失败根因）；双 logo 交接渐隐
- 线上：https://bluee-beep.github.io/xccx.github.io/ ✅

## v1.1.0 — 2026-08-16

### 章节结构确认 + 衔接动效收尾

- **结构定稿**（用户拍板）：Hero → Nº001 → 过渡动画（仅此一处）→ Nº002 → Nº003 → Nº004 → 关于内容区
- **过渡动效重做**：C+D 组合——陡圆弧（椭圆率 92%）从底部滑上覆盖（太阳升起感），上一章同步模糊（blur 10px + 微暗），滚动驱动（160vh 行程、20vh 延迟）
- **Nº002 保持现状**：灰底 + 右栏文案（无标题）
- **回滚记录**：Nº002 内容合并方案（理解错误）已回滚

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

## v1.3.0-H3 — 2026-08-15

### 首页 → 关于页 过渡衔接

- 新增 NextStation 过渡区（首页底部）：「Next Station · 下一站 · 关于我」
- hover 标题变荧光 + 箭头滑出，点击进入 /about
- 首页全站完成：Hero 视频取景 / 大 logo 归位 / 滚动字幕 / 四章节 / CTA / 过渡区

## v1.3.0-H2 — 2026-08-15

### 首页四章节文案拟稿（竞赛视角，用户审后可改）

- Nº001 Manifesto：「先跑通，再深究」宣言
- Nº002 What I do：「电子 × AI × 工程」+ stats 真实化（1 个亲手网站 / 2 个技能方向 / ∞ 好奇心）
- Nº003 Selected works：「作品在路上」（等竞赛项目）
- Nº004 Let's talk：联系 CTA（真实邮箱已在 site.ts）

## v1.3.0-H1 — 2026-08-15

### 首页大 Logo 滚动归位（PPT 平滑感）

- Hero 文字层移除（无中文），替换为**中央大 XCCX**（220px）
- `useHeroLogo`：滚动进度 → lerp 插值 → scale(1→0.2) + translate（归位至 header logo）
- **与 header logo 合体**：归位进度驱动 header logo 显隐（useState 跨组件共享）
- `useDevice` 统一设备判定（触屏/减少动效 → 不归位，居中展示）
- 修复：useState 模块顶层调用报错（移入 setup 上下文）

## v1.2.5 — 2026-08-15

### 内容填充 Step 5：Bio 自我介绍（热情版，竞赛视角）

- 三段落：闲不住的人设 → 网站本身为证据 → 竞赛目标与行动力宣言
- 四大板块 + Bio 全部填充完毕，剩余：项目经历（暂缓）

## v1.2.4 — 2026-08-15

### 内容填充 Step 4：特长兴趣（竞赛选拔定位）

- AI 工具深度应用 / 快速学习能力 / 文档与信息检索 / 技术记录习惯
- 背景确认：网站用于**竞赛人员选拔展示**，后续内容（bio/role/项目）对齐此定位

## v1.2.3 — 2026-08-15

### 内容填充 Step 2 修正 + Step 3 技能

- 教育描述简写：「在读 · 电子科学与技术」（去掉长头衔）
- 技能按实际重分类：**AI（AI 工具使用）** + **编程（C 语言入门）**

## v1.2.2 — 2026-08-15

### 内容填充 Step 2：教育背景

- 时间线：**2026—2030 燕山大学 · 本科 · 电子科学与技术**（在读）
- 描述含专业特色（国家级一流本科专业建设点，电子学×光电子学）——查证自学校官网

## v1.2.1 — 2026-08-15

### 内容填充 Step 1：基本信息

- 姓名：**徐晨轩**（页面展示中文名，品牌 logo 保持 XCCX）
- 学校：**燕山大学** / 专业：**电子科学与技术**
- 邮箱：**coldbluee@163.com**（替换占位，site.ts + 页脚同步生效）

## v1.2.0 — 2026-08-15

### 关于页升级：个人简介四大板块框架

- **Nº01 基本信息**：学校 / 专业 / 邮箱 / 社交链接（数据驱动）
- **Nº02 教育背景与技能**：教育时间线 + 技能矩阵
- **Nº03 项目经历**：空状态占位（「项目整理中 · 稍后展出」虚线框）
- **Nº04 个人特长、兴趣爱好**：卡片式列表
- `data/profile.ts` 重构为四板块结构（education / projects / interests 新增，均占位待填）

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
