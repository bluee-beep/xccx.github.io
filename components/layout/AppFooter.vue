<script setup lang="ts">
// ==================== 页脚 ====================
// 年份 + 社交链接 + mailto，全部来自 data/site.ts
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="u-container footer__inner">
      <p class="footer__copy u-mono">© {{ year }} {{ site.name }}</p>

      <nav class="footer__links" aria-label="社交链接">
        <a
          v-for="item in site.social"
          :key="item.label"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link u-monolabel"
        >
          {{ item.label }}
        </a>
        <a :href="`mailto:${site.email}`" class="footer__link u-monolabel footer__link--mail">
          {{ site.email }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--c-line);
  padding-block: var(--space-5);
  margin-top: var(--space-8);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.footer__copy {
  color: var(--c-muted);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}

.footer__link {
  color: var(--c-muted);
}

.footer__link:hover {
  color: var(--c-accent);
}

.footer__link--mail {
  color: var(--c-ink);
}
</style>
