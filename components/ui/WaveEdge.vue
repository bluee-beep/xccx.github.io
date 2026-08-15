<script setup lang="ts">
// ==================== 波浪边缘过渡 ====================
// 章节交界处：波浪形裁剪边缘（SVG 波浪背景 + 横向无缝流动动画）
// 用法：放在章节之间，color = 下一章节的背景色
import { computed } from 'vue'

const props = defineProps<{ color: string }>()

// 内联 SVG 波浪（360px 一个周期，path 填充色）
const bg = computed(() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" preserveAspectRatio="none"><path d="M0,40 C60,75 120,5 180,40 C240,75 300,5 360,40 L360,80 L0,80 Z" fill="${props.color}"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})
</script>

<template>
  <div class="wave" :style="{ backgroundImage: bg }" aria-hidden="true" />
</template>

<style scoped>
.wave {
  position: relative;
  z-index: 2; /* 盖住上一章节底部 */
  height: 80px;
  margin-top: -80px; /* 向上覆盖上一章节底部 80px */
  background-repeat: repeat-x;
  background-size: 360px 80px;
  background-position: 0 0;
  animation: wave-slide 12s linear infinite; /* 波浪流动 */
  pointer-events: none;
}

@keyframes wave-slide {
  to { background-position: -360px 0; } /* 一个周期，无缝循环 */
}

@media (prefers-reduced-motion: reduce) {
  .wave {
    animation: none;
  }
}
</style>
