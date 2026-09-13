<script setup lang="ts">
// ==================== 章节衔接过渡：圆弧覆盖 + 上一章模糊 ====================
// C+D 组合（用户选定）：下一章圆弧顶部随滚动从底部滑上覆盖（太阳升起）
// 同时上一章（prevId）随进度模糊淡出
import { prefersReducedMotion } from '~/composables/useDevice'

const props = defineProps<{
  /** 下一章颜色（覆盖块颜色） */
  color: string
  /** 上一章颜色（过渡画面底色，与 Nº001 同色） */
  fromColor?: string
  /** 上一章元素 id（做模糊处理） */
  prevId: string
  /** 方向：up 圆弧从底部升起（默认）｜down 圆弧从顶部降下（反向） */
  direction?: 'up' | 'down'
}>()

const root = ref<HTMLElement>()
const stage = ref<HTMLElement>()
const cover = ref<HTMLElement>()

let compact = false
let targetProgress = 0
let smoothProgress = 0
let rafId = 0
let running = false
let vh = 0

function computeTarget() {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 进度 0：区块顶部滚到视口 90% 处才触发（进视口后延迟，不一开始就模糊）
  // 进度 1：区块顶部到达视口 25%（覆盖完成）；区间 65% vh，比原 60% 更缓
  const start = vh * 0.9
  const end = vh * 0.25
  targetProgress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
}

function applyCover(p: number) {
  const el = cover.value
  if (!el) return
  const travel = compact ? 100 : 110
  const offset = props.direction === 'down' ? p * travel : 100 - p * travel
  el.style.transform = `translateY(${offset.toFixed(2)}%)`
  // 紧凑舞台内升起圆弧，完成时拉平边缘，与下一章无缝相接。
  const radius = ((1 - p) * 80).toFixed(2)
  el.style.borderRadius = compact ? `50% 50% 0 0 / ${radius}% ${radius}% 0 0` : ''
}

function apply() {
  const p = smoothProgress
  applyCover(p)
  // 过渡舞台背景层：blur 同步 + 变黑（brightness 终点 0.45，仅背景）
  // 圆弧（cover）不在 filter 作用域内——保持清晰，与下一章底色无缝融合
  if (stage.value) {
    stage.value.style.filter = `blur(${(p * 10).toFixed(1)}px) brightness(${(1 - p * 0.55).toFixed(2)})`
  }
  // 上一章模糊：blur 0 → 10px + 微暗（保持原样 0.75）
  const prev = document.getElementById(props.prevId)?.querySelector<HTMLElement>('.u-container')
  if (prev) {
    prev.style.filter = `blur(${(p * 10).toFixed(1)}px) brightness(${(1 - p * 0.25).toFixed(2)})`
  }
}

function tick() {
  if (!running) return
  smoothProgress += (targetProgress - smoothProgress) * 0.12
  const settled = Math.abs(targetProgress - smoothProgress) < 0.001
  if (settled) smoothProgress = targetProgress
  apply()
  if (settled) running = false
  else rafId = requestAnimationFrame(tick)
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

function onResize() {
  vh = window.innerHeight
  compact = window.matchMedia('(max-width: 48rem), (hover: none)').matches
  onScroll()
}

onMounted(() => {
  // 触屏正常播放；仅尊重系统减少动态效果偏好。
  if (prefersReducedMotion()) return
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  onResize()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  // 清理滤镜
  if (stage.value) stage.value.style.filter = ''
  const prev = document.getElementById(props.prevId)?.querySelector<HTMLElement>('.u-container')
  if (prev) prev.style.filter = ''
})
</script>

<template>
  <div
    ref="root"
    class="ct"
    :style="{
      '--ct-from': props.direction === 'down' ? props.color : props.fromColor,
      '--ct-to': props.direction === 'down' ? props.fromColor : props.color,
    }"
    aria-hidden="true"
  >
    <!-- 舞台背景层：blur/变黑只作用于此，圆弧保持清晰 -->
    <div ref="stage" class="ct__stage" />
    <div class="ct__sticky">
      <!-- down：椭圆为上一章颜色，向下撤走露出下一章 -->
      <div
        ref="cover"
        class="ct__cover"
        :class="{ 'ct__cover--down': props.direction === 'down' }"
        :style="{ background: props.direction === 'down' ? props.fromColor : color }"
      />
    </div>
  </div>
</template>

<style scoped>
.ct {
  height: 25vh; /* 过渡区占位 25vh（用户设定） */
  position: relative;
  padding-top: 10vh; /* 过渡延迟（padding 区域被背景覆盖，不露黑底） */
}

/* 舞台背景层：灰蓝底 + 动态扫描线条纹；blur/变黑只作用于这一层 */
.ct__stage {
  position: absolute;
  inset: 0;
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
  border-radius: 50% 50% 0 0 / 92% 92% 0 0; /* 陡圆弧（上） */
  transform: translateY(100%);
  will-change: transform;
}

/* 反向：椭圆为上一章色，初始完全覆盖，滚动向下撤走（圆弧在下端） */
.ct__cover--down {
  bottom: auto;
  top: 0;
  border-radius: 0 0 50% 50% / 0 0 92% 92%;
  transform: translateY(0); /* 初始覆盖 */
}

/* 紧凑舞台：保留滚动圆弧，不使用超出父级高度的粘滞层。 */
@media (max-width: 48rem), (hover: none) {
  .ct {
    height: clamp(8rem, 24svh, 14rem);
    padding-top: 0;
    overflow: hidden;
    background: var(--ct-from, #969da4);
  }

  .ct__stage {
    background: var(--ct-from, #969da4);
    animation: none;
    filter: none !important;
  }

  .ct__sticky {
    position: absolute;
    inset: 0;
    height: 100%;
  }

  .ct__cover {
    left: 0;
    width: 100%;
    height: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ct { height: 4rem; padding: 0; }
  .ct__stage { background: linear-gradient(var(--ct-from), var(--ct-to)); animation: none; }
  .ct__sticky { display: none; }
}
</style>
