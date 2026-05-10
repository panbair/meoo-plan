# CardEclipse - 日食奇观

日食主题卡片组件，展示天体奇观的震撼之美。

## 特性

- **zoom-out 入场动画** - 从放大状态收缩至正常
- **日冕光晕** - 三层动态扩张的日冕效果
- **轨道图标** - 多层旋转的轨道动画
- **动态光粒子** - 漂浮的金色粒子
- **ScrollTrigger 滚动动画** - 卡片放大淡出效果

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS 径向渐变

## 卡片内容

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 初亏 | 月球开始遮盖太阳 |
| 02 | 食既 | 太阳完全被月球遮挡 |
| 03 | 生光 | 月球开始离开太阳 |
| 04 | 复圆 | 太阳恢复完整圆形 |

## 动画配置

### 入场动画 (zoom-out)

```typescript
from: { scale: 1.2, opacity: 0, filter: 'blur(12px)' }
to: { scale: 1, opacity: 1, filter: 'blur(0px)' }
```

### ScrollTrigger 配置

```typescript
{
  trigger: card,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    scale: 1 + self.progress * 0.5,
    opacity: Math.max(0, 1 - self.progress * 2.5),
    filter: `blur(${self.progress * 12}px)`
  }
}
```
