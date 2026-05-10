# CardHologram - 全息投影卡片组件

## 概述

全息科技主题的创新卡片组件，展示全息显示、全息存储、全息通信等技术概念。

## 特性

- 全息投影视觉效果
- 扫描线动画
- 3D 卡片翻转效果
- 入场/滚动/悬停多层次动画

## 技术实现

- Vue 3 Composition API
- TypeScript 类型安全
- GSAP 动画引擎
- ScrollTrigger 滚动控制
- SCSS 样式预处理

## 卡片数据

| 卡片 | 主题 | 渐变 |
|------|------|------|
| 全息显示 | Holographic Display | #00d9ff → #0066ff |
| 全息存储 | Holographic Storage | #ff6b6b → #feca57 |
| 全息通信 | Holographic Communication | #a29bfe → #6c5ce7 |
| 全息医疗 | Holographic Medical | #00b894 → #00cec9 |

## 动画效果

### 入场动画
- 卡片从下方飞入，带 3D 透视旋转
- 扫描线依次从上到下扫过
- 全息粒子脉冲动画

### 滚动动画
- 卡片随滚动进行 Y 轴 180° 翻转
- 全息投影强度随滚动变化
- 背景网格位移

### 悬停动画
- 卡片上浮 + 全息边框发光
- 扫描线加速
- 全息抖动效果
