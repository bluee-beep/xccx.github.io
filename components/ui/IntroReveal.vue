<script setup lang="ts">
// ==================== Intro 章节：行遮罩上滑（pxpush 式） ====================
// 每个段落一个遮罩窗口，文字整段从下方升起（yPercent 100→0 的手写等价：
//   translateY(110%) → 0，expo-out 1s，段间 stagger）。
// 触发：进入视口一次性序列播放（原版 ScrollTrigger start:"top 80%" 语义）。
// 可见性约定（同 v-reveal）：SSR / 无 JS / 触屏 / reduced-motion 全部直接可见，
//   仅 JS 挂载后由 --armed 类进入隐藏态等待入场。
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

const props = defineProps<{ paragraphs: string[] }>()

const root = ref<HTMLElement>()
const inView = ref(false)
const armed = ref(false)

onMounted(() => {
  const el = root.value
  if (!el) return

  // 触屏 / 减少动效：保持直接可见，不播放动画
  if (isTouchDevice() || prefersReducedMotion()) return

  // 挂载后进入待入场状态（此时章节在视口外，用户无感）
  armed.value = true

  // 进入视口 → 一次性播放序列
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        inView.value = true
        io.disconnect()
      }
    },
    { threshold: 0.15 },
  )
  io.observe(el)

  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <div
    ref="root"
    class="intro-reveal"
    :class="{ 'intro-reveal--armed': armed, 'intro-reveal--in': inView }"
  >
    <p v-for="(para, pi) in paragraphs" :key="pi" class="intro-reveal__para">
      <span class="intro-reveal__line" :style="{ '--lm-i': pi }">
        <span class="intro-reveal__inner">{{ para }}</span>
      </span>
    </p>
  </div>
</template>

<style scoped>
/* 段落区：上移 + 右栏宽度（背景由章节级 .chapter--intro 提供） */
.intro-reveal {
  margin-top: -2rem;
  max-width: 60vw;
  margin-left: auto;
}

/* Intro 段落：栏内左对齐，深色文字（适配章节浅底） */
.intro-reveal__para {
  text-align: left;
  color: var(--c-bg);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.intro-reveal__para:last-child {
  margin-bottom: 0;
}

/* ---- 行遮罩：段落从遮罩窗口升起 ---- */
.intro-reveal__line {
  display: block;
  overflow: hidden;
}

.intro-reveal__inner {
  display: block;
  transform: none; /* 默认可见（SSR / 无 JS） */
  will-change: transform;
}

/* JS 挂载后才进入隐藏态（等待入场） */
.intro-reveal--armed .intro-reveal__inner {
  transform: translateY(110%);
  transition: transform 1s var(--ease-out-expo);
  transition-delay: calc(var(--lm-i) * 0.12s);
}

/* 进入视口：序列上滑（expo-out 1s，段间 0.12s 错峰） */
.intro-reveal--armed.intro-reveal--in .intro-reveal__inner {
  transform: none;
}
</style>
