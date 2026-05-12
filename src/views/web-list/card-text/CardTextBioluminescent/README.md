# CardTextBioluminescent - 生物发光组件

深海的幽蓝，生命的脉动。文字如同深海生物般散发着神秘的光芒。

## 动画特点

- **生物发光粒子**: 80+ 发光粒子漂浮呼吸，模拟深海生物
- **脉冲呼吸**: 粒子和字符亮度周期性脉动
- **海草摇曳**: 底部SVG海草随风摆动
- **气泡上升**: 15个气泡持续上升漂浮
- **深海氛围**: 深蓝渐变背景配合焦散光效

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- CSS 动画

## 使用示例

```vue
<template>
  <CardTextBioluminescent 
    title="生物发光" 
    subtitle="深海的幽蓝 · 生命的脉动"
    :glow-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '生物发光' | 标题文字 |
| subtitle | string | '深海的幽蓝 · 生命的脉动' | 副标题 |
| glowIntensity | number | 1 | 发光强度 (0-2) |
