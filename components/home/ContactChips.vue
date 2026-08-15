<script setup lang="ts">
// ==================== 联系方式图标胶囊（Nº004 章节下方） ====================
// 图标常态显示，hover 切换对应信息；微信 hover 浮出二维码
defineProps<{
  contacts: { icon: string; label: string; value: string; qr?: string }[]
}>()

const baseURL = useRuntimeConfig().app.baseURL
</script>

<template>
  <div class="cc" v-reveal>
    <div v-for="c in contacts" :key="c.label" class="cc__contact" :title="c.label">
      <!-- 微信：纯文字标识（hover 浮出二维码）；其余：图标 -->
      <span v-if="c.qr" class="cc__label">{{ c.value }}</span>
      <span v-else class="cc__icon">
        <img :src="`${baseURL}icons/${c.icon}.svg`" :alt="c.label" />
      </span>
      <span v-if="!c.qr" class="cc__value">{{ c.value }}</span>
      <!-- 微信：hover 浮出二维码卡片 -->
      <span v-if="c.qr" class="cc__qr">
        <img :src="`${baseURL}icons/${c.qr}.jpg`" :alt="`${c.label}二维码`" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.cc {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: flex-end; /* 与章节标题右对齐一致 */
  margin-bottom: var(--space-6);
}

.cc__contact {
  position: relative;
  min-width: 6rem;
  height: 3.75rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  /* 无外框、无 overflow 裁剪（二维码浮层在胶囊外） */
}

/* 微信纯文字标识 */
.cc__label {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: var(--c-ink);
}

.cc__icon {
  display: grid;
  place-items: center;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
}

.cc__icon img {
  height: 1.9rem;
  width: auto;
  display: block;
}

/* 微信二维码浮层：hover 时从胶囊上方浮出 */
.cc__qr {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
  z-index: 10;
}

.cc__qr img {
  width: 320px; /* 20rem */
  max-width: none;
  height: auto;
  display: block;
  border-radius: 8px;
}

.cc__contact:hover .cc__qr {
  opacity: 1;
}

/* 信息层：默认隐藏，hover 时替换图标 */
.cc__value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  color: var(--c-accent);
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
  padding-inline: var(--space-2);
  text-align: center;
}

.cc__contact:hover .cc__icon {
  opacity: 0;
}

.cc__contact:hover .cc__value {
  opacity: 1;
}
</style>
