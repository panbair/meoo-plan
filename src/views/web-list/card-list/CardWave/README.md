# CardWave - 波动效果卡片

## 概述

背景有动态波浪动画，卡片带有流动效果的组件。

## 效果预览

- SVG波浪背景持续动画
- 卡片滚动时上下浮动
- 进度条填充动画
- 悬停时波动效果增强

## 技术实现

### 核心原理

1. **SVG波浪**：使用 `<path>` 绘制波浪形状
2. **GSAP动画**：`gsap.to()` 动态修改 path 的 d 属性
3. **进度条动画**：`--fill-percent` CSS 变量控制进度

### 关键代码

```typescript
// 波浪动画
const initWaveAnimation = () => {
  waveRefsMap.value.forEach((wave, index) => {
    gsap.to(wave, {
      attr: { d: generateWavePath(index, true) },
      duration: 3 + index,
      repeat: -1,
      yoyo: true
    })
  })
}
```

## 参数配置

| 属性 | 值 | 说明 |
|------|-----|------|
| 波浪层数 | 3层 | 不同透明度和颜色 |
| 波浪高度 | 200px | 底部波浪区域高度 |
| 动画周期 | 3-6秒 | 各层波浪周期不同 |

## 使用方式

```vue
<CardWave />
```

## 数据结构

```typescript
interface WaveCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  progress: number  // 0-100
}
```
