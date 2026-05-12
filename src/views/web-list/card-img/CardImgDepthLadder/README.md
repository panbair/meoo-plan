# CardImgDepthLadder · 空间纵深阶梯 · 景深错落入场

## 概述

CardImgDepthLadder 组件实现"空间纵深阶梯·景深错落入场"效果，图片以前、中、后三个景深层分布，通过 GSAP Timeline 驱动从远及近依次弹入画面，营造三维展廊的空间纵深感。

## 动画效果

### 核心动画流程

1. **景深分布**：图片初始按远(-60px)、中(-30px)、近(0px) 三个景深层分布
2. **引力波推进**：从最远层开始向前逐层推进，stagger: 0.2
3. **景深递进**：`translateZ` 归零、`blur` 从模糊至清晰
4. **微弹锁定**：触位时 3px 微弹 + 阴影加深
5. **亮度聚焦**：全局 brightness 0.85 → 1.0

### 技术实现

| 参数 | 值 | 说明 |
|------|-----|------|
| 景深层 | 3层 | 前/中/后景 |
| stagger | 0.2 | 层间间隔 |
| duration | 0.5s | 单层动画时长 |
| ease | power3.out | 弹入缓动 |
| blur | 8px → 0 | 远景模糊消退 |

## 使用说明

```vue
<template>
  <CardImgDepthLadder />
</template>

<script setup lang="ts">
import CardImgDepthLadder from '@/views/web-list/card-img/CardImgDepthLadder/CardImgDepthLadder.vue'
</script>
```
