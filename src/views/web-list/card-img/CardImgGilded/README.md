# CardImgGilded - 鎏金流幕·流体金属背景视差

## 概述

这是一个模拟鎏金流体金属质感的图片展示组件。通过流体纹理、金属光泽、漩涡动画和鼠标引力效果，创造出液态金属在重力作用下沉降的视觉体验。

## 视觉特性

| 元素 | 描述 |
|------|------|
| **流体背景** | SVG feTurbulence 滤镜实现流动感 |
| **金属拉丝** | 金属颜料在暗色基底上流淌 |
| **漩涡效果** | 中心旋转的流体纹理 |
| **鼠标引力** | 光标周围产生引力扰动 |
| **颗粒噪点** | 金属材质触感 |
| **色相循环** | 暖金与冷铜之间缓慢变化 |

## 动画效果

- **缓慢漂移**：背景以 0.08 低速系数向下漂移
- **流体变形**：feTurbulence 参数持续变化
- **漩涡旋转**：中心区域缓慢旋转
- **引力聚拢**：鼠标移动时局部流体聚拢
- **噪点呼吸**：颗粒若隐若现

## 使用方法

```vue
<template>
  <CardImgGilded />
</template>

<script setup lang="ts">
import CardImgGilded from '@/views/web-list/card-img/CardImgGilded/CardImgGilded.vue'
</script>
```
