# CardAllInOne 全能动画卡片

> 汇聚12种滚动动画效果的卡片组件

## 特性

- 🎬 **12种入场动画** - 从两边边缘、渐变、形变、淡入等
- 🔄 **12种滚动动画** - 每张卡片展示不同动画组合
- ✨ **GSAP + ScrollTrigger** - 专业的动画控制
- 🎨 **霓虹科技风格** - 深色背景配霓虹发光

## 动画清单

| 卡片 | 入场动画 | 滚动动画 |
|------|----------|----------|
| 01 | 从两边边缘进入 | 位移 |
| 02 | 渐变出来 | 渐变 |
| 03 | 形变出来 | 形变 |
| 04 | 淡入淡出 | 淡出 |
| 05 | 旋转进入 | 旋转 |
| 06 | 缩放进入 | 缩放 |
| 07 | 位移进入 | 位移 |
| 08 | 旋转缩放位移 | 旋转缩放位移 |
| 09 | 位移旋转缩放 | 位移旋转缩放 |
| 10 | 位移旋转缩放渐变 | 位移旋转缩放渐变 |
| 11 | 位移旋转缩放渐变旋转缩放位移 | 位移旋转缩放渐变旋转缩放位移 |
| 12 | 位移旋转缩放渐变旋转缩放位移旋转缩放渐变 | 位移旋转缩放渐变旋转缩放位移旋转缩放渐变 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS

## 快速开始

```vue
<template>
  <CardAllInOne />
</template>

<script setup lang="ts">
import CardAllInOne from '@/views/web-list/card-list/CardAllInOne/CardAllInOne.vue'
</script>
```
