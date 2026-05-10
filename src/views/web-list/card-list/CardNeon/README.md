# CardNeon - 霓虹灯效果卡片

## 概述

边框有发光的霓虹效果，鼠标移动时光效跟随的卡片组件。

## 效果预览

- 渐变霓虹边框持续发光
- 鼠标位置控制背景高光方向
- 图标持续脉冲动画
- 四角装饰线条
- 按钮悬停发光增强

## 技术实现

### 核心原理

1. **渐变边框**：使用 `linear-gradient` 和 `-webkit-mask` 实现边框渐变
2. **光晕效果**：`filter: blur()` 和 `box-shadow` 实现发光
3. **CSS变量**：`--mouse-x`, `--mouse-y` 控制高光位置

### 关键代码

```scss
// 霓虹边框
.neon-border {
  background: linear-gradient(
    135deg,
    var(--neon-color) 0%,
    transparent 30%,
    transparent 70%,
    var(--neon-color) 100%
  );
}

// 背景光效跟随鼠标
.neon-bg {
  background: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  );
}
```

## 参数配置

| 属性 | 值 | 说明 |
|------|-----|------|
| 卡片宽度 | 300px | 单个卡片宽度 |
| 卡片高度 | 400px | 单个卡片高度 |
| 边框宽度 | 2px | 霓虹边框粗细 |
| 发光模糊 | 10-20px | 光晕模糊程度 |

## 使用方式

```vue
<CardNeon />
```

## 数据结构

```typescript
interface NeonCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string      // 霓虹颜色
  glow: string      // 发光效果
  tags: string[]
}
```
