<script setup lang="ts">
// ==================== 章节条带刷色过渡（pxpush effect__overlayIn 1:1 移植） ====================
// 锚定出站章节底部（bottom:0 absolute，覆盖其末尾 100svh）：滚动 scrub 驱动条带波自底部升起
// （底行先、40ms 间隔、power4 缓动）刷成入站章节色，与入站章节背景在边界无缝衔接
// 零 GSAP：手动还原 GSAP 时间模型；scroll/resize 直接写值（1:1 scrub，无 rAF 无 lerp）
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = defineProps<{ color: string }>()

const overlayEl = ref<HTMLElement>()
let strips: HTMLElement[] = []
let rows = 0
let vh = 0

function compute() {
  const el = overlayEl.value
  if (!el || !strips.length) return
  // 原版 scrollTrigger：start "top 0%" → end "top -80%"
  const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (0.8 * vh)))
  const total = 0.5 + 0.04 * (rows - 1) // GSAP 默认单 tween 0.5s + stagger 总跨度
  strips.forEach((s, r) => {
    // 原版 stagger from:"end"：底行先长（r=0 为顶行）
    const start = (rows - 1 - r) * 0.04
    const q = Math.min(1, Math.max(0, (p * total - start) / 0.5))
    const scaleY = (1 - Math.pow(1 - q, 5)) * 1.01 // power4.out + 1% 防缝隙（原版同值）
    s.style.transform = `scaleY(${scaleY.toFixed(4)})`
  })
}

onMounted(() => {
  if (prefersReducedMotion()) return // 条带保持 CSS scaleY(0)：hero 全程可见，无波但配色衔接正常
  const el = overlayEl.value
  if (!el) return
  // 原版：移动端 15 行 / 桌面 10 行；JS 生成空 div（规避 SSR 与触屏行数不一致的 hydration 问题）
  rows = isTouchDevice() ? 15 : 10
  for (let i = 0; i < rows; i++) {
    const s = document.createElement('div')
    el.appendChild(s)
    strips.push(s)
  }
  vh = window.innerHeight
  window.addEventListener('scroll', compute, { passive: true })
  window.addEventListener('resize', onResize)
  compute() // 带锚点/中途刷新时立即同步状态
})

function onResize() {
  vh = window.innerHeight
  compute()
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', compute)
  window.removeEventListener('resize', onResize)
  strips = []
})
</script>

<template>
  <!-- 挂在出站章节内：bottom:0 覆盖其末尾 100svh（原版同款几何） -->
  <div ref="overlayEl" class="co" :style="{ '--color-bg-overlay': props.color }" aria-hidden="true" />
</template>

<style scoped>
.co {
  position: absolute;
  bottom: 0; /* pxpush：锚定出站章节底部 */
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100svh; /* 与 .hero 的 svh 度量一致：移动端地址栏伸缩不产生底行预生长伪影 */
  display: grid;
  grid-template-columns: 1fr; /* 原版 --columns: 1 */
  pointer-events: none;
  z-index: 10; /* 原版级联终值：盖过 hero 内部层(3/4)，低于 header(100) */
}

/* JS 生成的条带无 scoped data 属性，必须 :deep 穿透 */
.co :deep(div) {
  background: var(--color-bg-overlay);
  transform: scaleY(0); /* 初始压成线（reduced-motion 亦保持） */
  transform-origin: 50% 100%; /* 原版：条带从底部向上生长 */
  will-change: opacity, transform;
}
</style>
