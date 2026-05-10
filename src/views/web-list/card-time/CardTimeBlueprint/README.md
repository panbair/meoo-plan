# CardTimeBlueprint - 蓝图体系 · SVG流程图的生长与节点揭示

## 概述

CardTimeBlueprint 组件实现了"蓝图体系"效果 - SVG连接线像蓝图一样被绘制，然后节点卡片依次浮现，配合精准的弹入与阴影加深，传递出"精密、有序、可依赖"的工程感。

## 设计理念

企业常需要展示服务流程、业务架构或合作步骤。这个方案让连接线条像蓝图一样被绘制，然后节点卡片依次浮现，配合精准的弹入与阴影加深。

## 特性

### 核心动画

- **SVG路径绘制**: `stroke-dasharray/stroke-dashoffset` 动画模拟绘制
- **节点圆点**: 依次弹入
- **卡片弹性入场**: `back.out` 缓动
- **图标旋转放大**: `rotation: -45` 到 `0`

### 五步流程

| 步骤 | 图标 | 标题 | 描述 | 关键能力 | 颜色 |
|------|------|------|------|----------|------|
| 01 | 🔍 | 需求分析 | 深入业务场景 | 商业洞察 | #3B82F6 |
| 02 | ⚙️ | 方案架构 | 定制化设计 | 系统规划 | #8B5CF6 |
| 03 | 🔧 | 开发实施 | 敏捷迭代 | 技术实现 | #10B981 |
| 04 | 🧪 | 测试验证 | 严格质检 | 质量保障 | #F59E0B |
| 05 | 🚀 | 部署交付 | 快速上线 | 运维支持 | #EC4899 |

## 技术实现

### SVG路径绘制

```typescript
gsap.fromTo('.bp-path-main',
  { strokeDashoffset: 1200 },
  {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: 'power2.inOut'
  }
)
```

### 节点弹入

```typescript
gsap.fromTo('.bp-node',
  { scale: 0, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    stagger: 0.15,
    ease: 'back.out(2)'
  }
)
```

## 视觉效果

- **蓝图网格背景**: 细密的蓝色网格
- **渐变路径**: 多色渐变连接线
- **节点脉冲**: 圆点呼吸动画
- **顶部光条**: 悬停时显示
- **底部信息**: 悬停时滑出
- **卡片连接器**: 步骤间箭头指示

## 动画清理

组件卸载时自动清理：
- GSAP Timeline 实例
- ScrollTrigger 实例
- mousenter/mouseleave 事件
