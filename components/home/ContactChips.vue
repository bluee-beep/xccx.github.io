<script setup lang="ts">
// ==================== 联系方式图标胶囊（Nº004 章节下方） ====================
// 桌面 hover/focus 切换信息；触屏常显信息，微信点击展开二维码
import type { ContactItem } from '~/data/chapters'

defineProps<{ contacts: ContactItem[] }>()

const baseURL = useRuntimeConfig().app.baseURL
const activeQr = ref<string | null>(null)

function contactHref(contact: ContactItem) {
  return contact.qr ? undefined : contact.href
}

function contactTag(contact: ContactItem) {
  if (contact.qr) return 'button'
  return contactHref(contact) ? 'a' : 'div'
}

function toggleQr(label: string) {
  activeQr.value = activeQr.value === label ? null : label
}

// 智能翻转：胶囊靠近视口顶部时二维码向下浮出
function flipQr(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  el.classList.toggle('cc__contact--down', rect.top < 400)
}
</script>

<template>
  <div class="cc" v-reveal>
    <component
      :is="contactTag(c)"
      v-for="c in contacts"
      :key="c.label"
      class="cc__contact"
      :class="{
        'cc__contact--qr': c.qr,
        'cc__contact--open': activeQr === c.label,
      }"
      :href="contactHref(c)"
      :type="c.qr ? 'button' : undefined"
      :tabindex="!c.qr && !contactHref(c) ? 0 : undefined"
      :title="c.label"
      :aria-label="c.qr ? `${c.label}：点击查看二维码` : c.label"
      :aria-expanded="c.qr ? activeQr === c.label : undefined"
      @mouseenter="c.qr && flipQr($event)"
      @click="c.qr && toggleQr(c.label)"
      @keydown.esc="activeQr = null"
    >
      <!-- 微信：纯文字标识（hover 浮出二维码）；其余：图标 -->
      <span v-if="c.qr" class="cc__label">{{ c.value }}</span>
      <span v-else class="cc__icon">
        <img :src="`${baseURL}icons/${c.icon}.svg`" :alt="c.label" />
      </span>
      <span v-if="!c.qr" class="cc__value">{{ c.value }}</span>
      <!-- 微信：桌面 hover/focus、触屏点击后浮出二维码卡片 -->
      <span v-if="c.qr" class="cc__qr">
        <img :src="`${baseURL}icons/${c.qr}.jpg`" :alt="`${c.label}二维码`" loading="lazy" />
      </span>
    </component>
  </div>
</template>

<style scoped>
.cc {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5); /* 胶囊间隔加大 */
  justify-content: flex-start; /* 左对齐 */
  margin-top: 0;
  margin-bottom: var(--space-6); /* 与下方段落拉开，文字完整可见 */
}

.cc__contact {
  position: relative;
  min-width: 8rem;
  height: 3.75rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  border: 0;
  background: transparent;
  text-decoration: none;
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
  width: min(20rem, calc(100vw - 2 * var(--gutter)));
  max-width: none;
  height: auto;
  display: block;
  border-radius: 8px;
}

.cc__contact--open .cc__qr {
  opacity: 1;
}

/* 智能翻转：胶囊靠近视口顶部 → 二维码向下浮出 */
.cc__contact--down .cc__qr {
  bottom: auto;
  top: calc(100% + 0.75rem);
}

/* 信息层：默认隐藏，hover 时替换图标 */
.cc__value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.85rem; /* 稍小适配网址 */
  white-space: nowrap;
  color: var(--c-accent);
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
  padding-inline: var(--space-2);
  text-align: center;
}

@media (hover: hover) {
  .cc__contact:hover .cc__qr,
  .cc__contact:focus-visible .cc__qr {
    opacity: 1;
  }

  .cc__contact:hover .cc__icon,
  .cc__contact:focus-visible .cc__icon {
    opacity: 0;
  }

  .cc__contact:hover .cc__value,
  .cc__contact:focus-visible .cc__value {
    opacity: 1;
  }
}

@media (max-width: 48rem), (hover: none) {
  .cc {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
    width: 100%;
    margin-bottom: var(--space-5);
  }

  .cc__contact {
    grid-template-rows: auto auto;
    gap: var(--space-1);
    width: 100%;
    min-width: 0;
    min-height: 5rem;
    height: auto;
    padding: var(--space-2) var(--space-1);
  }

  .cc__contact--qr {
    grid-column: 1 / -1;
  }

  .cc__icon {
    opacity: 1 !important;
  }

  .cc__value {
    position: static;
    opacity: 1;
    color: var(--c-muted);
    font-size: 0.72rem;
    line-height: 1.35;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .cc__contact--qr .cc__qr {
    top: calc(100% + var(--space-1));
    bottom: auto;
  }
}
</style>
