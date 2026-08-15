<script setup lang="ts">
// ==================== 首屏 Hero：视频取景 + 大 Logo 滚动归位 ====================
// 视频层：太空背景 + 鼠标取景（usePanorama）
// Logo 层：中央大 XCCX，滚动时平滑缩小归位至 header（useHeroLogo）
import { site } from '~/data/site'
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const baseURL = useRuntimeConfig().app.baseURL

const videoWrap = ref<HTMLElement>()
const video = ref<HTMLVideoElement>()
const videoError = ref(false)
const heroLogo = ref<HTMLElement>()

const videoSrc = `${baseURL}${site.heroVideo.src}`
const videoPoster = `${baseURL}videos/hero-poster.jpg`
const logoSrc = `${baseURL}logo.svg`

function onVideoError() {
  videoError.value = true
}

usePanorama(videoWrap, video, { range: site.heroVideo.range })

// 大 logo 归位：桌面 + 动效开启时启用；移动端保持居中
const logoStatic = ref(isTouchDevice() || prefersReducedMotion())
useHeroLogo(heroLogo, { initialHeight: 220, finalHeight: 44 })
</script>

<template>
  <section class="hero">
    <!-- 视频取景层（大画布，比视口大 20%） -->
    <div ref="videoWrap" class="hero__video-wrap" aria-hidden="true">
      <video
        v-if="!videoError"
        ref="video"
        class="hero__video"
        :src="videoSrc"
        :poster="videoPoster"
        muted
        autoplay
        loop
        playsinline
        preload="auto"
        @error="onVideoError"
      />
    </div>

    <!-- 可读性遮罩 -->
    <div class="hero__shade" aria-hidden="true" />

    <!-- 大 Logo（滚动归位至 header） -->
    <div ref="heroLogo" class="hero__logo" :class="{ 'hero__logo--static': logoStatic }" aria-hidden="true">
      <img :src="logoSrc" alt="" class="hero__logo-img" />
    </div>

    <!-- 滚动提示 -->
    <div v-reveal="{ delay: 400 }" class="hero__scroll u-monolabel" aria-hidden="true">
      Scroll to enter
      <span class="hero__scroll-arrow">↓</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  /* 上移 header 高度：视频从页面最顶端开始（header 区域也显示画面） */
  margin-top: calc(-1 * var(--header-h));
  min-height: calc(100svh + var(--header-h));
  padding-top: var(--header-h);
  display: flex;
  align-items: center;
  overflow: hidden; /* 视频取景：超出部分裁剪 */
  border-bottom: 1px solid var(--c-line);
  background: var(--c-bg); /* 视频加载前/失败的底色 */
}

/* ---- 视频取景层 ---- */
.hero__video-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 尺寸与 transform 由 usePanorama 控制（居中基准 + 平移） */
.hero__video {
  position: absolute;
  left: 50%;
  top: 50%;
  will-change: transform;
  max-width: none;
}

/* ---- 可读性遮罩：底部渐深 + 全局微暗 ---- */
.hero__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(10, 10, 10, 0.55) 0%, rgba(10, 10, 10, 0.15) 40%, rgba(10, 10, 10, 0.35) 75%, rgba(10, 10, 10, 0.82) 100%);
}

/* ---- 大 Logo：fixed 居中，transform 由 useHeroLogo 驱动 ---- */
.hero__logo {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 3;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: transform;
}

.hero__logo-img {
  height: 220px;
  width: auto;
  display: block;
}

/* 移动端：居中展示不归位，尺寸收小 */
.hero__logo--static .hero__logo-img {
  height: 120px;
}

@media (max-width: 640px) {
  .hero__logo-img {
    height: 120px;
  }
}

/* ---- 滚动提示 ---- */
.hero__scroll {
  position: absolute;
  bottom: var(--space-5);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--c-muted);
  font-size: var(--fs-label);
}

.hero__scroll-arrow {
  color: var(--c-accent);
  font-size: 1rem;
}
</style>
