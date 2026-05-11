# CardTimeWave 波浪错落上浮卡片

灵动柔和・现代 UI 风 - 波浪错落上浮动画

## 特性

- **波浪错落上浮**: `y: 60 → 0` + stagger with `circ.out`
- **SVG波浪背景**: 双层波浪动画左右漂移
- **顶部波浪线装饰**: 卡片顶部彩色波浪进度条
- **现代青蓝主题**: #00acc1 清新科技感配色
- **永久波浪微动**: circ.out easing 持续浮动

## 动画逻辑

### 入场动画 Timeline

```javascript
// Step 1: 标题入场
tl.to([badgeRef, titleRef, subtitleRef], {
  opacity: 1, y: 0, stagger: 0.1
})

// Step 2: 波浪上浮
tl.from(cards, {
  y: 60, opacity: 0,
  stagger: { each: 0.1, ease: 'circ.out' }
}, '-=0.2')

// Step 3: 波浪线展开
tl.to(waveLines, {
  scaleX: 1, stagger: 0.08
}, '-=0.4')
```

### ScrollTrigger 滚动动画

| 卡片 | 效果 |
|------|------|
| C1/C5 边缘 | X ±45 + Y +25 + 旋转 ±5° + 缩小 |
| C3 中心 | scale(1.1) + Y -25 + 阴影加深 |

### 设计风格

- 青蓝渐变背景 (#e0f7fa → #80deea → #4dd0e1)
- 毛玻璃效果卡片
- Nunito Sans 现代字体
- 分页指示器样式

## 使用

```vue
<template>
  <CardTimeWave />
</template>

<script setup lang="ts">
import CardTimeWave from './card-time/CardTimeWave/CardTimeWave.vue'
</script>
```
