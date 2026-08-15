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

      <!-- 正文：intro 变体整章连续逐字显现；其余逐段错峰入场 -->
      <IntroReveal v-if="chapter.variant === 'intro'" :paragraphs="chapter.paragraphs" />
      <template v-else>
        <p v-for="(para, i) in chapter.paragraphs" :key="para" v-reveal="{ delay: i * 120 }" class="chapter__para">
          {{ para }}
        </p>
      </template>

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

/* Intro 变体：整章底色（用户选定）+ 动态 CRT 扫描线条纹，文字转深色 */
.chapter--intro {
  background:
    repeating-linear-gradient(to bottom, transparent 0 4px, rgba(0, 0, 0, 0.16) 4px 8px),
    #e9e8e4; /* TODO: 底色待用户选定 */
  border-top-color: #d5d4cf;
  /* 扫描线缓慢下移（8px = 一个条纹周期，无缝循环） */
  animation: crt-scan 1.4s linear infinite;
}

@keyframes crt-scan {
  from { background-position: 0 0; }
  to { background-position: 0 8px; }
}

.chapter--intro .chapter__title {
  color: var(--c-bg);
}

.chapter--intro .chapter__kicker {
  color: #6a6a66;
}

.chapter--intro .chapter__no {
  color: #4a7a1a; /* accent 深化，浅底可读 */
}

.chapter__head {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 眉题行在左（放大版） */
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  font-size: 1.1rem; /* 放大（覆盖 u-monolabel 的 0.75rem） */
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
  align-items: flex-end; /* 标题行靠右 */
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  margin-bottom: var(--space-6);
}

.chapter__para {
  max-width: 36rem;
  margin-left: auto; /* 段落靠右 */
  text-align: right;
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

/* 引言变体：intro 段落加大字号 */
.chapter--intro .chapter__para {
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  line-height: 1.6;
  color: var(--c-ink);
}

.chapter__stats {
  display: flex;
  justify-content: flex-end; /* stats 靠右 */
  flex-wrap: wrap;
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
