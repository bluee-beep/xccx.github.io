// ==================== Hero 大 Logo 滚动归位 ====================
// 首屏中央大 logo → 滚动时平滑缩小移动 → 与 header logo 合体（PPT 平滑感）
// 原理：滚动进度 → lerp 插值 → transform(scale + translate) 驱动
// 归位进度通过全局 state 暴露，供 AppHeader 做 logo 显隐合体
import { isTouchDevice, prefersReducedMotion } from './useDevice'

interface HeroLogoOptions {
  /** 大 logo 初始高度（px），用于 scale 映射 */
  initialHeight?: number
  /** 归位后的高度（px）——与 header logo 一致 */
  finalHeight?: number
  /** 滚动阈值（视口高度的比例），滚过该距离完成归位 */
  thresholdRatio?: number
  /** lerp 平滑系数：越小越「缓缓」 */
  lerpFactor?: number
}

export function useHeroLogo(
  logoEl: Ref<HTMLElement | null | undefined>,
  options: HeroLogoOptions = {},
) {
  const {
    initialHeight = 220,
    finalHeight = 44,
    thresholdRatio = 0.6,
    lerpFactor = 0.09,
  } = options

  // 归位进度（Nuxt useState 同 key 跨组件共享，AppHeader 读取）
  const progressState = useState('hero-logo-progress', () => 0)

  let progress = 0
  let targetProgress = 0
  let rafId = 0
  let running = false
  let vw = 0
  let vh = 0

  const scaleFinal = finalHeight / initialHeight

  function apply() {
    const el = logoEl.value
    if (!el) return
    // 目标：header logo 中心（左距 32px + 半宽 66px，header 高一半 40px）
    const targetX = 32 + (finalHeight * 3) / 2
    const targetY = 40
    const centerX = vw / 2
    const centerY = vh / 2
    const dx = (targetX - centerX) * progress
    const dy = (targetY - centerY) * progress
    const s = 1 + (scaleFinal - 1) * progress
    el.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) scale(${s.toFixed(4)})`
    progressState.value = progress
  }

  function tick() {
    if (!running) return
    progress += (targetProgress - progress) * lerpFactor
    if (Math.abs(progress - targetProgress) < 0.0005) {
      progress = targetProgress
    }
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
    targetProgress = Math.min(1, window.scrollY / (vh * thresholdRatio))
  }

  function onResize() {
    vw = window.innerWidth
    vh = window.innerHeight
    onScroll()
  }

  onMounted(() => {
    const el = logoEl.value
    if (!el) return

    vw = window.innerWidth
    vh = window.innerHeight

    // 移动端 / 减少动效：不启用归位（大 logo 保持居中，header logo 正常显示）
    if (isTouchDevice() || prefersReducedMotion()) {
      progressState.value = 0
      return
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()
    start()
  })

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  })
}
