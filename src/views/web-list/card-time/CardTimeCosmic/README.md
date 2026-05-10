# CardTimeCosmic - 多维星轨重组

科幻旗舰级卡片动画效果，展示空间解构与重组的震撼视觉体验。

## 效果特点

- **三层切片结构**：前景、中景、背景各自独立运动
- **景深模糊**：切片带有不同层级的模糊效果
- **粒子爆发**：聚合瞬间释放粒子光点
- **3D 透视**：卡片支持 3D 旋转与倾斜
- **深空主题**：星场、星云、粒子背景

## 动画流程

1. **散开状态**：三切片沿不同轴向旋转漂移
2. **聚合阶段**：切片向中心汇聚，恢复清晰度
3. **粒子爆发**：聚合瞬间释放 12 颗粒子光点
4. **完美形态**：卡片阴影与边框完善

## 技术实现

- Vue3 Composition API
- GSAP Timeline 编排
- ScrollTrigger 滚动触发
- CSS 3D Transform
- 动态粒子生成

## 使用方式

```vue
<template>
  <CardTimeCosmic />
</template>

<script setup>
import CardTimeCosmic from '@/views/web-list/card-time/CardTimeCosmic/CardTimeCosmic.vue'
</script>
```
