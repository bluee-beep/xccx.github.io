// ==================== v-reveal 全局指令 ====================
// 用法：<div v-reveal> 或 <div v-reveal="{ delay: 200 }">
// 进入视口时切换 .v-reveal--hidden → .v-reveal--shown（过渡类定义在 main.css）
// 无 JS / reduced-motion 时元素直接可见（初始类由 JS 添加，不破坏可读性）

const observers = new WeakMap<HTMLElement, IntersectionObserver>()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      // 环境不支持或用户偏好减少动效：直接可见
      if (!('IntersectionObserver' in window)) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      el.classList.add('v-reveal--hidden')

      const delay = binding.value?.delay ?? 0
      if (delay > 0) {
        el.style.setProperty('--reveal-delay', `${delay}ms`)
      }

      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('v-reveal--shown')
            observer.unobserve(el)
          }
        }
      }, { threshold: 0.2 })

      observers.set(el, observer)
      observer.observe(el)
    },

    unmounted(el: HTMLElement) {
      observers.get(el)?.disconnect()
      observers.delete(el)
    },
  })
})
