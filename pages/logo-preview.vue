<script setup lang="ts">
// ==================== 临时工具页：logo 尺寸粗选（选定后删除） ====================
useSeo({ title: 'Logo 尺寸预览' })

const baseURL = useRuntimeConfig().app.baseURL
const logoSrc = `${baseURL}logo.svg`

// 候选尺寸（高度，宽按 3:1 自动）：粗选 → 细选
const candidates = [
  { id: 'S', height: 20, desc: '紧凑' },
  { id: 'M', height: 26, desc: '标准' },
  { id: 'L', height: 34, desc: '醒目' },
  { id: 'XL', height: 44, desc: '大' },
  { id: 'XXL', height: 54, desc: '更大' },
  { id: 'XXXL', height: 62, desc: '极限（header 高 72px 余 10px）' },
]
</script>

<template>
  <div class="preview u-container">
    <h1 class="preview__title">Header Logo 尺寸粗选</h1>
    <p class="preview__note u-monolabel">选出最合适的高度，标注 S/M/L/XL，然后告诉我</p>

    <div class="preview__row">
      <div v-for="c in candidates" :key="c.id" class="preview__item">
        <div class="preview__canvas">
          <img :src="logoSrc" :style="{ height: c.height + 'px' }" class="preview__logo" alt="logo" />
        </div>
        <p class="preview__label u-mono">{{ c.id }} · {{ c.height }}px 高 · {{ Math.round(c.height * 3) }}px 宽</p>
        <p class="preview__desc u-monolabel">{{ c.desc }}</p>
      </div>
    </div>

    <p class="preview__hint">当前线上为 M（26px/1.6rem）</p>
  </div>
</template>

<style scoped>
.preview {
  padding-block: var(--space-7) var(--space-8);
}

.preview__title {
  font-size: var(--fs-h1);
  margin-bottom: var(--space-2);
}

.preview__note {
  color: var(--c-muted);
  margin-bottom: var(--space-7);
}

.preview__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
}

.preview__item {
  border: 1px solid var(--c-line);
  border-radius: 8px;
  overflow: hidden;
}

/* 模拟 header 深色条带 */
.preview__canvas {
  display: flex;
  align-items: center;
  background: var(--c-bg-raised);
  padding: var(--space-5);
  min-height: 7rem;
}

.preview__logo {
  width: auto;
  display: block;
}

.preview__label {
  padding: var(--space-3) var(--space-4) 0;
  font-size: var(--fs-label);
}

.preview__desc {
  padding: 0 var(--space-4) var(--space-3);
  color: var(--c-muted);
  font-size: var(--fs-label);
}

.preview__hint {
  margin-top: var(--space-6);
  color: var(--c-muted);
}
</style>
