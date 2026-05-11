# CardSupernova - 超新星爆发

超新星爆发主题卡片组件，展示宇宙中最壮观的恒星死亡现象。

## 特性

- **slide-left 入场动画** - 从右侧滑入
- **冲击波动画** - 多层向外扩张的冲击波
- **爆发核心** - 脉动的超新星核心光球
- **碎片粒子** - 向外飞散的发光碎片
- **辐射仪表** - 显示辐射强度的进度条
- **ScrollTrigger 滚动动画** - 卡片向左滑出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS 径向渐变

## 卡片内容

| 序号 | 标题 | 描述 | 辐射 |
|------|------|------|------|
| 01 | 核心坍缩 | 恒星生命的最终阶段 | 85% |
| 02 | 中微子爆发 | 比光子更早逃离的能量 | 92% |
| 03 | 光球膨胀 | 以光速扩张的冲击波 | 78% |
| 04 | 重元素合成 | 宇宙中金元素的起源 | 65% |

## 动画配置

### 入场动画 (slide-left)

```typescript
from: { x: '100%', visibility: 'hidden', opacity: 0 }
to: { x: 0, visibility: 'visible', opacity: 1 }
```

### ScrollTrigger 配置

```typescript
{
  trigger: card,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    x: -200 * self.progress,
    opacity: Math.max(0, 1 - self.progress * 2),
    visibility: self.progress < 1 ? 'visible' : 'hidden'
  }
}
```
