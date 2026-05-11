# CardTextWaterWave - 水面文字剧场

浅蓝水底，文字以半透明油墨形态漂浮于水面。不可见的水流自左向右缓慢推动，每个字符独立随波起伏、旋转、聚散，字距与行距如被波纹不断揉皱又抚平。

## 动画特点

- **字符独立浮动**: 每个字符拥有独立的物理属性，随波起伏、旋转聚散
- **水流动感**: 模拟水面乱流效果，字符间距动态变化
- **涟漪交互**: 鼠标移动和点击产生涟漪效果，推开附近字符
- **光线折射**: 水面持续折射出微光，增强沉浸感
- **滚动联动**: ScrollTrigger 控制背景水色深浅变化

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- CSS 波浪动画

## 使用示例

```vue
<template>
  <CardTextWaterWave 
    title="水面文字" 
    subtitle="浅蓝水底 · 油墨漂浮"
    :wave-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '水面文字' | 标题文字 |
| subtitle | string | '浅蓝水底 · 油墨漂浮' | 副标题 |
| waveIntensity | number | 1 | 波纹强度 (0-2) |
| fontSize | string | 'clamp(2rem, 6vw, 4rem)' | 字体大小 |
