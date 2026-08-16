<script setup lang="ts">
// ==================== 大 logo 拖尾区块（Nº004 之后，独立展示） ====================
// 三层 logo 手绘图重叠，滚动时不同速度错位（拖尾残影）
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`

const root = ref<HTMLElement>()
const trailRefs = ref<HTMLElement[]>([])

let rafId = 0
let running = false

// 5 层：按用户指定间隔反推速度；深层 blur 虚化 + 颜色渐变变暗
const layers = [
  { speed: 0.656, opacity: 1, blur: 0, dark: 1 }, // 顶层：实心清晰
  { speed: 0.404, opacity: 0.6, blur: 1, dark: 0.8 },
  { speed: 0.192, opacity: 0.35, blur: 2, dark: 0.6 },
  { speed: 0.072, opacity: 0.2, blur: 3, dark: 0.45 },
  { speed: 0, opacity: 0.1, blur: 4, dark: 0.3 }, // 底层：静止最糊最暗
]

function tick() {
  if (!running) return
  const el = root.value
  if (el) {
    const rect = el.getBoundingClientRect()
    // 进度：区块刚进视口 = 0 → 页尾（底边滚至视口底之上 footer 高）恰好 = 1
    const ftH = el.clientHeight
    const footerH = (document.querySelector('.footer') as HTMLElement | null)?.offsetHeight || 0
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (ftH + footerH)))
    // 错位幅度：页尾时最快层（视觉最底下）底边刚好贴住区块底边 = 版权区上边界
    const logoH = trailRefs.value[0]?.offsetHeight || 280
    const maxOffset = Math.max(0, ftH - logoH)
    trailRefs.value.forEach((layer, i) => {
      if (!layer) return
      const offset = progress * (layers[i].speed / layers[0].speed) * maxOffset
      layer.style.transform = `translateY(${offset.toFixed(2)}px)`
    })
  }
  rafId = requestAnimationFrame(tick)
}

function onScroll() {
  if (!running) {
    running = true
    rafId = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  if (isTouchDevice() || prefersReducedMotion()) {
    trailRefs.value.forEach((l) => l && (l.style.transform = ''))
    return
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div ref="root" class="ft" aria-hidden="true">
    <img
      v-for="(l, i) in layers"
      :key="i"
      ref="trailRefs"
      :src="logoSrc"
      alt=""
      class="ft__layer"
      :style="{ opacity: l.opacity, filter: `blur(${l.blur}px) brightness(${l.dark})`, zIndex: 5 - i }"
    />
  </div>
</template>

<style scoped>
.ft {
  position: relative;
  height: clamp(32rem, 60vw, 52rem); /* 展示区 2 倍：容纳放大 logo + 拖尾空间 */
  display: grid;
  place-items: start center; /* logo 贴区块顶部 */
  overflow: hidden;
  margin-top: -6rem; /* 上移吃掉 Nº004 底部留白，紧贴其下 */
  pointer-events: none;
}

.ft__layer {
  position: absolute;
  width: min(88vw, 104rem); /* logo 放大一倍（原 52rem） */
  height: auto;
  display: block;
  will-change: transform;
}
</style>
