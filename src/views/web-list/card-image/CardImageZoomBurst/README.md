# CardImageZoomBurst — 镜头爆发·缩放迸裂

## 概述

**缩放迸裂**是一个具有强烈视觉冲击力的全屏图片展示组件。核心动画模拟"相机镜头拉远"效果：
- 每帧图片从屏幕正中央 **50×50px** 的微缩画框中开始
- 用户向下滚动 → 镜头拉远，图片**爆发式缩放**至屏幕 80%
- 达到峰值后淡出消失
- 下一帧接力，从 50×50 重新爆发
- 如此循环，形成连绵不绝的视觉冲击波

## 核心特性

| 特性 | 描述 |
|------|------|
| 🔍 缩放爆发 | 50×50 → 80vw×80vh 的极限缩放动画 |
| 🎯 十字瞄准线 | 中心十字准星随滚动节拍脉动 |
| ✨ Canvas 粒子 | 每次爆发喷射彩色粒子 |
| 🌈 流光渐变标题 | 四色渐变 shimmer 动画 |
| 🎨 青春时尚配色 | 珊瑚橙 · 电光紫 · 荧光青 · 金琥珀 |
| 🔄 ScrollTrigger 驱动 | 完全由滚动控制，scrub 丝滑 |
| 📱 响应式适配 | 移动端降级优化 |

## 技术要点

- **GSAP Timeline + ScrollTrigger**：所有帧动画集成到单一 master timeline，scrub 值 1.2s
- **Vue 3 Ref 获取 DOM**：所有元素通过 `:ref` 绑定获取，不使用 class 选择器做动画
- **粒子系统**：Canvas 2D 实时渲染，ScrollTrigger 回调触发爆发
- **完整清理**：`onUnmounted` 中清除所有 ScrollTrigger、animationFrame、粒子数组

## 图片来源

所有图片来自 [Unsplash](https://images.unsplash.com)。

## 文件结构

```
CardImageZoomBurst/
├── CardImageZoomBurst.vue   # 组件源码
└── README.md                # 本文档
```
