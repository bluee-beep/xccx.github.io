<script setup lang="ts">
// ==================== 大字横向滚动（pxpush MarqueeText 1:1 移植，无 3D） ====================
// 超大标题重复 8 组持续横移 + 词随机顺序淡入 + 离场模糊淡出 + 分隔线揭示
// 零 GSAP：横移用 CSS animation（等价 xPercent 循环）；scrub 直写值 1:1 无 lerp
// 两种入场模式：timeline（hero 首屏，加载后时间线播放）/ scrub（页尾，滚动驱动，pxpush 1:1 区间）
import { prefersReducedMotion } from '~/composables/useDevice'

const props = withDefaults(
  defineProps<{
    text: string[] // 词序列（英文按空格拆词）
    intro: 'timeline' | 'scrub'
    mode?: 'hero' | 'standalone'
  }>(),
  { mode: 'standalone' },
)

const root = ref<HTMLElement>()
const wordEls = ref<HTMLElement[]>()
// 与 Preloader 联动：视频就绪（加载页淡出）后才播词点亮，避免被黑屏盖住
const videoReady = useState('hero-video-ready', () => false)

// 显示序列：● 符号 + 词交替（pxpush title = symbol + name 结构）
const sequence = computed(() => {
  const seq: { type: 'symbol' | 'word'; text?: string }[] = []
  props.text.forEach((t, i) => {
    if (i > 0) seq.push({ type: 'symbol' })
    t.split(' ').forEach((w) => seq.push({ type: 'word', text: w }))
  })
  return seq
})

// 词随机 rank：动画顺序随机、DOM 顺序不变（pxpush stagger from:"random" 语义）
let ranks: number[] = []

function shuffle(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// power4.out（GSAP ease:"power4"）= 1-(1-t)^5
function power4Out(t: number) {
  return 1 - Math.pow(1 - t, 5)
}

// ---- scrub 版：词随机淡入（pxpush titleRandom 去 3D：top 90% → 0%，each 0.03 random） ----
function computeWordsScrub() {
  const el = root.value
  if (!el || !wordEls.value.length) return
  const vh = window.innerHeight
  const p = Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.9)))
  const total = 0.5 + 0.03 * (wordEls.value.length - 1) // GSAP 默认单 tween 0.5s + stagger 总跨度
  wordEls.value.forEach((w, i) => {
    const q = Math.min(1, Math.max(0, (p * total - ranks[i] * 0.03) / 0.5))
    w.style.opacity = String(power4Out(q))
  })
}

// ---- scrub 版：上下线从右侧滑出（pxpush separatorIn 区间 top 90% → 70%；方向按用户要求从右向左） ----
function computeLineScrub() {
  const el = root.value
  if (!el) return
  const vh = window.innerHeight
  const p = Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.2)))
  el.style.setProperty('--line-p', p.toFixed(4))
}

// ---- 离场模糊淡出（pxpush fadeOut：top 5% → -30%，opacity 1→0 + blur 0→20px） ----
function computeFadeOut() {
  const el = root.value
  if (!el) return
  const vh = window.innerHeight
  const p = Math.min(1, Math.max(0, (vh * 0.05 - el.getBoundingClientRect().top) / (vh * 0.35)))
  el.style.opacity = String(1 - p)
  el.style.filter = p > 0.001 ? `blur(${(20 * p).toFixed(1)}px)` : ''
}

function computeScrub() {
  if (props.intro !== 'scrub') return
  computeWordsScrub()
  computeLineScrub()
  computeFadeOut()
}

// ---- timeline 版（hero 首屏）：词随机点亮 + 线 scale 展开 ----
function playTimeline() {
  const el = root.value
  if (!el) return
  // 分隔线：--marquee-line-scale 0→1 expo.out 0.8s（pxpush 首页时间线同款）
  el.style.setProperty('--marquee-line-scale', '1')
  // 词随机顺序点亮：delay = rank×30ms、power4 近似缓动（pxpush stagger each 0.03 random 语义）
  wordEls.value.forEach((w, i) => {
    w.style.opacity = '0'
    w.style.transition = `opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1) ${(ranks[i] * 0.03).toFixed(2)}s`
    requestAnimationFrame(() => {
      w.style.opacity = '1'
    })
  })
}

onMounted(() => {
  const el = root.value
  if (!el) return
  ranks = shuffle(wordEls.value.length)

  if (prefersReducedMotion()) {
    // 词全显、线全显；横移由 CSS 慢速覆盖
    el.style.setProperty('--marquee-line-scale', '1')
    el.style.setProperty('--line-p', '1')
    wordEls.value.forEach((w) => (w.style.opacity = '1'))
    return
  }

  if (props.intro === 'timeline') {
    let started = false
    let stopWatch: (() => void) | undefined
    const start = () => {
      if (started) return
      started = true
      stopWatch?.()
      playTimeline()
    }
    if (videoReady.value) start()
    else {
      stopWatch = watch(videoReady, (ok) => ok && start())
      window.setTimeout(start, 3000) // 兜底：视频极慢时 3s 后照播（词先亮，加载页由超时放行）
    }
  } else {
    computeScrub()
  }

  window.addEventListener('scroll', props.intro === 'scrub' ? computeScrub : computeFadeOut, { passive: true })
  window.addEventListener('resize', props.intro === 'scrub' ? computeScrub : computeFadeOut)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', props.intro === 'scrub' ? computeScrub : computeFadeOut)
  window.removeEventListener('resize', props.intro === 'scrub' ? computeScrub : computeFadeOut)
})
</script>

<template>
  <div ref="root" class="marqueeText" :class="`marqueeText--${mode}`" aria-hidden="true">
    <div class="marqueeText__track">
      <!-- 8 组相同标题：-100%/8 位移实现无缝循环（pxpush 同款 8 次重复） -->
      <h1 v-for="g in 8" :key="g" class="marqueeText__title">
        <span class="marqueeText__symbol">●</span>
        <template v-for="(s, i) in sequence" :key="i">
          <span v-if="s.type === 'symbol'" class="marqueeText__symbol">●</span>
          <span v-else ref="wordEls" class="marqueeText__word">{{ s.text }}</span>
        </template>
      </h1>
    </div>
  </div>
</template>

<style scoped>
.marqueeText {
  position: relative;
  height: 14vw; /* pxpush 原版 17vw；本站缩小（用户拍板） */
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
  /* 上下 2px 分隔线（pxpush ::before/::after border 同款），scaleX 由 --marquee-line-scale 驱动 */
}

.marqueeText::before,
.marqueeText::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-line);
  transform: scaleX(var(--marquee-line-scale, 1));
  transform-origin: left;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); /* expo.out 0.8s（pxpush 首页时间线同款） */
  z-index: 1;
}

.marqueeText::before {
  top: 0;
}

.marqueeText::after {
  bottom: 0;
}

/* scrub 版：线加粗（4px）+ 滚动时从右侧滑出（--line-p 0→1，origin right） */
.marqueeText--standalone::before,
.marqueeText--standalone::after {
  height: 4px;
  background: var(--c-line);
  transform: scaleX(var(--line-p, 1));
  transform-origin: right;
  transition: none; /* scrub 直写，无过渡 */
}

/* hero 版：absolute 于 hero 顶部（pxpush fixed top 3.5vw 的流内等价）；字号调小（用户拍板） */
.marqueeText--hero {
  position: absolute;
  top: 10vh;
  left: 0;
  right: 0;
  z-index: 3;
  height: 11.5vw;
}

.marqueeText--hero .marqueeText__word {
  font-size: 10vw;
}

.marqueeText--hero .marqueeText__symbol {
  font-size: 4vw;
}

.marqueeText__track {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: max-content;
  white-space: nowrap;
  will-change: transform;
  animation: marquee-scroll 30s linear infinite; /* 等价 GSAP xPercent 循环（ease none） */
}

/* 8 组无缝循环：位移 = -100%/8（每组含两侧 padding，组宽相等） */
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-12.5%);
  }
}

/* reduced-motion：慢速保活循环（覆盖 base.css 的全局停动画） */
@media (prefers-reduced-motion: reduce) {
  .marqueeText__track {
    animation-duration: 60s !important;
    animation-iteration-count: infinite !important;
  }
}

.marqueeText__title {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 2vw; /* pxpush symbol padding 0 2vw：间距含在组宽内，保证 -12.5% 精确无缝 */
  white-space: nowrap;
}

.marqueeText__word {
  font-family: 'Inter Variable', sans-serif;
  font-size: 12vw; /* 填充容器（pxpush 观感同款大字，本站缩小：用户拍板） */
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0;
  color: var(--c-ink);
  opacity: 1; /* SSR 可见；JS 接管后按模式隐藏/点亮 */
  will-change: opacity;
}

.marqueeText__symbol {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 6vw;
  line-height: 1;
  color: var(--c-ink);
  padding: 0 2vw; /* pxpush 同款：符号两侧间距 */
  flex-shrink: 0;
}
</style>
