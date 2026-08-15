<script setup lang="ts">
// ==================== 首页 ====================
// Hero 首屏 → 数据驱动章节序列 → 结尾 CTA
// M4 接入动效（Lenis / v-reveal / RevealText）
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
