# CardImgMorningMist · 晨雾弥散 · 记忆显影呼吸动效

## 概述

CardImgMorningMist 组件实现"晨雾弥散·记忆显影呼吸动效"效果，图片初始被薄雾笼罩，通过 GSAP Timeline 驱动雾气从中心向两侧解开，营造安静而深情的回忆显影氛围。

## 动画效果

### 核心动画流程

1. **初始状态**：blur: 15px，translateX: 20px，opacity: 0.75
2. **雾气弥散**：blur 15px → 0，duration: 2.5s
3. **向左回正**：translateX 20px → 0px
4. **锐化过冲**：模糊消退至 90% 时 blur 短暂 -0.5px 后回零
5. **亮度提升**：brightness 0.9 → 1.0
6. **柔光渐隐**：边缘柔光镶边随雾散消退

### 技术实现

| 参数 | 值 | 说明 |
|------|-----|------|
| 初始 blur | 15px | 极度朦胧 |
| 初始 translateX | 20px | 偏右悬浮 |
| 初始 opacity | 0.75 | 半隐半现 |
| 初始 brightness | 0.9 | 微暗 |
| duration | 2.5s | 舒缓节奏 |
| ease | sine.inOut | 无顿挫 |

## 使用说明

```vue
<template>
  <CardImgMorningMist />
</template>

<script setup lang="ts">
import CardImgMorningMist from '@/views/web-list/card-img/CardImgMorningMist/CardImgMorningMist.vue'
</script>
```
