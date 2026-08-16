<script setup lang="ts">
// ==================== 页脚 ====================
// 简洁页脚：版权 + 社交链接（大 logo 拖尾已独立为 FooterTrail 区块）
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="u-container footer__inner">
      <p class="footer__copy u-mono">© {{ year }} {{ site.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  /* 边界横线已取消：页脚与拖尾区无缝衔接 */
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-block: var(--space-5);
}

.footer__copy {
  color: var(--c-muted);
}
</style>
