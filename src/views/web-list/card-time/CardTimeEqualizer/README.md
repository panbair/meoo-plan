# CardTimeEqualizer - 音浪频谱 · 卡片均衡器

## 概述

CardTimeEqualizer 组件实现了"音浪频谱"效果 - 6张卡片化身音频频谱柱，在滚动触及时从底部依次用力弹起，高度各不相同，然后缓缓落稳，制造出"低音炮轰击地面"的冲击感。

## 设计理念

将卡片化身音频频谱柱，在滚动触及时从底部依次用力弹起，有的冲得高，有的低，然后过冲回弹，带着光晕闪烁。像极了音乐播放器里的频谱柱，节奏感炸裂。

## 特性

### 核心动画

- **弹性弹起**: `back.out(4)` 强烈回弹
- **随机高度**: 每个卡片有不同的 `--h` 属性
- **阴影闪烁**: 弹起时阴影增强
- **冲击波效果**: 中心扩散的圆形波纹

### 六种音乐风格

| 风格 | BPM | 高度 | 配色 |
|------|-----|------|------|
| HIP-HOP | 90 | 1.3 | 粉紫渐变 |
| JAZZ | 120 | 0.7 | 金橙渐变 |
| ROCK | 140 | 1.8 | 红系渐变 |
| LO-FI | 85 | 0.5 | 紫系渐变 |
| EDM | 130 | 1.6 | 青蓝渐变 |
| CLASSIC | 100 | 1.0 | 淡紫渐变 |

## 技术实现

### 弹性弹起动画

```typescript
const settings = { back: 4, duration: 1.0 }

gsap.to('.eq-card', {
  scaleY: (i, el) => {
    const h = parseFloat(el.style.getPropertyValue('--h')) || 1
    return h
  },
  opacity: 1,
  duration: settings.duration,
  stagger: { each: 0.08, from: 'random' },
  ease: `back.out(${settings.back})`
})
```

### 阴影增强

```typescript
gsap.to('.eq-card', {
  boxShadow: (i, el) => {
    const color1 = el.style.getPropertyValue('--color1')
    return `0 0 60px ${color1}cc, 0 0 100px ${color1}66`
  },
  stagger: 0.08,
  duration: 0.3
}, '-=0.4')
```

## 交互控制

### 重播按钮
点击可重新触发动画

### 强度滑块
| 等级 | back.out | duration |
|------|----------|----------|
| 1 | 2 | 0.6s |
| 2 | 2.5 | 0.7s |
| 3 | 3 | 0.8s |
| 4 | 3.5 | 0.9s |
| 5 | 4 | 1.0s |

## 视觉效果

- **频谱柱设计**: 渐变填充 + 顶部盖子
- **频率指示器**: 顶部跳动的频率条
- **地面反光**: 底部的发光线条
- **冲击波**: 中心的扩散波纹
- **背景波浪**: 移动的网格线
- **粒子闪烁**: 背景星星动画

## 动画清理

组件卸载时自动清理：
- GSAP Timeline 实例
- ScrollTrigger 实例
- 持续动画
