<script setup lang="ts">
// ==================== 页脚 ====================
// 大 xccx 多层拖尾视差（学习参考站）：3 层重叠，滚动时不同速度偏移
// 上层实心 → 下层透明度递减（残影拖尾感）
import { site } from '~/data/site'
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const year = new Date().getFullYear()

const root = ref<HTMLElement>()
const trailRefs = ref<HTMLElement[]>([])

const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`

let rafId = 0
let running = false

// 3 层：不同视差速度（越深越慢）+ 透明度——C 档基础上再错开
const layers = [
  { speed: 0.6, opacity: 1 }, // 顶层：最快、实心
  { speed: 0.35, opacity: 0.6 }, // 中层
  { speed: 0.1, opacity: 0.35 }, // 底层：最慢
]

function tick() {
  if (!running) return
  const el = root.value
  if (el) {
    const rect = el.getBoundingClientRect()
    // 页脚进入视口的进度（0 = 刚露出，1 = 完全展开）
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.5)))
    // 错位基准：按 logo 实际高度 × 4，保证层间跨度 ≥ 2 个 logo 高
    const logoH = trailRefs.value[0]?.offsetHeight || 280
    trailRefs.value.forEach((layer, i) => {
      if (!layer) return
      const offset = progress * layers[i].speed * logoH * 4 // 每层偏移量不同
      layer.style.transform = `translateY(${offset.toFixed(2)}px)`
    })
  }
  rafId = requestAnimationFrame(tick)
}

function onScroll() {
  if (!running) {
    running = true
    rafId = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  // 触屏 / 减少动效：静态（无拖尾）
  if (isTouchDevice() || prefersReducedMotion()) {
    trailRefs.value.forEach((l) => l && (l.style.transform = ''))
    return
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <footer ref="root" class="footer">
    <!-- 大 logo 手绘图多层拖尾（参考站学习） -->
    <div class="footer__trail" aria-hidden="true">
      <img
        v-for="(l, i) in layers"
        :key="i"
        ref="trailRefs"
        :src="logoSrc"
        alt=""
        class="footer__trail-layer"
        :style="{ opacity: l.opacity, zIndex: 3 - i }"
      />
    </div>

    <div class="u-container footer__inner">
      <p class="footer__copy u-mono">© {{ year }} {{ site.name }}</p>

      <nav class="footer__links" aria-label="社交链接">
        <a
          v-for="item in site.social"
          :key="item.label"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link u-monolabel"
        >
          {{ item.label }}
        </a>
        <a :href="`mailto:${site.email}`" class="footer__link u-monolabel footer__link--mail">
          {{ site.email }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  border-top: 1px solid var(--c-line);
  overflow: hidden;
  background: var(--c-bg);
}

/* ---- 大 logo 拖尾层（整体上移，三层初始完全重叠） ---- */
.footer__trail {
  position: relative;
  height: clamp(10rem, 22vw, 18rem); /* 大尺寸展示区 */
  display: grid;
  place-items: center;
  pointer-events: none;
  margin-top: -12.5rem; /* 整体上移（用户指定） */
}

.footer__trail-layer {
  position: absolute;
  width: min(88vw, 52rem); /* logo 手绘图大尺寸 */
  height: auto;
  display: block;
  will-change: transform;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-block: var(--space-5);
  border-top: 1px solid var(--c-line);
  position: relative;
  z-index: 4;
}

.footer__copy {
  color: var(--c-muted);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}

.footer__link {
  color: var(--c-muted);
}

.footer__link:hover {
  color: var(--c-accent);
}

.footer__link--mail {
  color: var(--c-ink);
}
</style>
