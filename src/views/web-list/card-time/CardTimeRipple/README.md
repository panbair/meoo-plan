# CardTimeRipple - 水波扩散卡片

## 设计理念

涟漪驱动·触感材质 — 当鼠标光标在卡片区域移动时，如同石子落入水面，激起一圈圈看不见的波纹。卡片会随着波纹的扩散依次上下浮动，形成极为治愈的静电容感交互。

## 核心特性

- **涟漪扩散动画**: 鼠标移动触发涟漪效果，距离越近反应越明显
- **触感反馈**: 点击卡片时产生按压弹跳效果
- **六元素主题**: 水、火、风、土、光、暗六种元素卡片
- **滚动动画**: ScrollTrigger 驱动的入场和呼吸效果
- **3D 悬浮**: 卡片悬停时的光晕和边框增强

## 技术实现

| 技术 | 用途 |
|------|------|
| Vue 3 | 组件框架 |
| TypeScript | 类型安全 |
| GSAP | 涟漪动画引擎 |
| ScrollTrigger | 滚动动画控制 |
| SCSS | 样式预处理 |

## 动画机制

### 涟漪算法
```
proximity = 1 - min(distance / maxDistance, 1)
lift = proximity * 30px
scale = 1 + proximity * 0.1
delay = proximity * 0.12s
```

### 点击强化
1. 按下: scale 0.94, y +10px
2. 弹起: scale 1.08, y -15px  
3. 归位: scale 1, y 0

## 文件结构

```
CardTimeRipple/
├── CardTimeRipple.vue    # 组件源码
└── README.md            # 本文档
```

## 使用方式

```vue
<template>
  <CardTimeRipple />
</template>
```

## 组件尺寸

- 宽度: 100vw
- 高度: 100vh
