<script setup lang="ts">
// ==================== 首屏 Hero ====================
// 全屏居中：名字逐字入场 + 定位 + 滚动提示
import { site } from '~/data/site'
</script>

<template>
  <section class="hero">
    <div class="u-container hero__inner">
      <p v-reveal class="hero__eyebrow u-monolabel">{{ site.tagline }}</p>
      <h1 class="hero__name">
        <RevealText>{{ site.name }}</RevealText>
      </h1>
      <p v-reveal="{ delay: 200 }" class="hero__sub">
        欢迎来到我的站点 — 这里记录思考、作品与成长。
      </p>
    </div>

    <!-- 滚动提示 -->
    <div v-reveal="{ delay: 400 }" class="hero__scroll u-monolabel" aria-hidden="true">
      Scroll to enter
      <span class="hero__scroll-arrow">↓</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--c-line);
}

.hero__inner {
  padding-block: var(--space-8);
}

.hero__eyebrow {
  color: var(--c-accent);
  margin-bottom: var(--space-4);
}

.hero__name {
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  line-height: var(--lh-display);
}

.hero__sub {
  margin-top: var(--space-5);
  max-width: 30rem;
  color: var(--c-muted);
}

.hero__scroll {
  position: absolute;
  bottom: var(--space-5);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--c-muted);
  font-size: var(--fs-label);
}

.hero__scroll-arrow {
  color: var(--c-accent);
  font-size: 1rem;
}
</style>
