# CardTimeGravity - 重力崩塌

重力崩塌·卡片坠入重组动画效果，展示高端暗黑的物理震撼体验。

## 效果特点

- **悬浮高度入场**：卡片初始悬浮在 -100px 高度
- **重力加速度下落**：`power4.in` 模拟自由落体加速
- **惯性延迟元素**：图标、标题、描述依次延迟下落
- **落地阴影爆发**：`boxShadow` 从 0 到 `0 30px 60px`
- **弹性回弹效果**：`back.out(2)` / `back.out(1.5)` 弹性缓动

## 动画流程

1. **悬浮状态**：卡片 y: -100，元素各自偏移
2. **重力坠入**：`power4.in` 加速下落
3. **落地冲击**：`boxShadow` 阴影炸裂
4. **元素惯性下落**：图标、标题、分割线、描述依次延迟
5. **回弹稳定**：弹性缓动收尾

## 技术实现

- Vue3 Composition API
- GSAP Timeline 编排
- ScrollTrigger 滚动触发
- `power4.in` 重力加速度缓动
- `back.out()` 弹性回弹效果

## 使用方式

```vue
<template>
  <CardTimeGravity />
</template>

<script setup>
import CardTimeGravity from '@/views/web-list/card-time/CardTimeGravity/CardTimeGravity.vue'
</script>
```
