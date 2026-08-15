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

// 3 层：不同视差速度（越深越慢）+ 透明度
const layers = [
  { speed: 0.6, opacity: 1 }, // 顶层：最快、实心
  { speed: 0.35, opacity: 0.6 }, // 中层
  { speed: 0.1, opacity: 0.35 }, // 底层：最慢
]

function tick() {
  if (!running) return
  const el = root.value
  if (el) {
    const rect = el.getBoundingClientRect()
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.5)))
    // 错位基准：按 logo 实际高度 × 3（层间跨度 1.5 logo 高，错位收敛）
    const logoH = trailRefs.value[0]?.offsetHeight || 280
    trailRefs.value.forEach((layer, i) => {
      if (!layer) return
      const offset = progress * layers[i].speed * logoH * 3
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
      :style="{ opacity: l.opacity, zIndex: 3 - i }"
    />
  </div>
</template>

<style scoped>
.ft {
  position: relative;
  height: clamp(16rem, 30vw, 26rem); /* 大展示区 */
  display: grid;
  place-items: start center; /* logo 贴区块顶部 */
  overflow: hidden;
  margin-top: -6rem; /* 上移吃掉 Nº004 底部留白，紧贴其下 */
  border-top: 1px solid var(--c-line);
  pointer-events: none;
}

.ft__layer {
  position: absolute;
  width: min(88vw, 52rem); /* logo 大尺寸 */
  height: auto;
  display: block;
  will-change: transform;
}
</style>
