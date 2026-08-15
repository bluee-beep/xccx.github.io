<script setup lang="ts">
// ==================== 关于我 ====================
// 数据驱动（data/profile.ts）：定位 → bio → 时间线 → 技能 → 联系
import { profile } from '~/data/profile'

useSeo({ title: '关于我' })
</script>

<template>
  <div class="about">
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

    <!-- 时间线 -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Timeline</h2>
        <ol class="about__timeline">
          <li v-for="item in profile.timeline" :key="item.year" v-reveal class="about__timeline-item">
            <span class="about__timeline-year u-mono">{{ item.year }}</span>
            <div class="about__timeline-body">
              <h3 class="about__timeline-title">{{ item.title }}</h3>
              <p class="about__timeline-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- 技能 -->
    <section class="about__section">
      <div class="u-container">
        <h2 v-reveal class="about__heading u-monolabel">— Skills</h2>
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

/* ---- 时间线 ---- */
.about__timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
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
  padding: 0.35rem 0.9rem;
  font-size: 0.9em;
  color: var(--c-ink);
}

.about__skill-chip:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}
</style>
