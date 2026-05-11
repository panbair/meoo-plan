# CardQuantum 量子脉冲卡片

## 简介

`CardQuantum` 是一个量子物理主题的卡片组件，带有轨道旋转、波粒二象性和量子脉冲等视觉效果。

## 特性

- **量子粒子背景** - 50个动态闪烁的量子粒子
- **波纹扩散背景** - 4层向外扩散的波纹
- **zoom-in 入场动画** - 从中心缩放放大的效果
- **ScrollTrigger 滚动动画** - 卡片随滚动缩小淡出

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型支持 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

## 文件结构

```
CardQuantum/
├── CardQuantum.vue    # 组件源码
└── README.md          # 本文档
```

## 动画配置

### 入场动画 (zoom-in)

```typescript
{
  scale: 0.6,           // 初始缩放 0.6
  opacity: 0,           // 初始透明
  filter: blur(15px)    // 初始模糊
}
```

### ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `card` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数 |

## 使用方式

```vue
<template>
  <CardQuantum />
</template>

<script setup lang="ts">
import CardQuantum from './card-list/CardQuantum/CardQuantum.vue'
</script>
```

## 卡片列表

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 量子纠缠 | 跨越时空的联系 |
| 02 | 态叠加 | 多态并存的可能 |
| 03 | 隧穿效应 | 穿墙而过的奇迹 |
| 04 | 波粒二象性 | 既是粒子也是波 |
