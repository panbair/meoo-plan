# Card3dHologram - 复古全息·3D扫描卡片阵

> CSS胶片滤镜+滚动扫描展开特效

## 效果特点

- **初始状态**：所有卡片压缩为全息扫描核心
  - `filter: brightness(0.3) contrast(1.3) saturate(0.5)` 模拟胶片暗调
  - Z轴深景压缩 `z: -800px`
  - `scaleX: 0.3, scaleY: 0.4` 极端压缩
  - `backface-visibility: hidden` 隐藏背面

- **滚动触发展开**：
  - 扫描预热：卡片上浮 `z: -200px`，亮度提升
  - 扫描展开：卡片沿水平轨迹依次弹出
  - 轻微错落：`y += random(-15, 15)` 避免呆板
  - 滤镜渐变：暗调胶片 → 清晰全息

- **复古全息悬浮**：
  - 展开后保持轻微3D倾斜 `rotateX: 8deg`
  - 微弱悬浮动画 `y: +=6px`
  - 扫描光线持续从上到下循环

- **完美双向动画**：
  - 向上滚动卡片收缩回扫描核心
  - 滤镜反向过渡

## 技术实现

- **CSS3 3D核心**：
  - `perspective: 1600px` 复古全息透视感
  - `transform-style: preserve-3d` 维持3D空间
  - `backface-visibility: hidden` 强化立体

- **复古滤镜系统**：
  - 胶片暗调：`brightness(0.3) contrast(1.3) saturate(0.5)`
  - 全息清晰：`brightness(1) contrast(1.1) saturate(1)`
  - 颗粒噪点动画：`grain-overlay` 持续位移

- **扫描光线**：
  - 循环从顶部到底部
  - `box-shadow` 多层光晕
  - 营造扫描仪效果

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| perspective | 1600px | 透视深度 |
| 初始 z | -800px | 深度压缩 |
| 展开 z | 0 | 归位 |
| rotateX | 25° → 8° | 3D倾斜 |
| stagger | 0.08-0.1s | 扫描延迟 |
| scrub | 2 | 平滑滚动 |

## 视觉元素

- **复古网格背景**：60px 间隔网格线
- **暗角叠加**：边缘渐暗聚焦中心
- **扫描光线**：持续循环扫描
- **状态指示器**：ACTIVE / STANDBY / IDLE
- **数据进度条**：显示数据百分比

## 使用方式

```vue
<template>
  <Card3dHologram />
</template>

<script setup>
import Card3dHologram from './card-3d/Card3dHologram/Card3dHologram.vue'
</script>
```

## 注意事项

- 组件会自动注册 GSAP ScrollTrigger
- 使用 Vue3 `ref` 数组精准绑定 DOM
- 展开动画完成后自动启动悬浮微动
- 组件卸载时清理所有动画和样式
