# CardTimeCubeFlip 3D翻折渐现卡片

科技高级・立体空间感 - 3D Y轴翻折渐现动画

## 特性

- **3D Y轴翻折**: `rotateY: 70` → `0` 翻折渐现效果
- **科技网格背景**: 12×12 透视网格线动画
- **悬浮翻转交互**: 鼠标悬停时卡片翻转显示背面数据
- **Z轴深度控制**: ScrollTrigger 控制卡片 Z 轴位移
- **赛博青色主题**: #00c8ff 科技感配色

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 标签入场
tl.to(eyebrowRef, { opacity: 1, y: 0, duration: 0.5 })

// Step 2: 标题副标题入场
tl.to([titleRef, subtitleRef], {
  opacity: 1, y: 0, stagger: 0.1
}, '-=0.3')

// Step 3: 3D翻折渐现
tl.from(cubes, {
  opacity: 0, rotateY: 70, y: 40, scale: 0.85, stagger: 0.15
}, '-=0.2')
```

### ScrollTrigger 滚动动画

| 卡片 | 效果 |
|------|------|
| C1/C5 边缘 | X ±50 + Z -100 + rotateY ±15 + rotateX ±10 + 缩小 |
| C3 中心 | scale(1.12) + Z +100 + 阴影加深 |

### 交互

- **悬停翻转**: 鼠标进入时卡片 3D 翻转 180° 显示背面数据

## 使用

```vue
<template>
  <CardTimeCubeFlip />
</template>

<script setup lang="ts">
import CardTimeCubeFlip from './card-time/CardTimeCubeFlip/CardTimeCubeFlip.vue'
</script>
```
