# CardImgPerspective · 透视窗

## 效果概述

图片被镶入一个深邃的虚拟立体画框，悬浮于极黑展墙。初始画面微暗、略微后倾，仿佛退隐于暗影深处。用户滚动时，整个画框以极克制的幅度绕垂直轴微微旋转，图片向前景浮出并逐渐提亮，光影如扫描线般自左向右轻抚过画面，完成一次从沉寂到呈现的立体揭示。

## 核心特性

### 初始状态
- `rotateY: -2deg`，`translateZ: -20px`
- `filter: brightness(0.7)`
- 图片微微后倾，退隐于暗影深处

### 3D 透视动画
| 属性 | 初始值 | 终止值 | 缓动 |
|------|--------|--------|------|
| rotateY | -2deg | 0deg | power2.out |
| translateZ | -20px | 0px | power2.out |
| translateX | 0 | 3px | power2.out |
| brightness | 0.7 | 1.0 | power2.out |

### 视觉元素
- **扫描高光**：伪元素半透明渐变自左向右平移
- **画框发光**：外层径向渐变光晕
- **边缘高光**：1px 细线边框
- **内阴影**：深色内阴影增强立体感

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
CardImgPerspective/
├── CardImgPerspective.vue    # 组件源码
└── README.md                 # 本文档
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
