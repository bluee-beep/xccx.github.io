<script setup lang="ts">
// ==================== XCCX Logo 滚动字幕（实心大圆分隔） ====================
// 滚动内容：手绘 X 字标图片（logo.svg）+ 白色实心大圆
// 无缝方案：JS 测量容器/组宽度 → 动态重复内容至覆盖视口 → 固定像素平移循环
const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`

const root = ref<HTMLElement>()
const track = ref<HTMLElement>()
const groupEl = ref<HTMLElement>()
const repeatCount = ref(4) // 初始值，挂载后按容器宽动态计算

onMounted(() => {
  const rootEl = root.value
  const trackEl = track.value
  const gEl = groupEl.value
  if (!rootEl || !trackEl || !gEl) return

  // 测量组宽与容器宽
  const groupW = gEl.getBoundingClientRect().width
  const containerW = rootEl.clientWidth
  if (!groupW) return

  // 重复次数：覆盖容器 + 2 份缓冲（保证任意时刻无空白）
  repeatCount.value = Math.ceil(containerW / groupW) + 2

  // 固定像素平移（一个组宽），绝对无缝
  trackEl.style.setProperty('--lm-dist', `-${groupW.toFixed(2)}px`)
})

onBeforeUnmount(() => {
  // 清理由 Vue 自动处理
})
</script>

<template>
  <div ref="root" class="lm" aria-hidden="true">
    <div ref="track" class="lm__track">
      <span v-for="n in repeatCount" :key="n" ref="groupEl" class="lm__group">
        <img :src="logoSrc" alt="" class="lm__logo" />
        <span class="lm__dot" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.lm {
  --lm-logo-h: clamp(4rem, 8vw, 7rem); /* logo 高度基准 */
  overflow: hidden;
  pointer-events: none;
}

.lm__track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  /* 平移距离由 JS 注入（--lm-dist = 一个组宽），固定像素无缝循环 */
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

.lm__logo {
  height: var(--lm-logo-h);
  width: auto;
  display: block;
}

/* 实心大圆：白色，尺寸随 logo 高度（0.6 倍） */
.lm__dot {
  width: calc(var(--lm-logo-h) * 0.6);
  height: calc(var(--lm-logo-h) * 0.6);
  border-radius: 50%;
  background: var(--c-ink);
  flex-shrink: 0;
}

@keyframes lm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(var(--lm-dist, -440px)); }
}
</style>
