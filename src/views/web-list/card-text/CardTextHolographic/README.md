# CardTextHolographic - 全息投影组件

文字以全息投影方式呈现，带有扫描线、故障效果和科技感光效。

## 动画特点

- **扫描线**: 水平扫描线从上到下扫过，增强科技感
- **故障效果**: 随机字符抖动偏移，模拟全息信号干扰
- **呼吸效果**: 字符透明度和大小周期性变化
- **彩虹色散**: 字符带有RGB分离效果
- **透视网格**: 底部透视网格增强3D感

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎
- ScrollTrigger 滚动动画
- CSS clipPath 动画
- CSS 滤镜效果

## 使用示例

```vue
<template>
  <CardTextHolographic 
    title="全息投影" 
    subtitle="HOLOGRAPHIC · PROJECTION"
    :intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '全息投影' | 标题文字 |
| subtitle | string | 'HOLOGRAPHIC · PROJECTION' | 副标题 |
| intensity | number | 1 | 全息强度 (0-2) |
