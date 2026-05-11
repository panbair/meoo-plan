# CardMagma - 岩浆涌动

岩浆主题卡片组件，展示地球内部炽热的自然力量。

## 特性

- **zoom-out-down 入场动画** - 从上方放大收缩下降
- **熔岩流动** - 三层动态流淌的熔岩效果
- **余烬粒子** - 上升消散的火星粒子动画
- **热度仪表** - 显示温度的动态进度条
- **ScrollTrigger 滚动动画** - 卡片向下飞出放大淡出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS 渐变与滤镜

## 卡片内容

| 序号 | 标题 | 描述 | 热度 |
|------|------|------|------|
| 01 | 地核熔岩 | 地球内部的高温熔融物质 | 95° |
| 02 | 火山通道 | 岩浆上升的地壳裂缝 | 88° |
| 03 | 熔岩流动 | 缓慢而毁灭性的蔓延 | 82° |
| 04 | 冷却凝固 | 从液态到固态的转变 | 60° |

## 动画配置

### 入场动画 (zoom-out-down)

```typescript
from: { y: -200, scale: 1.2, opacity: 0, filter: 'blur(12px)' }
to: { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }
```

### ScrollTrigger 配置

```typescript
{
  trigger: card,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    y: 200 * self.progress,
    scale: 1 + self.progress * 0.4,
    opacity: Math.max(0, 1 - self.progress * 2.2),
    filter: `blur(${self.progress * 10}px)`
  }
}
```
