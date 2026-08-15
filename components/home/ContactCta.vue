<script setup lang="ts">
// ==================== 结尾 CTA ====================
// mailto 引导 + 社交链接
import { site } from '~/data/site'
</script>

<template>
  <section class="cta">
    <div class="u-container cta__inner">
      <h2 class="cta__title">
        有想法？
        <br />
        写信给我
      </h2>

      <a :href="`mailto:${site.email}`" class="cta__mail">
        {{ site.email }}
      </a>

      <nav class="cta__social" aria-label="社交链接">
        <a
          v-for="item in site.social"
          :key="item.label"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          class="cta__social-link u-monolabel"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.cta {
  border-top: 1px solid var(--c-line);
}

.cta__inner {
  padding-block: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
}

.cta__title {
  font-size: var(--fs-h1);
}

.cta__mail {
  font-size: var(--fs-h3);
  color: var(--c-accent);
  border-bottom: 1px solid var(--c-accent);
  padding-bottom: 2px;
}

.cta__mail:hover {
  color: var(--c-ink);
  border-color: var(--c-ink);
}

.cta__social {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.cta__social-link {
  color: var(--c-muted);
}

.cta__social-link:hover {
  color: var(--c-accent);
}
</style>
