# CardImgStage · 光影舞台

## 效果概述

图片悬浮于一个深邃的三维展台之上，展台由近至远分布着三层隐性景深轨道：前景光斑层、图片主体层、远景暗影层。用户滚动时，三层轨道以差异化的速度、幅度和旋转角度同步运动。前景光斑快速掠过并渐亮，主图稳健推进且微微绕Y轴旋转，远景暗影缓慢后撤并渐深。一道柔和的顶光随滚动自左向右缓慢扫过画面，形成光影在空间中流动的立体剧场感。

## 核心特性

### 三层景深轨道
| 层级 | 速度系数 | 动画效果 |
|------|----------|----------|
| 前景光斑 | 0.35 | translateY 快速掠动，opacity 0.1→0.25 |
| 主图主体 | 1.0 | rotateY/translateZ 归零，brightness 0.7→1 |
| 远景暗影 | 0.04 | translateY 缓慢后撤，opacity 微增 |

### 3D 透视动画
| 属性 | 初始值 | 终止值 | 缓动 |
|------|--------|--------|------|
| rotateY | -2.5deg | 0deg | power2.out |
| translateZ | -15px | 0px | power2.out |
| translateX | 0 | 4px | power2.out |
| brightness | 0.7 | 1.0 | power2.out |

### 视觉元素
- **扫描顶光**：自左向右推移过画面，opacity 0→0.12
- **前景光斑**：3个暖色光斑快速掠动
- **远景暗影**：3个深色渐影缓慢后撤
- **画框发光**：内层径向渐变光晕

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
CardImgStage/
├── CardImgStage.vue    # 组件源码
└── README.md           # 本文档
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
