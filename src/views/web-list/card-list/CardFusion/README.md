# CardFusion - 核聚变反应

核聚变主题卡片组件，展示人类能源的未来希望。

## 特性

- **slide-up 入场动画** - 从底部 100% 高度滑入
- **托卡马克装置** - 多层旋转的等离子体环
- **原子轨道动画** - 电子绕核旋转的原子模型
- **磁场约束线** - 脉冲动画的磁场线
- **能量仪表** - 显示反应能量的旋转仪表
- **ScrollTrigger 滚动动画** - 卡片向下滑出

## 技术栈

- Vue 3 Composition API
- GSAP + ScrollTrigger
- SCSS 动画
- CSS 径向渐变

## 卡片内容

| 序号 | 标题 | 描述 | 能量 |
|------|------|------|------|
| 01 | 氘氚聚变 | 氢的两种同位素融合 | 17.6MeV |
| 02 | 等离子体 | 万亿度高温下的物质态 | 100MeV |
| 03 | 磁场约束 | 托卡马克装置的奇迹 | 50MeV |
| 04 | 能量输出 | 清洁能源的无限可能 | 500MeV |

## 动画配置

### 入场动画 (slide-up)

```typescript
from: { y: '100%', visibility: 'hidden', opacity: 0 }
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
    y: 200 * self.progress,
    opacity: Math.max(0, 1 - self.progress * 2),
    visibility: self.progress < 1 ? 'visible' : 'hidden'
  }
}
```
