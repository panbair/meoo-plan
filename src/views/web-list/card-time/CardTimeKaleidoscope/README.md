# CardTimeKaleidoscope - 万花筒棱镜

万花筒棱镜·碎片旋转变焦重组动画效果，展示迷幻奢华的视觉冲击体验。

## 效果特点

- **8个三角形碎片**：使用 clip-path 切割成不规则碎片
- **随机散布入场**：碎片初始随机分布在空间中
- **万花筒旋转聚拢**：碎片像万花筒旋转般飞向中心
- **棱镜色散光晕**：拼合瞬间触发彩虹光晕爆发
- **模糊消散**：碎片从 blur(8px) 到 blur(0px) 逐渐清晰

## 动画流程

1. **碎片散布**：8个碎片随机分布在 -350~350px 范围内
2. **旋转聚拢**：stagger from 'random'，back.out 弹性效果
3. **棱镜爆发**：scale 0.3 → 3 → 1.5 光晕扩散
4. **内容显现**：opacity 0 → 1，scale 0.85 → 1
5. **碎片淡出**：opacity 0.9 → 0，留下完整卡片

## 技术实现

- Vue3 Composition API
- GSAP Timeline 编排
- ScrollTrigger 滚动触发
- CSS clip-path 三角形切割
- 动态粒子生成

## 使用方式

```vue
<template>
  <CardTimeKaleidoscope />
</template>

<script setup>
import CardTimeKaleidoscope from '@/views/web-list/card-time/CardTimeKaleidoscope/CardTimeKaleidoscope.vue'
</script>
```
