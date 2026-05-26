# Infinite Scroll 全屏无限滚动组件 - 开发方案

## 1. 组件概述

一个基于 **GSAP ScrollTrigger** 的垂直全屏无限循环滚动组件。用户向上/向下滚动时，在 7 个全屏面板之间无缝循环切换（滚到最后一个面板后自动回到第一个）。

### 核心能力

| 能力 | 实现方式 |
|------|---------|
| 全屏 Snap 吸附 | GSAP ScrollTrigger `snap` |
| 无限循环滚动 | DOM 克隆首屏 + 边界 scrollTop 跳转 |
| 右侧导航点 | 动态生成 `<button>`，点击跳转 |
| 顶部进度条 | `width` 百分比联动当前屏 |
| 底部页码指示 | `X / 7` 文字动态更新 |
| 键盘导航 | ↑↓ / PageUp/PageDown / Home/End |
| 触摸滑动 | touchstart/touchend，阈值 50px |
| 响应式 | 768px 断点缩小字体和导航点间距 |

---

## 2. 文件结构

```
infinite-scroll/
├── infinite-scroll.vue   ← 主组件（单文件）
└── README.md             ← 本文档
```

组件为单文件 Vue 3 `<script setup>` + `<template>` + `<style>`，无需外部依赖（除 GSAP）。

---

## 3. CSS 类名命名规范

**所有类名统一以 `infinite-scroll-` 为前缀**，按功能划分：

```
infinite-scroll-{命名空间}[-{子元素}][-{变体}]
```

| 类名 | 作用 | 样式块 |
|------|------|--------|
| `.infinite-scroll-brand-page` | 页面根容器（100vh, overflow:hidden） | scoped |
| `.infinite-scroll-container` | 滚动容器（overflow-y:auto） | scoped |
| `.infinite-scroll-panel` | 通用面板（100vh 全屏） | scoped |
| `.infinite-scroll-panel-hero` | 第1屏变体背景 | scoped |
| `.infinite-scroll-panel-about` | 第2屏变体背景 | scoped |
| `.infinite-scroll-panel-timeline` | 第3屏变体背景 | scoped |
| `.infinite-scroll-panel-team` | 第4屏变体背景 | scoped |
| `.infinite-scroll-panel-stats` | 第5屏变体背景 | scoped |
| `.infinite-scroll-panel-partners` | 第6屏变体背景 | scoped |
| `.infinite-scroll-panel-contact` | 第7屏变体背景 | scoped |
| `.infinite-scroll-nav-dots` | 右侧导航点容器（fixed） | **非 scoped** |
| `.infinite-scroll-nav-dot` | 单个导航点 | **非 scoped** |
| `.infinite-scroll-active` | 当前活跃导航点状态 | **非 scoped** |
| `.infinite-scroll-progress-bar` | 顶部进度条（fixed） | **非 scoped** |
| `.infinite-scroll-page-indicator` | 底部页码指示器（fixed） | **非 scoped** |
| `.infinite-scroll-current` | 当前页码 `<span>` | **非 scoped** |
| `.infinite-scroll-total` | 总页数 `/ 7` `<span>` | **非 scoped** |

### 为什么有两个 `<style>` 块？

- **`<style scoped>`**：面板布局、背景色 → 这些与组件实例强绑定，需要作用域隔离
- **`<style>`（非 scoped）**：导航点、进度条、页码指示器 → 这些是 `fixed` 定位的 overlay 元素，且用 JS 动态操作 class（`.infinite-scroll-active`），必须全局可见

> **关键规则**：凡是 JS 中通过 `classList.toggle()` 或 `querySelector()` 操作的类名，**一律放在非 scoped 的 `<style>` 块中**，否则 Vue 的作用域 hash 会导致选择器不匹配。

---

## 4. ID 命名规范

| ID | 对应 DOM | 用途 |
|----|---------|------|
| `infiniteScrollBrandContainer` | `.infinite-scroll-container` | 滚动容器，scrollTop 操作 |
| `infiniteScrollProgressBar` | `.infinite-scroll-progress-bar` | 进度条元素的 width 更新 |
| `infiniteScrollNavDots` | `.infinite-scroll-nav-dots` | 导航点容器，动态插入 dot 子元素 |

> **注意**：ID 使用驼峰命名（camelCase），类名使用短横线命名（kebab-case），两者通过 JS 的 `getElementById` 和 CSS 选择器分别引用。

---

## 5. 无限循环机制详解

### 5.1 核心原理

```
┌─────────────┐  ← scrollTop = 0（第1屏：hero）
│  Panel 0    │     原始面板 0
├─────────────┤  ← scrollTop = 1vh（第2屏）
│  Panel 1    │
├─────────────┤  ← scrollTop = 2vh
│  Panel 2    │
├─────────────┤  ← ...
│  Panel 3    │
├─────────────┤
│  Panel 4    │
├─────────────┤
│  Panel 5    │
├─────────────┤  ← scrollTop = 6vh（第7屏：contact）
│  Panel 6    │     原始面板 6
├─────────────┤  ← scrollTop = 7vh（克隆屏：hero 的拷贝）
│  Panel 0    │     克隆 ← init() 时动态创建
│  (cloned)   │
└─────────────┘  ← maxScroll（滚到这里 → 自动跳到顶部）
```

### 5.2 边界跳转逻辑（`onScroll` 函数）

```
if scrollTop >= maxScroll - 10:     // 滚到了克隆屏（底部）
  → 设置 isJumping = true            // 防抖标记，500ms 内跳过 onScroll
  → containerEl.scrollTop = 2        // 跳到接近顶部（不是 0，避免触发反向跳转）
  → 500ms 后恢复 isJumping = false
  → 设置 index = 0

else if scrollTop <= 10:            // 滚到了真正的顶部
  → 设置 isJumping = true
  → containerEl.scrollTop = maxScroll - 2  // 跳到接近底部
  → 500ms 后恢复 isJumping = false
  → 设置 index = totalPanels - 1
```

**为什么用 2 而不是 0？** 如果 `scrollTop = 0`，会立刻触发第二个判断 `scrollTop <= 10`，形成死循环。用 2 留下一个安全间隙。

### 5.3 GSAP Snap 配置

```ts
ScrollTrigger.create({
  trigger: containerEl,
  start: 'top top',
  end: `+=${totalPanels * 100}%`,    // 容器高度 = totalPanels * 100% = 700%
  snap: {
    snapTo: 1 / totalPanels,          // 7 个 snap 点（0, 1/7, 2/7, ..., 6/7）
    duration: { min: 0.2, max: 0.45 },
    delay: 0.05,
    ease: 'power1.inOut'
  }
})
```

---

## 6. 如何新增/删除面板

### 新增第 8 个面板

**Step 1**：修改 `totalPanels`（第 9 行）

```ts
const totalPanels = 8  // 从 7 改为 8
```

**Step 2**：在 `<template>` 中新增 `<section>`（第 188 行之后）

```html
<section class="infinite-scroll-panel infinite-scroll-panel-gallery" data-index="7">
  第八屏
</section>
```

**Step 3**：在 `<style scoped>` 中新增背景色

```scss
.infinite-scroll-panel-gallery {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
}
```

**Step 4**：更新页码指示器文字

```html
<span class="infinite-scroll-total"> / 8</span>
```

---

### 删除面板（例如只保留 5 屏）

**Step 1**：修改 `totalPanels` → `5`

**Step 2**：删除多余 `<section>` 和对应背景样式

**Step 3**：更新 `/ 7` → `/ 5`

> 其余逻辑（克隆、导航点数量、进度条）都基于 `totalPanels` 自动计算，**无需手动调整**。

---

## 7. 配置与可调参数

| 参数 | 位置 | 默认值 | 说明 |
|------|------|--------|------|
| `totalPanels` | 第 9 行 | `7` | 面板总数（必须 ≥ 2） |
| Snap duration | 第 142 行 | `{min: 0.2, max: 0.45}` | Snap 吸附动画时长范围（秒） |
| Snap delay | 第 143 行 | `0.05` | 停止滚动后延迟触发吸附（秒） |
| Snap ease | 第 144 行 | `'power1.inOut'` | 吸附缓动函数 |
| 边界跳转防抖 | 第 75/80 行 | `500` | isJumping 恢复时间（ms） |
| 触屏滑动阈值 | 第 114 行 | `50` | 触摸滑动最小距离（px） |
| 响应式断点 | 第 257 行 | `768px` | 移动端适配断点 |

---

## 8. 事件系统

| 事件 | 绑定目标 | 触发条件 |
|------|---------|---------|
| `scroll` | `containerEl` | 容器滚动时实时触发 |
| `keydown` | `document` | 键盘方向键/翻页键 |
| `touchstart` | `document` | 触屏开始触摸 |
| `touchend` | `document` | 触屏结束触摸（计算滑动距离） |

### 键盘快捷键

| 按键 | 行为 |
|------|------|
| `↓` / `PageDown` | 下一页 |
| `↑` / `PageUp` | 上一页 |
| `Home` | 跳到第一屏 |
| `End` | 跳到最后一屏 |

---

## 9. 导航点交互

- **悬停**：放大 1.3 倍 + 半透明白色
- **激活态（`.infinite-scroll-active`）**：蓝色 `#6c8cff` + 发光阴影 + 放大 1.4 倍
- **点击**：调用 `goToPanel(i)`，先禁用 ScrollTrigger snap → 直接设置 scrollTop → 下一帧恢复 snap（避免 snap 与手动跳转冲突）

---

## 10. 生命周期

```
onMounted ──→ nextTick(init)
                ├── 获取 DOM 引用（getElementById）
                ├── 克隆首屏面板（无限循环）
                ├── 创建 ScrollTrigger snap
                ├── 绑定事件（scroll, keydown, touch）
                ├── 创建导航点
                └── 初始化 UI（updateUI(0)）

onUnmounted ──→ destroy()
                ├── 销毁所有 ScrollTrigger（st.kill()）
                ├── 移除 scroll 事件
                └── 移除 document 事件
```

---

## 11. 常见问题与解决方案

### Q1：导航点高亮不生效
检查 `.infinite-scroll-active` 是否在**非 scoped** 的 `<style>` 块中定义。scoped 样式会给选择器加 hash（如 `.infinite-scroll-active[data-v-xxx]`），导致 JS 动态添加的 class 无法匹配。

### Q2：克隆面板内容与首屏不一致
克隆是 `cloneNode(true)` 深拷贝，只会复制 HTML 结构和内联样式。如果首屏内容依赖 JS 动态生成（如 Canvas、Vue 响应式数据），克隆面板不会同步。解决方案：① 确保首屏内容是纯静态 HTML；② 或在克隆后手动同步状态。

### Q3：滚动卡顿或跳跃
- 检查 `isJumping` 是否正确恢复（500ms 超时）
- 检查 ScrollTrigger snap 的 `duration` 是否过长
- 检查是否有多余的 ScrollTrigger 没有 destroy

### Q4：在移动端触屏滑动不灵敏
调整 `onTouchEnd` 中的阈值（当前 50px）。减小该值让滑动更容易触发，增大则要求更大幅度的滑动手势。

---

## 12. 扩展指南

### 添加面板内入场动画

在 `init()` 中为每个 `.infinite-scroll-panel` 的内部元素添加 ScrollTrigger 动画：

```ts
panels.forEach((panel, i) => {
  const title = panel.querySelector('.panel-title')
  if (title) {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top center',
      onEnter: () => gsap.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6 })
    })
  }
})
```

### 添加鼠标滚轮阻尼/平滑

可以在 `onScroll` 或 `containerEl` 的 `wheel` 事件中使用 GSAP 的 `gsap.to(containerEl, { scrollTo: ... })` 实现更平滑的滚动。

### 替换为横向滚动

将 `scrollTop` 改为 `scrollLeft`，`vh` 改为 `vw`，容器改为 `overflow-x: auto`，面板改为 `width: 100vw`，即可转换为横向无限滚动。

---

## 13. 依赖项

| 包 | 版本要求 | 用途 |
|---|---------|------|
| `vue` | `^3.x` | 框架 |
| `gsap` | `^3.x` | 滚动吸附动画 |
| `gsap/ScrollTrigger` | `^3.x` | GSAP 滚动插件 |
