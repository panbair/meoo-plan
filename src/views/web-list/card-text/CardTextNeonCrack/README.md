# CardTextNeonCrack - 霓虹裂纹组件

破界、绽放、电光，文字如同被闪电击碎的玻璃般震撼呈现。

## 动画特点

- **裂纹背景**: SVG 动态裂纹线条，模拟破碎玻璃效果
- **电弧粒子**: 100+ 电弧粒子随机漂浮闪烁
- **多色霓虹**: 每个字符带有独立霓虹色彩
- **随机闪烁**: 字符随机亮度闪烁，模拟电能波动
- **能量脉冲**: 背景中心能量脉冲呼吸效果

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎 (elastic 缓动)
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- SVG 动态裂纹

## 使用示例

```vue
<template>
  <CardTextNeonCrack 
    title="霓虹裂纹" 
    subtitle="破界 · 绽放 · 电光"
    :crack-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '霓虹裂纹' | 标题文字 |
| subtitle | string | '破界 · 绽放 · 电光' | 副标题 |
| crackIntensity | number | 1 | 裂纹强度 (0-2) |
