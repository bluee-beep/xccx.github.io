<script setup lang="ts">
// ==================== XCCX Logo 滚动字幕（实心大圆分隔） ====================
// 滚动内容：用户手绘 X 字标图片（logo.svg）+ 白色实心大圆 + 无缝循环
const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`
</script>

<template>
  <div class="lm" aria-hidden="true">
    <div class="lm__track">
      <span v-for="n in 2" :key="n" class="lm__group">
        <img :src="logoSrc" alt="" class="lm__logo" />
        <span class="lm__dot" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.lm {
  --lm-logo-h: clamp(4rem, 8vw, 7rem); /* logo 高度基准（放大） */
  overflow: hidden;
  pointer-events: none;
  font-size: 0; /* 消除模板空白节点：保证循环无缝无跳变 */
}

.lm__track {
  display: flex;
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
  to { transform: translateX(-50%); }
}
</style>
