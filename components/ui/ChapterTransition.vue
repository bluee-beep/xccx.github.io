<script setup lang="ts">
// ==================== 章节衔接过渡：圆弧覆盖 + 上一章模糊 ====================
// C+D 组合（用户选定）：下一章圆弧顶部随滚动从底部滑上覆盖（太阳升起）
// 同时上一章（prevId）随进度模糊淡出
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = defineProps<{
  /** 下一章颜色（覆盖块颜色） */
  color: string
  /** 上一章颜色（过渡画面底色，与 Nº001 同色） */
  fromColor?: string
  /** 上一章元素 id（做模糊处理） */
  prevId: string
}>()

const root = ref<HTMLElement>()
const cover = ref<HTMLElement>()

let progress = 0
let targetProgress = 0
let smoothProgress = 0
let rafId = 0
let running = false
let vh = 0

function computeTarget() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 进度 0：区块顶部进入视口底部；进度 1：区块顶部到达视口 40%（覆盖完成）
  const start = vh
  const end = vh * 0.4
  targetProgress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
}

function apply() {
  const p = smoothProgress
  // 覆盖块：translateY(100% → -10%) 完全覆盖视口
  if (cover.value) {
    cover.value.style.transform = `translateY(${(100 - p * 110).toFixed(2)}%)`
  }
  // 过渡舞台：blur 同步 + 变黑程度 D 档（brightness 终点 0.45，仅舞台）
  if (root.value) {
    root.value.style.filter = `blur(${(p * 10).toFixed(1)}px) brightness(${(1 - p * 0.55).toFixed(2)})`
  }
  // 上一章模糊：blur 0 → 10px + 微暗（保持原样 0.75）
  const prev = document.getElementById(props.prevId)
  if (prev) {
    prev.style.filter = `blur(${(p * 10).toFixed(1)}px) brightness(${(1 - p * 0.25).toFixed(2)})`
  }
}

function tick() {
  if (!running) return
  smoothProgress += (targetProgress - smoothProgress) * 0.12
  apply()
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (running) return
  running = true
  rafId = requestAnimationFrame(tick)
}

function stop() {
  running = false
  cancelAnimationFrame(rafId)
}

function onScroll() {
  computeTarget()
  if (!running) start()
}

onMounted(() => {
  // 触屏 / 减少动效：直接静态完成态（覆盖块隐藏，无模糊）
  if (isTouchDevice() || prefersReducedMotion()) {
    apply()
    return
  }
  vh = window.innerHeight
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => {
    vh = window.innerHeight
    computeTarget()
  })
  computeTarget()
  start()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('scroll', onScroll)
  // 清理滤镜
  if (root.value) root.value.style.filter = ''
  const prev = document.getElementById(props.prevId)
  if (prev) prev.style.filter = ''
})
</script>

<template>
  <div ref="root" class="ct" :style="{ '--ct-from': props.fromColor }" aria-hidden="true">
    <div class="ct__sticky">
      <div ref="cover" class="ct__cover" :style="{ background: color }" />
    </div>
  </div>
</template>

<style scoped>
.ct {
  height: 25vh; /* 过渡区占位 25vh（用户设定） */
  position: relative;
  padding-top: 10vh; /* 过渡延迟（padding 区域被背景覆盖，不露黑底） */
  /* 与 Nº001 同款：灰蓝底 + 动态扫描线条纹 */
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px),
    var(--ct-from, #969da4);
  animation: ct-scan 0.8s linear infinite;
}

@keyframes ct-scan {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}

.ct__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
}

/* 覆盖块：超大宽圆弧顶部（更陡的椭圆率），初始在视口下方 */
.ct__cover {
  position: absolute;
  left: -50%;
  width: 200%;
  bottom: 0;
  height: 130vh; /* 高于视口，保证完全覆盖 */
  border-radius: 50% 50% 0 0 / 92% 92% 0 0; /* 陡圆弧 */
  transform: translateY(100%);
  will-change: transform;
}
</style>
