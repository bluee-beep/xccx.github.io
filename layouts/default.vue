<script setup lang="ts">
// ==================== 全局壳层 ====================
// Header/Footer 正式组件在 M2 接入，此处先留占位
</script>

<template>
  <div class="layout">
    <header class="layout__header">
      <NuxtLink to="/">XCCX</NuxtLink>
    </header>

    <main class="layout__main">
      <slot />
    </main>

    <footer class="layout__footer">© 2026 Xccx</footer>
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
