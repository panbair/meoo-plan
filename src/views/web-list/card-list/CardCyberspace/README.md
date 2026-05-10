# CardCyberspace 赛博空间卡片

## 简介

`CardCyberspace` 是一个赛博空间主题的卡片组件，带有动态网格、节点网络连接和扫描线等视觉效果。

## 特性

- **动态网格背景** - 移动的赛博网格
- **节点网络** - 20个动态连接的网络节点
- **zoom-in-down 入场动画** - 从上方缩放下落的效果
- **ScrollTrigger 滚动动画** - 卡片向下飞出缩小淡出

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
CardCyberspace/
├── CardCyberspace.vue    # 组件源码
└── README.md             # 本文档
```

## 动画配置

### 入场动画 (zoom-in-down)

```typescript
{
  y: -200,        // 从上方 -200px
  scale: 0.6,     // 初始缩放 0.6
  opacity: 0,      // 初始透明
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
  <CardCyberspace />
</template>

<script setup lang="ts">
import CardCyberspace from './card-list/CardCyberspace/CardCyberspace.vue'
</script>
```

## 卡片列表

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 数据矩阵 | 信息的数字化呈现 |
| 02 | 网络拓扑 | 节点连接的结构 |
| 03 | 层级协议 | 通信的规则定义 |
| 04 | 加密隧道 | 安全的数据通道 |
