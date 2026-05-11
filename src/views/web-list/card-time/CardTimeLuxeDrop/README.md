# CardTimeLuxeDrop 奢华坠落卡片

高端商务・精致落地感 - 弹性坠落回弹 + 左侧渐入倾斜滑入

## 特性

- **弹性坠落回弹**: 卡片从上向下坠落 + 落地轻微回弹 + 缩放弹性过渡
- **左侧渐入倾斜滑入**: 滚动时卡片从左侧滑入 + 小角度倾斜修正
- **中心优先对称扩散**: ScrollTrigger 控制卡片 3D 旋转和位移
- **永久悬浮微动**: 滚动离开后卡片持续丝滑微动

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 标题入场
tl.to([titleRef, subtitleRef], {
  opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
})

// Step 2: 弹性坠落
tl.from(cards, {
  y: -100, opacity: 0, scale: 0.9, stagger: 0.14, duration: 0.7
})

// Step 3: 第一层弹性放大
tl.to(cards, {
  scale: 1.04, duration: 0.25, stagger: 0.1, ease: 'power2.inOut'
})

// Step 4: 第二层稳定回弹
tl.to(cards, {
  scale: 1, duration: 0.3, stagger: 0.1
})
```

### ScrollTrigger 滚动动画

- 边缘卡片倾斜滑入
- 中心卡片放大提升
- 标题模糊消失效果

## 使用

```vue
<template>
  <CardTimeLuxeDrop />
</template>

<script setup lang="ts">
import CardTimeLuxeDrop from './card-time/CardTimeLuxeDrop/CardTimeLuxeDrop.vue'
</script>
```
