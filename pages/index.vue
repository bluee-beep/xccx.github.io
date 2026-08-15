<script setup lang="ts">
// ==================== 首页（单页整合版） ====================
// Hero 视频取景 → 章节叙事 → 关于内容（原 /about 并入）→ 联系 CTA
import { chapters } from '~/data/chapters'

useSeo()
</script>

<template>
  <div>
    <HeroSection />
    <ChapterLoop :chapters="chapters" />
    <AboutSections />
    <ContactCta />
  </div>
</template>
