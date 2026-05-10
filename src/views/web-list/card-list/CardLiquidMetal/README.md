# CardLiquidMetal - 液态金属卡片组件

## 简介

**CardLiquidMetal** 是一个未来科技风格的液态金属效果卡片组件，模拟真实液态金属的流动、光泽和反射效果。组件采用 Vue 3 + TypeScript + GSAP 技术栈，实现了丰富的动画效果和交互体验。

## 特性

- **液态金属背景** - Canvas 绘制的动态液态光斑效果
- **闪光粒子系统** - 漂浮的金属质感粒子
- **4种卡片效果** - 水滴、波浪、镜面反射、融合交互
- **丰富的 GSAP 动画**：
  - 标题从两侧边缘飞入
  - 卡片从不同方向入场（左侧、上方、下方、右侧）
  - 滚动时卡片位移 + 旋转 + 缩放组合效果
  - 卡片悬停时的 3D 翻转和发光效果
- **响应式设计** - 适配桌面和移动设备

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画 |
| SCSS | ^1.6 | 样式预处理 |

## 组件结构

```
CardLiquidMetal/
├── CardLiquidMetal.vue    # 主组件
└── README.md             # 本文档
```

## 使用方法

```vue
<template>
  <CardLiquidMetal />
</template>

<script setup lang="ts">
import CardLiquidMetal from './CardLiquidMetal/CardLiquidMetal.vue'
</script>
```

## 动画说明

### 入场动画

| 元素 | 动画效果 | 参数 |
|------|----------|------|
| 徽章 | 缩放 + 旋转 | `scale: 0→1`, `rotation: -180→0` |
| 标题行1 | 从左侧飞入 + 旋转Y轴 | `x: -200→0`, `rotationY: -90→0` |
| 标题行2 | 从右侧飞入 + 旋转Y轴 | `x: 200→0`, `rotationY: 90→0` |
| 副标题 | 上移淡入 | `y: 30→0`, `opacity: 0→1` |
| 卡片1 | 从左侧滑入 + 旋转 | `x: -300→0`, `rotation: -30→0` |
| 卡片2 | 从上方落下 + 弹跳 | `y: -300→0`, `scale: 0.6→1` |
| 卡片3 | 从下方升起 + 缩放 | `y: 300→0`, `scale: 1.3→1` |
| 卡片4 | 从右侧滑入 + 旋转 | `x: 300→0`, `rotation: 30→0` |

### 滚动动画

| 元素 | 动画效果 | 参数 |
|------|----------|------|
| 标题 | 位移 + 旋转 + 淡出 | `y: -150`, `opacity: 0`, `rotation: 5` |
| 卡片 | 位移 + 旋转 + 缩放 + 淡出 | `y: -80~140`, `rotation: ±5~13`, `scale: 0.75~0.9` |

### 悬停动画

| 效果 | 描述 |
|------|------|
| 卡片上浮 | `translateY(-15px)` |
| 3D 旋转 | `rotateX(5deg) rotateY(-5deg)` |
| 发光阴影 | 彩色 box-shadow |
| 闪光扫过 | shimmer 动画从左到右 |
| 图标放大 | `scale(1.1) rotate(5deg)` |

## 卡片数据

| ID | 标题 | 描述 | 指标 |
|----|------|------|------|
| 01 | 液态水滴 | 模拟真实水滴的表面张力效果 | 还原度 96%, 流畅度 60fps |
| 02 | 动态波浪 | 连续不断的波浪流动 | 流畅度 98%, 波浪数 12层 |
| 03 | 镜面反射 | 真实的镜面反射效果 | 分辨率 4K, 视角 180° |
| 04 | 融合交互 | 元素之间的自然融合 | 可能性 ∞, AI 驱动 |

## 自定义

### 修改卡片数据

在组件的 `liquidCards` 区域修改卡片内容：

```typescript
const liquidCards = [
  {
    id: 'custom',
    title: '自定义标题',
    desc: '自定义描述',
    icon: 'custom-icon',
    metrics: { value: '100%', label: '自定义指标' }
  }
]
```

### 修改主题色

在 SCSS 变量区域修改：

```scss
$primary: #your-color;    // 主色调
$secondary: #your-color;  // 辅助色
$accent: #your-color;     // 强调色
```

## 浏览器兼容

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 性能考虑

- Canvas 动画使用 `requestAnimationFrame`
- 组件卸载时自动清理所有动画
- 响应式设计适配不同屏幕尺寸

## License

MIT
