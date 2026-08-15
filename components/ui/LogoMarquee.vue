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
  gap: 17px;
  padding-right: 17px;
}

/* 超大粗体无衬线、紧字距、近黑（瑞士风格） */
.lm__text {
  font-family: 'Inter Variable', sans-serif;
  font-size: var(--lm-font);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--c-bg);
}

/* 白色实心大圆（0.6 倍字高） */
.lm__dot {
  width: calc(var(--lm-font) * 0.6);
  height: calc(var(--lm-font) * 0.6);
  border-radius: 50%;
  background: var(--c-ink);
  flex-shrink: 0;
}

@keyframes lm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(var(--lm-dist, -500px)); }
}
</style>
