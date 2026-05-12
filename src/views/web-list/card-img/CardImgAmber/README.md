# CardImgAmber · 时间琥珀 · 超现实钟表呼吸动效

## 概述

CardImgAmber 组件实现"时间琥珀·超现实钟表呼吸动效"效果，图片如达利风格的超现实梦境，通过 GSAP Timeline 驱动多层次循环呼吸动效，营造永恒流动的时间感。

## 动画效果

### 核心动画流程

1. **不对称缩放**：1.0 ↔ 1.018，周期 8s（吸气 5.5s + 呼气 2.5s）
2. **对角线漂移**：X: -2px ↔ +2px，Y: -1px ↔ +3px，周期 13s
3. **热浪扭曲**：嵌套小周期 3s 波动
4. **色温漂移**：hue-rotate -5° ↔ +5°，周期 15s
5. **暗角呼吸**：四角暗角同步微调

### 技术实现

| 参数 | 值 | 说明 |
|------|-----|------|
| scale 范围 | 1.0 ~ 1.018 | 不对称呼吸 |
| scale 周期 | 8s | 吸气5.5s + 呼气2.5s |
| 位移 | 对角线 | 13s周期 |
| 色温漂移 | hue-rotate | 15s超长周期 |
| 热浪 | 嵌套3s | 局部扭曲 |

## 使用说明

```vue
<template>
  <CardImgAmber />
</template>

<script setup lang="ts">
import CardImgAmber from '@/views/web-list/card-img/CardImgAmber/CardImgAmber.vue'
</script>
```
