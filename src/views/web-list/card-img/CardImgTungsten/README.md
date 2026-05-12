# CardImgTungsten - 钨丝启辉·放映灯微缩入场

## 概述

CardImgTungsten 组件实现"钨丝启辉·放映灯微缩入场"效果，模拟放映机钨丝灯从微小光点向外疾速膨胀的过程，配合 RGB 色散分离、灯丝频闪过冲、色温游移和余热辉晕，呈现从灯丝点亮到电影开幕的完整光学仪式。

## 效果特点

### 动画机制

- **聚焦一点**：scale 从 0.02 起始，配以高 brightness 和多层径向炫光
- **RGB 色散**：三通道水平偏移 ±6px，透明度交错
- **炫光收拢**：box-shadow 大范围模糊白晕随膨胀收拢
- **频闪过冲**：90% 附近 opacity 快速抖动模拟灯丝震荡
- **对焦过冲**：blur 短暂 -1px 再回零
- **颗粒演化**：噪点层 opacity 从 0.5 降至 0.05
- **色温游移**：hue-rotate 从 +30° 至 0° 再微偏 +5°
- **余热辉晕**：完成后暖白径向渐变持续呼吸

### 视觉风格

- **色调**：深棕黑色背景配炽白钨丝光
- **装饰**：灯丝 SVG 图形、四角装饰线条
- **氛围**：放映灯高温、电影开幕仪式感

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
// 色散归零
const chromaOffset = 6 * (1 - Math.pow(p, 1.3))
gsap.set(redLayerRef.value, { x: -chromaOffset })
gsap.set(blueLayerRef.value, { x: chromaOffset })

// 炫光收拢
const flareScale = 3 - 2 * Math.pow(p, 2)
const flareOpacity = 0.9 * (1 - Math.pow(p, 1.5))

// 色温游移
let hueRotate = p < 0.6
  ? 30 - 30 * Math.pow(p / 0.6, 1.5)
  : 5 * Math.pow((p - 0.6) / 0.4, 0.5)
```

## 与其他组件对比

| 特点 | CardImgProjector | CardImgSplitFocus | CardImgTungsten |
|------|-----------------|-------------------|-----------------|
| 初始形态 | 微小光斑 | 裂像分离 | **炽白光点** |
| 特效 | 胶片颗粒 | 绿色镀膜 | **钨丝炫光** |
| 过冲 | 对焦过冲 | 对焦过冲 | **频闪过冲** |
| 氛围 | 暖棕胶片 | 墨绿光学 | **炽白放映** |

## 使用场景

适用于电影院、老式放映机、摄影器材、怀旧电影等需要放映灯仪式感的场景。
