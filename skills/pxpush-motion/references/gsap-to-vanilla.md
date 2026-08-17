# GSAP + ScrollTrigger → 零依赖原生 JS 还原公式

目标：把 pxpush 的 `gsap.fromTo + scrollTrigger{scrub:true}` 配方翻译成**不引任何库**的原生实现，数学等价、观感 1:1。

## 1. scrub 的本质：滚动进度线性映射为时间轴播放头

ScrollTrigger `scrub:true` = 滚动位置线性驱动 timeline 的播放头（无迟滞）。设滚动进度为 `p ∈ [0,1]`，timeline 总时长为 `T`，则播放头时间 `t = p × T`。

## 2. 滚动进度 p 的计算

ScrollTrigger 区间 `start:"top A%" → end:"top B%"`（trigger 元素顶边过视口 A% 线起、过 B% 线止，A > B，B 可为负）：

```js
const p = clamp((vh·(A/100) − el.getBoundingClientRect().top) / (vh·((A−B)/100)), 0, 1)
```

特例：textFade 的 end 是 `"bottom 80%"`（元素**底边**过 80% 线）——区间长度 = 元素自身高度：

```js
const p = rect.height > 0 ? (vh·0.8 − rect.top) / rect.height : 1
```

## 3. GSAP 时间模型还原（单 tween 默认时长 0.5s）

`stagger:{ each:S, from:F }` 把 N 条 tween 的起点摊开：timeline 总时长

```
T = 0.5 + S × (N − 1)
```

元素 i（DOM 序，0-based）的开始时间：

```
from:"start" → start(i) = i × S
from:"end"   → start(i) = (N − 1 − i) × S   // 末位先播
from:"random"→ start(i) = rank[i] × S        // rank 为 [0..N-1] 洗牌后的排列
```

元素 i 的动画进度：

```
q(i) = clamp((t − start(i)) / 0.5, 0, 1) = clamp((p × T − start(i)) / 0.5, 0, 1)
```

## 4. 缓动表（ease 作用于单条 tween 的进度 q）

| GSAP ease | 公式 | 说明 |
|---|---|---|
| `none` | `f(q) = q` | 线性 |
| `power1` | `f(q) = 1−(1−q)²` | power1.out |
| `power4` | `f(q) = 1−(1−q)⁵` | power4.out（GSAP 裸 "power4" 默认 .out） |
| `expo` | `f(q) = q≥1 ? 1 : 1−2^(−10q)` | expo.out（时间线版分隔线用） |

动画属性 = `from + (to − from) × f(q)`。例：overlayIn 的 `scaleY = (1−(1−q)⁵) × 1.01`。

## 5. 监听策略（1:1 跟手的关键）

```js
addEventListener('scroll', update, { passive: true })
addEventListener('resize', update)
update() // 挂载即同步（锚点/中途刷新不闪变）
```

- **直接写值**：scroll 事件里同步计算并 `el.style.x = ...`，不用 rAF 节流、不用 lerp 平滑——scrub 语义就是 1:1 跟手（pxpush 原版同）。加 lerp 会产生「迟滞感」，偏离原版。
- `passive: true`：不阻塞滚动合成。
- 卸载时 `removeEventListener` 两个事件。

## 6. CSS 配合约定

- **SSR 默认可见**：动画元素 CSS 不设初始隐藏（`.px-word` 无 `opacity:0`），JS 挂载后才接管写值——无 JS 环境/JS 失败时内容完整可读。
- **transform-origin / clip-path / 变量驱动**：from 态的即时属性（如 overlayIn 的 `transformOrigin:"50% 100%"`）写在 CSS；JS 只写动画属性（transform/opacity/filter）。
- **will-change**：`will-change: transform, opacity` 或按动画属性声明，提示合成层。

## 7. 从 Vue 组件去壳的映射

| Vue 实现 | 原生 JS 等价 |
|---|---|
| `ref` + `onMounted` | 函数参数 `el` + 立即执行 |
| composable（useLenis/useDevice） | 直接 window 监听 / matchMedia |
| scoped CSS + `:deep()` | 独立类名前缀（`.px-*`），动态生成元素同样命中 |
| `useState` 跨组件共享 | 简单全局变量 / CustomEvent |
| 触屏判定 `isTouchDevice()` | `matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches` |

## 8. 验证清单（移植后自检）

- [ ] 正向滚动：区间内元素按 stagger 顺序渐进，区间外 clamp 到 from/to 端点
- [ ] 反向滚动：动画对称回卷（scrub 双向性）
- [ ] 挂载即同步：带锚点加载/中途刷新无闪变
- [ ] resize：vh 更新后进度正确
- [ ] 与 pxpush 原站并排：节奏、顺序、缓动一致
