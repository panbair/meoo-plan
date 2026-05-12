# CardImgSplitFocus - 裂像对焦·测距仪微缩入场

## 概述

CardImgSplitFocus 组件实现"裂像对焦·测距仪微缩入场"效果，模拟老式测距相机裂像对焦屏的工作原理，画面从微小的圆形取景框膨胀放大，上下两半图像沿裂像线逐步校准对齐，配合 RGB 色散校正、对焦过冲和绿色镀膜反光，呈现精密光学仪器的质感。

## 效果特点

### 动画机制

- **裂像分离**：上下半区初始 translateX 偏移 ±6px，模拟测距仪重影
- **RGB 色散**：红蓝通道各有 ±2px 偏移，随对焦归零
- **微缩膨胀**：scale 从 0.08 至 1.0，blur 从 18px 降至 0
- **对焦过冲**：80%-95% 阶段 blur 过冲 1.2px + scale 微弹
- **画幅变形**：clip-path 从 `circle(5%)` 过渡为 `inset(5%)`
- **裂像消融**：对焦完成后裂像线渐隐
- **绿色镀膜**：完成后 inset box-shadow 持续呼吸

### 视觉风格

- **色调**：深墨绿色背景配翡翠绿高光
- **装饰**：测距仪边框线条、对焦指示器圆环
- **氛围**：精密光学仪器、绿色镀膜光泽

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
// 裂像校准（提前于模糊消除）
const alignP = Math.min(p / 0.75, 1)
const offset = 6 * (1 - Math.pow(alignP, 1.3))
gsap.set(topHalf, { x: -offset })
gsap.set(bottomHalf, { x: offset })

// RGB 色散
const rgbOffset = 2 * (1 - Math.pow(Math.min(p / 0.7, 1), 1.5))
gsap.set('.rgb-layer.red', { x: -rgbOffset, y: -rgbOffset })

// 对焦过冲
if (p >= 0.8 && p < 0.95) {
  const overP = (p - 0.8) / 0.15
  focusOver = 1.2 * Math.sin(overP * Math.PI)
}
```

## 与其他组件对比

| 特点 | CardImgProjector | CardImgSplitFocus |
|------|-----------------|-------------------|
| 效果 | RGB 横向分离 | 上下裂像分离 |
| 画幅 | 圆形→宽银幕 | 圆形→矩形 |
| 色散 | R/G/B 三层叠加 | 红蓝通道偏移 |
| 特色 | 胶片颗粒 | 绿色镀膜 |
| 氛围 | 暖棕胶片 | 墨绿光学 |

## 使用场景

适用于摄影、精密仪器、机械工程、军品等需要精密光学质感的场景。
