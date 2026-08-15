<script setup lang="ts">
// ==================== 关于我：四大板块框架 ====================
// 1 基本信息（姓名/联系方式/学校专业） 2 教育背景与技能
// 3 项目经历（占位） 4 个人特长、兴趣爱好
import { profile } from '~/data/profile'
import { site } from '~/data/site'

useSeo({ title: '关于我' })

const basicRows = [
  { label: '学校', value: profile.basic.school },
  { label: '专业', value: profile.basic.major },
  { label: '邮箱', value: site.email },
]
</script>

<template>
  <div class="about">
    <!-- 页首：名字 + 定位 -->
    <section class="about__hero">
      <div class="u-container">
        <p v-reveal class="about__eyebrow u-monolabel">About</p>
        <h1 v-reveal="{ delay: 100 }" class="about__name">
          <RevealText>{{ profile.name }}</RevealText>
        </h1>
        <p v-reveal="{ delay: 200 }" class="about__role u-monolabel">{{ profile.role }}</p>
      </div>
    </section>

    <!-- Bio -->
    <section class="about__section">
      <div class="u-container about__bio">
        <p v-for="(para, i) in profile.bio" :key="para" v-reveal="{ delay: i * 120 }" class="about__para">
          {{ para }}
        </p>
      </div>
    </section>

    <!-- ============ 板块一：基本信息 ============ -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Nº01 基本信息</h2>
        <dl class="about__basic">
          <div v-for="row in basicRows" :key="row.label" v-reveal class="about__basic-row">
            <dt class="about__basic-label u-monolabel">{{ row.label }}</dt>
            <dd class="about__basic-value">{{ row.value }}</dd>
          </div>
          <!-- 社交链接行 -->
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

    <!-- ============ 板块二：教育背景与技能 ============ -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Nº02 教育背景与技能</h2>

        <!-- 教育时间线 -->
        <ol class="about__timeline">
          <li v-for="item in profile.education" :key="item.year" v-reveal class="about__timeline-item">
            <span class="about__timeline-year u-mono">{{ item.year }}</span>
            <div class="about__timeline-body">
              <h3 class="about__timeline-title">{{ item.school }} · {{ item.degree }}</h3>
              <p class="about__timeline-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ol>

        <!-- 技能矩阵 -->
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

    <!-- ============ 板块三：项目经历（先空着） ============ -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Nº03 项目经历</h2>

        <div v-if="profile.projects.length" class="about__projects">
          <article v-for="p in profile.projects" :key="p.title" v-reveal class="about__project">
            <h3 class="about__project-title">{{ p.title }}</h3>
            <p class="about__project-desc">{{ p.desc }}</p>
          </article>
        </div>
        <!-- 空状态占位 -->
        <div v-else v-reveal class="about__empty">
          <p class="about__empty-text">项目整理中 · 稍后展出</p>
          <p class="about__empty-hint u-monolabel">Projects coming soon</p>
        </div>
      </div>
    </section>

    <!-- ============ 板块四：个人特长、兴趣爱好 ============ -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Nº04 特长与兴趣</h2>

        <ul class="about__interests">
          <li v-for="item in profile.interests" :key="item.name" v-reveal class="about__interest">
            <h3 class="about__interest-name">{{ item.name }}</h3>
            <p class="about__interest-desc">{{ item.desc }}</p>
          </li>
        </ul>
      </div>
    </section>

    <ContactCta />
  </div>
</template>

<style scoped>
.about__hero {
  padding-block: var(--space-8) var(--space-7);
  border-bottom: 1px solid var(--c-line);
}

.about__eyebrow {
  color: var(--c-accent);
  margin-bottom: var(--space-4);
}

.about__name {
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
}

.about__role {
  margin-top: var(--space-4);
  color: var(--c-muted);
}

.about__section {
  border-bottom: 1px solid var(--c-line);
  padding-block: var(--space-7);
}

.about__para {
  max-width: 36rem;
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

.about__heading {
  color: var(--c-muted);
  margin-bottom: var(--space-5);
}

/* ---- 板块一：基本信息 ---- */
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
  color: var(--c-ink);
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

/* ---- 板块二：教育时间线 ---- */
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
  font-size: var(--fs-h3);
  margin-bottom: var(--space-1);
}

.about__timeline-desc {
  color: var(--c-muted);
  font-size: 0.95em;
}

/* ---- 板块二：技能矩阵 ---- */
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
  padding: 0.35rem 0.9rem;
  font-size: 0.9em;
  color: var(--c-ink);
}

.about__skill-chip:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

/* ---- 板块三：项目经历空状态 ---- */
.about__empty {
  border: 1px dashed var(--c-line);
  border-radius: 8px;
  padding: var(--space-7);
  text-align: center;
}

.about__empty-text {
  color: var(--c-ink);
  margin-bottom: var(--space-2);
}

.about__empty-hint {
  color: var(--c-muted);
  font-size: var(--fs-label);
}

/* ---- 板块四：特长兴趣 ---- */
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
  font-size: var(--fs-h3);
  margin-bottom: var(--space-2);
}

.about__interest-desc {
  color: var(--c-muted);
  font-size: 0.95em;
}
</style>
