# CardImgProjector - 放映机启动·电影微缩入场

## 概述

CardImgProjector 组件实现"放映机启动·电影微缩入场"效果，模拟老式电影放映机将胶片画面从微小光斑逐渐放大至清晰宽银幕的过程，配合 RGB 色散校正、对焦过冲和电影暗角，呈现胶片电影的复古质感。

## 效果特点

### 动画机制

- **微缩膨胀**：scale 从 0.05 至 1，配合 blur 从 20px 降至 0
- **RGB 色散**：三层通道初始偏移 ±4px，随进度归零
- **对焦过冲**：80%-90% 阶段插入 blur 1.5px 过冲
- **画幅变形**：clip-path 从圆形 (5%) 渐变为宽银幕 (inset 8%)
- **电影暗角**：径向渐变遮罩在后期渐显
- **胶片颗粒**：overlay 混合模式透明度从 0.4 降至 0.08

### 视觉风格

- **色调**：深棕黑色背景配暖黄光晕
- **装饰**：胶片边框条纹、四角金属角标
- **氛围**：暖色放映机光晕 + 复古胶片质感

## 技术实现

### ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | parent | 触发器元素 |
| start | top 85% | 标准触发 |
| end | bottom 20% | 元素离开前结束 |
| scrub | 1.5 | 平滑滚动系数 |

### 核心计算

```typescript
// 画幅变形
if (p < 0.7) {
  const circleRadius = 5 + 45 * Math.pow(circleP, 0.8)
  gsap.set(frame, { clipPath: `circle(${circleRadius}% at center)` })
} else {
  const insetX = 8 * (1 - rectP)
  gsap.set(frame, { clipPath: `inset(0 ${insetX}%)` })
}

// RGB 色散校正
const channelOffset = 4 * (1 - Math.pow(p, 1.2))
gsap.set(redChannelRef.value, { x: -channelOffset })
gsap.set(blueChannelRef.value, { x: channelOffset })
```

## 与其他组件对比

| 特点 | CardImgBeacon | CardImgFallingLeaf | CardImgVelvet | CardImgCrystal | CardImgProjector |
|------|---------------|-------------------|---------------|----------------|-------------------|
| 风格 | 冷蓝科技 | 暖棕秋意 | 淡紫轻奢 | 冷银珠宝 | **暖棕胶片** |
| 变形 | 无 | 无 | 无 | 无 | **圆形→宽银幕** |
| 色散 | 无 | 无 | 无 | 无 | **RGB通道分离** |
| 特效 | 微尘 | 摇曳 | 柔光 | 辉光 | **暗角+颗粒** |

## 使用场景

适用于电影、摄影、复古艺术、怀旧主题等需要胶片质感的场景。
