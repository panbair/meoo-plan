# CardImgFlipCard · 微倾落地 · 3D卡片翻转入场

## 概述

CardImgFlipCard 组件实现"微倾落地·3D卡片翻转入场"效果，图片如艺术卡片悬浮，通过 GSAP Timeline 驱动重力与弹性联动，完成优雅的3D翻转落地动画。

## 动画效果

### 核心动画流程

1. **初始待落姿态**：rotateX: -8deg 后倾，y: 15px，scaleY: 0.96
2. **重力翻转落地**：rotateX 归零，y 归零，power4.out
3. **微弹锁定**：back.out(1.2) 产生2-3px回弹
4. **阴影演化**：模糊浅影 → 锐化深影
5. **依次轻叩**：stagger: 0.1 形成连续节奏

### 技术实现

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始 rotateX | -8deg | 后倾待落 |
| 初始 y | 15px | 低于位置 |
| 初始 scaleY | 0.96 | 透视缩短 |
| duration | 0.7s | 翻转时长 |
| ease | power4.out | 重力加速 |
| stagger | 0.1 | 入场间隔 |

## 使用说明

```vue
<template>
  <CardImgFlipCard />
</template>

<script setup lang="ts">
import CardImgFlipCard from '@/views/web-list/card-img/CardImgFlipCard/CardImgFlipCard.vue'
</script>
```
