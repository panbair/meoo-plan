# CardTimeSingularity - 宇宙奇点 · 涡旋扩散

卡片从容器中心的"奇点"爆发扩散到最终网格位置，仿佛宇宙大爆炸般震撼。

## 动画效果

- **初始状态**：所有卡片隐藏在容器中心的"奇点"中，缩放为 0
- **滚动触发**：向下滚动时，卡片像宇宙大爆炸一样爆发出来
- **扩散效果**：旋转、放大、飞向各自位置
- **双向动画**：向上滚动时，卡片收回到奇点状态

## 技术实现

- **GSAP Flip 插件**：自动计算从奇点到最终位置的差异
- **ScrollTrigger**：滚动驱动的双向动画
- **Vue 3 Composition API**：使用 `ref` 获取 DOM 元素

## 核心代码

```typescript
// 1. 记录最终网格状态
const finalState = Flip.getState(cards)

// 2. 将所有卡片移至容器中心（奇点）
cards.forEach((card) => {
  gsap.set(card, {
    x: centerX - cardWidth / 2,
    y: centerY - cardHeight / 2,
    scale: 0,
    rotation: (i % 2 === 0 ? 45 : -45),
    opacity: 0
  })
})

// 3. 用 Flip 从奇点状态扩散到最终网格
Flip.from(finalState, {
  duration: 1.2,
  stagger: { each: 0.08, from: 'random' },
  ease: 'power3.out',
  absolute: true,
  spin: true,
  scrollTrigger: {
    trigger: vortexGridRef.value,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 2
  }
})
```

## ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `vortexGridRef` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `2` | 平滑系数，值越大动画越平滑 |

## 卡片数据

| 卡片 | 标题 | 数值 | 标签 |
|------|------|------|------|
| 1 | 星系 | ∞ | 恒星数量 |
| 2 | 行星 | 8 | 太阳系行星 |
| 3 | 星云 | 1K+ | 观测数量 |
| 4 | 黑洞 | M87* | 首张影像 |
| 5 | 流星 | 100/s | 地球接触 |
| 6 | 深空 | 93B | 光年之外 |
