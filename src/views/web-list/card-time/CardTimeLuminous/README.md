# CardTimeLuminous 由内发光浮现卡片

轻奢静谧・柔和高级感 - 由内发光浮现动画

## 特性

- **由内发光浮现**: 低透明度 + 缩小状态缓慢浮现
- **阴影由内扩散**: boxShadow 从无到有的扩散效果
- **柔和光晕背景**: 三个粉色/蓝色/橙色光球背景
- **静谧优雅设计**: 淡粉、淡蓝、奶油色调色板
- **永久轻柔浮动**: stagger from center 丝滑悬浮

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 标题入场
tl.to([eyebrowRef, titleRef, subtitleRef], {
  opacity: 1, y: 0, stagger: 0.1
})

// Step 2: 卡片浮现
tl.from(cardInners, {
  opacity: 0, scale: 0.75, stagger: 0.12
}, '-=0.3')

// Step 3: 光晕扩散
tl.to(cardGlows, {
  opacity: 1, scale: 1, stagger: 0.12
}, '-=0.8')

// Step 4: 阴影扩散
tl.to(cardInners, {
  boxShadow: '0 10px 40px rgba(255, 255, 255, 0.08)'
}, '-=0.6')
```

### ScrollTrigger 滚动动画

| 卡片 | 效果 |
|------|------|
| C1/C5 边缘 | X ±40 + Y +20 + 缩小 + 降低亮度 |
| C3 中心 | scale(1.08) + Y上移 -20 + 阴影加深 + 亮度提升 |

### 设计风格

- 柔和粉彩色调 (#ffb6c1, #bae1ff, #ffd8be)
- Cormorant Garamond 衬线字体
- 毛玻璃效果背景
- 极简优雅布局

## 使用

```vue
<template>
  <CardTimeLuminous />
</template>

<script setup lang="ts">
import CardTimeLuminous from './card-time/CardTimeLuminous/CardTimeLuminous.vue'
</script>
```
