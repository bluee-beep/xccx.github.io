<script setup lang="ts">
// ==================== 首屏 Hero：视频视差取景 ====================
// 大画布无缝循环视频 + 鼠标驱动取景平移（usePanorama）
// 文字层为占位形式（P3 定稿）；视频加载失败回退纯色静态视觉
import { site } from '~/data/site'

const baseURL = useRuntimeConfig().app.baseURL

const videoWrap = ref<HTMLElement>()
const video = ref<HTMLVideoElement>()
const videoError = ref(false)

const videoSrc = `${baseURL}${site.heroVideo.src}`

function onVideoError() {
  videoError.value = true
}

usePanorama(videoWrap, video, { range: site.heroVideo.range })
</script>

<template>
  <section class="hero">
    <!-- 视频取景层（大画布，比视口大 30%） -->
    <div ref="videoWrap" class="hero__video-wrap" aria-hidden="true">
      <video
        v-if="!videoError"
        ref="video"
        class="hero__video"
        :src="videoSrc"
        muted
        autoplay
        loop
        playsinline
        preload="auto"
        @error="onVideoError"
      />
    </div>

    <!-- 可读性遮罩（视频上叠文字用） -->
    <div class="hero__shade" aria-hidden="true" />

    <!-- 文字层（P3 呈现形式待定，当前占位） -->
    <div class="u-container hero__inner">
      <p v-reveal class="hero__eyebrow u-monolabel">{{ site.tagline }}</p>
      <h1 class="hero__name">
        <RevealText>{{ site.name }}</RevealText>
      </h1>
      <p v-reveal="{ delay: 200 }" class="hero__sub">
        欢迎来到我的站点 — 这里记录思考、作品与成长。
      </p>
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
  min-height: 100svh;
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

/* ---- 文字层（P3 定稿占位） ---- */
.hero__inner {
  position: relative;
  z-index: 2;
  padding-block: var(--space-8);
}

.hero__eyebrow {
  color: var(--c-accent);
  margin-bottom: var(--space-4);
}

.hero__name {
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  line-height: var(--lh-display);
}

.hero__sub {
  margin-top: var(--space-5);
  max-width: 30rem;
  color: var(--c-muted);
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
