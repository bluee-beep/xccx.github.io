# Xccx — 个人品牌网站

> 单页叙事站点：CRT 复古美学 × 滚动叙事动效，Nuxt 3 SSG 静态输出，部署 GitHub Pages。
>
> **线上**：[bluee-beep.github.io/xccx.github.io](https://bluee-beep.github.io/xccx.github.io/) · **文档**：完整迭代记录见 [CHANGELOG.md](CHANGELOG.md)

## 页面一览

```
Hero 视频取景（太空漂浮 + 手持摇晃 + 鼠标取景）
  └─ 条带刷色过渡（overlayIn）
Nº001 宣言（灰蓝 CRT + 「XCCX ●」大字横滚）
  └─ 圆弧覆盖过渡
Nº002 电子 × AI × 工程（彗尾荧光波浪）
  └─ 条带刷色过渡
Nº003 作品在路上（灰蓝 + 喷漆 + Wait Me 水印）
Nº004 联系（胶囊 + 微信二维码）
页脚（5 层 logo 拖尾 + 版权）
```

## 技术栈

| 层 | 方案 |
|---|---|
| 框架 | Nuxt 3.21（SSG / prerender） |
| 动效 | **零 GSAP**：滚动动效原生手写实现（scrub 直写） |
| 平滑滚动 | Lenis（手写 composable） |
| 文字拆分 | Splitting.js（章节标题）+ 自研中文分词（段落 scrub） |
| 样式 | 手写 CSS 设计系统（token 化，无框架） |
| 字体 | Space Grotesk / JetBrains Mono / Inter 自托管 |
| 部署 | GitHub Pages + GitHub Actions |

## 动效复刻清单

以下效果经逆向后零依赖复刻（来源见文末「参考」）：

| 效果 | 说明 | 组件 |
|---|---|---|
| overlayIn | 章节间条带刷色（10 行水平色带从底部逐排升起，40ms 间隔、power4、scrub top 0%→-80%） | `ChapterOverlay.vue` |
| textFade | 段落逐词淡入（stagger 0.05、scrub 直写、中文标点分词） | `ChapterSection.vue` |
| MarqueeText | 17vw 大字横滚（8 组无缝循环）+ 词随机淡入 + 离场模糊 + 线从右滑出 | `MarqueeText.vue` |
| separatorIn | 分隔线 clip 揭示（top 90%→70%） | `ChapterSection.vue` |
| 网格光标 | 全屏 20 列反色点阵 + gooey 滤镜（ttl 0.2s 硬切） | `CursorGrid.vue` |
| 视频加载页 | 黑底 logo 呼吸 + 真实缓冲进度条（100% 才淡出） | `Preloader.vue` |
| 手持摇晃 | 背景视频双正弦漂移 ≤9px/0.53°（真人持机感） | `useHandheld.ts` |

## 常用命令

```bash
npm run dev       # 开发（localhost:3000/xccx.github.io/）
npm run generate  # SSG 构建（含 fix-404 覆盖脚本）→ .output/public
npm run preview   # 静态预览
```

## 目录结构

```
xccx.github.io/
├── .github/workflows/deploy.yml   # GH Pages 发布流水线
├── assets/css/                    # 设计系统：tokens / base / utilities / main
├── components/
│   ├── layout/                    # AppHeader / AppFooter
│   ├── ui/                        # 通用：ChapterSection / ChapterOverlay / MarqueeText /
│   │                              #   CursorGrid / Preloader / ContactChips / RevealText
│   └── home/                      # 首页：HeroSection / ChapterLoop / FooterTrail
├── composables/                   # useLenis / useReveal / useHeroLogo / usePanorama /
│                                  #   useHandheld / useDevice / useSeo
├── data/                          # 单一数据源：site / chapters / profile
├── layouts/                       # default（全局壳层）/ blank（404 蓝屏）
├── pages/                         # index / 404
├── plugins/                       # reveal.directive（v-reveal 指令）
├── scripts/fix-404.mjs            # 构建后 404.html 覆盖（见「已知设计行为」）
└── public/                        # logo.svg / logo-cropped.svg / videos/hero.mp4
```

## 核心设计：章节是数据，不是组件

首页叙事由 `data/chapters.ts` 驱动——新增模块（作品集、博客章节等）只需向数组追加条目，不动组件结构。`ChapterSection.vue` 负责渲染，`ChapterLoop.vue` 只做循环与过渡装配。

## 已知设计行为

- **404.html 的 SPA 陷阱**：Nuxt prerender 对 `/404.html` 走 SPA 模板输出，产物 body 为空。`scripts/fix-404.mjs` 在构建后把 `/404` 的 SSR 完整渲染覆盖为 `404.html`——无 JS 也显示完整蓝屏彩蛋。
- **组件自动导入**：`pathPrefix: false`，组件按文件名注册（`AppHeader` 而非 `LayoutAppHeader`）。新增组件须保证文件名全站唯一。
- **资源路径**：baseURL 为 `/xccx.github.io/`，public 资源须手动拼接前缀且**不带头斜杠**（`videos/hero.mp4`——双斜杠在 Pages 上请求挂起，v2.3.0 踩坑）。

## Roadmap

- [ ] Journal 博客：`pages/journal/` + `@nuxt/content`
- [ ] 坦克大战小游戏接入 Nº003
- [ ] 汉堡菜单（移动端导航）
- [ ] OG 图品牌化（PNG）/ 头像

## 参考

- [pxpush.com](https://pxpush.com) — 站内页面设计与滚动动效的来源参考
- [Lenis](https://github.com/darkroomengineering/lenis) / [Splitting.js](https://splitting.js.org/)
