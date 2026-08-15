<script setup lang="ts">
// ==================== 首页 → 关于页 过渡衔接区 ====================
// 首页底部「下一站」引导：滚动到页尾自然过渡，点击进入关于页
</script>

<template>
  <section class="next">
    <div class="u-container next__inner">
      <NuxtLink to="/about" class="next__link">
        <span class="next__kicker u-monolabel">Next Station</span>
        <span class="next__title">
          下一站 · 关于我
          <span class="next__arrow" aria-hidden="true">→</span>
        </span>
        <span class="next__hint u-monolabel">About — 基本信息 / 教育技能 / 项目 / 特长</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.next {
  border-top: 1px solid var(--c-line);
  padding-block: var(--space-8);
}

.next__inner {
  display: flex;
  justify-content: center;
}

.next__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
}

.next__kicker {
  color: var(--c-muted);
}

.next__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-tight);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--c-ink);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.next__arrow {
  color: var(--c-accent);
  transition: transform var(--dur-base) var(--ease-out-expo);
}

.next__hint {
  color: var(--c-muted);
  font-size: var(--fs-label);
}

/* hover：标题变荧光 + 箭头滑出 */
.next__link:hover .next__title {
  color: var(--c-accent);
}

.next__link:hover .next__arrow {
  transform: translateX(0.75rem);
}
</style>
