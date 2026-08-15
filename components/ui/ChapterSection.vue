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

      <!-- 大标题：常规章节逐行拆字；intro 章节用 XCCX logo 滚动字幕 -->
      <h2 v-if="chapter.variant !== 'intro'" class="chapter__title">
        <RevealText
          v-for="line in chapter.title"
          :key="line"
          class="chapter__title-line"
        >
          {{ line }}
        </RevealText>
      </h2>
      <LogoMarquee v-else class="chapter__logo-marquee" />

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

/* feature 变体（capabilities）：灰色背景 + 动态扫描线，文字转深色 */
.chapter--feature {
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px),
    #b8b8ba;
  animation: chapter-feature-scan 0.8s linear infinite;
  border-top-color: #a3a3a6;
}

@keyframes chapter-feature-scan {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}

.chapter--feature .chapter__title {
  color: var(--c-bg);
}

.chapter--feature .chapter__kicker {
  color: var(--c-bg);
}

.chapter--feature .chapter__no {
  color: #3d6b14;
}

.chapter--feature .chapter__stat-value {
  color: #3d6b14;
}

.chapter--feature .chapter__stat-label {
  color: var(--c-bg);
}

/* 滑动入场：feature 内容从右滑入（替换上移淡入） */
.chapter--feature .v-reveal--hidden {
  transform: translateX(60px);
}

/* Intro 变体：整章底色（用户选定）+ 动态 CRT 扫描线条纹，文字转深色 */
.chapter--intro {
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px),
    #969da4; /* 用户选定底色 */
  border-top-color: #82898f;
  /* 扫描线下移（4px = 一个条纹周期，无缝循环）——B 档：细 2px + 中速 0.8s */
  animation: crt-scan 0.8s linear infinite;
}

@keyframes crt-scan {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}

/* 眉题行：加大加粗 + 深色高对比；无上线；下 margin 归零让字幕紧贴 */
.chapter--intro .chapter__head {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0;
}

.chapter--intro .chapter__title {
  color: var(--c-bg);
}

.chapter--intro .chapter__kicker {
  color: var(--c-bg); /* 深黑 */
}

.chapter--intro .chapter__no {
  color: #3d6b14; /* 深绿，浅底可读 */
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

/* intro 章节：logo 字幕全宽贴边，只保留下边线（第二条线） */
.chapter__logo-marquee {
  margin-inline: calc(-1 * var(--gutter));
  margin-top: 0; /* 紧贴眉题行 */
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--c-ink);
  padding-block: var(--space-2);
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

/* feature 变体（capabilities）：右栏左对齐 + 大一号 */
.chapter--feature .chapter__para {
  max-width: 60vw;
  margin-left: auto; /* 右栏 */
  text-align: left; /* 左对齐 */
  font-size: clamp(1.2rem, 1.8vw, 1.5rem); /* 大一号 */
  line-height: 1.6;
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
