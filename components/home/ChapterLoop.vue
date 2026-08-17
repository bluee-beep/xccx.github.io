<script setup lang="ts">
// ==================== 章节序列渲染器 ====================
// v-for 章节；Nº001(Intro) → Nº002 之间插入滚动衔接过渡（圆弧覆盖 + 上一章模糊）
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapters: ChapterItem[] }>()

// 章节背景色映射（与 ChapterSection 的变体样式一致）
const waveColorOf = (c: ChapterItem) =>
  c.variant === 'intro' ? '#969da4'
  : c.variant === 'feature' ? '#0a0a0a'
  : c.id === 'works' ? '#969da4'
  : '#0a0a0a'
</script>

<template>
  <template v-for="(chapter, i) in chapters" :key="chapter.id">
    <!-- 2→3 过渡已改为条带刷色：挂在 Nº002 章节内部底部（overlayColor，见 ChapterSection） -->
    <ChapterSection
      :chapter="chapter"
      :overlay-color="chapter.id === 'capabilities' ? '#969da4' : undefined"
    />
    <!-- 衔接过渡：Nº001(Intro) → Nº002 之间（圆弧覆盖 + 模糊） -->
    <ChapterTransition
      v-if="chapter.variant === 'intro' && i < chapters.length - 1"
      :color="waveColorOf(chapters[i + 1])"
      :from-color="waveColorOf(chapter)"
      :prev-id="chapter.id"
    />
  </template>
</template>
