<script setup lang="ts">
// ==================== 关于内容（整合进首页） ====================
// 原 /about 页的全部板块：bio / 基本信息 / 教育技能 / 项目 / 特长
// 数据驱动（data/profile.ts + data/site.ts）
import { profile } from '~/data/profile'
import { site } from '~/data/site'

const basicRows = [
  { label: '学校', value: profile.basic.school },
  { label: '专业', value: profile.basic.major },
  { label: '邮箱', value: site.email },
]
</script>

<template>
  <div class="about">
    <!-- 基本信息 -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">基本信息</h2>
        <dl class="about__basic">
          <div v-for="row in basicRows" :key="row.label" v-reveal class="about__basic-row">
            <dt class="about__basic-label u-monolabel">{{ row.label }}</dt>
            <dd class="about__basic-value">{{ row.value }}</dd>
          </div>
          <div v-reveal class="about__basic-row">
            <dt class="about__basic-label u-monolabel">社交</dt>
            <dd class="about__basic-value">
              <span class="about__social">
                <a
                  v-for="item in site.social"
                  :key="item.label"
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="about__social-link"
                >
                  {{ item.label }}
                </a>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- 教育背景与技能 -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">教育背景与技能</h2>
        <ol class="about__timeline">
          <li v-for="item in profile.education" :key="item.year" v-reveal class="about__timeline-item">
            <span class="about__timeline-year u-mono">{{ item.year }}</span>
            <div class="about__timeline-body">
              <h3 class="about__timeline-title">{{ item.school }} · {{ item.degree }}</h3>
              <p class="about__timeline-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ol>
        <div class="about__skills">
          <div v-for="group in profile.skills" :key="group.category" v-reveal class="about__skill-group">
            <h3 class="about__skill-category u-monolabel">{{ group.category }}</h3>
            <ul class="about__skill-list">
              <li v-for="skill in group.skills" :key="skill" class="about__skill-chip">
                {{ skill }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目经历（空状态） -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">项目经历</h2>
        <div v-if="profile.projects.length" class="about__projects">
          <article v-for="p in profile.projects" :key="p.title" v-reveal class="about__project">
            <h3 class="about__project-title">{{ p.title }}</h3>
            <p class="about__project-desc">{{ p.desc }}</p>
          </article>
        </div>
        <div v-else v-reveal class="about__empty">
          <p class="about__empty-text">项目整理中 · 稍后展出</p>
          <p class="about__empty-hint u-monolabel">Projects coming soon</p>
        </div>
      </div>
    </section>

    <!-- 特长与兴趣 -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">特长与兴趣</h2>
        <ul class="about__interests">
          <li v-for="item in profile.interests" :key="item.name" v-reveal class="about__interest">
            <h3 class="about__interest-name">{{ item.name }}</h3>
            <p class="about__interest-desc">{{ item.desc }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 与 Intro 章节同款：灰蓝底 + 动态扫描线 */
.about {
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px),
    #969da4;
  animation: about-scan 0.8s linear infinite;
  border-block: 1px solid #82898f;
}

@keyframes about-scan {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}

.about__section {
  padding-block: var(--space-7);
  border-top: 1px solid rgba(0, 0, 0, 0.2); /* 浅底分隔线 */
}

.about__section:first-child {
  border-top: none;
}

/* 右栏化（Intro 展示页文字样式） */
.about__section :deep(.u-container) {
  max-width: 60vw;
  margin-left: auto;
}

/* 段落：Intro 风格——大字号、左对齐、深色（灰蓝底上） */
.about__para {
  color: var(--c-bg);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  line-height: 1.6;
  text-align: left;
  margin-bottom: var(--space-4);
}

/* 标题：Intro 眉题风格——1.4rem 粗体深色 */
.about__heading {
  color: var(--c-bg);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-5);
}

/* ---- 基本信息 ---- */
.about__basic {
  max-width: 40rem;
}

.about__basic-row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: var(--space-4);
  padding-block: var(--space-3);
  border-bottom: 1px dashed var(--c-line);
}

.about__basic-row:last-child {
  border-bottom: none;
}

.about__basic-label {
  color: var(--c-muted);
  padding-top: 0.25rem;
}

.about__basic-value {
  color: var(--c-bg);
  font-size: 1.25rem;
}

.about__social {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.about__social-link {
  color: var(--c-muted);
}

.about__social-link:hover {
  color: var(--c-accent);
}

/* ---- 教育时间线 ---- */
.about__timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin-bottom: var(--space-7);
}

.about__timeline-item {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px dashed var(--c-line);
}

.about__timeline-item:last-child {
  border-bottom: none;
}

.about__timeline-year {
  color: var(--c-accent);
  font-size: var(--fs-label);
  padding-top: 0.35rem;
}

.about__timeline-title {
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  margin-bottom: var(--space-1);
}

.about__timeline-desc {
  color: var(--c-muted);
  font-size: 1.1rem;
}

/* ---- 技能 ---- */
.about__skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--space-6);
}

.about__skill-category {
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

.about__skill-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.about__skill-chip {
  border: 1px solid var(--c-line);
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-size: 1.15rem;
}

.about__skill-chip:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

/* ---- 项目空状态 ---- */
.about__empty {
  border: 1px dashed var(--c-line);
  border-radius: 8px;
  padding: var(--space-7);
  text-align: center;
}

.about__empty-text {
  color: var(--c-bg);
  margin-bottom: var(--space-2);
}

.about__empty-hint {
  color: var(--c-muted);
  font-size: var(--fs-label);
}

/* ---- 特长兴趣 ---- */
.about__interests {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--space-5);
}

.about__interest {
  border: 1px solid var(--c-line);
  border-radius: 8px;
  padding: var(--space-4);
}

.about__interest-name {
  color: var(--c-bg);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  margin-bottom: var(--space-2);
}

.about__interest-desc {
  color: var(--c-muted);
  font-size: 1.15rem;
}
</style>
