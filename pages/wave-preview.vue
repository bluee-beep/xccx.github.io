<script setup lang="ts">
// ==================== 临时工具页：波浪形状选项（选完删） ====================
useSeo({ title: '波浪形状对比' })

// 4 种波浪形状（SVG path，均带流动动画）
const waves = [
  {
    id: 'A',
    name: '大浪',
    desc: '高振幅：波峰更高、波谷更深（激烈）',
    path: 'M0,40 C90,85 180,-5 270,40 C360,85 450,-5 540,40 C630,85 720,-5 810,40 C900,85 990,-5 1080,40 C1170,85 1260,-5 1350,40 L1440,40',
  },
  {
    id: 'B',
    name: '不规则浪',
    desc: '大小浪交替（一个高浪接一个低浪，海浪感）',
    path: 'M0,40 C90,85 180,-5 270,40 C360,85 450,-5 540,40 C630,55 690,25 720,40 C790,60 850,20 1080,40 C1170,85 1260,-5 1350,40 L1440,40',
  },
  {
    id: 'C',
    name: '狂风暴雨',
    desc: '不规则弧尖峰：带弧度、高度错落、间距不均',
    path: 'M0,40 Q20,15 40,40 Q65,5 90,40 Q115,25 140,40 Q165,10 190,40 Q215,30 240,40 Q265,8 290,40 Q315,18 340,40 Q365,4 390,40 Q415,22 440,40 Q465,12 490,40 Q515,28 540,40 Q565,6 590,40 Q615,20 640,40 Q665,10 690,40 Q715,25 740,40 Q765,5 790,40 Q815,15 840,40 Q865,30 890,40 Q915,8 940,40 Q965,20 990,40 Q1015,10 1040,40 Q1065,26 1090,40 Q1115,6 1140,40 Q1165,18 1190,40 Q1215,12 1240,40 Q1265,24 1290,40 Q1315,8 1340,40 Q1365,20 1390,40 Q1415,10 1440,40',
  },
  {
    id: 'D',
    name: '碎浪双峰',
    desc: '每周期双小峰（更碎的海浪感）',
    path: 'M0,40 C45,70 90,10 135,40 C180,70 225,10 270,40 C315,70 360,10 405,40 C450,70 495,10 540,40 C585,70 630,10 675,40 C720,70 765,10 810,40 C855,70 900,10 945,40 C990,70 1035,10 1080,40 C1125,70 1170,10 1215,40 C1260,70 1305,10 1350,40 L1440,40',
  },
].map((w) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="${w.path} L1440,80 L0,80 Z" fill="#969da4"/></svg>`
  return { ...w, bg: `url("data:image/svg+xml,${encodeURIComponent(svg)}")` }
})
</script>

<template>
  <div class="preview">
    <p class="preview__hint u-monolabel">波浪形状选择（海浪感 + 水花尖角，仅形状）—— 选 A/B/C/D</p>

    <div v-for="w in waves" :key="w.id" class="preview__block">
      <!-- 模拟章节交界：上方深色 + 下方灰蓝 -->
      <div class="preview__top" />
      <div class="preview__wave" :style="{ backgroundImage: w.bg }" />
      <div class="preview__bottom" />
      <p class="preview__tag u-mono">{{ w.id }} · {{ w.name }} — {{ w.desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.preview {
  padding-block: var(--space-6);
}

.preview__hint {
  color: var(--c-muted);
  text-align: center;
  margin-bottom: var(--space-6);
}

.preview__block {
  position: relative;
  margin-bottom: var(--space-6);
}

.preview__top {
  height: 60px;
  background: #0a0a0a;
}

.preview__wave {
  height: 80px;
  margin-top: -80px;
  position: relative;
  z-index: 2;
  background-repeat: repeat-x;
  background-size: 1440px 80px;
  background-position: 0 0;
  animation: wave-preview 10s linear infinite;
}

@keyframes wave-preview {
  to { background-position: -1440px 0; }
}

.preview__bottom {
  height: 60px;
  background: #969da4;
}

.preview__tag {
  position: absolute;
  left: 0.5rem;
  top: 0.4rem;
  font-size: 0.75rem;
  color: var(--c-ink);
  background: rgba(0, 0, 0, 0.75);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  z-index: 3;
}
</style>
