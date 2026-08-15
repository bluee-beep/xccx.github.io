<script setup lang="ts">
// ==================== 章节序列渲染器 ====================
// v-for 章节；Nº001(Intro) → Nº002 之间插入滚动衔接过渡（圆弧覆盖 + 上一章模糊）
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapters: ChapterItem[] }>()

// 章节背景色映射（与 ChapterSection 的变体样式一致）
const waveColorOf = (c: ChapterItem) =>
  c.variant === 'intro' ? '#969da4'
  : c.variant === 'feature' ? '#0a0a0a'
  : c.id === 'works' ? '#141c28'
  : '#0a0a0a'
</script>

<template>
  <template v-for="(chapter, i) in chapters" :key="chapter.id">
    <ChapterSection :chapter="chapter" />
    <!-- 衔接过渡：Nº001(Intro) → Nº002 之间 -->
    <ChapterTransition
      v-if="chapter.variant === 'intro' && i < chapters.length - 1"
      :color="waveColorOf(chapters[i + 1])"
      :from-color="waveColorOf(chapter)"
      :prev-id="chapter.id"
    />
    <!-- 简单过渡：Nº002 → Nº003 之间（椭圆黑色） -->
    <ChapterTransition
      v-if="chapter.id === 'capabilities' && i < chapters.length - 1"
      color="#0a0a0a"
      :from-color="waveColorOf(chapter)"
      :prev-id="chapter.id"
    />
  </template>
</template>
