# CardImageSparkStorm — 火花风暴

## 概述

**火花风暴**是一个以"火焰粒子"为核心视觉语言的图片展示组件。数百个金色/琥珀色火花粒子在 Canvas 上飞舞，图片在火花笼罩中浮现、燃烧、重生。

## 核心动画

```
竖滚 → 当前图片被火花"火焰"从底部向上燃烧揭示
     → 达到峰值后，火焰从底部向上燃尽图片
     → 火花爆发（80个粒子爆炸）
     → 下一帧从火星中重生浮现
     → 循环往复
```

## 核心特性

| 特性 | 描述 |
|------|------|
| ✨ 火花粒子系统 | 200-500个实时 Canvas 粒子，每个带拖尾轨迹 |
| 🔥 燃烧揭示 | clipPath 驱动火焰从底部向上揭示/燃尽 |
| 🎯 三层光环核心 | 中心脉动光环指示器，爆发时剧烈脉动 |
| 💥 爆发回调 | ScrollTrigger 触发火花爆炸（80粒子/次） |
| 🎨 暖色青春 | 金 · 琥珀 · 珊瑚 · 暖白，火焰美学 |
| 🔤 弹跳标题 | 四字逐字从旋转缩放中弹入 |
| 📊 火花进度条 | 渐变暖色进度指示 |

## 技术要点

- **Canvas 粒子**：每个火花拥有 6 点拖尾轨迹，径向渐变光晕渲染
- **clipPath 动画**：`inset(0% 0% 0% 0%)` ↔ `inset(0% 0% 100% 0%)` 模拟火焰燃烧方向
- **GSAP Timeline + ScrollTrigger**：scrub 1.15s，5帧各占1个单位
- **Vue 3 Refs**：全部通过 ref 获取 DOM，不使用 class 选择器
- **完整清理**：onUnmounted 清除 ScrollTrigger、Canvas animationFrame、粒子数组

## 图片来源

[Unsplash](https://images.unsplash.com)

## 文件结构

```
CardImageSparkStorm/
├── CardImageSparkStorm.vue   # 组件源码
└── README.md                 # 本文档
```
