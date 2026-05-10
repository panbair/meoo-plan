# CardPrism 棱镜折射卡片

## 简介

`CardPrism` 是一个棱镜折射主题的卡片组件，带有多彩光线、折射效果和光晕粒子等视觉效果。

## 特性

- **彩虹光束背景** - 8条旋转的彩虹光线
- **七彩粒子** - 30个动态旋转的发光粒子
- **fade-down-left 入场动画** - 从右上方滑入的效果
- **ScrollTrigger 滚动动画** - 卡片随滚动向左下方飞出并淡出

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
CardPrism/
├── CardPrism.vue    # 组件源码
└── README.md        # 本文档
```

## 动画配置

### 入场动画 (fade-down-left)

```typescript
{
  x: 200,           // 从右侧 200px
  y: -200,          // 从上方 -200px
  opacity: 0,        // 初始透明
  rotation: ±12,     // 初始旋转
  scale: 0.35,      // 初始缩放
  skewY: ±6,        // 初始倾斜
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
  <CardPrism />
</template>

<script setup lang="ts">
import CardPrism from './card-list/CardPrism/CardPrism.vue'
</script>
```

## 卡片列表

| 序号 | 标题 | 描述 |
|------|------|------|
| 01 | 光线汇聚 | 光的聚焦与发散 |
| 02 | 光谱分解 | 白光的多彩分离 |
| 03 | 折射定律 | 光的角度偏移 |
| 04 | 全反射 | 临界角的奇迹 |
