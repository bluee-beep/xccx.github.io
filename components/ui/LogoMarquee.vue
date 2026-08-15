<script setup lang="ts">
// ==================== XCCX Logo 滚动字幕（实心大圆分隔） ====================
// 复用首页滚动字幕的视觉语言：Inter 粗体大字 + 2em 实心大圆 + 无缝循环
// 深色文字（适配灰白底章节）
</script>

<template>
  <div class="lm" aria-hidden="true">
    <div class="lm__track">
      <span v-for="n in 2" :key="n" class="lm__group">
        <span class="lm__text">XCCX</span>
        <span class="lm__dot" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.lm {
  overflow: hidden;
  pointer-events: none;
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

.lm__text {
  font-family: 'Inter Variable', sans-serif;
  font-size: clamp(3.4rem, 7vw, 5.8rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--c-bg); /* 深色，适配灰底 */
}

/* 实心大圆（2em = 两倍字高） */
.lm__dot {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: var(--c-bg);
  flex-shrink: 0;
}

@keyframes lm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
