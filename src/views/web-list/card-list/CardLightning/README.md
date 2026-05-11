# CardLightning - 闪电风暴

闪电主题卡片组件，展示自然界最壮观的电现象。

## 特性

- **zoom-out-left 入场动画** - 从右侧放大收缩滑入
- **闪电效果** - 多条随机闪烁的闪电
- **暴雨粒子** - 持续下落的雨滴动画
- **电压仪表** - 显示闪电电压的进度条
- **随机闪光** - 模拟真实闪电的闪光效果
- **ScrollTrigger 滚动动画** - 卡片向左飞出放大淡出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS clip-path 闪电造型

## 卡片内容

| 序号 | 标题 | 描述 | 电压 |
|------|------|------|------|
| 01 | 云闪 | 云层内部电荷的释放 | 10kV |
| 02 | 地闪 | 云与地面之间的放电 | 100kV |
| 03 | 球闪 | 罕见的球形闪电现象 | 50kV |
| 04 | 超级闪电 | 超出普通闪电百倍 | 1000kV |

## 动画配置

### 入场动画 (zoom-out-left)

```typescript
from: { x: 200, scale: 1.2, opacity: 0, filter: 'blur(12px)' }
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
    scale: 1 + self.progress * 0.4,
    opacity: Math.max(0, 1 - self.progress * 2.2),
    filter: `blur(${self.progress * 10}px)`
  }
}
```
