# CardTextVoidRebirth - 时空漩涡重生组件

利用螺旋路径与粒子飞溅，展现物质从黑洞中重生排列的诡异美感。

## 动画特点

- **黑洞漩涡**: 中心黑洞吞噬一切，周围粒子螺旋向心
- **粒子飞溅**: 200+ 粒子围绕中心旋转，模拟时空扭曲
- **字符重生**: 字符从黑洞中心爆发而出，跟随粒子轨迹
- **光圈旋转**: 多层同心光环旋转，增强深空感
- **闪烁效果**: 粒子随机闪烁，模拟星光效果

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎 (elastic 缓动)
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- CSS 旋转动画

## 使用示例

```vue
<template>
  <CardTextVoidRebirth 
    title="时空漩涡" 
    subtitle="从虚无中重生"
    :vortex-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '时空漩涡' | 标题文字 |
| subtitle | string | '从虚无中重生 · 诡异的美感' | 副标题 |
| vortexIntensity | number | 1 | 漩涡强度 (0-2) |
