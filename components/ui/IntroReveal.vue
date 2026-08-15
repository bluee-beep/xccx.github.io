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
  const end = vh * 0.85 // 提前完成：容器顶部到达视口 85% 即全部显示
  targetProgress = Math.min(1, Math.max(0, (start - rect.bottom) / (start - end)))
}

function tick() {
  if (!running) return
  // 0.66：字随滚动快速显现，略带柔和滞后
  smoothProgress += (targetProgress - smoothProgress) * 0.66
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
/* 老电视机段落区：灰白底 + CRT 扫描线条纹 */
.intro-reveal {
  margin-top: -2rem; /* 上移（视觉重心提升） */
  max-width: 60vw; /* 右栏宽度 */
  margin-left: auto; /* 右栏 */
  padding: var(--space-4) var(--space-5);
  border-radius: 4px;
  /* 扫描线条纹 + 灰白底色 */
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.07) 2px 4px),
    #e9e8e4;
}

/* Intro 段落：栏内文字左对齐，深色文字（适配浅底） */
.intro-reveal__para {
  text-align: left;
  color: var(--c-bg); /* 深色字 */
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.intro-reveal__para:last-child {
  margin-bottom: 0;
}

.intro-reveal__char {
  opacity: 1;
  transition: opacity 0.18s ease;
}

.intro-reveal__char--hidden {
  opacity: 0;
}
</style>
