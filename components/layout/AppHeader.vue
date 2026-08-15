<script setup lang="ts">
// ==================== 顶部导航 ====================
// 固定顶部 + 毛玻璃；导航项来自 data/site.ts
// TODO: M4 后接入滚动进度条 / 汉堡菜单
import { site } from '~/data/site'

// public 静态资源需手动拼接 baseURL（Nuxt 不会自动加前缀）
const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`
</script>

<template>
  <header class="header">
    <div class="u-container header__inner">
      <NuxtLink to="/" class="header__logo" aria-label="回到首页">
        <img :src="logoSrc" alt="XCCX" class="header__logo-img" />
      </NuxtLink>

      <nav class="header__nav" aria-label="主导航">
        <NuxtLink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="header__link u-monolabel"
          active-class="header__link--active"
          exact-active-class="header__link--active"
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
  background: color-mix(in srgb, var(--c-bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-line);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
}

.header__logo {
  display: flex;
  align-items: center;
}

.header__logo-img {
  height: 1.6rem;
  width: auto;
  display: block;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
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
