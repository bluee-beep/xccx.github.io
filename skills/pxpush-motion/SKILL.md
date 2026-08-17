---
name: pxpush-motion
description: "pxpush.com 滚动动效零 GSAP 复刻：条带刷色(overlayIn)、逐词淡入(textFade)、大字横滚(marquee)、词随机淡入(randomFade)、离场模糊(fadeOut)、线揭示(separatorIn)、网格光标(cursorGrid)。当需要复刻 pxpush 式滚动驱动动效、无 GSAP 依赖的 scrub 动画、或中文分词词级动画时使用。"
---

# pxpush-motion Skill

把 [pxpush.com](https://pxpush.com) 的滚动动效用**零依赖原生 JS + CSS** 1:1 复刻到任何项目——参数全部逆向自原站 bundle（非目测估计），与 GSAP+ScrollTrigger 原版数学等价。

## When to Use This Skill

触发条件（任一）：
- 复刻 pxpush.com 的某种动效（条带刷色、大字横滚、逐词淡入、网格光标等）
- 需要**滚动 scrub** 动画但不想引入 GSAP/ScrollTrigger（零依赖直写值方案）
- 需要把 GSAP 配方（ease/stagger/scrollTrigger 区间）翻译成原生 JS 公式
- 需要中文/中英混排的**词级**滚动动画（标点附着分词已内置）
- 需要 marquee 无缝循环大字、词随机顺序入场、离场模糊淡出、分隔线揭示

## Not For / Boundaries

- **不做通用动画库**：参数全部锁定 pxpush 原版（1:1 语义），要自创节奏请改参数或另写
- **不含 WebGL/Three.js**：pxpush 首页 Three 场景（云飞行/徽标等）未逆向，只覆盖 2D DOM 动效
- **不是 GSAP 教程**：假定你拿到的是逆向参数；如何从 minified bundle 提取参数见 `references/reverse-engineering.md`
- 触屏/移动端差异按**原站语义**处理（如条带行数 15/10），不自作主张「优化」
- 已知限制：`titleIn`/`titleRandom` 的 3D 翻入已逆向但未默认启用（站内用户砍掉了 3D），参数在 `references/params.md` 中保留可选

## Quick Reference

所有函数均为**原生 JS**，约定：
- scrub = scroll/resize 事件**直接写值**（1:1 跟手，无 rAF 无 lerp）
- 区间映射 `p = clamp((A·vh − rect.top) / (A·vh − B·vh), 0, 1)`（B 可为负数）
- 触屏行数差异：`rows = isTouch() ? 15 : 10`（`isTouch = matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches`）

### 1. textFade：段落逐词 scrub 淡入（含中文分词）

```js
// 结构：段落 p 内先包 <span class="px-word">（分词函数 splitWords 见下）
function pxFadeWords(el) {
  const words = [...el.querySelectorAll('.px-word')]
  const total = 1 + 0.05 * (words.length - 1) // stagger .05
  const update = () => {
    const vh = innerHeight
    const r = el.getBoundingClientRect()
    const p = r.height > 0 ? (vh * 0.8 - r.top) / r.height : 1 // top 80% → bottom 80%
    words.forEach((w, i) => {
      w.style.opacity = Math.min(1, Math.max(0, p * total - i * 0.05)) // ease none
    })
  }
  addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
}

// 中文分词：标点附着前词（「词连同标点一起显现」的中文节奏）
function splitWords(text) {
  const raw = text.match(/[^，。；、？：！,.!?;:\s]+|[，。；、？：！,.!?;:]/g) ?? []
  const out = []
  for (const w of raw) {
    if (/^[，。；、？：！,.!?;:]$/.test(w) && out.length) out[out.length - 1] += w
    else out.push(w)
  }
  return out
}
```

### 2. overlayIn：章节条带刷色过渡

```css
/* 结构：overlay 挂出站章节内 bottom:0 absolute，覆盖末尾 100svh */
.px-overlay { position: absolute; bottom: 0; left: 0; width: 100vw; height: 100vh; height: 100svh;
  display: grid; grid-template-columns: 1fr; pointer-events: none; z-index: 10 }
.px-overlay > div { background: var(--px-overlay-color, #969da4); transform: scaleY(0); transform-origin: 50% 100%; will-change: transform }
/* 条带行高 = 100svh / rows（grid 隐式行 stretch，无需显式行高） */
```

```js
function pxOverlayStrips(el, { color = '#969da4', isTouch } = {}) {
  const rows = (isTouch ?? (matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) ? 15 : 10
  el.style.setProperty('--px-overlay-color', color)
  const strips = []
  for (let i = 0; i < rows; i++) { const s = document.createElement('div'); el.appendChild(s); strips.push(s) }
  const TOTAL = 0.5 + 0.04 * (rows - 1) // GSAP 默认 0.5s + stagger 跨度
  const update = () => {
    const vh = innerHeight
    const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (vh * 0.8))) // top 0% → -80%
    strips.forEach((s, r) => {
      const q = Math.min(1, Math.max(0, (p * TOTAL - (rows - 1 - r) * 0.04) / 0.5)) // from:"end"：底行先
      s.style.transform = `scaleY(${((1 - Math.pow(1 - q, 5)) * 1.01).toFixed(4)})` // power4.out + 1% 防缝
    })
  }
  addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
}
```

### 3. marquee：大字横滚无缝循环

```css
/* 8 组重复（pxpush 同款），位移 = -100% / 组数 */
.px-marquee__track { display: flex; width: max-content; white-space: nowrap; will-change: transform;
  animation: px-marquee 30s linear infinite }
@keyframes px-marquee { to { transform: translateX(-12.5%) } } /* -100% / 8 组 */
```

### 4. randomFade：词随机顺序淡入（timeline 版）

```js
function pxRandomFade(el, { delayStart = 0 } = {}) {
  const words = [...el.querySelectorAll('.px-word')]
  const ranks = shuffle(words.length) // 动画顺序随机、DOM 顺序不变
  words.forEach((w, i) => {
    w.style.opacity = '0'
    w.style.transition = `opacity 0.5s cubic-bezier(0.19,1,0.22,1) ${(delayStart + ranks[i] * 0.03).toFixed(2)}s`
    requestAnimationFrame(() => { w.style.opacity = '1' })
  })
}
function shuffle(n) { const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
```

### 5. randomFade（scrub 版，pxpush titleRandom 去 3D）

```js
function pxRandomFadeScrub(el) {
  const words = [...el.querySelectorAll('.px-word')]
  const ranks = shuffle(words.length)
  const total = 0.5 + 0.03 * (words.length - 1)
  const update = () => {
    const vh = innerHeight
    const p = Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.9))) // top 90% → 0%
    words.forEach((w, i) => {
      const q = Math.min(1, Math.max(0, (p * total - ranks[i] * 0.03) / 0.5))
      w.style.opacity = String(1 - Math.pow(1 - q, 5)) // power4.out
    })
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
}
```

### 6. fadeOut：离场模糊淡出

```js
function pxFadeOut(el) {
  const update = () => {
    const vh = innerHeight
    const p = Math.min(1, Math.max(0, (vh * 0.05 - el.getBoundingClientRect().top) / (vh * 0.35))) // top 5% → -30%
    el.style.opacity = String(1 - p)
    el.style.filter = p > 0.001 ? `blur(${(20 * p).toFixed(1)}px)` : '' // blur 0 → 20px
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
}
```

### 7. separatorIn：分隔线揭示（clip / 从右滑出变体）

```css
/* 原版语义：clip-path 从左向右揭示（top 90% → 70%）；--klp 由 JS 驱动 */
.px-separator::after { content: ''; display: inline-block; width: 8rem; height: 1px;
  background: currentColor; clip-path: inset(0 calc((1 - var(--klp, 1)) * 100%) 0 0) }
/* 变体（从右侧滑出，站点定制）：改用 transform: scaleX(var(--line-p,1)); transform-origin: right */
```

```js
function pxSeparator(el) {
  const update = () => {
    const vh = innerHeight
    const p = Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.2))) // top 90% → 70%
    el.style.setProperty('--klp', p.toFixed(4))
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
}
```

### 8. 缓动速查

```js
const power1Out = t => 1 - Math.pow(1 - t, 2) // GSAP ease:"power1"
const power4Out = t => 1 - Math.pow(1 - t, 5) // GSAP ease:"power4"（默认 .out）
const expoOut = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t) // GSAP ease:"expo"（时间线版用）
```

### 9. scrub 区间映射模板

```js
// start "top A%" → end "top B%"（A>B，B 可负），返回 [0,1] 进度
const scrubP = (el, a, b) => {
  const vh = innerHeight
  return Math.min(1, Math.max(0, (vh * (a / 100) - el.getBoundingClientRect().top) / (vh * ((a - b) / 100))))
}
// 例：scrubP(el, 80, 80) 不可用（除零）；textFade 用段落自身高度驱动（见 1）
```

## Examples

### 示例 1：把中文段落接上 textFade

- 输入：`<p id="intro">先跑通，再深究。不懂就问，问到懂为止。</p>`
- 步骤：
  1. 用 `splitWords()` 把文本切成词数组，逐词包 `<span class="px-word">`
  2. `pxFadeWords(document.getElementById('intro'))`
  3. CSS：`.px-word { will-change: opacity }`（SSR 默认可见，JS 接管后由 scrub 控制）
- 验收：段落顶部过视口 80% 线起逐词点亮、底部过 80% 线全部可见；反向滚动词逐个熄灭；节奏与 pxpush 正文一致

### 示例 2：给两个章节之间加条带刷色过渡

- 输入：`<section class="out">…旧章节…</section><section class="in">…新章节…</section>`
- 步骤：
  1. 在 `.out` 末尾插 `<div class="px-overlay"></div>`（CSS 见 Quick Reference 2；`.out` 需 `position: relative`）
  2. `pxOverlayStrips(overlayEl, { color: '#969da4' })`（颜色 = `.in` 的背景色）
  3. 滚过交界时灰蓝色带从底部逐排升起刷过 `.out` 末尾，与 `.in` 同色无缝衔接
- 验收：底行先长、行间 40ms、power4 缓动、区间 overlay 顶过视口 0% 起 -80% 止；反向回卷

### 示例 3：页脚大字横滚 + 词随机点亮 + 离场模糊

- 输入：`<div class="mq"><div class="px-marquee__track"><h1 class="t">● <span class="px-word">XCCX</span></h1></div></div>`（8 组相同标题）
- 步骤：
  1. 模板复制 8 组（v-for / 手动），track 用 Quick Reference 3 的 CSS（`animation: px-marquee 30s linear infinite`，keyframes `-12.5%`）
  2. `pxRandomFadeScrub(document.querySelector('.mq'))`（滚动接近时词随机淡入）
  3. `pxFadeOut(document.querySelector('.mq'))`（滚过顶部后模糊淡出）
  4. 上下线：`.mq::before/::after` + `pxSeparator`（或从右滑出变体）
- 验收：字高 ~15vw、8 组无缝循环无跳帧；接近视口词随机点亮；继续滚动整体模糊淡出；反向全部回卷

## References

- `references/index.md`：导航索引
- `references/params.md`：全参数速查（每种效果逆向实录：区间/缓动/stagger/结构）
- `references/gsap-to-vanilla.md`：GSAP → 零依赖还原公式推导（时间模型/scrub 映射/缓动表）
- `references/reverse-engineering.md`：逆向方法与来源（bundle 提取点、Codrops 文、教训）
- `scripts/demo.html`：自包含演示页（六种效果内联演示，浏览器直接打开）

## Maintenance

- 来源：pxpush.com 线上 HTML/JS bundle 逆向（2026-08-17）+ Codrops 官方拆解文《The Department Is Open: Building the PX PUSH Website》（2026-08-07）
- 已知限制：Three.js 场景未覆盖；`titleIn`/`titleRandom` 的 3D 参数在 params.md 保留（默认不启用）
- 双份维护说明：本 Skill 的原生 JS 为准；站内 Vue 组件版（ChapterOverlay/MarqueeText 等）为同参数实现参考
- Last updated: 2026-08-17
