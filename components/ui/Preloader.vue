<script setup lang="ts">
// ==================== 首屏加载页：背景视频就绪检测 ====================
// 视频 canplay（或加载失败 / 4s 超时兜底）→ 淡出移除；真实缓冲进度驱动进度条
// SSR 首帧不渲染遮罩（hydration 失败不卡死页面），挂载后才显示
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo-cropped.svg`

const videoReady = useState('hero-video-ready', () => false)
const videoProgress = useState('hero-video-progress', () => 0)

const done = ref(false) // 放行：淡出中
const gone = ref(false) // 淡出结束：移除 DOM
const jsFlag = ref(false) // hydration 接管标记：取消 CSS 兜底动画

let timer = 0
const FADE_MS = 600
const TIMEOUT_MS = 90000 // 超时兜底：网络停滞/异常时最迟 90s 放行（正常等待完全加载）

function release() {
  if (done.value) return
  done.value = true
  document.documentElement.style.overflow = '' // 解锁滚动
  window.setTimeout(() => (gone.value = true), FADE_MS)
}

onMounted(() => {
  if (isTouchDevice() || prefersReducedMotion()) {
    gone.value = true // 触屏/减少动效：直接移除（海报兜底已存在）
    return
  }
  jsFlag.value = true
  document.documentElement.style.overflow = 'hidden' // 加载期间锁定滚动
  timer = window.setTimeout(release, TIMEOUT_MS) // 超时兜底：最迟 4s 放行
  if (videoReady.value) release() // 已就绪（HMR / 强缓存 / hydration 前已 canplay）：立即放行
  else watch(videoReady, (ok) => ok && release())
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <!-- SSR 首帧即渲染：盖住未 hydration 的页面；JS 接管或 CSS 兜底动画负责淡出 -->
  <div v-if="!gone" class="preloader" :class="{ 'preloader--done': done, 'preloader--js': jsFlag }" aria-hidden="true">
    <img :src="logoSrc" alt="" class="preloader__logo" />
    <div class="preloader__bar">
      <div
        class="preloader__bar-fill"
        :style="{ transform: `scaleX(${done ? 1 : Math.max(0.04, videoProgress)})` }"
      />
    </div>
    <p class="preloader__label u-mono">Loading</p>
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  background: var(--c-bg);
  transition:
    opacity 0.6s ease,
    visibility 0.6s ease;
  /* JS 未接管时兜底：6.2s 后自动淡出隐藏，防脚本异常卡死页面 */
  animation: preloader-fallback 0.6s ease 6.2s forwards;
}

/* hydration 接管后取消兜底动画，淡出由 JS（--done）全权控制 */
.preloader--js {
  animation: none;
}

@keyframes preloader-fallback {
  to {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

.preloader--done {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* logo 呼吸：黑底上的品牌心跳 */
.preloader__logo {
  width: min(50vw, 26rem);
  height: auto;
  animation: preloader-breathe 2.4s ease-in-out infinite;
}

@keyframes preloader-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 真实缓冲进度条：荧光细线 */
.preloader__bar {
  width: min(28vw, 16rem);
  height: 2px;
  background: rgba(244, 244, 242, 0.15);
  overflow: hidden;
}

.preloader__bar-fill {
  height: 100%;
  background: var(--c-accent);
  transform-origin: left;
  transition: transform 0.3s linear;
}

.preloader__label {
  color: var(--c-muted);
  font-size: var(--fs-label);
}
</style>
