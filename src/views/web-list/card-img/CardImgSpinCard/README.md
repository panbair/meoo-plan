# CardImgSpinCard · 瞬闪翻正 · 3D卡片旋落入场

## 概述

CardImgSpinCard 组件实现"瞬闪翻正·3D卡片旋落入场"效果，图片如金属卡牌悬浮，通过 GSAP Timeline 驱动绕Y轴旋正归位，配合瞬间闪亮反馈，营造精准利落的入场节奏。

## 动画效果

### 核心动画流程

1. **待入姿态**：rotateY: 12deg 微偏，y: 8px 略低
2. **旋正归位**：rotateY 归零 + y 归零同步
3. **power3.in**：前段克制，后段急速
4. **到位闪烁**：box-shadow 瞬间闪亮
5. **依次旋正**：stagger: 0.09 形成连续序列

### 技术实现

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始 rotateY | 12deg | 微偏待入 |
| 初始 y | 8px | 略低于位置 |
| duration | 0.55s | 旋正时长 |
| ease | power3.in | 前缓后急 |
| stagger | 0.09 | 入场间隔 |
| 闪烁 | 0.3s | 瞬间反馈 |

## 使用说明

```vue
<template>
  <CardImgSpinCard />
</template>

<script setup lang="ts">
import CardImgSpinCard from '@/views/web-list/card-img/CardImgSpinCard/CardImgSpinCard.vue'
</script>
```
