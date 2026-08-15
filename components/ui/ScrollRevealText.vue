<script setup lang="ts">
// ==================== 滚动驱动逐字显现 ====================
// 文字随滚轮逐字显现：段落进入视口后，滚动进度映射到已显现字符数
// SSR 时全量可见（无 JS 不丢内容）；客户端挂载后由滚动驱动
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = withDefaults(defineProps<{ text: string; delay?: number }>(), { delay: 0 })

const root = ref<HTMLElement>()

// 字符序列（SSR 全量可见；客户端初始全隐藏，滚动逐字显现）
const chars = computed(() => props.text.split(''))
const shownCount = ref(import.meta.server ? Infinity : 0)

// 平滑进度（rAF lerp）
let targetProgress = 0
let smoothProgress = 0
let rafId = 0
let running = false
let vh = 0

function computeTarget() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 进度 0：段落底部刚进入视口底部；进度 1：段落顶部到达视口 25% 处
  const start = vh + rect.height * 0.2
  const end = vh * 0.25
  targetProgress = Math.min(1, Math.max(0, (start - rect.bottom) / (start - end)))
}

function tick() {
  if (!running) return
  smoothProgress += (targetProgress - smoothProgress) * 0.08
  shownCount.value = Math.floor(smoothProgress * chars.value.length)
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
  // 触屏 / 减少动效：直接全量显示
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
  <span ref="root" class="scr" :style="{ '--scr-delay': `${delay * 0.15}s` }">
    <span
      v-for="(ch, i) in chars"
      :key="i"
      class="scr__char"
      :class="{ 'scr__char--hidden': i >= shownCount }"
    >{{ ch }}</span>
  </span>
</template>

<style scoped>
.scr__char {
  opacity: 1;
  transition: opacity 0.25s ease var(--scr-delay, 0s);
}

.scr__char--hidden {
  opacity: 0;
}
</style>
