# 变更日志

> 每完成一小步实现，在此追加记录，并同步提交 git（中文语义化 commit）。

## v2.5.1 — 2026-08-17

### 文档：来源署名归拢单处

- 动效来源说明统一收至 README「参考」一节；组件注释与历史日志中的站点名一律改为「原站」中性指代
- `skills/` 动效知识库定位为本地开发工具：移出版本控制（.gitignore），目录更名 `skills/motion/`

## v2.5.0 — 2026-08-17

### 新增动效复刻知识库 Skill

- **`skills/motion/`**（本地知识库）：将原站动效逆向并零 GSAP 复刻的参数整理为可复用 Skill——`SKILL.md`（触发词/边界 + 9 个原生 JS Quick Reference 函数 + 3 端到端示例）、`references/`（params.md 全参数速查 / gsap-to-vanilla.md 还原公式推导 / reverse-engineering.md 逆向方法与教训）、`scripts/demo.html`（自包含演示页：条带刷色/词淡入/大字横滚/随机淡入/离场模糊/线揭示/网格光标，浏览器直接打开）
- 全部参数逆向实录（非目测）：overlayIn / textFade / MarqueeText / titleRandom(去3D) / fadeOut / separatorIn / CursorGrid，GSAP 时间模型（0.5s 单 tween + stagger 跨度）与 scrub 1:1 直写语义完整保留

## v2.4.0 — 2026-08-17

### Hero→Nº001 条带刷色过渡（1:1 移植）

- **ChapterOverlay**（`components/ui/ChapterOverlay.vue` 新建）：原站 `effect__overlayIn` 1:1 移植——锚定出站章节底部（absolute bottom:0 覆盖 hero 末尾 100svh，挂 `HeroSection` 内），JS 生成 10 行（触屏 15）水平条带，滚动 scrub 驱动从底部逐排升起（底行先、40ms 间隔、power4.out、scaleY 0→1.01、origin 50% 100%、区间 top 0%→-80%）；零 GSAP（手动还原 GSAP 时间模型，scroll/resize 直写值 1:1 无 lerp）；z-index 10（原版级联终值）；reduced-motion 保持无条带（hero 全程可见）
- 色值 = Nº001 灰蓝 `#969da4`（与章节底同色，边界无缝）；条带 JS 生成规避 SSR/触屏行数 hydration 不一致，scoped 需 `:deep` 穿透

### header Index 回首页修复

- 根因：单页站点 Index/logo（`to="/"`）在首页时是重复导航（无滚动动作）+ `scrollRestoration=manual` → 点击无响应
- **修复**：`useLenis.ts` 导出 `scrollToTop()`（Lenis 平滑 + onComplete resolve；reduced-motion 原生回退）；AppHeader 对 logo 与 Index 项挂 `@click.capture`（先于 RouterLink 内部 onClick）+ preventDefault 阻断 push（防 `/#hash → /` 的 scrollBehavior 瞬时回顶杀死平滑动画），平滑到顶后 `router.replace` 清 hash 同步 URL

### Nº001 顶部留白归零

- `.chapter--intro` `padding-block: 12rem` → `0 12rem`：内容头与章节上边界平齐（用户拍板），下留白保留

### 大字 marquee 全套移植（无 3D，用户拍板）

- **MarqueeText**（`components/ui/MarqueeText.vue` 新建）：原站 MarqueeText 1:1 移植（去除 3D 翻入）——8 组超大标题持续横移（CSS animation translateX(-12.5%) 无缝循环，等价 GSAP xPercent 循环）、词**随机顺序**淡入（timeline / scrub 双模式：timeline 与 Preloader 视频就绪联动，scrub 区间 top 90%→0% each 0.03 random）、离场模糊淡出（fadeOut：top 5%→-30%，blur 0→20px）、上下分隔线（hero 时间线版 expo.out 0.8s scaleX；scrub 版 4px 加粗、**从右侧滑出** top 90%→70%）
- **Hero 大字**（timeline 版）：替换原滚动字幕（「Xccx Design ● WavePeak Elite Member」，字号 10vw/容器 11.5vw，用户拍板缩小），词点亮在加载页淡出后播放
- **Nº001 大字**（scrub 版）：替换原 LogoMarquee xccx 字幕（「XCCX ●」，字号 12vw/容器 14vw，用户拍板；LogoMarquee 组件已删除）
- **章节眉题线 separatorIn**：kicker 右侧横线随滚动 clip 揭示（top 90%→70%，--klp 变量驱动）
- **2→3 过渡换为条带刷色**（用户拍板）：Nº002 底部挂 ChapterOverlay（灰蓝 #969da4，overlayColor prop），原圆弧+模糊 ChapterTransition 移除（现仅服务 1→2）；Nº002 底部延伸 30svh 腾出刷色空间（60svh 太下减半）；Nº004 底部内边距减半收紧拖尾上方留白

## v2.3.0 — 2026-08-16

### 首屏加载页（背景视频就绪检测）

- **Preloader**（`components/ui/Preloader.vue` 新建）：全屏黑底 + 裁切版 logo 呼吸 + 荧光细进度条；SSR 首帧即渲染（盖住未 hydration 的页面），JS 异常时 CSS 兜底动画 6.2s 自动淡出
- **真实缓冲进度**：`<video>` progress 事件驱动（buffered / duration）；进度条保留到**完全加载（缓冲 100%）**才消失（用户拍板）；加载失败立即放行（海报/纯色兜底）；90s 超时仅防卡死
- 加载期间锁定滚动；触屏 / reduced-motion 不显示；hydration 后同步真实状态（`readyState === 4`）——慢网络下 canplay 先于 JS 完成也能正确放行
- 修复：Slow 3G 下 JS 未加载时视频露默认 300×150 小画面 → `.hero__video` 加 hydration 前兜底尺寸（120vw 居中 cover）

### 手持拍摄摇晃（首页）

- **useHandheld**（`composables/useHandheld.ts` 新建）：背景视频双正弦叠加漂移 + 微旋转，模拟真人持机拍摄；低频主导呼吸感，幅度克制（平移 ≤9px / 旋转 ≤0.53°）不晕；作用于视频取景外层包装，与鼠标取景分层独立；触屏 / reduced-motion 禁用、滚出首屏停 rAF

### header 导航激活高亮

- scroll-spy 激活项的标题文字变荧光绿（`--c-accent`），与滑动横线同色呼应，颜色平滑过渡

### 修复：线上视频 URL 双斜杠

- `data/site.ts` heroVideo.src 去头斜杠（`/videos/...` → `videos/...`）：原与 baseURL 尾斜杠拼接成 `/xccx.github.io//videos/hero.mp4`，GitHub Pages 上该请求挂起 → 首访视频加载失败（线上实证：curl 双斜杠 URL 卡死、单斜杠 200）。另线上首访撞到 Pages CDN 旧版 HTML 缓存（无 Preloader 的 v2.2.0 产物）——部署完成后 CDN 自动一致

## v2.2.0 — 2026-08-16

### 文字出现效果（滚动 scrub 逐词淡入）

- **正文段落逐词 scrub 淡入**（`components/ui/ChapterSection.vue`）：全部章节（含 Nº001 intro）段落**逐词**随滚动依次点亮——原站 `effect__textFade` 1:1 移植：每词独立 opacity 0→1、ease none、词间 stagger 0.05、scrub 1:1 直接写值（无 lerp 迟滞）、区间由段落自身高度驱动（top 过视口 80% 线开始 → bottom 过 80% 线完成）；中文按标点分词（标点附着前词），「」高亮块整体作为一个词
- **Nº001「」重点词高亮**：intro 浅底上高亮用深绿 `#3d6b14`（与 Nº001 编号同色），荧光绿在浅底不可读
- SSR 安全约定沿用 v-reveal：默认可见，仅 JS 挂载后进入隐藏/淡入管线；触屏 / reduced-motion 直接可见

### 迭代记录

- 初版 Nº001 行遮罩上滑（`IntroReveal.vue`，原站 `.line/.line__inner` + yPercent 100→0 expo-out 1s 语义）经用户验收后替换为统一 scrub 淡入，组件已移除——「全部段落同一出场方式」的一致性优先
- **过渡模糊调参**：Nº001→Nº002 衔接过渡的模糊/圆弧触发从「进视口即开始（100%→40%）」改为「区块顶部到视口 90% 才触发、25% 完成」（触发放低 + 区间加长，模糊推进更缓）
- **Nº003 改为 Nº001 同款灰蓝底**（用户 DevTools 选定后拍板）：`#works` 背景 `#141c28` → `#969da4`，底部喷漆带改为「灰蓝喷点 ↔ 黑」（顶部喷漆带取消——过渡圆弧直接衔接灰蓝底）；文字全套改深色（标题/眉题/段落用 `--c-bg`，编号与「」高亮用深绿 `#3d6b14`，Wait Me 水印深色半透明）——首尾章节灰蓝 CRT 对称
- **Nº002→Nº003 过渡镜像对称**：圆弧色改为 `#969da4`（灰蓝圆弧从黑舞台升起，与 1→2 黑圆弧从灰蓝舞台升起互为镜像）；荧光绿描边方案废弃（对比已足够），`edgeColor` prop 移除
- **圆弧移出模糊作用域**：blur/变黑只作用于舞台背景层（`.ct__stage`），圆弧覆盖块保持清晰——灰蓝圆弧与 Nº003 灰蓝底完美融合（用户反馈）
- **页面边界横线全部取消**：章节 border-top（含 intro/feature/works 变体）、Hero border-bottom、页脚拖尾与版权区 border-top 删除——各区块透明无缝衔接（用户拍板）
- **header 底边横线取消**（用户指定「最底下那条」）：导航 scroll-spy 荧光引导线保留——现在导航区完全透明，仅激活项下有荧光横线
- **header logo 透明度 0.7**：logo 淡入背景，不抢导航视觉重心（用户拍板）
- **修复：页尾 logo 拖尾错位溢出**（用户 DevTools 反馈）——原错位幅度 `logoH×2.5` 导致最快层滚出区块被裁剪、且页尾进度未达 1 留 ~90px 空隙。重写：错位幅度收进区块（`ftH - logoH`，页尾时最底下那层底边**刚好贴住版权区上边界**），进度公式改为页尾恰为 1（以 `ftH + footerH` 为行程）
- **页尾大 logo 放大一倍**（用户拍板）：`52rem → 104rem`；展示区高度同步 2 倍（`26rem → 52rem`）容纳 logo + 拖尾空间；贴底逻辑 JS 动态适配
- **拖尾层间隔收紧**（用户拍板）：速度由不等距 `[0.656, 0.404, 0.192, 0.072, 0]` 改为等差 `[0.656, 0.492, 0.328, 0.164, 0]`——层间间隔均等且更紧凑，顶层贴底不变
- **拖尾 logo 整体往下靠**（用户拍板，本版已回退）：`.ft__layer` 初始位置 `top: 15%`；贴底约束同步扣除初始下移（`ftH - logoH - 0.15ftH`）——页尾时最底下层仍**刚好贴住版权区上边界**，拖尾从 15% 处向下铺开
- **拖尾 logo 透明边界修复（裁切副本）**：原 logo.svg 画布约 57% 高度是透明留白（图形仅占 y 178~485），「贴底」视觉上悬空 ~141px。新增 `public/logo-cropped.svg`（viewBox `99 176 1974 311`，headless Edge `getBBox` 权威验证无裁切）——仅页尾拖尾使用：元素盒 = 图形边界，贴底即白字贴底；header 等其余位置继续用原稿
- **拖尾重影动效重做**（用户拍板）：滚动中残影按速度差逐渐散开（越往下重影铺开面积越多）、颜色渐淡（`1 − 0.5×progress`，页尾残影 50% 浓度）；速度系数等差 **0.1**（1 / 0.9 / 0.8 / 0.7 / 0.6）层间更密；主层实心全程、页尾贴底
- **拖尾初始位置收回区块顶**（`top: 0`）：裁切后无需下移补偿，缩短与 Nº004 的间隔；贴底行程同步改为 `ftH − logoH`（用户验收「比例尺寸合适」）

## v2.1.0 — 2026-08-16

### 网格反色光标（1:1 移植）

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
