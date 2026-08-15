<script setup lang="ts">
// ==================== 章节容器 ====================
// 数据驱动渲染单条 ChapterItem：Nº 编号 + 眉题 + 大标题 + 段落 + stats
// M4 将接入入场动效（此处先静态）
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapter: ChapterItem }>()
</script>

<template>
  <section :id="chapter.id" class="chapter" :class="`chapter--${chapter.variant ?? 'default'}`">
    <div class="u-container">
      <!-- 章节眉题行 -->
      <header v-reveal class="chapter__head">
        <span class="chapter__no u-monolabel">{{ chapter.no }}</span>
        <span class="chapter__kicker u-monolabel">{{ chapter.kicker }}</span>
      </header>

      <!-- 大标题：逐行拆字入场 -->
      <h2 class="chapter__title">
        <RevealText
          v-for="line in chapter.title"
          :key="line"
          class="chapter__title-line"
        >
          {{ line }}
        </RevealText>
      </h2>

      <!-- 正文：逐段错峰入场 -->
      <p
        v-for="(para, i) in chapter.paragraphs"
        :key="para"
        v-reveal="{ delay: i * 120 }"
        class="chapter__para"
      >
        {{ para }}
      </p>

      <!-- 数字条目 -->
      <dl v-if="chapter.stats" v-reveal class="chapter__stats">
        <div v-for="stat in chapter.stats" :key="stat.label" class="chapter__stat">
          <dt class="chapter__stat-value">{{ stat.value }}</dt>
          <dd class="chapter__stat-label u-monolabel">{{ stat.label }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.chapter {
  padding-block: var(--space-8);
  border-top: 1px solid var(--c-line);
}

/* 强调变体：浅色浮起背景 */
.chapter--feature {
  background: var(--c-bg-raised);
}

.chapter__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.chapter__no {
  color: var(--c-accent);
}

.chapter__kicker {
  color: var(--c-muted);
}

/* 眉题行右侧延伸的分隔线 */
.chapter__kicker::after {
  content: '';
  display: inline-block;
  width: clamp(2rem, 10vw, 8rem);
  height: 1px;
  margin-left: var(--space-3);
  background: var(--c-line);
  vertical-align: middle;
}

.chapter__title {
  display: flex;
  flex-direction: column;
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  margin-bottom: var(--space-6);
}

.chapter__para {
  max-width: 36rem;
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

.chapter__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: var(--space-5);
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--c-line);
}

.chapter__stat-value {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: var(--ls-tight);
  line-height: 1;
  color: var(--c-accent);
}

.chapter__stat-label {
  margin-top: var(--space-1);
  color: var(--c-muted);
}
</style>
