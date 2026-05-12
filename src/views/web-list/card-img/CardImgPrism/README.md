# CardImgPrism · 色散重组

## 效果概述

图片被拆解为红、绿、蓝三色重影层，各层略微偏移并绕不同轴向轻微旋转，初始画面呈精致的光谱色散状态，仿佛透过一枚未校准的棱镜窥视。用户滚动页面时，三色层以差异化的速度向中心聚合，同步提亮，过程中色层边缘产生极细的虹彩辉光，最终三色完美重合为清晰全彩影像。

## 核心特性

### 色散初始状态
| 色层 | translateX | rotateY | 滤镜 |
|------|------------|---------|------|
| 红色层 | -5px | -1.5deg | hue-rotate(-20deg) |
| 绿色层 | 0 | 0 | 原始 |
| 蓝色层 | +5px | +1.5deg | hue-rotate(20deg) |

### 聚合动画
- 三色层同步向中心聚合：`translateX`/`rotateY` 归零
- `mix-blend-mode: screen` 叠加混合
- 边缘彩色镶边随聚合渐隐

### 视觉元素
- **彩虹边框**：渐变色边框，光学仪器校准感
- **外发光**：蓝紫径向渐变光晕
- **背景网格**：科技感网格纹理

## ScrollTrigger 配置

```javascript
{
  trigger: parentRef.value,
  start: 'top 100%',
  end: 'bottom 20%',
  scrub: true
}
```

## 文件结构

```
CardImgPrism/
├── CardImgPrism.vue    # 组件源码
└── README.md           # 本文档
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
