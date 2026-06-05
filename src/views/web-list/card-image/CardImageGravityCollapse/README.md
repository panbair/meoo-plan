# CardImageGravityCollapse — 引力坍缩

## 概述
以黑洞事件视界+大爆炸为隐喻。图片被吸入奇点（spaghettification），坍缩到极致后从奇点反弹爆发出新图片。

## 核心动画
```
图片 → 被拉向中心(borderRadius 50%, scale→0.02) →
白光爆发(flash opacity 1) → 新图片从奇点炸出(scale 1.15→0.92→1)
```

## 视觉元素
- 事件视界三层旋转光环 + 核心光点
- 吸积盘180个Canvas粒子绕中心旋转
- 时空弯曲背景(radial-gradient)
- 每帧对应宇宙事件(Event Horizon→Singularity→Big Bang→New Universe)

## 技术要点
- CSS border-radius + scale 组合模拟"面条化"
- Canvas轨道粒子系统
- GSAP ScrollTrigger scrub:1.2
- Vue 3 refs 获取DOM
- onUnmounted完整清理
