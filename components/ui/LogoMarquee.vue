<script setup lang="ts">
// ==================== xccx 超大文字滚动字幕（瑞士国际主义风格） ====================
// 超大粗体无衬线 + 紧字距 + 超出画布边缘被裁切（滚动天然裁切）
// 无缝方案：JS 测量 → 动态重复覆盖视口 → 固定像素平移循环

const root = ref<HTMLElement>()
const track = ref<HTMLElement>()
// v-for 内的 ref 收集为数组
const groupEls = ref<HTMLElement[]>([])
const repeatCount = ref(4)

onMounted(() => {
  const rootEl = root.value
  const trackEl = track.value
  const gEl = groupEls.value[0]
  if (!rootEl || !trackEl || !gEl) return

  const groupW = gEl.getBoundingClientRect().width
  const containerW = rootEl.clientWidth
  if (!groupW) return

  // 覆盖容器 + 2 份缓冲
  repeatCount.value = Math.ceil(containerW / groupW) + 2
  // 固定像素平移（一个组宽），绝对无缝
  trackEl.style.setProperty('--lm-dist', `-${groupW.toFixed(2)}px`)
})
</script>

<template>
  <div ref="root" class="lm" aria-hidden="true">
    <div ref="track" class="lm__track">
      <span v-for="n in repeatCount" :key="n" ref="groupEls" class="lm__group">
        <span class="lm__text">xccx</span>
        <span class="lm__dot" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.lm {
  --lm-font: clamp(6rem, 12vw, 10rem); /* 超大字号基准 */
  overflow: hidden;
  pointer-events: none;
}

.lm__track {
  display: flex;
  align-items: center;
  width: max-content;
  white-space: nowrap;
  animation: lm-scroll 20s linear infinite;
}

/* 品牌字幕为内容性动画，reduced-motion 时慢速而非停止 */
@media (prefers-reduced-motion: reduce) {
  .lm__track {
    animation-duration: 40s !important;
    animation-iteration-count: infinite !important;
  }
}

.lm__group {
  display: flex;
  align-items: center;
  gap: 8px; /* 4A：圆距 8px */
  padding-right: 8px;
}

/* 超大无衬线、紧字距、统一白色 25% 透明（与圆一致）——2A 字重 600 / 3A 字距 -0.04em */
.lm__text {
  font-family: 'Inter Variable', sans-serif;
  font-size: var(--lm-font);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--c-ink);
  opacity: 0.25; /* 与圆透明度一致 */
}

/* 白色实心大圆（0.4 倍字高）：25% 透明 + 垂直偏移 +0.5em */
.lm__dot {
  width: calc(var(--lm-font) * 0.4);
  height: calc(var(--lm-font) * 0.4);
  border-radius: 50%;
  background: var(--c-ink);
  opacity: 0.25; /* 透明度减半 */
  transform: translateY(0.5em);
  flex-shrink: 0;
}

@keyframes lm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(var(--lm-dist, -500px)); }
}
</style>
