// ==================== 首页滚动：百叶窗帘幕 + 视频虚化 ====================
// 滚动下翻时：4 条黑色叶片从上到下依次滑下（合拢遮住背景），视频同步模糊
// 与 useHeroLogo 共用同一滚动进度（hero-logo-progress）

interface BlindsOptions {
  /** 叶片数量 */
  count?: number
  /** 视频最大模糊（px） */
  maxBlur?: number
}

export function useBlinds(
  blindsEl: Ref<HTMLElement | null | undefined>,
  videoEl: Ref<HTMLVideoElement | null | undefined>,
  options: BlindsOptions = {},
) {
  const { count = 4, maxBlur = 10 } = options

  // 共用归位进度（useHeroLogo 维护）
  const progress = useState('hero-logo-progress', () => 0)

  let rafId = 0
  let running = false
  let smooth = 0 // lerp 后的平滑进度

  // 条带元素缓存
  let strips: HTMLElement[] = []

  function apply() {
    const p = smooth

    // 叶片错峰下落合拢：第 i 条在进度 (i / count) 后从上方滑下覆盖
    strips.forEach((strip, i) => {
      const delay = i / count
      const local = Math.min(1, Math.max(0, (p - delay) / (1 - delay)))
      strip.style.transform = `translateY(${(-100 + local * 100).toFixed(2)}%)`
    })

    // 视频虚化
    const video = videoEl.value
    if (video) {
      video.style.filter = `blur(${(p * maxBlur).toFixed(1)}px)`
    }
  }

  function tick() {
    if (!running) return
    smooth += (progress.value - smooth) * 0.08
    if (Math.abs(smooth - progress.value) < 0.001) smooth = progress.value
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

  onMounted(() => {
    const el = blindsEl.value
    if (!el) return

    // 初始化条带元素
    strips = Array.from(el.children) as HTMLElement[]
    // 初始全收起状态（translateY 0 = 覆盖）
    apply()

    // 触屏 / 减少动效：不启用
    if (
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches
    ) {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // 监听归位进度变化（useHeroLogo 的 rAF 在跑时持续更新）
    watch(progress, () => {
      if (!running) start()
    })
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })
}
