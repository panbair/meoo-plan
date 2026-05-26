# Parallax Scroll 多层视差滚动组件 - 开发方案

## 1. 组件概述

基于 **GSAP ScrollTrigger + scrub** 实现的**多层视差滚动组件**。不是全屏 Snap 吸附，而是传统的垂直滚动页面，但每个段落包含 3 层元素（背景层 `bgLayer`、中间层 `midLayer`、前景层 `fgLayer`），以不同速度随滚动移动，产生深度视差效果。

与 `infinite-scroll` 的区别：

| 特性 | infinite-scroll | parallax-scroll |
|------|----------------|-----------------|
| 滚动方式 | 全屏吸附 Snap | 自然自由滚动 |
| 循环 | 无限循环克隆 | 无（线性5段） |
| 交互核心 | Snap + 边界跳转 | 多层速率视差 + 入场动画 |
| 段落数量 | 固定7屏 | 5段可配 |
| 导航方式 | 滚动 + 点 + 键盘 | 滚动标记 + 点 + smooth scrollTo |

---

## 2. 视差层架构

每个 `.parallax-section` 内部包含三层：

```
.parallax-section
├── .parallax-bg-layer    ← 背景层：大圆形/环形装饰，移动速度最快（y: -60 → +60）
├── .parallax-mid-layer   ← 中间层：点阵网格/波浪，移动速度中等（y: -30 → +30）
└── .parallax-fg-layer    ← 前景层：实际内容（标题、卡片、按钮），速度最慢（y: -15 → +15）
```

GSAP 实现（同一 timeline，同步启动）：

```ts
gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
})
.fromTo(bgLayer,  { y: -60 }, { y: 60, ease: 'none' }, 0)
.fromTo(midLayer, { y: -30 }, { y: 30, ease: 'none' }, 0)
.fromTo(fgLayer,  { y: -15 }, { y: 15, ease: 'none' }, 0)
```

> `position: 0` 表示三个图层同时启动，但各自有不同的位移范围（-60~60 / -30~30 / -15~15），自然形成视差深度。

---

## 3. CSS 类名命名规范

**所有类名统一以 `parallax-` 为前缀**：

| 类名 | 作用 | 样式块 |
|------|------|--------|
| `.parallax-brand-page` | 根容器 | scoped |
| `.parallax-section` | 段落容器（`min-height: 100vh`） | scoped |
| `.parallax-section-hero/cards/...` | 段落背景变体 | scoped |
| `.parallax-bg/mid/fg-layer` | 三层视差 | scoped |
| `.parallax-content` | 前景层内容居中 | scoped |
| `.parallax-title` / `.parallax-desc` | 标题/描述（入场动画目标） | scoped |
| `.parallax-badge` | 段标签徽章 | scoped |
| `.parallax-card` / `.parallax-card-row` | 功能/作品卡片 | scoped |
| `.parallax-stat` / `.parallax-stats-row` | 数据统计 | scoped |
| `.parallax-cta` | CTA 按钮 | scoped |
| `.parallax-nav-dots` + `.parallax-nav-dot` + `.parallax-active` | 导航点 | **非 scoped** |
| `.parallax-progress-bar` | 进度条 | **非 scoped** |
| `.parallax-page-indicator` | 页码指示器 | **非 scoped** |

---

## 4. 段落结构详解

| 段落 | `data-section` | 内容类型 | 视差装饰 |
|------|---------------|---------|---------|
| Hero | `0` | 标题 + 描述 | 2 个大圆 + 有机形状 |
| Cards | `1` | 3 张功能卡片 | 大圆 + 点阵网格 |
| Work | `2` | 2 张宽作品卡 | 双圆 + 渐变波浪 |
| Stats | `3` | 4 个数据指标 | 双环同心圆 + 渐变条 |
| Contact | `4` | 标题 + CTA | 虚线大圆 + 粉色波浪 |

---

## 5. 入场动画机制

每个段落的标题、描述、卡片通过以下方式入场：

```ts
const tl = gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 25%', scrub: 0.5 }
})
tl.fromTo(title,  { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
  .fromTo(desc,   { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.3')
  .fromTo(cards,  { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.12 }, '-=0.2')
```

- 标题先出现，描述和卡片稍微重叠（`-=0.3` / `-=0.2`）
- `stagger: 0.12` 让多张卡片依次显现
- `scrub: 0.5` 平滑跟随滚动

---

## 6. 扩展方向

- **添加更多段落**：复制 `parallax-section` 结构，增加背景变体样式，更新 `totalSections`
- **添加图片视差**：在 `bgLayer` 或 `midLayer` 中放置 `<img>`，调整 y 位移范围实现不同速度
- **鼠标跟随视差**：在 `mousemove` 事件中根据鼠标位置微调 `fgLayer` 的 `translate`
- **横向视差**：改为 `x` 轴位移，配合横向滚动布局
