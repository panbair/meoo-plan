# CardTimeMagicFlip - 堆叠魔法 · Flip 卡片群展开

> GSAP Flip 插件实现 · 卡片从堆叠到网格的魔法变换

## 效果特性

### 核心效果
- **堆叠状态**: 6张卡片初始像扑克牌一样叠在一起
- **Flip 动画**: 使用 GSAP Flip 插件自动计算变换
- **滚动触发**: ScrollTrigger 控制展开时机
- **随机顺序**: 卡片以随机顺序飞向各自位置
- **3D 悬停**: 鼠标交互产生 3D 倾斜效果

### 动画流程

```
初始状态 → 滚动触发 → Flip 展开 → 网格布局
```

| 阶段 | 状态 | 描述 |
|------|------|------|
| 1 | 堆叠 | 所有卡片重叠在中心，依次旋转偏移 |
| 2 | 触发 | 滚动到达 70% 视口 |
| 3 | 展开 | Flip 计算差异，生成补间动画 |
| 4 | 完成 | 3x2 网格布局，卡片完全展开 |

### 卡片信息

| # | 标题 | 标签 | 数值 | 色调 |
|---|------|------|------|------|
| 01 | 星际之门 | PORTAL | ∞ | 紫色 |
| 02 | 时间沙漏 | TEMPORAL | 365 | 粉色 |
| 03 | 量子矩阵 | QUANTUM | 99.9% | 青色 |
| 04 | 能量核心 | ENERGY | 10K | 橙色 |
| 05 | 全息投影 | HOLOGRAM | 8K | 绿色 |
| 06 | 暗物质场 | DARK | 27% | 暗紫 |

## 技术实现

### GSAP Flip 核心

```typescript
import Flip from 'gsap/Flip'
gsap.registerPlugin(Flip)

// 获取堆叠状态
const cards = document.querySelectorAll('.flip-card')
const state = Flip.getState(cards)

// 切换布局
stack.classList.add('is-expanded')

// Flip 动画
Flip.from(state, {
  duration: 1,
  stagger: {
    each: 0.08,
    from: 'random'
  },
  ease: 'power3.out',
  scale: true,
  fade: true,
  absolute: true,
  spin: true,
  scrollTrigger: {
    trigger: stack,
    start: 'top 70%',
    scrub: 1.5
  }
})
```

### 关键参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `stagger.from` | 'random' | 随机展开顺序 |
| `stagger.each` | 0.08s | 每张卡片延迟 |
| `absolute` | true | 动画期间脱离文档流 |
| `spin` | true | 添加旋转动画 |

### CSS 结构

```scss
.cards-stack {
  // 堆叠状态
  &:not(.is-expanded) {
    .flip-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(calc(var(--index) * 4deg));
    }
  }

  // 展开状态
  &.is-expanded {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    .flip-card {
      position: relative;
    }
  }
}
```

## 视觉效果

### 背景
- 紫色 + 粉色双光晕
- 网格线纹理
- 漂浮粒子系统
- 扫描线动效

### 卡片
- 毛玻璃质感
- 彩虹色调（每张不同）
- 进度条动画
- 发光边框悬停

## 使用方式

```vue
<template>
  <CardTimeMagicFlip />
</template>

<script setup lang="ts">
import CardTimeMagicFlip from './card-time/CardTimeMagicFlip/CardTimeMagicFlip.vue'
</script>
```

## 响应式

| 断点 | 布局 | 卡片尺寸 |
|------|------|----------|
| >1024px | 3列网格 | 260x300px |
| 768-1024px | 2列网格 | 220x260px |
| <768px | 单列 | 280xauto |

## 依赖

```bash
npm install gsap
```

GSAP Flip 插件已包含在 gsap 包中，无需单独安装。
