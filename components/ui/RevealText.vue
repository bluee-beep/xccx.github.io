<script setup lang="ts">
// ==================== 逐字拆解动画文字 ====================
// Splitting.js 按字符拆包：.char 元素带 --char-index，CSS 做 stagger 过渡
// 关键：onMounted 后动态 import（SSR 首屏渲染纯文本，无水合 mismatch）
const root = ref<HTMLElement>()

onMounted(async () => {
  const el = root.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // 等字体加载完成再拆字动画，避免 font-display: swap 首帧错位
  try {
    await document.fonts.ready
  } catch {
    // 某些环境 fonts.ready 异常：继续执行，不阻塞
  }

  const Splitting = (await import('splitting')).default
  Splitting({ target: el, by: 'chars' })

  useReveal(root, { onEnter: () => el.classList.add('is-inview') })
})
</script>

<template>
  <span ref="root" class="reveal-text"><slot /></span>
</template>
