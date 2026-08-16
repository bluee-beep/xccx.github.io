// ==================== 手持拍摄摇晃（Handheld Shake） ====================
// 背景视频轻微漂移 + 微旋转，模拟真人持机拍摄
// 双正弦叠加（低频主导）：呼吸式缓慢漂移，幅度克制防晕（平移 ≤9px / 旋转 ≤0.53°）
// 纯 transform 驱动；触屏 / reduced-motion 禁用；滚出首屏停止 rAF
// scale(1.04) 预放大：摇晃位移不露边

export function useHandheld(target: Ref<HTMLElement | null | undefined>) {
  const isTouch = () =>
    window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(any-pointer: fine)').matches
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let rafId = 0
  let running = false
  let observer: IntersectionObserver | null = null
  let startTime = 0

  function tick() {
    if (!running) return
    const el = target.value
    if (el) {
      const t = (performance.now() - startTime) / 1000
      // 平移：低频大浪 + 高频细微波；旋转：更慢的呼吸
      const x = 6 * Math.sin(t * 0.5) + 3 * Math.sin(t * 1.1 + 1.3)
      const y = 5 * Math.sin(t * 0.45 + 2.1) + 2.5 * Math.sin(t * 1.0 + 0.5)
      const r = 0.35 * Math.sin(t * 0.35 + 0.8) + 0.18 * Math.sin(t * 0.75 + 2.8)
      el.style.transform =
        `scale(1.04) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg)`
    }
    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (running || !target.value) return
    running = true
    startTime = performance.now()
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  onMounted(() => {
    const el = target.value
    if (!el || isTouch() || prefersReducedMotion()) return

    // 进出视口启停 rAF（性能：滚出首屏即停）
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start()
        else stop()
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    start()
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
  })
}
