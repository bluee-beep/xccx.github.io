<script setup lang="ts">
// ==================== 全局壳层 ====================
// Header/Footer 正式组件；Lenis 平滑滚动在此初始化
useLenis()
</script>

<template>
  <div class="layout">
    <AppHeader />

    <main class="layout__main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
}
</style>
