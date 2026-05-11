# CardGlacier - 冰川纪元

冰川主题卡片组件，展示极地冰晶的神秘之美。

## 特性

- **zoom-out-right 入场动画** - 从左侧放大收缩滑入
- **冰晶造型** - 多层浮动的大冰晶背景
- **极光效果** - 北极光波动的光效
- **雪花飘落** - 持续下落的雪花粒子
- **ScrollTrigger 滚动动画** - 卡片向右飞出放大淡出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS clip-path 图形

## 卡片内容

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 冰晶形成 | 水分子在低温下的结晶过程 |
| 02 | 冰川移动 | 冰体沿坡向下的缓慢流动 |
| 03 | 冰舌延伸 | 海洋边缘的冰架扩张 |
| 04 | 冰裂崩解 | 冰山脱离主冰体的瞬间 |

## 动画配置

### 入场动画 (zoom-out-right)

```typescript
from: { x: -200, scale: 1.2, opacity: 0, filter: 'blur(12px)' }
to: { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }
```

### ScrollTrigger 配置

```typescript
{
  trigger: card,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    x: 200 * self.progress,
    scale: 1 + self.progress * 0.4,
    opacity: Math.max(0, 1 - self.progress * 2.2),
    filter: `blur(${self.progress * 10}px)`
  }
}
```
