# CardTimeEpicenter 震中扩散卡片

顶级聚焦・官网爆款 - 中心缩放扩散效果

## 特性

- **中心缩放扩散**: 以中间卡片为原点，向四周扩散式缩放入场
- **震中光环背景**: 三层同心圆环形动画
- **科技青色主题**: #00f5d4 科技感配色
- **3D 景深旋转**: perspective: 1400px + 卡片空间旋转
- **永久悬浮微动**: stagger from center 丝滑循环

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 背景光环入场
tl.to(rings, {
  opacity: 1, scale: 1, duration: 1.2, stagger: 0.2
})

// Step 2: 标题入场
tl.to([titleRef, subtitleRef], {
  opacity: 1, y: 0, duration: 0.5, stagger: 0.1
}, '-=0.8')

// Step 3: 中心爆发
tl.to(c3, {
  opacity: 1, scale: 1, y: 0, ease: 'back.out(1.4)'
})

// Step 4: 向内层扩散
tl.to([c2, c4], { opacity: 1, scale: 1, y: 0 }, '-=0.35')

// Step 5: 向外层扩散
tl.to([c1, c5], { opacity: 1, scale: 1, y: 0 }, '-=0.3')

// Step 6: 悬浮微动
tl.to(cards, {
  y: -6, duration: 1.5, repeat: -1, yoyo: true,
  stagger: { each: 0.1, from: 'center' }
}, '+=0.2')
```

### ScrollTrigger 滚动动画

| 卡片 | 效果 |
|------|------|
| C1/C5 边缘 | X轴大偏移 + Y轴下沉 + 旋转 + 透明度降低 + 缩小 |
| C3 中心 | 放大 scale(1.15) + Y轴上移 + 光晕阴影加深 |

## 使用

```vue
<template>
  <CardTimeEpicenter />
</template>

<script setup lang="ts">
import CardTimeEpicenter from './card-time/CardTimeEpicenter/CardTimeEpicenter.vue'
</script>
```
