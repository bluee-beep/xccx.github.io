<script setup lang="ts">
// ==================== 章节序列渲染器 ====================
// v-for 章节；章节之间插入波浪边缘（WaveEdge，颜色 = 下一章节背景色）
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapters: ChapterItem[] }>()

// 章节背景色映射（与 ChapterSection 的变体样式一致）
const waveColorOf = (c: ChapterItem) =>
  c.variant === 'intro' ? '#969da4' : c.variant === 'feature' ? '#b8b8ba' : '#0a0a0a'
</script>

<template>
  <template v-for="(chapter, i) in chapters" :key="chapter.id">
    <ChapterSection :chapter="chapter" />
    <!-- 波浪边缘：仅 Nº001(Intro) → Nº002 之间 -->
    <WaveEdge
      v-if="chapter.variant === 'intro' && i < chapters.length - 1"
      :color="waveColorOf(chapters[i + 1])"
    />
  </template>
</template>
