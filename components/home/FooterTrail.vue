<script setup lang="ts">
// ==================== 大 logo 拖尾区块（Nº004 之后，独立展示） ====================
// 三层 logo 手绘图重叠，滚动时不同速度错位（拖尾残影）
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const baseURL = useRuntimeConfig().app.baseURL
// 裁切版：viewBox 贴合图形真实边界（浏览器 getBBox 权威验证）——拖尾「贴底」= 白字贴底，无透明留白干扰
const logoSrc = `${baseURL}logo-cropped.svg`

const root = ref<HTMLElement>()
const trailRefs = ref<HTMLElement[]>([])

let rafId = 0
let running = false

// 5 层：s = 速度系数（等差 0.1，层间更密）；滚动中重影铺开 → 面积越多，颜色越淡
const layers = [
  { s: 1, opacity: 1, blur: 0, dark: 1 }, // 主层：实心清晰
  { s: 0.9, opacity: 0.6, blur: 1, dark: 0.8 },
  { s: 0.8, opacity: 0.35, blur: 2, dark: 0.6 },
  { s: 0.7, opacity: 0.2, blur: 3, dark: 0.45 },
  { s: 0.6, opacity: 0.1, blur: 4, dark: 0.3 }, // 底层：最糊最暗
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
    // 贴底行程：页尾时主层底边贴住区块底边 = 版权区上边界（裁切后元素盒即图形，无需再扣初始下移）
    const logoH = trailRefs.value[0]?.offsetHeight || 200
    const maxOffset = Math.max(0, ftH - logoH)
    trailRefs.value.forEach((layer, i) => {
      if (!layer) return
      const l = layers[i]
      // 残影按速度差逐渐散开：越往下重影铺开面积越多；页尾主层贴底
      const offset = progress * l.s * maxOffset
      // 重影随滚动渐淡：越往下颜色越淡（主层保持实心）
      const fade = i === 0 ? 1 : 1 - progress * 0.5
      layer.style.transform = `translateY(${offset.toFixed(2)}px)`
      layer.style.opacity = String(l.opacity * fade)
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
  top: 0; /* 贴区块顶：缩短与 Nº004 的间隔（裁切后无需下移补偿） */
  width: min(88vw, 104rem); /* logo 放大一倍（原 52rem） */
  height: auto;
  display: block;
  will-change: transform;
}
</style>
