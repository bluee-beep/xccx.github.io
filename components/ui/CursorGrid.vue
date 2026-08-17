<script setup lang="ts">
// ==================== 网格反色光标（CursorGrid） ====================
// 复刻自原站的全屏网格光标：
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

// dev 诊断计数：验证光标运行状态用（生产构建整段剔除）
let probeOn = false
const diag = import.meta.dev
  ? reactive({
      cells: 0, lit: 0, moves: 0, excl: 0, mounted: false,
      rect: '-', gtc: '-', size: '-', last: '-', layer: '-', win: 0,
    })
  : null

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
  // probe 调试：全部格子常亮红色，区分「渲染管线」与「blend 混合」问题
  if (diag && probeOn) {
    cells.forEach((el) => {
      el.style.background = '#f00'
      el.style.opacity = '1'
    })
  }
  if (diag) {
    diag.cells = cells.length
    // 计算样式取证：格子实际渲染尺寸 / grid 模板 / CSS 变量值
    const first = cells[0]
    const r = first?.getBoundingClientRect()
    diag.rect = r ? `${Math.round(r.width)}x${Math.round(r.height)}` : 'none'
    diag.gtc = getComputedStyle(inner).gridTemplateColumns.slice(0, 40)
    diag.size = getComputedStyle(root).getPropertyValue('--cg-size').trim()
    // .cursor 层自身计算样式：定位 / 层级 / 混合模式
    const cs = getComputedStyle(root)
    diag.layer = `${cs.position}/${cs.zIndex}/blend:${cs.mixBlendMode}`
  }

  // gooey：非 Firefox 才挂（原版规避 Firefox SVG filter 兼容问题）
  // 挂载前验证 filter 定义存在——失效引用会导致 Chrome 把整个层渲染为不可见
  if (params.gooey && !/firefox/i.test(navigator.userAgent) && document.getElementById(filterId)) {
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
  if (diag) {
    diag.lit++
    // 点亮瞬间取证：格子的实际计算样式（opacity / 背景 / 尺寸）
    const cs = getComputedStyle(el)
    diag.last = `op:${cs.opacity} bg:${cs.backgroundColor}`
  }
}

// ---- 鼠标：格子索引 O(1) 计算；cachedCell 幂等（原版同款防重复触发） ----
function onMove(e: PointerEvent) {
  if (diag) diag.moves++
  if (!cells) return
  const target = e.target
  if (target instanceof Element && target.closest(props.excludeSelector)) {
    if (diag) diag.excl++
    return
  }

  const col = Math.floor(e.clientX / cellSize)
  const row = Math.floor(e.clientY / cellSize)
  if (col < 0 || col >= cols || row < 0 || row >= rows) return

  const el = cells[row * cols + col]
  if (!el || el === cachedCell) return
  cachedCell = el
  light(el)
}

// ---- resize：150ms 防抖后重建（桌面端尺寸变化即重建，原版 resize → layout 语义） ----
// 原版的移动端假 resize 守卫本站无需：触屏设备根本不挂载光标
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
      if (typeof window === 'undefined') return // SSR 阶段跳过（immediate 首轮）
      const q = route.query.cursor
      if (typeof q !== 'string' || !q) return
      for (const pair of q.split(',')) {
        const [key, raw] = pair.split(':')
        const value = Number(raw)
        if (key === 'probe') {
          probeOn = raw !== '0'
          continue
        }
        if (Number.isNaN(value)) continue
        if (key === 'columns') params.columns = value
        else if (key === 'ttl') params.ttl = value
        else if (key === 'maxWidth') params.maxWidth = value
        else if (key === 'gooey') params.gooey = value !== 0
      }
      syncEnabled()
    },
    { immediate: true },
  )
}

onMounted(() => {
  // 触屏 / 减少动效：不建格子、不挂监听（同 usePanorama 模式）
  if (isTouchDevice() || prefersReducedMotion()) return
  if (diag) {
    diag.mounted = true
    diag.win = window.innerWidth
  }

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

    <!-- dev 诊断徽章：验证运行状态（生产构建整段剔除） -->
    <div v-if="diag" class="cursor__diag u-mono">
      mounted={{ diag.mounted }} cells={{ diag.cells }} lit={{ diag.lit }}
      rect={{ diag.rect }} size={{ diag.size }}
      layer={{ diag.layer }}
      last={{ diag.last }}
      win={{ diag.win }}
    </div>

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

/* 格子由 JS innerHTML 动态生成（不带 scoped 的 data-v 标记），
   必须用 :deep() 穿透，否则样式匹配不到动态元素 */
.cursor__inner :deep(.cursor__inner-box) {
  background: #fff;
  width: var(--cg-size);
  height: var(--cg-size);
  opacity: 0;
}

/* 点亮：硬切（无 transition，对应原版 GSAP set 无 duration） */
.cursor__inner :deep(.cursor__inner-box.is-on) {
  opacity: 1;
}

/* SVG 滤镜定义容器：position:absolute 不占文档流，但保留默认渲染尺寸
   （原版同款做法——0 尺寸 SVG 会让 Chrome 中 filter 定义失效，
    进而 filter:url() 引用失败导致整个光标层不可见） */
.cursor__filters {
  position: absolute;
}

/* dev 诊断徽章：左上角固定，荧光绿可读 */
.cursor__diag {
  position: fixed;
  top: 6rem;
  left: 1rem;
  z-index: 2000;
  font-size: 0.75rem;
  color: var(--c-accent);
  background: rgba(0, 0, 0, 0.7);
  padding: 0.25rem 0.5rem;
  pointer-events: none;
}
</style>
