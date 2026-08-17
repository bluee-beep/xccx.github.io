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

// 视频加载状态上报（Preloader 消费）：canplay 就绪 / 缓冲进度 / 失败放行
const heroVideoReady = useState('hero-video-ready', () => false)
const heroVideoProgress = useState('hero-video-progress', () => 0)

function onVideoError() {
  videoError.value = true
  heroVideoReady.value = true // 加载失败直接放行（海报/纯色兜底已存在）
}

function onVideoProgress() {
  const v = video.value
  if (!v || !v.duration) return
  const buf = v.buffered
  const ratio = buf.length ? buf.end(buf.length - 1) / v.duration : 0
  heroVideoProgress.value = ratio
  if (ratio >= 0.99) heroVideoReady.value = true // 完全加载（缓冲 100%）才放行：进度条走到满才消失
}

usePanorama(videoWrap, video, { range: site.heroVideo.range })
// 手持拍摄摇晃：作用于视频取景层（外层包装），与鼠标取景（内层 video）分层互不干扰
useHandheld(videoWrap)

// 大 logo 归位：桌面 + 动效开启时启用；移动端保持居中
const logoStatic = ref(isTouchDevice() || prefersReducedMotion())
useHeroLogo(heroLogo, { initialHeight: 220, finalHeight: 44 })

// 滚动模糊过渡：复用归位进度（lerp 已平滑），视频随滚动渐模糊
const heroProgress = useState('hero-logo-progress', () => 0)
watch(heroProgress, (p) => {
  const v = video.value
  if (v) v.style.filter = `blur(${(p * 10).toFixed(1)}px)`
})

// hydration 前视频事件未绑定（慢网络下可能已加载完成）：同步真实状态给 Preloader
onMounted(() => {
  const v = video.value
  if (!v) return
  if (v.readyState === 4) heroVideoReady.value = true // 缓存/极快网络：已完全就绪
  onVideoProgress()
})
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
        @progress="onVideoProgress"
      />
    </div>

    <!-- 可读性遮罩 -->
    <div class="hero__shade" aria-hidden="true" />

    <!-- 视口 20% 处：滚动字幕（无缝循环） -->
    <div class="hero__marquee" aria-hidden="true">
      <div class="hero__marquee-track">
        <!-- 两组相同内容：-50% 平移实现无缝循环 -->
        <span v-for="n in 2" :key="n" class="hero__marquee-group">
          <span class="hero__marquee-text">Xccx Design</span>
          <span class="hero__marquee-dot" />
          <span class="hero__marquee-text">WavePeak Elite Member</span>
          <span class="hero__marquee-dot" />
        </span>
      </div>
    </div>

    <!-- 大 Logo（滚动归位至 header） -->
    <div ref="heroLogo" class="hero__logo" :class="{ 'hero__logo--static': logoStatic }" aria-hidden="true">
      <img :src="logoSrc" alt="" class="hero__logo-img" />
    </div>

    <!-- 滚动提示 -->
    <div v-reveal="{ delay: 400 }" class="hero__scroll u-monolabel" aria-hidden="true">
      Scroll to enter
      <span class="hero__scroll-arrow">↓</span>
    </div>

    <!-- pxpush 刷色过渡：锚定 hero 底部，Nº001 灰蓝条带波自底部升起（1:1 移植） -->
    <ChapterOverlay color="#969da4" />
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
  /* hydration 前兜底：JS 未接管时不露默认 300×150 小画面（16:9 cover 全屏居中） */
  width: 120vw;
  height: 67.5vw;
  transform: translate(-50%, -50%);
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

/* ---- 滚动字幕：视口 20% 处，无缝循环 ---- */
.hero__marquee {
  position: absolute;
  top: 10vh;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 3;
  pointer-events: none;
  border-block: 2px solid var(--c-line);
  padding-block: 0.1rem; /* 文字贴近上下线 */
}

.hero__marquee-track {
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: hero-marquee 20s linear infinite;
}

/* 品牌滚动字幕为内容性动画，reduced-motion 时慢速而非停止（保持循环） */
@media (prefers-reduced-motion: reduce) {
  .hero__marquee-track {
    animation-duration: 40s !important;
    animation-iteration-count: infinite !important;
  }
}

.hero__marquee-group {
  display: flex;
  align-items: center;
  gap: 1.0625rem; /* 17px：词与圆间距 */
  padding-right: 1.0625rem;
}

.hero__marquee-text {
  font-family: 'Inter Variable', sans-serif;
  font-size: clamp(3.4rem, 7vw, 5.8rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0; /* 字距几乎贴住 */
  text-transform: capitalize;
  color: var(--c-ink);
}

/* 圆形分隔符：白色超大圆（2em = 两倍字高） */
.hero__marquee-dot {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: var(--c-ink);
  flex-shrink: 0;
}

@keyframes hero-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
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

/* ---- 滚动提示：上移避开底部强遮罩 + 提亮 ---- */
.hero__scroll {
  position: absolute;
  bottom: var(--space-7);
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: rgba(244, 244, 242, 0.75);
  font-size: var(--fs-label);
}

.hero__scroll-arrow {
  color: var(--c-accent);
  font-size: 1rem;
}
</style>
