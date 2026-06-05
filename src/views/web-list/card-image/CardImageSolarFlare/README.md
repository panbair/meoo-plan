# CardImageSolarFlare — 日冕耀斑

## 概述

**日冕耀斑**以"过度曝光显影"为核心视觉语言。每张图片以极亮状态出现（如同直视太阳），滚动时曝光逐渐降低，图片从白光中显影而出 —— 就像相机从极端过曝调整到正常曝光的过程。

## 核心动画

```
竖滚 → 当前图片过度曝光（brightness: 3.5+）
     → 曝光逐渐降低，图片从白光中显影
     → 清晰驻留，轻微亮度呼吸
     → 重新过度曝光 → 白光吞没画面
     → 下一帧从曝光中浮现
     → 循环往复
```

## 核心特性

| 特性 | 描述 |
|------|------|
| ☀ 过度曝光显影 | brightness 3.5→1.05 + blur 12px→0，模拟相机曝光 |
| 🌈 色差边缘 | 红/蓝偏移过场，模拟 chromatic aberration |
| 💡 18道光线束 | 围绕中心旋转 180°，透明度随过场脉动 |
| 🔆 日冕光环 | 三层光环 + 核心光点，爆发时放大 2.5× |
| ✨ 镜头光晕粒子 | Canvas 渲染 40-120 个暖金色光晕粒子 |
| 🎨 明亮青春配色 | 奶油白 · 香槟金 · 暖琥珀 — 全程明亮无暗色 |
| 🔤 双向滑入标题 | "日冕""耀斑"分别从左右弹入 |

## 技术要点

- **filter 动画**：GSAP 驱动 `brightness()` `saturate()` `contrast()` `blur()` 四通道
- **screen 混合模式**：过度曝光层 + 光漏层使用 `mix-blend-mode: screen` 实现真实光感
- **ScrollTrigger scrub 1.2s**：5帧各占1个单位
- **Vue 3 Refs 取 DOM**：全组件无 class 选择器动画
- **完整清理**：onUnmounted 清除 ScrollTrigger、Canvas animationFrame、粒子数组

## 图片来源

[Unsplash](https://images.unsplash.com)

## 文件结构

```
CardImageSolarFlare/
├── CardImageSolarFlare.vue   # 组件源码
└── README.md                 # 本文档
```
