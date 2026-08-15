<script setup lang="ts">
// ==================== 顶部导航 ====================
// 固定顶部 + 毛玻璃；导航项来自 data/site.ts
// TODO: M4 后接入滚动进度条 / 汉堡菜单
import { site } from '~/data/site'
import { isTouchDevice, prefersReducedMotion } from '~/composables/useDevice'

// public 静态资源需手动拼接 baseURL（Nuxt 不会自动加前缀）
const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`

// ---- 与 Hero 大 logo 合体：滚动归位完成后才显示（避免双 logo） ----
const heroProgress = useState('hero-logo-progress', () => 0)
const logoOpacity = computed(() =>
  isTouchDevice() || prefersReducedMotion() ? 1 : Math.min(1, heroProgress.value),
)

// 滚动后 header 加毛玻璃背景（顶部透明让视频画面透出）
const isScrolled = ref(false)

// scroll-spy：滚动到哪一章，对应导航项显示荧光下横线
const sectionIds = ['manifesto', 'capabilities', 'works', 'contact']
const activeId = ref('')

function onScroll() {
  isScrolled.value = window.scrollY > 16
  // 当前章节：章节顶部越过视口中线即激活
  let current = ''
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
      current = id
    }
  }
  activeId.value = current
}

onMounted(() => {
  // 禁用浏览器滚动位置恢复：进入页面从顶部开始，header 恒透明直到用户实际滚动
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="u-container header__inner">
      <!-- 小 logo 左上：滚动中隐藏，Hero 大 logo 归位到位后显现（合体） -->
      <NuxtLink to="/" class="header__logo" aria-label="回到首页">
        <img :src="logoSrc" alt="XCCX" class="header__logo-img" :style="{ opacity: logoOpacity }" />
      </NuxtLink>

      <nav class="header__nav" aria-label="主导航">
        <NuxtLink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="header__link u-monolabel"
          :class="{ 'header__link--active': activeId === item.to.slice(1) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  /* 恒透明：导航始终无底色（全站 CRT 罩透出） */
  background: transparent;
  border-bottom: 1px solid var(--c-line);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
  /* B 档（对比选定）：logo 左侧边距 32px，右侧保持 gutter */
  padding-left: 2rem;
}

.header__logo {
  display: flex;
  align-items: center;
}

.header__logo-img {
  height: 2.75rem; /* 44px：B 档（六档对比中选定） */
  width: auto;
  display: block;
  /* 与 Hero 大 logo 合体：归位进度驱动显隐 */
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.header__logo:hover .header__logo-img {
  opacity: 0.7;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.header__link {
  position: relative;
  padding-block: 0.25rem;
  color: var(--c-muted);
}

.header__link:hover {
  color: var(--c-ink);
}

.header__link--active {
  color: var(--c-ink);
}

.header__link--active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--c-accent);
}

/* ---- 移动端：隐藏导航（汉堡菜单后续迭代） ---- */
@media (max-width: 640px) {
  .header__nav {
    display: none;
  }
}
</style>
