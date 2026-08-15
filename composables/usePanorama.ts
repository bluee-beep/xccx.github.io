// ==================== 视频取景（Panorama） ====================
// 大画布视频 + 鼠标驱动取景平移：鼠标移到哪，视口显示视频对应位置的画面
// 原理：cover 放大 + range 余量 → mousemove 归一化坐标 → lerp 插值平滑跟随
// 纯 transform 驱动，与 Lenis / 现有动效零冲突

interface PanoramaOptions {
  /** 视频相对视口的放大余量（0.3 = 视频比视口大 30%，支持 ±15% 平移） */
  range?: number
  /** lerp 平滑系数：越大越跟手，越小越飘 */
  lerpFactor?: number
}

export function usePanorama(
  viewportEl: Ref<HTMLElement | null | undefined>,
  mediaEl: Ref<HTMLVideoElement | null | undefined>,
  options: PanoramaOptions = {},
) {
  const { range = 0.3, lerpFactor = 0.08 } = options

  let maxTx = 0
  let maxTy = 0
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let rafId = 0
  let running = false
  let observer: IntersectionObserver | null = null

  // ---- 环境判定：触屏 / 减少动效 → 居中静态取景 ----
  const isTouch = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---- 尺寸计算：cover + range，结果直接写媒体元素样式 ----
  function computeSize() {
    const vp = viewportEl.value
    const media = mediaEl.value
    if (!vp || !media) return

    const vw = media.videoWidth
    const vh = media.videoHeight
    if (!vw || !vh) return // 元数据未就绪（loadedmetadata 前）

    const scale = Math.max(vp.clientWidth / vw, vp.clientHeight / vh) * (1 + range)
    media.style.width = `${vw * scale}px`
    media.style.height = `${vh * scale}px`

    // 可平移余量（单侧）
    maxTx = (vw * scale - vp.clientWidth) / 2
    maxTy = (vh * scale - vp.clientHeight) / 2
  }

  function applyTransform() {
    const media = mediaEl.value
    if (!media) return
    media.style.transform =
      `translate(-50%, -50%) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
  }

  // ---- rAF 循环：lerp 逼近目标 ----
  function tick() {
    if (!running) return
    currentX += (targetX - currentX) * lerpFactor
    currentY += (targetY - currentY) * lerpFactor
    applyTransform()
    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (running || !viewportEl.value) return
    running = true
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  // ---- 鼠标：归一化坐标 → 目标偏移（鼠标在右 → 视频左移露出右侧画面） ----
  function onMouseMove(e: MouseEvent) {
    const vp = viewportEl.value
    if (!vp) return
    const rect = vp.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / rect.width
    const my = (e.clientY - rect.top) / rect.height
    targetX = (0.5 - mx) * 2 * maxTx
    targetY = (0.5 - my) * 2 * maxTy
  }

  function onMouseLeave() {
    targetX = 0
    targetY = 0 // 移出 → 缓慢回中
  }

  onMounted(() => {
    const vp = viewportEl.value
    const media = mediaEl.value
    if (!vp || !media) return

    // 触屏 / 减少动效：居中静态取景，不挂交互
    if (isTouch() || prefersReducedMotion()) {
      media.style.width = '100%'
      media.style.height = '100%'
      media.style.objectFit = 'cover'
      media.style.transform = 'none'
      media.style.position = 'static'
      return
    }

    // 媒体元数据就绪后计算尺寸（videoWidth 才有值）
    media.addEventListener('loadedmetadata', computeSize)
    if (media.videoWidth) computeSize()

    window.addEventListener('resize', computeSize)
    vp.addEventListener('mousemove', onMouseMove)
    vp.addEventListener('mouseleave', onMouseLeave)

    // 进出视口启停 rAF（性能：滚出首屏即停）
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start()
        else stop()
      }
    }, { threshold: 0.1 })
    observer.observe(vp)
    start()
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
    const vp = viewportEl.value
    const media = mediaEl.value
    if (vp) {
      vp.removeEventListener('mousemove', onMouseMove)
      vp.removeEventListener('mouseleave', onMouseLeave)
    }
    if (media) media.removeEventListener('loadedmetadata', computeSize)
    window.removeEventListener('resize', computeSize)
  })
}
