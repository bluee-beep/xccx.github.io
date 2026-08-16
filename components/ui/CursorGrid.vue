<script setup lang="ts">
// ==================== 网格反色光标（CursorGrid） ====================
// 1:1 移植自 pxpush.com 的全屏网格光标：
//   全屏 20 列点阵 + mix-blend-mode: difference，鼠标滑过时所在格子
//   白色方块点亮 0.2s 后硬切熄灭，gooey 滤镜让相邻格子融合成胶体光斑。
// 与原版差异（有意为之）：
//   - 无 GSAP 依赖：class 切换 + setTimeout 复刻 set(1)/set(0,delay:0.2) 时序
//   - 坐标用 clientX/clientY（fixed 网格纯视口坐标，本站 Lenis 滚动容器是 window）
//   - 环境判定复用 useDevice（触屏 / reduced-motion 不建格子不挂监听）
// 注意：mix-blend-mode 依赖根层叠上下文——若未来给 body/layout 根加
//   transform/filter/isolation 会隔离混合域导致光标视觉消失。
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = withDefaults(
  defineProps<{
    /** 列数（原版 20） */
    columns?: number
    /** 点亮保持时长，秒（原版 data-ttl 默认 0.2） */
    ttl?: number
    /** gooey 粘连滤镜（Firefox 自动关闭，原版同款） */
    gooey?: boolean
    /** 视口宽 ≤ 此值整体关闭（原版 media query 1300px） */
    maxWidth?: number
    /** 命中即不点亮的排除区（有专属 hover 反馈的元素） */
    excludeSelector?: string
  }>(),
  {
    columns: 20,
    ttl: 0.2,
    gooey: true,
    maxWidth: 1300,
    excludeSelector: '.header__link, .header__logo, .cc__contact',
  },
)

// 环境判定：直接复用 useDevice 的两个导出函数（无需解构）

const rootEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
const filterId = useId()

// 运行时参数：dev 下可被 ?cursor=columns:28,ttl:0.4 覆盖（生产剔除）
const params = reactive({
  columns: props.columns,
  ttl: props.ttl,
  gooey: props.gooey,
  maxWidth: props.maxWidth,
})

let cells: HTMLElement[] | null = null
let cols = params.columns
let rows = 0
let cellSize = 0
let cachedCell: HTMLElement | null = null
let resizeTimer = 0

// ---- 网格生成：原生 DOM 单次 innerHTML（数百格，不走 v-for 响应式） ----
function buildGrid() {
  const root = rootEl.value
  const inner = innerEl.value
  if (!root || !inner) return

  const w = window.innerWidth
  const h = window.innerHeight
  cols = params.columns
  cellSize = w / cols
  rows = Math.ceil(h / cellSize)

  root.style.setProperty('--cg-columns', String(cols))
  root.style.setProperty('--cg-size', `${cellSize}px`)
  inner.innerHTML = '<div class="cursor__inner-box"></div>'.repeat(rows * cols)
  cells = Array.from(inner.children) as HTMLElement[]

  // gooey：非 Firefox 才挂（原版规避 Firefox SVG filter 兼容问题）
  if (params.gooey && !/firefox/i.test(navigator.userAgent)) {
    inner.style.filter = `url(#${filterId})`
  } else {
    inner.style.filter = ''
  }

  cachedCell = null
}

function clearGrid() {
  const inner = innerEl.value
  if (inner) inner.innerHTML = ''
  cells = null
  cachedCell = null
}

// ---- 点亮时序：瞬时亮 → ttl 后硬切熄灭（原版 GSAP set 语义，无淡出） ----
function light(el: HTMLElement) {
  const timer = Number(el.dataset.timer)
  if (timer) clearTimeout(timer) // 淡出前再次进入：复位重新计时（等价 GSAP 覆盖旧 tween）
  el.classList.add('is-on')
  el.dataset.timer = String(window.setTimeout(() => el.classList.remove('is-on'), params.ttl * 1000))
}

// ---- 鼠标：格子索引 O(1) 计算；cachedCell 幂等（原版同款防重复触发） ----
function onMove(e: PointerEvent) {
  if (!cells) return
  const target = e.target
  if (target instanceof Element && target.closest(props.excludeSelector)) return

  const col = Math.floor(e.clientX / cellSize)
  const row = Math.floor(e.clientY / cellSize)
  if (col < 0 || col >= cols || row < 0 || row >= rows) return

  const el = cells[row * cols + col]
  if (!el || el === cachedCell) return
  cachedCell = el
  light(el)
}

// ---- resize：150ms 防抖后重建（桌面端尺寸变化即重建，原版 resize → layout 语义） ----
// 原版的移动端假 resize 守卫无需移植：本站触屏设备根本不挂载光标
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(syncEnabled, 150)
}

// 按阈值启停：宽屏建格子（resize 时重建），窄屏清空（原版 display:none 的等价物）
function syncEnabled() {
  if (window.innerWidth > params.maxWidth) {
    buildGrid()
  } else if (cells) {
    clearGrid()
  }
}

// dev 调参：?cursor=columns:28,ttl:0.4,gooey:0 —— 仅作调试手段，生产 dead-code 剔除
if (import.meta.dev) {
  const route = useRoute()
  watch(
    () => route.query.cursor,
    () => {
      const q = route.query.cursor
      if (typeof q !== 'string' || !q) return
      for (const pair of q.split(',')) {
        const [key, raw] = pair.split(':')
        const value = Number(raw)
        if (Number.isNaN(value)) continue
        if (key === 'columns') params.columns = value
        else if (key === 'ttl') params.ttl = value
        else if (key === 'maxWidth') params.maxWidth = value
        else if (key === 'gooey') params.gooey = value !== 0
      }
      syncEnabled()
    },
  )
}

onMounted(() => {
  // 触屏 / 减少动效：不建格子、不挂监听（同 usePanorama 模式）
  if (isTouchDevice() || prefersReducedMotion()) return

  syncEnabled()
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
  cells?.forEach((el) => {
    const timer = Number(el.dataset.timer)
    if (timer) clearTimeout(timer)
  })
  cells = null
})
</script>

<template>
  <div ref="rootEl" class="cursor">
    <div ref="innerEl" class="cursor__inner" />

    <!-- gooey 粘连滤镜：零尺寸占位，仅作 defs 引用 -->
    <svg class="cursor__filters" aria-hidden="true">
      <defs>
        <filter :id="filterId">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="3.2" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
/* ---- 与原版 .cursor CSS 逐行对应 ---- */
.cursor {
  position: fixed;
  inset: 0;
  z-index: var(--z-cursor, 1000); /* 原版 99；本站需盖过 CRT 罩层 999 */
  pointer-events: none;
  mix-blend-mode: difference;
}

.cursor__inner {
  display: grid;
  grid-template-columns: repeat(var(--cg-columns), var(--cg-size));
}

.cursor__inner-box {
  background: #fff;
  width: var(--cg-size);
  height: var(--cg-size);
  opacity: 0;
}

/* 点亮：硬切（无 transition，对应原版 GSAP set 无 duration） */
.cursor__inner-box.is-on {
  opacity: 1;
}

/* SVG 滤镜定义容器：不占布局 */
.cursor__filters {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
