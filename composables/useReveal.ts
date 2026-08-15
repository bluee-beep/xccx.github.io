// ==================== 入场动画观察器 ====================
// IntersectionObserver 封装：被 RevealText 等组件复用
// 无 IO 支持（老浏览器）时直接触发 onEnter，内容恒可见

interface UseRevealOptions {
  onEnter?: () => void
  /** 触发后是否停止观察（默认 true） */
  once?: boolean
  threshold?: number
}

export function useReveal(
  el: Ref<HTMLElement | null | undefined>,
  options: UseRevealOptions = {},
) {
  const { onEnter, once = true, threshold = 0.2 } = options

  onMounted(() => {
    const target = el.value
    if (!target) return

    // 无 IntersectionObserver：内容直接可见
    if (!('IntersectionObserver' in window)) {
      onEnter?.()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onEnter?.()
          if (once) observer.unobserve(target)
        }
      }
    }, { threshold })

    observer.observe(target)
  })
}
