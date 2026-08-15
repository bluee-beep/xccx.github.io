<script setup lang="ts">
// ==================== 404 蓝屏彩蛋 ====================
// 复古 Windows 蓝屏风格：纯 CSS 视觉 + 任意键/点击返回首页
definePageMeta({ layout: 'blank' })

useSeo({ title: '404 — 页面不存在' })

// 说明：Nuxt 官方设计——prerender 的 /404.html 以 SPA 模式输出
// （PRERENDER_NO_SSR_ROUTES 硬编码），客户端 JS 挂载后渲染蓝屏。
// 蓝屏交互（点击/按键返回首页）本身依赖 JS，此设计完全够用。

const goHome = () => navigateTo('/')

let keyHandler: ((e: KeyboardEvent) => void) | null = null

onMounted(() => {
  keyHandler = (e: KeyboardEvent) => {
    e.preventDefault()
    goHome()
  }
  window.addEventListener('keydown', keyHandler)
})

onBeforeUnmount(() => {
  if (keyHandler) window.removeEventListener('keydown', keyHandler)
})
</script>

<template>
  <main class="bsod" role="alert" @click="goHome">
    <pre class="bsod__screen">
┌────────────────────────────────────────────────┐
│  XCCX: An error has occurred.                  │
│  404 — 页面不存在                              │
│                                                │
│  To continue:                                  │
│  · Press Enter to return to Index,             │
│  · or Press CTRL+ALT+DEL to restart.           │
│                                                │
│  If you do this, you will lose any unsaved     │
│  information in all open applications.         │
│                                                │
│  Error: 404 : 016F : BFF9B3D4                  │
│  Press any key to continue <span class="bsod__cursor">_</span>│
└────────────────────────────────────────────────┘</pre>
    <p class="bsod__hint u-monolabel">— 点击任意位置或按任意键返回首页 —</p>
  </main>
</template>

<style scoped>
/* ---- 蓝屏：经典深蓝 + 白字等宽 ---- */
.bsod {
  min-height: 100svh;
  background: #0d2b6e;
  color: #e8ecf4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  padding: var(--space-5);
  cursor: pointer;
  font-family: 'JetBrains Mono Variable', monospace;
}

.bsod__screen {
  font-size: clamp(0.65rem, 1.6vw, 0.95rem);
  line-height: 1.7;
  max-width: 46rem;
  overflow-x: auto;
  text-shadow: 0 0 1px currentColor;
}

/* ---- 光标闪烁 ---- */
.bsod__cursor {
  animation: bsod-blink 1s steps(1) infinite;
}

@keyframes bsod-blink {
  50% {
    opacity: 0;
  }
}

.bsod__hint {
  color: rgba(232, 236, 244, 0.6);
  font-size: var(--fs-label);
}
</style>
