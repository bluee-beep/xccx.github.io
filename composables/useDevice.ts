// ==================== 设备与环境判定（统一） ====================
// 两处使用（useHeroLogo / AppHeader），抽出避免重复
// 均含 window 守卫，SSR 安全

/** 纯触屏设备（手机/平板）：触屏笔记本主指针是 fine，不算 */
export function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(any-pointer: fine)').matches
  )
}

/** 用户偏好减少动效 */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
