# CardTimeShatter - 记忆碎片 · 卡片粒子解体与重组

## 概述

CardTimeShatter 组件实现了"记忆碎片"效果 - 每张卡片初始由4个散落的三角形碎片组成，滚动触发时碎片从随机位置飞向中心，拼接成完整卡片，传达"信息从混沌中诞生"的概念。

## 设计理念

每张卡片初始并非完整形态，而是散落为多个碎片悬浮在空间中。当用户滚动至此处，碎片从随机位置飞向卡片中心，拼接成完整图像，同时碎片边缘散发着能量光晕。完成后，卡片浮现出内容。

## 特性

### 核心动画

- **碎片重组**: 4个三角形碎片从随机位置飞向中心
- **Clip-path 切割**: 使用 CSS clip-path 将卡片切割为4个三角形
- **随机偏移**: 每个碎片初始有随机的 x/y/rotation/scale 偏移
- **渐显内容**: 卡片内容在碎片归位后渐显

### 碎片设计

| 碎片编号 | 形状 | 位置 |
|----------|------|------|
| 1 | 左上三角形 | clip-path: polygon(0 0, 50% 0, 0 50%) |
| 2 | 右上三角形 | clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%) |
| 3 | 左下三角形 | clip-path: polygon(0 50%, 50% 50%, 0 100%) |
| 4 | 右下四边形 | clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%) |

### 卡片主题

| 卡片 | 图标 | 标题 | 描述 | 时间 |
|------|------|------|------|------|
| 1 | 🔮 | 起源 | 宇宙大爆炸 | 138亿年前 |
| 2 | 🌌 | 进化 | 星系形成 | 100亿年前 |
| 3 | 🌍 | 超越 | 生命诞生 | 38亿年前 |
| 4 | 🚀 | 永恒 | 文明探索 | 21世纪 |
| 5 | ✨ | 新生 | 意识觉醒 | 未来纪元 |

## 技术实现

### 碎片初始状态

```typescript
fragments.forEach((frag) => {
  const offset = {
    x: random(-150, 150),
    y: random(-180, 180),
    rotation: random(-200, 200),
    scale: random(0.2, 0.6)
  }
  gsap.set(frag, {
    x: offset.x,
    y: offset.y,
    rotation: offset.rotation,
    scale: offset.scale,
    opacity: 0.3
  })
})
```

### GSAP Timeline 动画

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: card,
    start: 'top 80%',
    toggleActions: 'play none none none',
  }
})

tl.to(fragments, {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  opacity: 1,
  duration: 0.7,
  stagger: { each: 0.06, from: 'random' },
  ease: 'power3.out'
})
.to(content, {
  opacity: 1,
  scale: 1,
  duration: 0.5,
  ease: 'back.out(1.7)'
}, '-=0.3')
```

## 视觉效果

- **背景渐变**: 深色渐变背景
- **粒子效果**: 漂浮的彩色粒子
- **网格背景**: 细密的网格线
- **光晕效果**: 脉动的背景光晕
- **碎片光晕**: 重组时的能量消散
- **悬停增强**: 悬停时亮度提升、图标放大

## 动画清理

组件卸载时自动清理：
- GSAP Timeline 实例
- ScrollTrigger 实例
- 动态创建的粒子元素
