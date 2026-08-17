<script setup lang="ts">
// ==================== 章节容器 ====================
// 数据驱动渲染单条 ChapterItem：Nº 编号 + 眉题 + 大标题 + 段落 + stats
// 段落入场 = 滚动 scrub 逐段淡入（原站 effect__textFade 语义）
import type { ChapterItem } from '~/data/chapters'
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

defineProps<{ chapter: ChapterItem; overlayColor?: string }>() // overlayColor：出站章节底部挂条带刷色过渡（2→3 用）

const baseURL = useRuntimeConfig().app.baseURL

// 解析「」标记：重点词高亮
function splitHighlight(text: string) {
  return text.split(/(「[^」]*」)/g).map((part) => {
    if (part.startsWith('「') && part.endsWith('」')) {
      return { text: part.slice(1, -1), hl: true }
    }
    return { text: part, hl: false }
  })
}

// 按标点切词，标点附着到前一个词（中文节奏：词连同标点一起显现）
function splitWords(text: string): string[] {
  const raw = text.match(/[^，。；、？：！,.!?;:\s]+|[，。；、？：！,.!?;:]/g) ?? []
  const out: string[] = []
  for (const w of raw) {
    if (/^[，。；、？：！,.!?;:]$/.test(w) && out.length) out[out.length - 1] += w
    else out.push(w)
  }
  return out
}

// ---- 段落 scrub 淡入：原站 effect__textFade 1:1 移植 ----
// 原版：fromTo(".word, .line__inner", {opacity:0}, {opacity:1, ease:"none",
//   stagger:.05, scrollTrigger:{start:"top 80%", end:"bottom 80%", scrub:true}})
// 语义：段落顶边到视口 80% 线 → 开始；段落底边到 80% 线 → 结束；
//   词 i 的 opacity = clamp(进度×总时长 − i×0.05)，scrub 1:1 直接写值（无缓动迟滞）
const scrubEls = ref<HTMLElement[]>([])
const wordLists = new Map<HTMLElement, HTMLElement[]>()
const headEl = ref<HTMLElement>() // 眉题行：驱动 kicker 线 clip 揭示
let vh = 0

function computeScrub() {
  for (const el of scrubEls.value) {
    if (!el) continue
    const words = wordLists.get(el)
    if (!words?.length) continue
    const rect = el.getBoundingClientRect()
    // 区间由段落自身高度驱动：top 过 80% 线起，bottom 过 80% 线止
    const p = rect.height > 0 ? (vh * 0.8 - rect.top) / rect.height : 1
    const total = 1 + 0.05 * (words.length - 1)
    words.forEach((w, i) => {
      w.style.opacity = String(Math.min(1, Math.max(0, p * total - i * 0.05)))
    })
  }
  // 眉题线 clip 揭示（原站 separatorIn：top 90% → 70%）
  const head = headEl.value
  if (head) {
    const hp = Math.min(1, Math.max(0, (vh * 0.9 - head.getBoundingClientRect().top) / (vh * 0.2)))
    head.style.setProperty('--klp', hp.toFixed(4))
  }
}

function onScrollScrub() {
  computeScrub()
}

function onResizeScrub() {
  vh = window.innerHeight
  computeScrub()
}

onMounted(() => {
  // 触屏 / 减少动效：词保持直接可见（SSR 默认态）
  if (isTouchDevice() || prefersReducedMotion()) return
  vh = window.innerHeight
  for (const el of scrubEls.value) {
    if (el) wordLists.set(el, Array.from(el.querySelectorAll('.word')))
  }
  window.addEventListener('scroll', onScrollScrub, { passive: true })
  window.addEventListener('resize', onResizeScrub)
  computeScrub()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollScrub)
  window.removeEventListener('resize', onResizeScrub)
})
</script>

<template>
  <section :id="chapter.id" class="chapter" :class="`chapter--${chapter.variant ?? 'default'}`">
    <!-- 动画背景：4 条交错荧光淡色波浪线，彗尾笔迹（feature 变体） -->
    <div v-if="chapter.variant === 'feature'" class="chapter__waves" aria-hidden="true">
      <svg v-for="i in 4" :key="i" class="chapter__wave-line" :class="`chapter__wave-line--${i}`" viewBox="0 0 100 500" preserveAspectRatio="none">
        <defs>
          <!-- 沿路径渐变：尾部（底部）透明 → 前端（顶部）实心，尾部慢慢隐去 -->
          <linearGradient :id="`waveGrad${i}`" gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="20">
            <stop offset="0" stop-color="#d8ff3e" stop-opacity="0" />
            <stop offset="0.35" stop-color="#d8ff3e" stop-opacity="0.12" />
            <stop offset="1" stop-color="#d8ff3e" stop-opacity="0.45" />
          </linearGradient>
        </defs>
        <!-- 2 号线：更扭曲（更多 S 弯） -->
        <path v-if="i === 2" pathLength="1" d="M50,500 C20,460 80,420 50,380 C20,340 80,300 50,260 C20,220 80,180 50,140 C20,100 80,60 50,20" :stroke="`url(#waveGrad${i})`" stroke-width="10" fill="none" />
        <path v-else pathLength="1" d="M50,500 C20,420 80,340 50,260 C20,180 80,100 50,20" :stroke="`url(#waveGrad${i})`" stroke-width="10" fill="none" />
      </svg>
    </div>

    <div class="u-container">
      <!-- 章节眉题行 -->
      <header v-reveal ref="headEl" class="chapter__head">
        <span class="chapter__no u-monolabel">{{ chapter.no }}</span>
        <span class="chapter__kicker u-monolabel">{{ chapter.kicker }}</span>
      </header>

      <!-- 大标题：常规章节逐行拆字；intro 用 xccx 字幕；feature/无标题不渲染 -->
      <h2 v-if="chapter.title.length && chapter.variant !== 'intro' && chapter.variant !== 'feature'" class="chapter__title">
        <RevealText
          v-for="line in chapter.title"
          :key="line"
          class="chapter__title-line"
        >
          {{ line }}
        </RevealText>
      </h2>
      <!-- Nº001：原站 大字 marquee（scrub 版，自页尾剪移而来——用户拍板替换原 xccx 字幕） -->
      <MarqueeText v-else-if="chapter.variant === 'intro'" intro="scrub" :text="['XCCX']" />

      <!-- 联系方式胶囊：标题正下方 -->
      <ContactChips v-if="chapter.contacts" :contacts="chapter.contacts" />

      <!-- 正文：滚动 scrub 逐词淡入（原站 effect__textFade 1:1；「」重点词高亮） -->
      <p v-for="para in chapter.paragraphs" :key="para" ref="scrubEls" class="chapter__para">
        <template v-for="(part, j) in splitHighlight(para)" :key="j">
          <span v-if="part.hl" class="word chapter__hl">{{ part.text }}</span>
          <template v-else>
            <span v-for="(w, k) in splitWords(part.text)" :key="k" class="word">{{ w }}</span>
          </template>
        </template>
      </p>

      <!-- 数字条目 -->
      <dl v-if="chapter.stats" v-reveal class="chapter__stats">
        <div v-for="stat in chapter.stats" :key="stat.label" class="chapter__stat">
          <dt class="chapter__stat-value">{{ stat.value }}</dt>
          <dd class="chapter__stat-label u-monolabel">{{ stat.label }}</dd>
        </div>
      </dl>

      <!-- 章节中央斜体大字背景 -->
      <p v-if="chapter.footer" class="chapter__footer" aria-hidden="true">{{ chapter.footer }}</p>

      <!-- 联系方式胶囊已移至章节下方（ContactChips，ChapterLoop 渲染） -->
    </div>

    <!-- 出站章节底部：原站 条带刷色过渡（2→3 用，颜色 = 下一章节底色） -->
    <ChapterOverlay v-if="overlayColor" :color="overlayColor" />
  </section>
</template>

<style scoped>
.chapter {
  position: relative;
  padding-block: var(--space-8);
  /* 边界横线已取消：章节间透明无缝衔接（用户拍板） */
}

/* ---- 动画背景：交错荧光波浪线 ---- */
.chapter__waves {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 内容层在动画线上方 */
.chapter > .u-container {
  position: relative;
  z-index: 1;
}

.chapter__wave-line {
  position: absolute;
  bottom: 0;
  width: 110px;
  height: 85vh;
  /* 线静止：不再整体移动 */
}

/* 4 条线横向分布——全部在文案区（40vw 起）左侧；高度 ×1.5 */
.chapter__wave-line--1 { left: 6vw;  height: 128vh; }
.chapter__wave-line--2 { left: 13vw; height: 300vh; }
.chapter__wave-line--3 { left: 20vw; height: 165vh; }
.chapter__wave-line--4 { left: 27vw; height: 137vh; }

/* 彗尾笔迹：可见窗口（22% 路径长）沿波浪前进——前头画出、后头消散 */
.chapter__wave-line path {
  stroke-dasharray: 0.22 0.78;
  animation: wave-trace 4s linear infinite;
}

/* 4 条交错：延迟加大错开；2 号线生成间隔更慢（12s） */
.chapter__wave-line--1 path { animation-delay: 0s; }
.chapter__wave-line--2 path { animation-delay: 5s; animation-duration: 12s; }
.chapter__wave-line--3 path { animation-delay: 1.5s; }
.chapter__wave-line--4 path { animation-delay: 3.5s; }

@keyframes wave-trace {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; } /* 窗口循环，首尾相接无缝 */
}

/* feature 变体（capabilities）：深色背景，文字浅色（与 Nº001 区分） */
.chapter--feature {
  background: var(--c-bg);
  /* 底部延伸：给 2→3 条带刷色过渡腾出刷色空间（用户拍板：60svh 太下，减半） */
  padding-bottom: 30svh;
}

.chapter--feature .chapter__title {
  color: var(--c-ink);
}

.chapter--feature .chapter__kicker {
  color: var(--c-ink);
}

.chapter--feature .chapter__no {
  color: var(--c-accent);
}

.chapter--feature .chapter__stat-value {
  color: var(--c-accent);
}

.chapter--feature .chapter__stat-label {
  color: var(--c-muted);
}

/* 滑动入场：feature 内容从右滑入（替换上移淡入） */
.chapter--feature .v-reveal--hidden {
  transform: translateX(60px);
}

/* Nº003（works）：灰蓝底（与 Nº001 同色，用户选定）+ 底部喷漆渐变（灰蓝喷点 ↔ 黑） */
#works {
  background: #969da4;
}

/* 灰蓝底适配：文字深色（同 Nº001 浅底约定） */
#works .chapter__title {
  color: var(--c-bg);
}

#works .chapter__kicker {
  color: var(--c-bg);
}

#works .chapter__no {
  color: #3d6b14; /* 深绿，浅底可读（与 Nº001 编号同色） */
}

#works .chapter__para {
  color: var(--c-bg);
}

#works .chapter__hl {
  color: #3d6b14; /* 浅底高亮用深绿；荧光绿不可读 */
}

#works .chapter__footer {
  color: var(--c-bg); /* Wait Me 水印：深色半透明 */
}

/* 顶部喷漆带已取消（用户拍板：2→3 过渡圆弧直接衔接灰蓝底） */

/* 底部喷漆带：灰蓝喷溅点向上过渡到黑 */
#works::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 7rem;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle 16px at 12% 70%, #969da4 60%, transparent 61%),
    radial-gradient(circle 20px at 28% 42%, #969da4 55%, transparent 56%),
    radial-gradient(circle 11px at 44% 74%, #969da4 60%, transparent 61%),
    radial-gradient(circle 23px at 58% 40%, #969da4 55%, transparent 56%),
    radial-gradient(circle 13px at 72% 70%, #969da4 60%, transparent 61%),
    radial-gradient(circle 19px at 86% 44%, #969da4 55%, transparent 56%),
    radial-gradient(circle 10px at 95% 66%, #969da4 60%, transparent 61%),
    radial-gradient(circle 7px at 6% 38%, #969da4 60%, transparent 61%),
    radial-gradient(circle 9px at 19% 58%, #969da4 60%, transparent 61%),
    radial-gradient(circle 6px at 33% 30%, #969da4 60%, transparent 61%),
    radial-gradient(circle 12px at 47% 66%, #969da4 60%, transparent 61%),
    radial-gradient(circle 8px at 55% 34%, #969da4 60%, transparent 61%),
    radial-gradient(circle 15px at 67% 60%, #969da4 60%, transparent 61%),
    radial-gradient(circle 6px at 79% 36%, #969da4 60%, transparent 61%),
    radial-gradient(circle 10px at 91% 55%, #969da4 60%, transparent 61%),
    radial-gradient(circle 7px at 41% 22%, #969da4 60%, transparent 61%),
    radial-gradient(circle 13px at 63% 78%, #969da4 60%, transparent 61%),
    radial-gradient(circle 5px at 84% 70%, #969da4 60%, transparent 61%),
    radial-gradient(circle 9px at 15% 25%, #969da4 60%, transparent 61%),
    radial-gradient(circle 11px at 38% 52%, #969da4 60%, transparent 61%),
    radial-gradient(circle 6px at 52% 62%, #969da4 60%, transparent 61%),
    radial-gradient(circle 14px at 70% 24%, #969da4 60%, transparent 61%),
    radial-gradient(circle 8px at 88% 34%, #969da4 60%, transparent 61%),
    radial-gradient(circle 12px at 25% 78%, #969da4 60%, transparent 61%),
    radial-gradient(circle 7px at 60% 44%, #969da4 60%, transparent 61%),
    linear-gradient(to top, #0a0a0a 0%, #0a0a0a 40%, transparent 100%);
}

/* Intro 变体：灰蓝底色（条纹由全站 CRT 罩统一提供），文字深色 */
.chapter--intro {
  background: #969da4; /* 用户选定底色 */
  /* 上内边距归零：内容头与章节上边界平齐（用户拍板）；下留白保留 */
  padding-block: 0 12rem;
}

/* 眉题行：加大加粗 + 深色高对比；无上线；下 margin 归零让字幕紧贴 */
.chapter--intro .chapter__head {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0;
}

.chapter--intro .chapter__title {
  color: var(--c-bg);
}

.chapter--intro .chapter__kicker {
  color: var(--c-bg); /* 深黑 */
}

.chapter--intro .chapter__no {
  color: #3d6b14; /* 深绿，浅底可读 */
}

.chapter__head {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 眉题行在左（放大版） */
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  font-size: 1.1rem; /* 放大（覆盖 u-monolabel 的 0.75rem） */
}

.chapter__no {
  color: var(--c-accent);
}

.chapter__kicker {
  color: var(--c-muted);
}

/* 眉题行右侧延伸的分隔线：clip 揭示（原站 separatorIn：scrub top 90%→70%，从左向右展开） */
.chapter__kicker::after {
  content: '';
  display: inline-block;
  width: clamp(2rem, 10vw, 8rem);
  height: 1px;
  margin-left: var(--space-3);
  background: var(--c-line);
  vertical-align: middle;
  clip-path: inset(0 calc((1 - var(--klp, 1)) * 100%) 0 0); /* --klp 由 scrub 驱动；默认 1（SSR/触屏全显） */
}

.chapter__title {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 标题行靠右 */
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  margin-bottom: var(--space-6);
}

/* Nº004 标题左对齐 + 下边距归零（让胶囊真正紧贴） */
/* 拖尾上方留白收紧（用户拍板「拖尾上面太长」）：Nº004 底部内边距减半 */
#contact {
  padding-bottom: var(--space-4);
}

#contact .chapter__title {
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.chapter__para {
  max-width: 36rem;
  margin-left: auto; /* 段落靠右 */
  text-align: right;
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

/* 引言变体：intro 段落右栏左对齐，浅底上深色大字（原 IntroReveal 样式并入） */
.chapter--intro .chapter__para {
  max-width: 60vw;
  margin-left: auto;
  text-align: left;
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  line-height: 1.6;
  color: var(--c-bg);
}

/* 首段收紧与字幕的间距（原 IntroReveal 容器 -2rem 语义） */
.chapter--intro .chapter__para:first-child {
  margin-top: -2rem;
}

/* intro 浅底上高亮用深绿（与 Nº001 编号同色）；荧光绿在浅底不可读 */
.chapter--intro .chapter__hl {
  color: #3d6b14;
}

/* feature 变体（capabilities）：右栏左对齐 + 大一号；正文调淡衬托高亮 */
.chapter--feature .chapter__para {
  max-width: 60vw;
  margin-left: auto; /* 右栏 */
  text-align: left; /* 左对齐 */
  font-size: clamp(1.2rem, 1.8vw, 1.5rem); /* 大一号 */
  line-height: 1.6;
  color: var(--c-muted); /* 淡灰正文 */
}

/* 逐词显现（原站 textFade：每词独立 opacity，scrub 1:1 驱动） */
.chapter__para .word {
  will-change: opacity;
}

/* 重点词高亮：荧光绿（深色底上清晰） */
.chapter__hl {
  color: var(--c-accent);
}

.chapter__stats {
  display: flex;
  justify-content: flex-end; /* stats 靠右 */
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--c-line);
}

.chapter__stat-value {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: var(--ls-tight);
  line-height: 1;
  color: var(--c-accent);
}

.chapter__stat-label {
  margin-top: var(--space-1);
  color: var(--c-muted);
}

/* 章节中央斜体大字背景：半透明、衬线体、像水印 */
.chapter__footer {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 0;
  pointer-events: none;
  font-family: 'Playfair Display Variable', serif;
  font-style: italic;
  font-size: clamp(5rem, 14vw, 12rem);
  font-weight: 600;
  letter-spacing: var(--ls-tight);
  line-height: 1;
  color: var(--c-ink);
  opacity: 0.25; /* 半透明背景字 */
  margin: 0;
}
</style>
