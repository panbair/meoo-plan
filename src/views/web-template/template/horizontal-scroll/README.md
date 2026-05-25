# Horizontal Scroll 横向全屏无限滚动组件 - 开发方案

## 1. 组件概述

**infinite-scroll 的横向版本**。基于 GSAP ScrollTrigger 实现横向全屏吸附滚动，支持无限循环（滚到最后一个面板后自动回到第一个）。

与 `infinite-scroll` 的核心区别：

| 特性 | infinite-scroll（纵向） | horizontal-scroll（横向） |
|------|----------------------|--------------------------|
| 滚动轴 | `scrollTop` | `scrollLeft` |
| 面板尺寸 | `height: 100vh` | `width: 100vw`（min-width） |
| 容器布局 | 默认块级 | `display: flex` + `overflow-x: auto` |
| 导航点 | 右侧竖排 | 底部居中横排 |
| 键盘方向 | ↑↓ | ←→ |
| 页码指示 | 底部居中 | 右上角 |
| ScrollTrigger | `start: 'top top'` | `start: 'left left'` + `horizontal: true` |

---

## 2. CSS 类名命名规范

**所有类名统一以 `hscroll-` 为前缀**：

| 类名 | 作用 | 样式块 |
|------|------|--------|
| `.hscroll-brand-page` | 根容器 | scoped |
| `.hscroll-container` | 滚动容器（`display: flex; overflow-x: auto`） | scoped |
| `.hscroll-panel` | 通用面板（`min-width: 100vw; flex-shrink: 0`） | scoped |
| `.hscroll-panel-intro/features/...` | 面板背景变体 | scoped |
| `.hscroll-content` | 内容居中容器 | scoped |
| `.hscroll-badge` | 面板标签徽章 | scoped |
| `.hscroll-nav-dots` | 导航点容器（底部居中） | **非 scoped** |
| `.hscroll-nav-dot` + `.hscroll-active` | 导航点 + 活跃态 | **非 scoped** |
| `.hscroll-progress-bar` | 顶部进度条 | **非 scoped** |
| `.hscroll-page-indicator` | 页码指示器（右上角） | **非 scoped** |

---

## 3. 横向无限循环机制

```
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ P0   │ P1   │ P2   │ P3   │ P4   │ P5   │ P6   │ P0*  │
│ 原始 │      │      │      │      │      │      │ 克隆 │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
scrollLeft=0                                         maxScroll

边界跳转：
- scrollLeft >= maxScroll - 10 → scrollLeft = 2（跳到开头）
- scrollLeft <= 10 → scrollLeft = maxScroll - 2（跳到末尾）
```

---

## 4. 配置参数

| 参数 | 行号 | 默认值 | 说明 |
|------|------|--------|------|
| `totalPanels` | 9 | `7` | 面板总数 |
| Snap duration | ~140 | `{min: 0.2, max: 0.45}` | 吸附时长 |
| `horizontal: true` | ~140 | — | ScrollTrigger 横向模式 |
| `isJumping` 防抖 | 75/80 | `500` | 边界跳转后 500ms 内跳过滚动 |
| 触屏阈值 | 114 | `50` | 滑动手势最小像素距离 |

---

## 5. 新增面板

1. 改 `totalPanels` → 新数量
2. 加 `<section class="hscroll-panel hscroll-panel-xxx">` 
3. 加对应的背景样式 `.hscroll-panel-xxx { ... }`
4. 更新 `/ 7` → `/ 新数量`

---

## 6. 扩展方向

- **非无限循环版**：删除克隆逻辑和边界跳转，`end` 改为 `+=${(totalPanels - 1) * 100}%`
- **面板内 3D 入场**：在每个 `.hscroll-panel` 内加 GSAP fromTo 动画
- **鼠标滚轮阻尼**：拦截 `wheel` 事件，用 `gsap.to(containerEl, { scrollLeft })` 平滑滚动
