# CardImageWhipCrash — 甩镜冲击

## 概述

**甩镜冲击**融合了两种经典电影运镜技巧：

- **Whip Pan (甩镜头/闪电摇)**：摄像机极速水平横扫，画面产生强烈的动态模糊
- **Crash Zoom (冲击变焦)**：镜头急速推拉，在着陆瞬间产生弹性冲击感

每次滚动触发一次"甩镜+冲击"组合动作，图片从远处高速甩入 → 冲击着陆弹跳 → 再甩出 → 下一帧接力。

## 核心动画

```
竖滚 → 图片从右侧远处(blur: 18px, scale: 0.35)高速甩入
     → 冲击着陆：scale 1.12 → 0.96 → 1.00 (弹性弹跳)
     → 清晰驻留 + 呼吸
     → 向左甩出(blur: 18px)
     → 下一帧从右侧甩入
     → 循环
```

## 运镜特色

| 元素 | 描述 |
|------|------|
| 🎬 **Whip Pan** | 图片水平高速移动 + 动态模糊模拟 |
| 💥 **Crash Zoom** | 着陆时 scale 弹性弹跳 1.12→0.96→1.0 |
| ⚡ **速度线** | 24条动态速度线条，甩镜时加速 |
| 📹 **取景框 HUD** | 电影摄影机 UI：上下黑条、四角标记 |
| 🔴 **REC 指示** | 闪烁红点 + 录制标识 |
| 🔍 **焦距显示** | FOCUS ∞ 在甩镜时脉冲 |
| 🎞️ **时间码** | 底部 TC 进度条 |
| 🎯 **场记板** | 标题上方拍板动画 |
| 🌊 **光效横条** | 甩镜时横扫的蓝白光条 |

## 技术要点

- **filter + transform 组合**：`blur(18px) brightness(1.8) scale(0.35)` → `blur(0px) brightness(1) scale(1)`
- **弹性着陆**：三段 scale 关键帧模拟 crash zoom 反弹
- **Canvas 速度粒子**：60-200 个水平拖尾粒子
- **ScrollTrigger scrub 1.1s**
- **Vue 3 Refs**：全部 ref 获取 DOM
- **完整清理**：onUnmounted 清除所有动画

## 图片来源

[Unsplash](https://images.unsplash.com)

## 文件结构

```
CardImageWhipCrash/
├── CardImageWhipCrash.vue   # 组件源码
└── README.md                # 本文档
```
