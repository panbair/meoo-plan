# CardTimeLuxury - 递进遮罩滑入 · 轻奢高级设计

## 设计理念

轻奢高级设计感拉满的卡片展示效果。卡片从右侧滑入，配合内部遮罩层渐显，通过 Timeline 控制多层动画并行，创造出精致、高级的视觉体验。设计灵感来源于高端品牌网站和奢侈品的展示方式。

## 核心特性

### 递进滑入动画
- **阶段1**：卡片从右滑入（x: 120 → 0），带透明度变化
- **阶段2**：轻微倾斜修正（rotation: 3 → 2 → 0）
- **阶段3**：遮罩层渐显消失
- **阶段4**：图标从模糊到清晰弹出
- **阶段5**：内容区域渐显上升

### Timeline 控制
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: card,
    start: 'top 85%',
    end: 'top 25%',
    scrub: 1.5,
  },
})
```

### 轻奢视觉设计
- 金色主题色（#d4af37）
- 深色背景配金色渐变光晕
- 细线装饰和边框
- 高级感的排版和间距

## 技术实现

### GSAP ScrollTrigger
| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | card | 触发器元素 |
| `start` | 'top 85%' | 开始触发位置 |
| `end` | 'top 25%' | 结束触发位置 |
| `scrub` | 1.5 | 平滑系数 |

### 多层动画并行
- 卡片位移 + 透明度
- 遮罩渐显
- 图标弹出 + 模糊恢复
- 内容渐显 + 位移

### 动画清理
- `cleanupFns` 数组存储所有 timeline kill 函数
- `onUnmounted` 执行所有清理
- `ScrollTrigger.getAll().forEach(st => st.kill())`

## 组件结构

```
CardTimeLuxury/
├── CardTimeLuxury.vue    # 主组件
└── README.md           # 文档
```

## 使用方法

```vue
<template>
  <CardTimeLuxury />
</template>

<script setup lang="ts">
import CardTimeLuxury from '@/views/web-list/card-time/CardTimeLuxury/CardTimeLuxury.vue'
</script>
```

## 卡片数据

| 图标 | 标题 | 描述 | 标签 |
|------|------|------|------|
| ◈ | 量子领域 | 探索微观世界的无限可能 | 量子, 微观 |
| ❖ | 光影交织 | 明暗之间的艺术平衡 | 光线, 阴影 |
| ✧ | 时空编织 | 穿越维度的永恒瞬间 | 时间, 空间 |
| ◇ | 秩序之美 | 对称与和谐的统一 | 对称, 和谐 |

## 视觉效果

1. **卡片入场**：从右侧滑入，轻微倾斜
2. **遮罩渐显**：金色渐变遮罩层逐渐消失
3. **图标弹出**：从模糊到清晰，back.out 缓动
4. **内容渐显**：文字和标签依次出现
5. **悬浮效果**：发光效果、图标旋转
6. **进度指示**：底部金色进度条和点状指示器
