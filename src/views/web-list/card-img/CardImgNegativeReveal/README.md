# CardImgNegativeReveal - 负片揭幕·灰阶暗房双重显影

## 效果描述

图片如一张尚未冲洗的负片底版，被两层灰度迥异的遮罩严密封锁。外层为粗粝的黑白颗粒幕布，带有极细微的银盐噪点；内层为均匀的灰阶雾膜，微微透出底层影像的朦胧轮廓。两层遮罩均从画面顶部垂直垂落，如同暗房中的两层隔光帘。

## 技术实现

### 核心动画阶段

1. **外层颗粒幕布滑落** (0.4s - 1.6s)
   - 黑白银盐颗粒幕布从顶部滑落至底部
   - 配合流动的银盐颗粒效果
   - `clipPath: inset(0% → 100%)`, `duration: 1.2s`, `ease: power3.in`

2. **内层灰阶雾膜溶解** (1.6s - 2.6s)
   - 雾膜透明度从1降至0
   - 径向渐变营造中心向外扩散效果

3. **图片显影仪式** (1.6s - 3.6s)
   - blur: 18px → 0px
   - brightness: 0.35 → 1.0
   - scale: 1.06 → 1.0
   - hue-rotate: -3deg → 0deg（冷灰到微暖色温）

4. **定影液水渍消散** (3.0s - 3.5s)
   - 边缘水渍痕迹在0.5s内消退

### 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 样式
- SVG feTurbulence 滤镜

### ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | parent | 触发器元素 |
| start | 'top 100%' | 元素顶部到达视口top 100%时开始 |
| end | 'bottom 20%' | 元素顶部到达视口bottom 20%时结束 |
| scrub | 1.5 | 平滑系数 |

## 视觉效果

- 双层遮罩：颗粒幕布 + 灰阶雾膜
- 银盐颗粒流动动画
- 径向渐变雾膜
- 色温柔和过渡
- 边缘光晕脉冲
- 定影液水渍痕迹

## 使用方法

```vue
<template>
  <CardImgNegativeReveal />
</template>
```
