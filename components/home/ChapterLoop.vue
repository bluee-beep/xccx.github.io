<script setup lang="ts">
// ==================== 章节序列渲染器 ====================
// 只做 v-for：章节是数据（data/chapters.ts），新增模块不改结构
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapters: ChapterItem[] }>()
</script>

<template>
  <ChapterSection v-for="chapter in chapters" :key="chapter.id" :chapter="chapter" />
</template>
