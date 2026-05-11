# CardBioluminescence - 生物荧光

生物荧光主题卡片组件，展示深海中的神奇发光生物。

## 特性

- **slide-down 入场动画** - 从顶部滑入
- **水母动画** - 脉动的水母身体和摆动的触须
- **荧光生物** - 漂浮的发光生物粒子
- **光线穿透** - 从水面射入的光柱
- **气泡上升** - 持续上升的气泡动画
- **ScrollTrigger 滚动动画** - 卡片向上滑出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS 径向渐变

## 卡片内容

| 序号 | 标题 | 描述 | 荧光色 |
|------|------|------|--------|
| 01 | 水母发光 | 维多利亚多管发光水母 | 青色 |
| 02 | 夜光藻潮 | 蓝色星海的浪漫奇观 | 蓝色 |
| 03 | 萤火鱿群 | 深海中的点点星光 | 紫色 |
| 04 | 荧光海岸 | 海岸线上的蓝色波浪 | 青绿色 |

## 动画配置

### 入场动画 (slide-down)

```typescript
from: { y: '-100%', visibility: 'hidden', opacity: 0 }
to: { y: 0, visibility: 'visible', opacity: 1 }
```

### ScrollTrigger 配置

```typescript
{
  trigger: card,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    y: -200 * self.progress,
    opacity: Math.max(0, 1 - self.progress * 2),
    visibility: self.progress < 1 ? 'visible' : 'hidden'
  }
}
```
