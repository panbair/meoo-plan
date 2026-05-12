# CardImgVelvet - 丝绒垂幕·轻奢沉坠入场

## 概述

图片如一块精纺丝绒方巾，初始悬浮于视口上方略高处，身形微缩、极度朦胧并近乎透明。滚动触发后，图片以丝绒软重坠感优雅垂落，触底瞬间产生轻微的纵向压缩形变并回弹，边缘泛出柔光镶边。

## 动画效果

### 核心特性

- **丝绒垂坠**：使用能量曲线 `pow(progress, 1.5)` 模拟前段蓄力后段加速
- **四属性同步**：y、scale、opacity、filter blur 统一驱动
- **纵向压缩**：触地时 scaleY 从 1.0 → 0.94 → 1.0
- **织物微尘**：7粒极细微尘从底部扬起消散
- **边缘柔光**：落地后边缘光晕持续低频呼吸
- **色温柔和**：从冷灰过渡至暖灰的色调变化

### 视觉效果

- 深紫色渐变背景配柔和高光
- 简洁矩形图片容器
- 边缘柔光镶边效果
- 优雅的淡紫色双语标题
- 底部装饰线条

## 技术实现

### 关键技术点

1. **能量曲线**：`pow(progress, 1.5)` 实现前慢后快的垂坠感
2. **纵向压缩**：`scaleY` 在触底瞬间压缩回弹
3. **微尘效果**：极细粒子赋予微弱速度和重力回落
4. **边缘光晕**：`inset box-shadow` 配合 `yoyo` 实现呼吸效果

### GSAP 使用

```typescript
// 能量曲线 - 前段慢后段快
const energyCurve = Math.pow(progress, 1.5)
const adjustedY = -80 + 80 * energyCurve

// 纵向压缩形变
if (progress > 0.88) {
  const landProgress = (progress - 0.88) / 0.06
  scaleY = 1 - 0.06 * Math.sin(landProgress * Math.PI)
}

// 边缘柔光呼吸
gsap.to(glowRef.value, {
  opacity: 0.6,
  duration: 2,
  yoyo: true,
  repeat: -1
})
```

## 使用方式

```vue
<template>
  <CardImgVelvet />
</template>
```

## 参数配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `start` | `top 80%` | 标准触发时机 |
| `end` | `bottom 30%` | 结束时机 |
| `scrub` | `1.5` | 平滑滚动系数 |

## 响应式适配

- 桌面端：420x560px 容器
- 平板端：280x380px 容器
- 移动端：220x300px 容器

## 与其他组件对比

| 特性 | CardImgBeacon | CardImgFallingLeaf | CardImgVelvet |
|------|---------------|-------------------|---------------|
| 路径 | 直线垂直 | 正弦波飘曳 | 能量曲线垂坠 |
| 变形 | scale 整体 | scaleY 飘压 | scaleY 垂压 |
| 微尘 | 8-12粒 | 3-5粒 | 6-8粒 |
| 余韵 | 无 | 叶柄微动 | 边缘柔光 |
| 风格 | 冷蓝科技 | 暖棕秋意 | 淡紫轻奢 |
