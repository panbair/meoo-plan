# CardImgFallingLeaf - 叶落归根·秋叶飘落渐显

## 概述

图片如一片轻盈的悬铃木叶，初始栖于视口上方半空，身形微缩、模糊且几近透明。滚动触发后，图片在克制的横向摇曳与缓慢自转中飘落，触地瞬间产生轻微的压实形变并迅即回弹。

## 动画效果

### 核心特性

- **飘落动画**：非直线飘落，带横向摇曳 (±15px) 和自转 (±12°)
- **四属性同步**：y、scale、opacity、filter blur 统一驱动
- **触地压缩**：落地瞬间 scaleY 轻微压缩回弹
- **尘埃粒子**：3-5粒尘埃从底部扬起消散
- **叶柄微动**：落地后叶柄保持低频旋转呼吸
- **阴影同步**：地面阴影随进度加深

### 视觉效果

- 暖棕色渐变背景配金色调
- 秋叶造型图片容器（圆角不规则）
- 叶脉纹理装饰
- 漂浮装饰叶片元素
- 金色优雅双语标题

## 技术实现

### 关键技术点

1. **正弦波飘曳**：使用 `Math.sin()` 计算横向偏移和旋转
2. **触地压缩**：`scaleY` 在落地瞬间 1.0 → 0.96 → 1.0
3. **尘埃效果**：动态创建 DOM，赋予随机初速和重力回落
4. **叶柄动画**：`rotation` 持续低频变化模拟呼吸

### GSAP 使用

```typescript
// 正弦波横向摇曳
const swayAmount = 15 * Math.sin(progress * Math.PI * 3)
const rotation = 12 * Math.sin(progress * Math.PI * 2)

// 触地压缩
if (progress > 0.92) {
  const landProgress = (progress - 0.92) / 0.04
  scaleY = 1 - 0.04 * Math.sin(landProgress * Math.PI)
}

// 尘埃粒子
gsap.fromTo(particle, {
  x: startX,
  y: 0,
  opacity: 0.6
}, {
  x: `+=${vx}`,
  y: `+=${vy}`,
  opacity: 0,
  duration: 0.5
})
```

## 使用方式

```vue
<template>
  <CardImgFallingLeaf />
</template>
```

## 参数配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `start` | `top 80%` | 标准触发时机 |
| `end` | `bottom 30%` | 结束时机 |
| `scrub` | `1.5` | 平滑滚动系数 |

## 响应式适配

- 桌面端：380x480px 秋叶造型容器
- 平板端：260x330px 容器
- 移动端：200x260px 容器

## 与 CardImgBeacon 的区别

| 特性 | CardImgBeacon | CardImgFallingLeaf |
|------|---------------|-------------------|
| 路径 | 直线垂直降落 | 正弦波飘曳 |
| 旋转 | 无 | ±12° 自转 |
| 压缩 | scale 整体回弹 | scaleY 压实回弹 |
| 尘埃数 | 8-12粒 | 3-5粒 |
| 余韵 | 无 | 叶柄持续微动 |
| 风格 | 冷蓝科技感 | 暖棕秋意感 |
