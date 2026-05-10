# CardTornado - 龙卷风暴

龙卷风主题卡片组件，展示自然界最强烈的气旋现象。

## 特性

- **zoom-out-up 入场动画** - 从下方放大收缩上升
- **漩涡环动画** - 五层反向旋转的漩涡环
- **SVG 螺旋路径** - 持续旋转的螺旋图标
- **进度条动画** - hover 时动态填充
- **ScrollTrigger 滚动动画** - 卡片向上飞出放大淡出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- SVG 路径动画

## 卡片内容

| 序号 | 标题 | 描述 | 进度 |
|------|------|------|------|
| 01 | 气旋形成 | 冷暖气流的剧烈交汇 | 85% |
| 02 | 旋转加强 | 角动量守恒的体现 | 92% |
| 03 | 漏斗延伸 | 垂直涡管的拉伸 | 78% |
| 04 | 风眼出现 | 风暴中心的宁静 | 65% |

## 动画配置

### 入场动画 (zoom-out-up)

```typescript
from: { y: 200, scale: 1.2, opacity: 0, filter: 'blur(12px)' }
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
    y: -200 * self.progress,
    scale: 1 + self.progress * 0.4,
    opacity: Math.max(0, 1 - self.progress * 2.2),
    filter: `blur(${self.progress * 10}px)`
  }
}
```
