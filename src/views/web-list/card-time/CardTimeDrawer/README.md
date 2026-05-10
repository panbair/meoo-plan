# CardTimeDrawer - 记忆抽屉卡片

## 设计理念

3D 景深拉出 · 档案展示 — 每一张卡片都像是一份藏在记忆深处的文件，平时只露出标签栏。当用户滚动至此时，它们以 3D 透视的方式从屏幕内部向外拉出，仿佛从深邃的桌面上逐一显现。

## 核心特性

- **3D 抽屉拉出效果**: 利用 CSS transform-style: preserve-3d
- **景深变换**: rotateY、rotateX、z 轴位移
- **ScrollTrigger 驱动**: 滚动触发动画
- **档案标签设计**: 文件夹式标签卡片
- **悬停 3D 交互**: 鼠标跟随倾斜效果

## 技术实现

| 技术 | 用途 |
|------|------|
| Vue 3 | 组件框架 |
| TypeScript | 类型安全 |
| GSAP | 3D 动画引擎 |
| ScrollTrigger | 滚动动画控制 |
| SCSS | 样式预处理 |

## 动画机制

### 抽屉拉出初始状态
```javascript
gsap.set(card, {
  rotateY: -35,
  rotateX: 5,
  z: -120,
  y: 60,
  opacity: 0,
  scale: 0.85
})
```

### 拉出动画
```javascript
gsap.to(card, {
  rotateY: 0,
  rotateX: 0,
  z: 0,
  y: 0,
  opacity: 1,
  scale: 1,
  duration: 0.8,
  ease: 'power3.out'
})
```

### 悬停 3D 跟随
```javascript
const x = (mouseX - cardCenterX) / cardWidth
const y = (mouseY - cardCenterY) / cardHeight
gsap.to(card, {
  rotateY: x * 15,
  rotateX: -y * 10
})
```

## 卡片数据

| 标签 | 标题 | 状态 |
|------|------|------|
| 计划 | 项目计划 | 进行中 |
| 实验 | 实验数据 | 已归档 |
| 报告 | 年度报告 | 已完成 |
| 档案 | 个人档案 | 私密 |
| 灵感 | 创意笔记 | 收集中 |

## 文件结构

```
CardTimeDrawer/
├── CardTimeDrawer.vue    # 组件源码
└── README.md             # 本文档
```

## 使用方式

```vue
<template>
  <CardTimeDrawer />
</template>
```

## 视觉效果

1. 滚动进入视口时卡片从 3D 空间拉出
2. rotateY: -35° → 0° 产生抽屉拉出感
3. z: -120px → 0px 产生深度感
4. 阴影随深度变化
5. 悬停时鼠标跟随 3D 倾斜

## 组件尺寸

- 宽度: 100vw
- 高度: min-height 100vh
