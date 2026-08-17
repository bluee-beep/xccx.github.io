# pxpush 全参数速查（逆向实录）

来源：pxpush.com 线上 HTML + `/_nuxt/OS4hgONa.js`（2026-08-17）+ Codrops 拆解文。所有值均为 bundle 逐字提取，非目测。

## 1. overlayIn（条带刷色过渡）

**结构**（出站章节末尾，absolute 锚底）：
```html
<div class="overlay overlay__lightgrey" effect__overlayIn></div>
```
```css
.overlay { bottom:0; display:grid; grid-area:1/1/-1/-1; grid-template-columns:repeat(var(--columns),1fr);
  height:100vh; pointer-events:none; position:absolute; width:100vw; z-index:4 } /* 级联终值 z-index:10 */
.overlay div { background:var(--color-bg-overlay); transform:scaleY(0) }
```
- 条带：JS 生成 `rows × 1` 空 div，`rows = 移动端 15 / 桌面 10`，`--columns:1`
- 条带行高：无显式定义 → grid 默认 `align-content:stretch` 把隐式行拉伸填满 100vh（每行 = 100vh/rows）

**动画**：
```js
from { transformOrigin:"50% 100%", scaleY:0, opacity:1 }
to   { ease:"power4", scaleY:1.01, opacity:1,
       stagger:{ grid:[rows,1], from:"end", each:0.04 },
       scrollTrigger:{ trigger:overlay, start:"top 0%", end:"top -80%", scrub:true } }
```

## 2. textFade（段落逐词淡入）

```js
fromTo(".word, .line__inner", { willChange:"opacity", opacity:0 },
  { ease:"none", opacity:1, stagger:.05,
    scrollTrigger:{ trigger, start:"top 80%", end: isMobile() ? "center top+=10%" : "bottom 80%", scrub:true } })
```
- 桌面 end = `"bottom 80%"`（段落底边过视口 80% 线）；移动端 `"center top+=10%"`
- 词级 stagger 0.05、ease none、scrub 1:1（无迟滞）

## 3. MarqueeText（大字横滚）

**结构**：超大标题重复 **8 次**，`position:fixed` 顶部、上下 2px 线、z-index 3；track `display:flex; width:max-content; will-change:transform`
```css
.marqueeText { height:17vw; left:0; overflow:hidden; pointer-events:none; position:fixed;
  top:3.5vw; white-space:nowrap; width:100%; z-index:3 }
.marqueeText__track { display:flex; left:0; position:absolute; top:0; width:max-content; will-change:transform }
.marqueeText__title { display:inline-flex; flex:0 0 auto; line-height:.96; white-space:nowrap }
.marqueeText__symbol { font-family:Arial; padding:0 2vw }
```
- 横移：持续移动（Codrops 文确认「重复 8 次、持续横移」；具体 tween 未在公开 bundle，等价实现 `xPercent:-50 repeat:-1 ease:none` 或 CSS `-100%/组数` keyframes）
- 分隔线揭示（首页时间线）：`--marquee-line-scale: 0 → 1`，ease `expo.out`，duration 0.8

## 4. titleRandom（词随机 3D 翻入，去 3D 版 = 随机淡入）

```js
// 原版含 3D（perspective 1000、z:-100→0、rotationX）；去 3D 只保留 opacity
fromTo(".word, .line__inner", { opacity:0 }, // 原版另有 z:-100
  { ease:"power4", opacity:1, stagger:{ each:.03, from:"random" }, // 原版另有 rotationX:0, z:0
    scrollTrigger:{ trigger, start:"top 90%", end: dataSmall ? "top 50%" : "top 0%", scrub:true } })
```

## 5. titleIn（逐字 3D 翻入，可选）

```js
fromTo(".char", { transformOrigin:"50% 0%", opacity:0, rotationX:-30, z:-200 },
  { ease:"power1", opacity:1, stagger:.05, rotationX:0, z:0,
    scrollTrigger:{ trigger, start:"top 90%", end:"top 40%", scrub:true } })
```

## 6. fadeOut（离场模糊淡出）

```js
fromTo(el, { opacity:1, filter:"blur(0px)" },
  { ease:"none", opacity:0, filter:"blur(20px)",
    scrollTrigger:{ trigger:el, start:"top 5%", end:"top -30%", scrub:true } })
```

## 7. separatorIn（分隔线 clip 揭示）

```js
from(el, { ease:"none", clipPath:"inset(0 100vw 0 0)",
  scrollTrigger:{ trigger:el, start:"top 90%", end:"top 70%", scrub:true } })
```
- 站点定制变体（从右侧滑出）：改用 `transform: scaleX(p)` + `transform-origin: right`（用户拍板方向）

## 8. fadeOutVideo / parallax（参考，未移植）

```js
// fadeOutVideo：opacity 1→0 + yPercent 0→50，top top → top -100%
// parallax：yPercent = data-parallax 值，区间随 trigger 类名
```

## 9. CursorGrid（网格反色光标）

- 结构：全屏 `20` 列点阵 grid + `mix-blend-mode: difference`；gooey SVG 滤镜（feGaussianBlur 3.2 + feColorMatrix α 20/-7 + atop）
- 点亮：瞬时 `opacity:1` → ttl **0.2s** 后硬切 `opacity:0`（GSAP set 延迟，无过渡）
- 排除区：header 链接/logo/作品区按钮（`closest()` 命中跳过）
- 宽屏阈值：`≤1300px` 关闭；触屏/reduced-motion 不启用
- 踩坑：动态生成的格子无 scoped data 属性需 `:deep()`；SVG filter 设 width:0/height:0 在 Chrome 导致整层不可见

## 10. 全局环境差异（原站语义）

- 移动端判定：`isMobile` = UA 正则（Android/webOS/iPhone/iPad…）；移动端 `lenis.stop()` 走原生滚动
- 本 Skill 的 `isTouch` 等价：`pointer: coarse && !any-pointer: fine`（DevTools 设备模拟可测）
