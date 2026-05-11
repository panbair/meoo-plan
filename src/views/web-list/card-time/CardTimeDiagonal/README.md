# CardTimeDiagonal 对角线滑入卡片

设计感小众・高级留白 - 对角线滑入动画

## 特性

- **对角线滑入**: 卡片从右上对角线方向滑入 + 微旋转
- **错落 stagger**: 0.12 秒错落时序
- **旋转修正**: Timeline 分段修正旋转角度
- **背景斜线**: 8 条斜向背景线条动画
- **高级留白设计**: 极简主义设计语言

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 标签入场
tl.to(tagRef, { opacity: 1, y: 0, duration: 0.5 })

// Step 2: 标题副标题入场
tl.to([titleRef, subtitleRef], { opacity: 1, y: 0, stagger: 0.1 }, '-=0.3')

// Step 3: 对角线滑入
tl.from(cards, {
  x: 50, y: -30, opacity: 0, rotate: 3, stagger: 0.12
}, '-=0.2')

// Step 4: 旋转归零
tl.to(cards, { rotate: 0, duration: 0.3 }, '-=0.4')
```

### ScrollTrigger 滚动动画

| 卡片 | 效果 |
|------|------|
| C1/C5 边缘 | X轴 ±40偏移 + Y轴 +30 + 旋转 ±6° + 缩小 |
| C3 中心 | scale(1.1) + Y上移 -25 + 阴影加深 |

## 使用

```vue
<template>
  <CardTimeDiagonal />
</template>

<script setup lang="ts">
import CardTimeDiagonal from './card-time/CardTimeDiagonal/CardTimeDiagonal.vue'
</script>
```
