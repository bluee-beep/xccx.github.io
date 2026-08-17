# 逆向方法与来源

本 Skill 的全部参数来自对 pxpush.com 的实际逆向，非目测估计。方法与来源记录如下，供验证与逆向其他站点参考。

## 来源

1. **pxpush.com 线上产物**（2026-08-17 抓取）：
   - `https://pxpush.com/` HTML（含 inline `<style>` 的组件 CSS）
   - `https://pxpush.com/_nuxt/OS4hgONa.js`（355KB，Nuxt 应用 bundle，minified）
2. **Codrops 官方拆解文**《The Department Is Open: Building the PX PUSH Website》（2026-08-07）：https://tympanus.net/codrops/2026/08/07/the-department-is-open-building-the-px-push-website/ —— 交叉验证 marquee 结构（8 次重复）、effect 属性声明系统（effect__xxx）、titleRandom/fadeOut/separatorIn 参数。

## 提取方法

1. **抓 HTML**：`curl -s https://pxpush.com/ -o pxpush.html`；inline `<style>` 里有组件级 CSS（`.overlay`、`.marqueeText` 等逐字规则）。
2. **抓 bundle**：HTML 中唯一的 `<script type="module" src="/_nuxt/OS4hgONa.js">`；下载后按 effect 属性名定位：
   ```bash
   grep -o '.\{50\}overlayIn.\{400\}' pxpush.js
   grep -o '.\{30\}titleRandom.\{600\}' pxpush.js
   ```
   每种效果的 `fromTo`/`from` 配置对象逐字可读（GSAP 的调用形态在 minify 后仍保留键名：`scrollTrigger:{trigger:d,scroller:t,start:"top 0%",end:"top -80%",scrub:!0}`）。
3. **区分库代码与应用代码**：GSAP/ScrollTrigger/Lenis 的库代码（含 `_gsap`、`getVelocity`、`ticker` 等标识符）与应用效果代码（`effect__xxx`、`querySelectorAll`）分离——只在应用代码里找参数。
4. **结构与生成器**：`class vP`（overlay 条带生成器）、`class yP`（条带单元格）等类定义可直接读出行列数与 CSS 变量注入点。

## 教训（移植过程中的真实踩坑）

- **不要目测估计参数**：最初按观感自创的区间/lerp 被用户驳回（「照搬不会吗」）——pxpush 的流畅感来自精确的时间模型（0.5s 单 tween + stagger 跨度）与 scrub 1:1 直写，自创即失真。
- **scrub 必须直写值**：加 lerp/rAF 节流会产生迟滞，偏离原版「跟手」手感。
- **grid 隐式行 stretch**：overlay 条带无显式行高，靠 `align-content` 默认行为拉伸——改结构前先读懂原版 CSS 的布局语义。
- **Vue scoped CSS 的动态 DOM 穿透**：JS 生成的元素（条带/光标格子）不带 scoped data 属性，必须 `:deep()` 否则样式不命中。
- **SVG filter 零尺寸陷阱**：gooey 滤镜的 SVG 设 `width:0;height:0` 在 Chrome 会让 `filter:url()` 整层失效（计算样式正常，极具迷惑性）——改 `position:absolute` 保留默认尺寸。
- **GitHub Pages 双斜杠**：baseURL（尾斜杠）拼接带斜杠的路径会产生 `//`——Pages 上该请求挂起（curl 卡死），静态资源路径不带头斜杠。

## 可复用的逆向流程（逆向其他站点动效）

1. 抓页面 HTML + 主 JS bundle（DevTools Network 里找 module script）
2. 按特征字符串定位（动画类名/属性名/组件名）
3. 提取配置对象（fromTo 的 from/to、stagger、scrollTrigger 区间）
4. 按 `gsap-to-vanilla.md` 的公式翻译成原生实现
5. 并排对照原站验证节奏（dev 双窗口）
