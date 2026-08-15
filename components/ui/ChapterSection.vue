<script setup lang="ts">
// ==================== 章节容器 ====================
// 数据驱动渲染单条 ChapterItem：Nº 编号 + 眉题 + 大标题 + 段落 + stats
// M4 将接入入场动效（此处先静态）
import type { ChapterItem } from '~/data/chapters'

defineProps<{ chapter: ChapterItem }>()

// 解析「」标记：重点词高亮
function splitHighlight(text: string) {
  return text.split(/(「[^」]*」)/g).map((part) => {
    if (part.startsWith('「') && part.endsWith('」')) {
      return { text: part.slice(1, -1), hl: true }
    }
    return { text: part, hl: false }
  })
}
</script>

<template>
  <section :id="chapter.id" class="chapter" :class="`chapter--${chapter.variant ?? 'default'}`">
    <!-- 动画背景：4 条交错荧光淡色波浪线，彗尾笔迹（feature 变体） -->
    <div v-if="chapter.variant === 'feature'" class="chapter__waves" aria-hidden="true">
      <svg v-for="i in 4" :key="i" class="chapter__wave-line" :class="`chapter__wave-line--${i}`" viewBox="0 0 100 500" preserveAspectRatio="none">
        <defs>
          <!-- 沿路径渐变：尾部（底部）透明 → 前端（顶部）实心，尾部慢慢隐去 -->
          <linearGradient :id="`waveGrad${i}`" gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="20">
            <stop offset="0" stop-color="#d8ff3e" stop-opacity="0" />
            <stop offset="0.35" stop-color="#d8ff3e" stop-opacity="0.12" />
            <stop offset="1" stop-color="#d8ff3e" stop-opacity="0.45" />
          </linearGradient>
        </defs>
        <!-- 2 号线：更扭曲（更多 S 弯） -->
        <path v-if="i === 2" pathLength="1" d="M50,500 C20,460 80,420 50,380 C20,340 80,300 50,260 C20,220 80,180 50,140 C20,100 80,60 50,20" :stroke="`url(#waveGrad${i})`" stroke-width="10" fill="none" />
        <path v-else pathLength="1" d="M50,500 C20,420 80,340 50,260 C20,180 80,100 50,20" :stroke="`url(#waveGrad${i})`" stroke-width="10" fill="none" />
      </svg>
    </div>

    <div class="u-container">
      <!-- 章节眉题行 -->
      <header v-reveal class="chapter__head">
        <span class="chapter__no u-monolabel">{{ chapter.no }}</span>
        <span class="chapter__kicker u-monolabel">{{ chapter.kicker }}</span>
      </header>

      <!-- 大标题：常规章节逐行拆字；intro 用 xccx 字幕；feature 不渲染（文案上移） -->
      <h2 v-if="chapter.variant !== 'intro' && chapter.variant !== 'feature'" class="chapter__title">
        <RevealText
          v-for="line in chapter.title"
          :key="line"
          class="chapter__title-line"
        >
          {{ line }}
        </RevealText>
      </h2>
      <LogoMarquee v-else-if="chapter.variant === 'intro'" class="chapter__logo-marquee" />

      <!-- 正文：intro 变体整章连续逐字显现；其余逐段错峰入场（「」标记重点词高亮） -->
      <IntroReveal v-if="chapter.variant === 'intro'" :paragraphs="chapter.paragraphs" />
      <template v-else>
        <p v-for="(para, i) in chapter.paragraphs" :key="para" v-reveal="{ delay: i * 120 }" class="chapter__para">
          <template v-for="(part, j) in splitHighlight(para)" :key="j">
            <span v-if="part.hl" class="chapter__hl">{{ part.text }}</span>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
      </template>

      <!-- 数字条目 -->
      <dl v-if="chapter.stats" v-reveal class="chapter__stats">
        <div v-for="stat in chapter.stats" :key="stat.label" class="chapter__stat">
          <dt class="chapter__stat-value">{{ stat.value }}</dt>
          <dd class="chapter__stat-label u-monolabel">{{ stat.label }}</dd>
        </div>
      </dl>

      <!-- 章节中央斜体大字背景 -->
      <p v-if="chapter.footer" class="chapter__footer" aria-hidden="true">{{ chapter.footer }}</p>

      <!-- 联系方式图标胶囊：hover 显示对应信息 -->
      <div v-if="chapter.contacts" v-reveal class="chapter__contacts">
        <div v-for="c in chapter.contacts" :key="c.label" class="chapter__contact" :title="c.label">
          <span class="chapter__contact-icon">{{ c.icon }}</span>
          <span class="chapter__contact-value">{{ c.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chapter {
  position: relative;
  padding-block: var(--space-8);
  border-top: 1px solid var(--c-line);
}

/* ---- 动画背景：交错荧光波浪线 ---- */
.chapter__waves {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 内容层在动画线上方 */
.chapter > .u-container {
  position: relative;
  z-index: 1;
}

.chapter__wave-line {
  position: absolute;
  bottom: 0;
  width: 110px;
  height: 85vh;
  /* 线静止：不再整体移动 */
}

/* 4 条线横向分布——全部在文案区（40vw 起）左侧；高度 ×1.5 */
.chapter__wave-line--1 { left: 6vw;  height: 128vh; }
.chapter__wave-line--2 { left: 13vw; height: 300vh; }
.chapter__wave-line--3 { left: 20vw; height: 165vh; }
.chapter__wave-line--4 { left: 27vw; height: 137vh; }

/* 彗尾笔迹：可见窗口（22% 路径长）沿波浪前进——前头画出、后头消散 */
.chapter__wave-line path {
  stroke-dasharray: 0.22 0.78;
  animation: wave-trace 4s linear infinite;
}

/* 4 条交错：延迟加大错开；2 号线生成间隔更慢（12s） */
.chapter__wave-line--1 path { animation-delay: 0s; }
.chapter__wave-line--2 path { animation-delay: 5s; animation-duration: 12s; }
.chapter__wave-line--3 path { animation-delay: 1.5s; }
.chapter__wave-line--4 path { animation-delay: 3.5s; }

@keyframes wave-trace {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; } /* 窗口循环，首尾相接无缝 */
}

/* feature 变体（capabilities）：深色背景，文字浅色（与 Nº001 区分） */
.chapter--feature {
  background: var(--c-bg);
  border-top-color: var(--c-line);
}

.chapter--feature .chapter__title {
  color: var(--c-ink);
}

.chapter--feature .chapter__kicker {
  color: var(--c-ink);
}

.chapter--feature .chapter__no {
  color: var(--c-accent);
}

.chapter--feature .chapter__stat-value {
  color: var(--c-accent);
}

.chapter--feature .chapter__stat-label {
  color: var(--c-muted);
}

/* 滑动入场：feature 内容从右滑入（替换上移淡入） */
.chapter--feature .v-reveal--hidden {
  transform: translateX(60px);
}

/* Intro 变体：整章底色（用户选定）+ 动态 CRT 扫描线条纹，文字转深色 */
.chapter--intro {
  background:
    repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 0, 0, 0.16) 2px 4px),
    #969da4; /* 用户选定底色 */
  border-top-color: #82898f;
  /* 扫描线下移（4px = 一个条纹周期，无缝循环）——B 档：细 2px + 中速 0.8s */
  animation: crt-scan 0.8s linear infinite;
  /* 多留空间：上下内边距加大 */
  padding-block: 12rem;
}

@keyframes crt-scan {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}

/* 眉题行：加大加粗 + 深色高对比；无上线；下 margin 归零让字幕紧贴 */
.chapter--intro .chapter__head {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0;
}

.chapter--intro .chapter__title {
  color: var(--c-bg);
}

.chapter--intro .chapter__kicker {
  color: var(--c-bg); /* 深黑 */
}

.chapter--intro .chapter__no {
  color: #3d6b14; /* 深绿，浅底可读 */
}

.chapter__head {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 眉题行在左（放大版） */
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  font-size: 1.1rem; /* 放大（覆盖 u-monolabel 的 0.75rem） */
}

.chapter__no {
  color: var(--c-accent);
}

.chapter__kicker {
  color: var(--c-muted);
}

/* 眉题行右侧延伸的分隔线 */
.chapter__kicker::after {
  content: '';
  display: inline-block;
  width: clamp(2rem, 10vw, 8rem);
  height: 1px;
  margin-left: var(--space-3);
  background: var(--c-line);
  vertical-align: middle;
}

.chapter__title {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 标题行靠右 */
  font-size: var(--fs-display);
  letter-spacing: var(--ls-display);
  margin-bottom: var(--space-6);
}

/* intro 章节：logo 字幕全宽贴边，只保留下边线（第二条线） */
.chapter__logo-marquee {
  margin-inline: calc(-1 * var(--gutter));
  margin-top: 0; /* 紧贴眉题行 */
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--c-ink);
  padding-block: var(--space-2);
}

.chapter__para {
  max-width: 36rem;
  margin-left: auto; /* 段落靠右 */
  text-align: right;
  color: var(--c-muted);
  margin-bottom: var(--space-3);
}

/* 引言变体：intro 段落加大字号 */
.chapter--intro .chapter__para {
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  line-height: 1.6;
  color: var(--c-ink);
}

/* feature 变体（capabilities）：右栏左对齐 + 大一号；正文调淡衬托高亮 */
.chapter--feature .chapter__para {
  max-width: 60vw;
  margin-left: auto; /* 右栏 */
  text-align: left; /* 左对齐 */
  font-size: clamp(1.2rem, 1.8vw, 1.5rem); /* 大一号 */
  line-height: 1.6;
  color: var(--c-muted); /* 淡灰正文 */
}

/* 重点词高亮：荧光绿（深色底上清晰） */
.chapter__hl {
  color: var(--c-accent);
}

.chapter__stats {
  display: flex;
  justify-content: flex-end; /* stats 靠右 */
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--c-line);
}

.chapter__stat-value {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: var(--ls-tight);
  line-height: 1;
  color: var(--c-accent);
}

.chapter__stat-label {
  margin-top: var(--space-1);
  color: var(--c-muted);
}

/* ---- 联系方式图标胶囊 ---- */
.chapter__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
  justify-content: flex-end; /* 与段落右对齐一致 */
}

.chapter__contact {
  position: relative;
  min-width: 7.5rem;
  height: 3.75rem;
  border: 1px solid var(--c-line);
  border-radius: 8px;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out-expo);
}

.chapter__contact:hover {
  border-color: var(--c-accent);
}

.chapter__contact-icon {
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: var(--c-ink);
  transition: opacity var(--dur-fast) var(--ease-out-expo);
}

/* 信息层：默认隐藏，hover 时替换图标 */
.chapter__contact-value {
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

.chapter__contact:hover .chapter__contact-icon {
  opacity: 0;
}

.chapter__contact:hover .chapter__contact-value {
  opacity: 1;
}

/* 章节中央斜体大字背景：半透明、衬线体、像水印 */
.chapter__footer {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 0;
  pointer-events: none;
  font-family: 'Playfair Display Variable', serif;
  font-style: italic;
  font-size: clamp(5rem, 14vw, 12rem);
  font-weight: 600;
  letter-spacing: var(--ls-tight);
  line-height: 1;
  color: var(--c-ink);
  opacity: 0.25; /* 半透明背景字 */
  margin: 0;
}
</style>
