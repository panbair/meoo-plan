# CardHolographic 全息矩阵卡片

## 简介

`CardHolographic` 是一个全息矩阵主题的卡片组件，带有扫描线、全息闪烁和故障艺术等视觉效果。

## 特性

- **全息背景** - 动态光点和光束效果
- **扫描线动画** - 卡片上的垂直扫描效果
- **fade-down-right 入场动画** - 从左上方向右下方的滑入效果
- **ScrollTrigger 滚动动画** - 卡片随滚动向右下方飞出并淡出

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
CardHolographic/
├── CardHolographic.vue    # 组件源码
└── README.md              # 本文档
```

## 动画配置

### 入场动画 (fade-down-right)

```typescript
{
  x: -200,           // 从左侧 -200px
  y: -200,           // 从上方 -200px
  opacity: 0,        // 初始透明
  rotation: ±15,     // 初始旋转
  scale: 0.35,       // 初始缩放
  filter: blur(12px)
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
  <CardHolographic />
</template>

<script setup lang="ts">
import CardHolographic from './card-list/CardHolographic/CardHolographic.vue'
</script>
```

## 卡片列表

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 数据投影 | 全息信息的投射 |
| 02 | 维度折叠 | 空间层的交错 |
| 03 | 时空锚点 | 穿越坐标的锁定 |
| 04 | 矩阵重建 | 数据结构的重塑 |
