<script setup lang="ts">
// ==================== 首页（单页版） ====================
// Hero 视频取景 → 章节叙事（Nº001-Nº004）→ 联系 CTA
import { chapters } from '~/data/chapters'

useSeo()
</script>

<template>
  <div>
    <HeroSection />
    <ChapterLoop :chapters="chapters" />
    <ContactCta />
  </div>
</template>
