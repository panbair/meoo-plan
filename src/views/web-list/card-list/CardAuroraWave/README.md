# CardAuroraWave 极光波浪

> 极光与波浪的梦幻融合，光影流转的神秘世界

## 概述

CardAuroraWave 是一个融合极光光效与波浪动态的沉浸式卡片组件。通过多层极光叠加、波浪动画、数据流粒子等元素，营造出神秘而梦幻的视觉效果。

## 主题风格

| 风格 | 描述 |
|------|------|
| 主色调 | 深邃紫蓝 (#0a0a1a) + 极光渐变 |
| 强调色 | 青色 (#00ffc8)、品红 (#ff00ff)、金色 (#ffd700) |
| 视觉风格 | 梦幻、神秘、科技感 |

## 动画效果

### 入场动画 (roll-up)

```javascript
'roll-up': {
  from: { y: '100%', visibility: 'hidden', rotation: -15 },
  to: { y: 0, visibility: 'visible', rotation: 0 }
}
```

### ScrollTrigger 配置

```javascript
ScrollTrigger.create({
  trigger: parent,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    gsap.set(parent, {
      y: 100 * self.progress,
      opacity: 1 - self.progress * 1.5
    })
  }
})
```

## 核心特效

| 特效 | 描述 |
|------|------|
| 极光层 | 6层不同颜色的渐变极光，持续波动 |
| 波浪层 | 3层不同频率的正弦波叠加 |
| 数据流 | 垂直下落的数据符号粒子 |
| 星光 | 100颗闪烁的星点 |
| 波纹 | 中心扩散的能量波纹 |
| 光点 | 漂浮的荧光粒子群 |

## 技术栈

- Vue 3 Composition API
- TypeScript 类型定义
- GSAP 动画引擎
- ScrollTrigger 滚动插件
- SCSS 样式预处理

## 使用方式

```vue
<template>
  <CardAuroraWave />
</template>
```

## 文件结构

```
CardAuroraWave/
├── CardAuroraWave.vue   # 主组件
└── README.md            # 文档
```

## 性能优化

- 使用 CSS `will-change` 优化动画性能
- 合理使用 `transform` 和 `opacity` 实现 GPU 加速
- 控制粒子数量避免性能问题
