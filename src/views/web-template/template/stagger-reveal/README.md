# Stagger Reveal 交错渐现卡片组件 - 开发方案

## 1. 组件概述

**交错卡片渐现模板**，适合作品集/案例展示页面。6 张卡片呈左右交替布局，每张卡片在进入视口时从侧边滑入 + 渐现 + 缩放，形成优雅的交错揭示效果。

核心特点：

- **左右交替**：奇数卡片从左滑入，偶数卡片从右滑入
- **3D 入场**：带 `rotateY` 透视旋转的滑入动画
- **编号水印**：每段有半透明大号数字作为背景装饰
- **Hero + Footer**：首尾有独立的 Hero 和 CTA 段落

---

## 2. 页面结构

```
.stagger-brand-page
├── .stagger-hero              ← 首屏 Hero，渐变标题 + 向下滚动提示
├── .stagger-card-section × 6  ← 6 张卡片，左右交替
│   ├── .stagger-section-number ← 背景大号数字（01~06）
│   └── .stagger-card
│       ├── .stagger-card-visual ← 左侧渐变占位图
│       └── .stagger-card-body   ← 右侧文字内容
└── .stagger-footer            ← 尾段 CTA
```

---

## 3. 左右交替实现

```html
<!-- 偶数 i：stagger-left（卡片在左，图片在左） -->
<section class="stagger-section stagger-card-section stagger-left" :data-card="i">
  <div class="stagger-card">
    <div class="stagger-card-visual">...</div>
    <div class="stagger-card-body">...</div>
  </div>
  <div class="stagger-section-number">01</div>
</section>

<!-- 奇数 i：stagger-right（卡片在右，图片在右，文字右对齐） -->
<section class="stagger-section stagger-card-section stagger-right" :data-card="i">
  <div class="stagger-card">
    <!-- 注意：right 模式下 flex-direction: row-reverse -->
    <div class="stagger-card-visual">...</div>
    <div class="stagger-card-body">...</div>
  </div>
  <div class="stagger-section-number">02</div>
</section>
```

通过 `:class="i % 2 === 0 ? 'stagger-left' : 'stagger-right'"` 动态切换。

---

## 4. 入场动画

```ts
// 左卡片从左边飞入
gsap.fromTo(card, {
  x: -80, opacity: 0, scale: 0.92, rotateY: 15
}, {
  x: 0, opacity: 1, scale: 1, rotateY: 0,
  duration: 0.8, ease: 'power3.out'
})

// 右卡片从右边飞入
gsap.fromTo(card, {
  x: 80, opacity: 0, scale: 0.92, rotateY: -15
}, {
  x: 0, opacity: 1, scale: 1, rotateY: 0,
  duration: 0.8, ease: 'power3.out'
})
```

动画通过 `ScrollTrigger.create()` 在 `onEnter` 回调中触发，支持 `onLeaveBack` 反向动画。

---

## 5. 导航标记

使用 `ScrollTrigger.create({ start: 'top 40%', end: 'bottom 40%' })` 在段落进入视口中心区域时更新导航点、进度条和页码指示器。

---

## 6. CSS 类名命名规范

**所有类名统一以 `stagger-` 为前缀**：

| 类名 | 作用 |
|------|------|
| `.stagger-brand-page` | 根容器 |
| `.stagger-section` | 段落通用 |
| `.stagger-hero` / `.stagger-card-section` / `.stagger-footer` | 段落类型 |
| `.stagger-left` / `.stagger-right` | 左右布局方向 |
| `.stagger-card` / `.stagger-card-visual` / `.stagger-card-body` | 卡片结构 |
| `.stagger-section-number` | 背景编号水印 |
| `.stagger-img-{1..6}` | 6 种渐变占位图 |
| `.stagger-nav-*` / `.stagger-progress-bar` / `.stagger-page-indicator` | 全局导航（非 scoped） |

---

## 7. 数据驱动

卡片数据为静态数组，可轻松替换为 API 数据：

```ts
const cards = [
  { tag: 'BRANDING', title: '品牌形象设计', desc: '...', img: '1' },
  // ... 6 张卡片
]
```

`img` 字段对应 CSS 类 `.stagger-img-{N}`，控制视觉区的渐变占位图颜色。

---

## 8. 扩展方向

- **替换真实图片**：将 `.stagger-card-visual` 内的渐变改为 `<img>` 标签
- **添加过滤/分类**：顶部加 tab 过滤按钮，根据 `tag` 筛选卡片
- **画廊模式**：改 2 列/3 列网格布局替代左右交替
- **更多入场效果**：飞入改为淡入放大、clip-path 揭示、模糊渐现等
