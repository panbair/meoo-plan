# CardImgStardust - 星尘聚合·图片粒子视差重组

## 效果描述

纯黑深空，图片被离散为数万个矩形光粒，初始沿 Z 轴在三个深度层随机飘散，形成模糊彩色星云。Timeline 驱动引力场启动，光粒沿弯曲轨迹向各自原始像素位置飞行。不同深度的粒子移动速度不同，近景粒子疾驰，远景粒子缓移，产生强烈的多层视差。

## 核心特性

### 1. 图片粒子化
- Canvas 采样图片颜色
- 60×40 粒子点阵（2400个粒子）
- 每个粒子承载原始坐标颜色

### 2. 三层景深
- **前景层 (Front)**: `translateZ: 100-200px`, 速度最快
- **中景层 (Middle)**: `translateZ: -50~50px`, 速度中等
- **远景层 (Back)**: `translateZ: -200~-100px`, 速度最慢

### 3. 粒子聚合动画
- Timeline 分段驱动粒子归位
- 远景→中景→近景依次聚合
- 贝塞尔弯弧轨迹
- opacity 从半透到实色

### 4. 鼠标交互
- 鼠标移动产生视差偏移
- 悬停触发径向推力
- 粒子散开后弹性弹回
- `elastic.out` 弹性缓动

### 5. ScrollTrigger 滚动控制
| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `container` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数 |

## 技术实现

### Vue3 组件架构
- `<script setup>` 语法
- Canvas API 图片采样
- `ref` / `reactive` 响应式状态
- 函数式 `setRef` 收集 DOM 引用

### GSAP 动画系统
- `gsap.timeline()` 主时间线
- `ScrollTrigger` 滚动驱动
- `stagger` 交错动画
- `elastic.out` 弹性缓动
- `filter: blur()` 景深效果

### 性能优化
- `will-change` CSS 属性
- 粒子数量可控 (2400)
- 适当的 filter 值
- 事件解绑清理

## 使用方式

```vue
<template>
  <CardImgStardust />
</template>

<script setup lang="ts">
import CardImgStardust from './card-img/CardImgStardust/CardImgStardust.vue'
</script>
```

## 配置参数

### 粒子配置
```typescript
const PARTICLE_ROWS = 40      // 粒子行数
const PARTICLE_COLS = 60       // 粒子列数
const PARTICLE_GAP = 2          // 粒子间距
```

### 图片配置
```typescript
const mainImage = {
  url: 'https://images.unsplash.com/photo-xxx?w=1920&q=85',
  title: '永恒峰峦',
  description: '穿越时空的巍峨巅峰'
}
```

## 视觉效果

### 颜色系统
| 用途 | 颜色 |
|------|------|
| 金色光晕 | `#ffd700` |
| 青色粒子 | `#00f0ff` |
| 紫罗兰远景 | `#9966ff` |
| 橙色前景 | `#ff6600` |

### 动画阶段
1. **背景星空** - 60个随机闪烁星星
2. **粒子散布** - 从中心向四周扩散
3. **远景聚合** - 最慢速度聚拢
4. **中景聚合** - 中等速度聚拢
5. **近景聚合** - 最快速度聚拢
6. **图片呈现** - 合成完整图片

## 动画清理

组件 `onUnmounted` 时自动清理：
1. GSAP Timeline 和 tweens
2. ScrollTrigger 实例
3. 事件监听器
4. DOM 属性重置

## 响应式断点

| 宽度 | 进度条宽度 | 显示 |
|------|-----------|------|
| `> 1200px` | 200px | 全部显示 |
| `900-1200px` | 150px | 全部显示 |
| `< 900px` | 150px | 隐藏粒子数量 |
| `< 600px` | 120px | 全部精简 |
