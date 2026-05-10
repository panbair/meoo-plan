# CardAurora - 极光之舞

极光主题卡片组件，展示自然奇观的绚烂之美。

## 特性

- **zoom-in-left 入场动画** - 从右侧滑入缩放动画
- **动态极光波浪** - 三层流动的极光背景
- **闪烁星空** - 动态闪烁的星星粒子
- **SVG 图标动画** - 旋转的圆环图标
- **ScrollTrigger 滚动动画** - 卡片向上飞出效果

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- SVG 渐变

## 卡片内容

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 光带形成 | 太阳粒子与大气碰撞 |
| 02 | 磁场舞动 | 极光随磁力线摆动 |
| 03 | 色彩变幻 | 不同气体的发光反应 |
| 04 | 极光风暴 | 绚烂的宇宙光影秀 |

## 动画配置

### 入场动画 (zoom-in-left)

```typescript
from: { x: 200, scale: 0.6, opacity: 0, filter: 'blur(12px)' }
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
    x: -200 * self.progress,
    scale: 1 - self.progress * 0.8,
    opacity: Math.max(0, 1 - self.progress * 2)
  }
}
```
