# Fake Horizontal Scroll 模板方案文档

## 一句话概述

> **用户向下滚鼠标，页面内容横向移动。** 用垂直滚动驱动水平位移，适合产品横向浏览、品牌叙事等场景。

---

## 核心原理

```
┌───────────────────────────────────────────────┐
│  .vhscroll-page  (背景包装)                    │
│                                               │
│  ┌─────────────────────────────────────┐      │
│  │ .vhscroll-scroll-area               │      │
│  │ height = totalPanels × 100vh        │      │
│  │                                     │      │
│  │  ┌──────────────────────────────┐   │      │
│  │  │ .vhscroll-pinned             │   │      │
│  │  │ position: sticky; top: 0     │   │      │
│  │  │ height: 100vh                │   │      │
│  │  │ overflow: hidden             │   │      │
│  │  │                              │   │      │
│  │  │  ┌───────────────────────┐   │   │      │
│  │  │  │ .vhscroll-track       │   │   │      │
│  │  │  │ display: flex         │   │   │      │
│  │  │  │ translateX ← GSAP     │   │   │      │
│  │  │  │                      │   │   │      │
│  │  │  │ [P0][P1][P2]...[P6] │   │   │      │
│  │  │  └───────────────────────┘   │   │      │
│  │  └──────────────────────────────┘   │      │
│  └─────────────────────────────────────┘      │
│                                               │
│  [进度条] [页面指示器] [导航点] (fixed 定位)   │
└───────────────────────────────────────────────┘

滚动机制：
  用户滚动 ↓        scrollTop 变化          GSAP translateX
  ──────────        ─────────────          ───────────────
  scrollTop=0       →                       0px (第1屏)
  scrollTop=N×vh    →                 -N×100vw (第N+1屏)
```

| 层级 | 作用 | 关键技术 |
|------|------|----------|
| `.vhscroll-scroll-area` | 撑出 `totalPanels×100vh` 高度，制造纵向滚动空间 | `height` 动态绑定 |
| `.vhscroll-pinned` | `position:sticky;top:0` 始终吸附在视口顶部 | CSS `sticky` |
| `.vhscroll-track` | `display:flex` 排列所有面板，被 GSAP 水平平移 | GSAP `scrub:0.5` |

---

## CSS 类名规范

### scoped 样式块（.vhscroll-xxx）

| 类名 | 作用 | 层级 |
|------|------|------|
| `.vhscroll-page` | 页面根容器 | 背景、字体 |
| `.vhscroll-scroll-area` | 纵向滚动空间 | `position:relative`, `height` 动态 |
| `.vhscroll-pinned` | 吸顶容器 | `sticky`, `100vh`, `overflow:hidden` |
| `.vhscroll-track` | 横向轨道 | `flex`, `will-change:transform` |
| `.vhscroll-panel` | 通用面板 | `min-width:100vw`, `flex-shrink:0` |
| `.vhscroll-panel::before` | 面板内边框 | `inset:20px`, `border-radius:20px` |
| `.vhscroll-panel::after` | 面板编号水印 | `font-size:10rem`, `opacity:0.03` |
| `.vhscroll-content` | 内容居中区 | `text-align:center` |
| `.vhscroll-badge` | 标签胶囊 | `padding:6px 20px`, `border-radius:20px` |
| `.vhscroll-panel-intro` ~ `.vhscroll-panel-contact` | 各屏专属背景渐变 | 7 个不同 `linear-gradient` |

### 非 scoped 样式块（全局）

| 类名 | 作用 |
|------|------|
| `.vhscroll-nav-dots` | 导航点容器 `fixed` `bottom:28px` |
| `.vhscroll-nav-dot` | 单个导航点 `12px` 圆形 |
| `.vhscroll-nav-dot.vhscroll-active` | 激活态导航点（蓝色发光） |
| `.vhscroll-progress-bar` | 顶部进度条 `fixed` `top:0` |
| `.vhscroll-page-indicator` | 右上角页码指示器 `fixed` |

---

## 为什么需要两个 `<style>` 块

| 块 | 作用 | 原因 |
|----|------|------|
| `<style scoped>` | 面板布局、背景、字体 | Vue scoped 添加 `data-v-xxx` 属性选择器 |
| `<style>` (非 scoped) | 导航点、进度条、页码指示器 | 这些元素由 JS 动态创建/操作，且 `fixed` 定位需要脱离组件 DOM 树限制 |

---

## 配置参数表

| 参数 | 位置 | 默认值 | 说明 |
|------|------|--------|------|
| `totalPanels` | 第 21 行 | `7` | 面板总数，修改后面板高度、GSAP 位移、导航点自动适配 |
| `scrub` | 第 100 行 | `0.5` | 滚动绑定平滑度（0=即时，1=平滑，2=惰性） |
| `ease` | 第 98 行 | `'none'` | GSAP ease 函数，`'none'` 保证线性位移 |
| `duration` (goToPanel) | 第 62 行 | `0.6` | 点击导航点跳转动画时长（秒） |
| `touchSwipeThreshold` | 第 84 行 | `50` | 触摸滑动最小距离（px） |

---

## 新增/删除面板指南

### 新增第 8 个面板（4 步）

1. **改配置**：`const totalPanels = 8`
2. **添加 HTML**：在 `#vhscrollTrack` 内追加 `<section>`
3. **添加背景样式**：新增 `.vhscroll-panel-xxx` 类指定 `linear-gradient`
4. **完成**：导航点、进度条、GSAP 全部自动适配

### 删除面板

1. `totalPanels -= 1`
2. 删除对应 `<section>` 和 `<style>` 背景类

**关键**：所有逻辑都从 `totalPanels` 推导，不依赖硬编码。

---

## 交互一览

| 交互 | 触发方式 | 实现 |
|------|----------|------|
| 滚动驱动横向位移 | 鼠标滚轮 / 触控板 | GSAP `scrub` |
| 导航点点击 | 点击底部圆点 | `gsap.to(window, { scrollTo })` |
| 键盘导航 | ↑↓←→ / Home / End | `onKeydown` |
| 触摸导航 | 上下滑动 50px+ | `onTouchStart` + `onTouchEnd` |
| 面板入场动画 | 横向滚动到该面板 | `ScrollTrigger` + `containerAnimation` |
| 进度条 | 随滚动进度变化 | `onUpdate` 回调 |
| 页码指示器 | 面板切换时更新 | `updateUI()` |

---

## 常见问题

### Q: 滚动没有反应？
**A:** 确认页面高度是否足够。`vhscroll-scroll-area` 的高度 = `totalPanels × 100vh`，查看 DevTools → Elements 确认该 div 的实际高度。

### Q: 横向位移不平滑？
**A:** 检查 `scrub` 值（第 100 行），`0.5` 是平滑推荐值。设为 `true` / `1` 更平滑但更滞后，`0` 即时跟随。

### Q: 如何去掉无限循环？
**A:** 本模板默认**无**无限循环，直接线性滚动。如需循环，参考 `horizontal-scroll` 的克隆 + `onScroll` 边界跳转模式。

### Q: 面板内容动画不触发？
**A:** 依赖 `ScrollTrigger` + `containerAnimation`。确认 GSAP 版本 ≥ 3.10（支持 `containerAnimation`）。

### Q: 移动端怎么优化？
**A:** 已有 `@media (max-width: 768px)` 适配。如需更小字号，在 `:style` 响应式块中调整 `h2` 和 `p` 的 `font-size`。

---

## 扩展方向

| 方向 | 改造点 | 用途 |
|------|--------|------|
| 面板内嵌复杂内容 | 替换 `.vhscroll-content` 为自定义组件 | 产品详情、图文混排 |
| 添加滚动指示箭头 | fixed 底部引导提示 | 引导用户向下滚动 |
| 反向滚动 | `start:'bottom bottom'` + `end:'top top'` | 从最后一屏开始 |
| 横向播放 Lottie 动画 | 面板内嵌套 lottie | 滚动控制动画帧 |
| 添加吸顶头部导航 | 在 `.vhscroll-page` 外放 fixed header | 品牌 logo + 菜单 |
