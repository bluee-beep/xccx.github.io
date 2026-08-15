<script setup lang="ts">
// ==================== Intro 章节：随滚轮逐字连续显现 ====================
// 整章所有段落字符合并为一个连续序列，滚动进度 → 全局字符编号，
// 前 N 个字符按顺序显现（阅读进度感），无段间错峰
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = defineProps<{ paragraphs: string[] }>()

const root = ref<HTMLElement>()

// 每段起始字符偏移：[0, len0, len0+len1, ...]
const offsets = computed(() => {
  const arr = [0]
  for (const p of props.paragraphs) arr.push(arr[arr.length - 1] + p.length)
  return arr
})
const total = computed(() => offsets.value[offsets.value.length - 1])

// SSR 全量可见（无 JS 不丢内容）；客户端初始 0，滚动逐字显现
const shownCount = ref(import.meta.server ? Infinity : 0)

// 全局字符编号：第 pi 段第 ci 个字符
const globalIndex = (pi: number, ci: number) => offsets.value[pi] + ci

// 滚动进度 → lerp 平滑
let targetProgress = 0
let smoothProgress = 0
let rafId = 0
let running = false
let vh = 0

function computeTarget() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const start = vh + rect.height * 0.2 // 容器底部刚进入视口
  const end = vh * 0.3 // 容器顶部到达视口 30%
  targetProgress = Math.min(1, Math.max(0, (start - rect.bottom) / (start - end)))
}

function tick() {
  if (!running) return
  // 0.3：快速滚动时也能跟上（约 3 帧追到 90%），字与滚动基本同步
  smoothProgress += (targetProgress - smoothProgress) * 0.3
  shownCount.value = Math.floor(smoothProgress * total.value)
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (running) return
  running = true
  rafId = requestAnimationFrame(tick)
}

function stop() {
  running = false
  cancelAnimationFrame(rafId)
}

function onScroll() {
  computeTarget()
  if (!running) start()
}

onMounted(() => {
  if (isTouchDevice() || prefersReducedMotion()) {
    shownCount.value = Infinity
    return
  }
  vh = window.innerHeight
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => {
    vh = window.innerHeight
    computeTarget()
  })
  computeTarget()
  start()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div ref="root" class="intro-reveal">
    <p v-for="(para, pi) in paragraphs" :key="pi" class="intro-reveal__para">
      <span
        v-for="(ch, ci) in para.split('')"
        :key="ci"
        class="intro-reveal__char"
        :class="{ 'intro-reveal__char--hidden': globalIndex(pi, ci) >= shownCount }"
      >{{ ch }}</span>
    </p>
  </div>
</template>

<style scoped>
/* 与 chapter__para 一致：靠右 + 右对齐 + intro 加大字号 */
.intro-reveal__para {
  max-width: 36rem;
  margin-left: auto;
  text-align: right;
  color: var(--c-ink);
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.intro-reveal__char {
  opacity: 1;
  transition: opacity 0.18s ease;
}

.intro-reveal__char--hidden {
  opacity: 0;
}
</style>
