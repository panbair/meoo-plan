# CardImgBeacon - 静默空降·信标沉降

## 概述

图片如同从高空无声降落的信标，初始悬浮于视口上方高处，以微缩态存在并完全失焦。滚动触发后，图片垂直降落，伴随尺度舒展、模糊度剥离至锐利清晰，触地瞬间产生克制的微弹效果。

## 动画效果

### 核心特性

- **垂直降落**：图片从上方 -150px 位置降落至 0
- **尺度变化**：从 0.82 微缩态渐次舒展至 1.0
- **模糊转清晰**：从 18px 模糊逐渐清晰
- **透明度渐显**：从完全透明渐变为全实
- **触地微弹**：落地瞬间产生垂直微弹效果
- **气垫光晕**：图片下方形成压缩空气光晕
- **尘埃粒子**：触地瞬间扬起尘埃粒子
- **阴影变化**：box-shadow 从微弱到深沉

### 视觉效果

- 深蓝渐变背景配发光效果
- 精致的图片边框装饰
- 优雅的双语标题
- 底部装饰元素

## 技术实现

### 关键技术点

1. **四属性同步动画**：`y`、`scale`、`opacity`、`filter blur` 在 scrub 回调中同步变化
2. **触地微弹**：使用 `sin` 函数计算超调量
3. **气垫光晕**：使用伪元素径向渐变，`scaleY` 模拟压缩
4. **尘埃粒子**：动态创建 DOM 元素，用 GSAP 赋予速度和重力回落
5. **box-shadow 动态变化**：内联样式控制阴影强度

### GSAP 使用

```typescript
// ScrollTrigger scrub 模式
scrollTriggerInstance = ScrollTrigger.create({
  trigger: parentRef.value,
  start: 'top 80%',
  end: 'bottom 30%',
  scrub: 1.5,
  onUpdate: (self) => {
    const progress = self.progress

    // 四属性同步
    gsap.set(beaconRef.value, {
      y: -150 + 150 * progress,
      scale: 0.82 + 0.18 * progress,
      opacity: progress,
      filter: `blur(${18 - 18 * progress}px)`
    })
  }
})

// 尘埃粒子
gsap.fromTo(particle, {
  x: startX,
  y: 0,
  opacity: 0.8
}, {
  x: `+=${vx}`,
  y: `+=${vy}`,
  opacity: 0,
  duration: 0.6
})
```

## 使用方式

```vue
<template>
  <CardImgBeacon />
</template>
```

## 参数配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `start` | `top 80%` | 标准触发时机 |
| `end` | `bottom 30%` | 结束时机 |
| `scrub` | `1.5` | 平滑滚动系数 |

## 响应式适配

- 桌面端：500x350px 图片
- 平板端：320x220px 图片
- 移动端：260x180px 图片
