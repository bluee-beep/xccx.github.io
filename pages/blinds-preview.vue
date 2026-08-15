<script setup lang="ts">
// ==================== 临时工具页：百叶窗效果选项（选完删） ====================
useSeo({ title: '百叶窗效果对比' })

// 模拟滚动进度：0 → 1 → 0 循环（合上 → 张开）
const p = ref(0)
let t = 0

onMounted(() => {
  const tick = () => {
    t += 0.006
    p.value = (Math.sin(t * Math.PI) + 1) / 2
    requestAnimationFrame(tick)
  }
  tick()
})

// 条带变换计算
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// A 错峰下滑：第 i 条从上方滑下盖住（经典百叶窗关闭）
const stripA = (i: number) => {
  const local = clamp01((p.value - i * 0.16) / 0.3)
  return { transform: `translateY(${(-100 + local * 100).toFixed(1)}%)` }
}

// B 上下对合：上 3 条下移、下 2 条上移，中央合拢
const stripB = (i: number) => {
  const total = 5
  if (i < 3) {
    const local = clamp01((p.value - i * 0.16) / 0.3)
    return { transform: `translateY(${(-100 + local * 100).toFixed(1)}%)` }
  }
  const local = clamp01((p.value - (total - 1 - i) * 0.16) / 0.3)
  return { transform: `translateY(${(100 - local * 100).toFixed(1)}%)` }
}

// C 斜向合拢：条带带角度依次滑下
const stripC = (i: number) => {
  const local = clamp01((p.value - i * 0.14) / 0.3)
  return { transform: `translateY(${(-100 + local * 100).toFixed(1)}%) rotate(${((i - 2) * 1.5).toFixed(1)}deg)` }
}

// D 整幅幕布：单条整帘下滑
const stripD = () => {
  return { transform: `translateY(${(-100 + p.value * 100).toFixed(1)}%)` }
}

const variants = [
  { id: 'A', name: '错峰下滑', desc: '五条依次滑下盖住（经典百叶窗关闭）', strips: stripA, count: 5 },
  { id: 'B', name: '上下对合', desc: '上三下二向中央合拢（对称关闭）', strips: stripB, count: 5 },
  { id: 'C', name: '斜向合拢', desc: '条带带微角度依次合拢（动感）', strips: stripC, count: 5 },
  { id: 'D', name: '整幅幕布', desc: '单条整帘下滑（干净利落）', strips: stripD, count: 1 },
]
</script>

<template>
  <div class="preview u-container">
    <h1 class="preview__title">百叶窗 · 下翻合上 选项</h1>
    <p class="preview__note u-monolabel">自动循环演示合拢过程（合上→张开）。选 A/B/C/D</p>

    <div class="preview__row">
      <div v-for="v in variants" :key="v.id" class="preview__card">
        <!-- 模拟 hero 容器：假视频画面 + 帘幕 -->
        <div class="preview__stage">
          <div class="preview__video">VIDEO</div>
          <div class="preview__blinds">
            <div
              v-for="i in v.count"
              :key="i"
              class="preview__strip"
              :class="{ 'preview__strip--full': v.count === 1 }"
              :style="v.strips(i - 1)"
            />
          </div>
        </div>
        <p class="preview__label u-mono">{{ v.id }} · {{ v.name }}</p>
        <p class="preview__desc u-monolabel">{{ v.desc }}</p>
      </div>
    </div>
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-5);
}

.preview__card {
  border: 1px solid var(--c-line);
  border-radius: 8px;
  overflow: hidden;
}

.preview__stage {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #0a0a0a;
}

.preview__video {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(244, 244, 242, 0.5);
  font-family: 'JetBrains Mono Variable', monospace;
  font-size: var(--fs-label);
  background: linear-gradient(135deg, #14243f, #0d2b6e 50%, #1a3a5c);
}

.preview__blinds {
  position: absolute;
  inset: 0;
}

.preview__strip {
  position: absolute;
  left: 0;
  right: 0;
  height: 20%;
  background: #0a0a0a;
  will-change: transform;
}

/* 五条分布 */
.preview__strip:nth-child(1) { top: 0; }
.preview__strip:nth-child(2) { top: 20%; }
.preview__strip:nth-child(3) { top: 40%; }
.preview__strip:nth-child(4) { top: 60%; }
.preview__strip:nth-child(5) { top: 80%; }

/* 单条幕布（D）撑满 */
.preview__strip--full {
  height: 100%;
  top: 0;
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
</style>
