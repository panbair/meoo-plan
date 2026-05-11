# CardTextGalaxy - 银河星尘组件

穿越时空的永恒之光，文字以星尘形态闪耀于深邃的银河之中。

## 动画特点

- **星尘粒子**: 400+ 星尘粒子漂浮闪烁，营造银河氛围
- **星云效果**: 多层模糊星云漂浮，增强深空感
- **字符发光**: 每个字符带有独立颜色光晕
- **呼吸光效**: 字符发光强度周期性变化
- **闪烁星空**: 背景星空随机闪烁

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- CSS 滤镜与混合模式

## 使用示例

```vue
<template>
  <CardTextGalaxy 
    title="银河星尘" 
    subtitle="穿越时空的永恒之光"
    :galaxy-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '银河星尘' | 标题文字 |
| subtitle | string | '穿越时空的永恒之光' | 副标题 |
| galaxyIntensity | number | 1 | 银河强度 (0-2) |
