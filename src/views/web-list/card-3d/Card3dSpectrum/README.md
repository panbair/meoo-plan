# Card3dSpectrum - 光谱折跃·3D幻变卡片阵列

> CSS3滤镜 + 透视 + 光影顶级视觉特效组件

## 特性

- **光谱折跃动画**：8张卡片从中心奇点沿3D轨迹炸裂展开
- **CSS3滤镜系统**：blur/brightness/saturate 动态渐变
- **3D透视空间**：perspective/transform-style/backface-visibility
- **霓虹光影**：box-shadow 多层发光效果
- **双向闭环**：ScrollTrigger scrub:2 丝滑滚动控制

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS

## 使用方式

```vue
<template>
  <Card3dSpectrum />
</template>

<script setup>
import Card3dSpectrum from '@/views/web-list/card-3d/Card3dSpectrum/Card3dSpectrum.vue'
</script>
```

## 核心CSS3属性

| 属性 | 用途 |
|------|------|
| `perspective` | 3D透视深度 |
| `transform-style: preserve-3d` | 3D空间渲染 |
| `backface-visibility` | 背面隐藏 |
| `filter: blur/brightness/saturate` | 光谱滤镜 |
| `box-shadow` | 霓虹光影 |

## 动画阶段

1. **奇点状态**：blur(20px) brightness(0) saturate(0)
2. **穿透空间**：blur(8px) → 3D旋转180°
3. **炸裂展开**：8方向散开 + 滤镜清晰化
4. **悬浮呼吸**：持续浮动 + 光影闪烁
