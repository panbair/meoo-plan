# CardLiquid - 液态流动效果卡片

## 效果说明

模拟液态流动效果，卡片带有动态Blob形状和波纹动画，背景有SVG波浪效果。

## 动画效果

| 动画类型 | 描述 |
|---------|------|
| 标题入场 | 模糊渐变入场，带有浮动效果 |
| 卡片上浮 | 滚动时卡片液态般上浮出现 |
| Blob变形 | 卡片表面光泽持续变形 |
| 波浪背景 | SVG波浪持续动画 |
| 液滴漂浮 | 背景液滴向上漂浮 |

## 技术实现

- **SVG Animate**: 波浪路径动画
- **CSS Blob Animation**: 液态形状变形
- **GSAP ScrollTrigger**: 滚动控制卡片动画

## 使用方式

```vue
<CardLiquid />
```

## 组件结构

```
CardLiquid/
├── CardLiquid.vue     # 组件源码
└── README.md          # 本文档
```
