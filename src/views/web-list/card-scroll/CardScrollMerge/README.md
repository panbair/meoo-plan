# CardScrollMerge — 双境合璧 · 滚动合并

## 概念

用户竖滚时，左右两张惊艳的风景图片从屏幕两侧向中心滑动，逐渐靠近并最终合并。合并瞬间触发光柱和光爆粒子效果，营造强烈的视觉冲击力。

## 核心机制

| 要素 | 细节 |
|------|------|
| 左侧图片 | 山峦晨曦 — 从左侧 (-52vw) 滑动到中心 (0) |
| 右侧图片 | 海洋落日 — 从右侧 (+52vw) 滑动到中心 (0) |
| 中心光柱 | 图片接近时渐显，合并瞬间最亮 |
| 光爆 | 合并完成时爆发式扩散 |
| 粒子场 | 25个金色粒子在3D空间漂浮 |

## ScrollTrigger 配置

| 动画 | start | 行为 |
|------|------|------|
| 入场 (标题) | `top 75%` | toggleActions: play none none reverse |
| 主合并 (pin) | `top 20%` | pin + pinSpacing + scrub: 1.5 |

## 技术栈

Vue 3 + TypeScript + GSAP (ScrollTrigger) + SCSS

## 图片来源

[Unsplash](https://images.unsplash.com)
