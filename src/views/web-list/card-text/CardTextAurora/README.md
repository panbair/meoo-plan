# CardTextAurora - 极光帷幕·天幕垂帘文字

北极夜空，深蓝至墨绿渐变天幕。文字由高空垂下的发光帷幕组成，色彩在翠绿、紫红、青蓝之间缓慢变换。

## 动画特点

- **极光帷幕**: 60条发光光帘覆盖文字区域
- **无序到有序**: Timeline 驱动帷幕从飘荡到排列
- **色彩流动**: HSL 色相持续偏移，模拟极光光谱
- **星空背景**: 80颗闪烁星星营造夜空氛围
- **风吹拂动**: 鼠标移动产生局部飘逸偏移
- **发光文字**: 文字带有极光色 text-shadow

## 技术实现

- Vue 3 Composition API + TypeScript
- GSAP 动画引擎 + ScrollTrigger
- CSS 渐变 + filter blur 发光效果
- requestAnimationFrame 色彩流动
- 鼠标交互驱动的帷幕偏移

## 使用示例

```vue
<template>
  <CardTextAurora 
    title="极光帷幕" 
    subtitle="北极之光 · 天幕垂帘"
    :curtain-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '极光帷幕' | 标题文字 |
| subtitle | string | '北极之光 · 天幕垂帘' | 副标题 |
| curtainIntensity | number | 1 | 帷幕强度 (0-2) |

## 动画流程

1. **入场**: 帷幕随机分布，无序飘荡
2. **排列**: 帷幕逐渐有序，形成文字轮廓
3. **显现**: 文字淡入，带模糊效果
4. **波动**: 帷幕持续水平波动
5. **色彩**: 极光色持续流动变换
6. **交互**: 鼠标移动风吹拂帷幕
