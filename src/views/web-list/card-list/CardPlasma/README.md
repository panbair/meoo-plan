# CardPlasma 等离子态卡片

## 简介

`CardPlasma` 是一个等离子态主题的卡片组件，带有能量场、波纹扩散和粒子上升等视觉效果。

## 特性

- **等离子粒子背景** - 40个向上飘浮的发光粒子
- **波纹扩散** - 5层向外扩散的能量波纹
- **zoom-in-up 入场动画** - 从下方缩放上升的效果
- **ScrollTrigger 滚动动画** - 卡片向上飞出缩小淡出

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
CardPlasma/
├── CardPlasma.vue    # 组件源码
└── README.md         # 本文档
```

## 动画配置

### 入场动画 (zoom-in-up)

```typescript
{
  y: 200,           // 从下方 200px
  scale: 0.6,       // 初始缩放 0.6
  opacity: 0,        // 初始透明
  filter: blur(15px)
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
  <CardPlasma />
</template>

<script setup lang="ts">
import CardPlasma from './card-list/CardPlasma/CardPlasma.vue'
</script>
```

## 卡片列表

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 离子电弧 | 高能粒子的舞蹈 |
| 02 | 磁场约束 | 托卡马克的奇迹 |
| 03 | 核聚变 | 恒星力量的源泉 |
| 04 | 能量爆发 | 等离子体的激荡 |
