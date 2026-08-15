// ==================== Lenis 平滑滚动 ====================
// 手写封装（不引 nuxt-lenis）：动态 import 避免 SSR 副作用
// 特性：autoRaf 免手动 rAF、anchors 拦截原生锚点防跳变、reduced-motion 回退、HMR 销毁
import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function useLenis() {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  onMounted(async () => {
    if (lenis || prefersReducedMotion()) return

    const { default: LenisCtor } = await import('lenis')
    lenis = new LenisCtor({
      autoRaf: true, // 内部自驱动 rAF 循环
      anchors: true, // 拦截 a[href^="#"] 走平滑滚动，避免与原生跳变打架
    })

    // 带 hash 进站（分享锚点链接）：直接定位，不滚动动画
    if (window.location.hash) {
      lenis.scrollTo(window.location.hash, { immediate: true })
    }
  })

  // HMR 或组件卸载时销毁，防止滚动失效残留
  onBeforeUnmount(() => {
    lenis?.destroy()
    lenis = null
  })
}
