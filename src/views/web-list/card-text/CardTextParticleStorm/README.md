# CardTextParticleStorm - 粒子风暴撕裂组件

文字被粒子风暴撕裂、重组，展现狂暴的自然力量与文字的重生之美。

## 动画特点

- **风暴漩涡**: 背景螺旋旋转，模拟风暴眼效果
- **粒子飞溅**: 300+ 火焰色粒子高速运动
- **文字撕裂**: 点击触发撕裂效果，字符被风暴吹散
- **弹性重组**: 被撕裂的文字弹性恢复，增强视觉冲击
- **闪电效果**: 随机闪电闪烁，增强戏剧性

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎 (elastic 缓动)
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- CSS 旋转动画

## 使用示例

```vue
<template>
  <CardTextParticleStorm 
    title="粒子风暴" 
    subtitle="撕裂 · 重组 · 重生"
    :storm-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '粒子风暴' | 标题文字 |
| subtitle | string | '撕裂 · 重组 · 重生' | 副标题 |
| stormIntensity | number | 1 | 风暴强度 (0-2) |
