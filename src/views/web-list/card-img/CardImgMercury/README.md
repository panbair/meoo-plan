# CardImgMercury 水银幕开 · 液态金属遮罩展卷

## 概述

CardImgMercury 组件实现了一种液态金属质感的遮罩展开动画效果，模拟水银薄膜被无形力场向两侧牵引的视觉体验。

## 效果特性

| 特性 | 描述 |
|------|------|
| 液态金属质感 | 水银渐变背景 + 高光流动 |
| 表面张力波动 | 边缘低频正弦波动动画 |
| 银丝拉丝效果 | 边缘拉伸出极细银丝 |
| 中央亮线 | 初始仅中央可见银色亮线 |
| 亮度色温过渡 | 开启时 brightness 0.85→1.0，色温微暖 |
| 鼠标液面起伏 | hover 时两侧金属饰条产生波动 |

## 技术实现

### 核心元素

- `.mercury-container` - 舞台容器
- `.mercury-image` - 背景图片层
- `.mercury-left` / `.mercury-right` - 左右液态遮罩
- `.mercury-highlight` - 高光层
- `.mercury-filaments` - 银丝粒子
- `.mercury-center-line` - 中央亮线

### 动画阶段

```
[蓄力 0-10%]      中央亮线 → 水银液面微震
[展开 10-70%]     液态遮罩向两侧拉开 + 表面波动 + 银丝飘动
[凝固 70-85%]     金属饰条凝聚 → 亮度提升 → 高光汇聚
[回卷 85-100%]    液面膜回卷 → 边缘波动 → 中央闭合
```

### ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | container | 触发器元素 |
| start | top 100% | 元素顶部到达视口底部时开始 |
| end | bottom -100% | 元素底部离开视口顶部时结束 |
| scrub | 1.5 | 平滑系数 |

## 使用方式

```vue
<template>
  <CardImgMercury />
</template>

<script setup lang="ts">
import CardImgMercury from '@/views/web-list/card-img/CardImgMercury/CardImgMercury.vue'
</script>
```

## 动画细节

### 液态遮罩动画

- 初始宽度：50%（scaleX: 1，scaleX 变换基准为各自边缘）
- 展开：scaleX 从 1 收缩至 0
- 缓动：power4.out 配合 elastic.out(0.3, 0.3)
- 边缘波动：ticker 驱动正弦位移

### 表面质感

- 背景：线性渐变 + 径向高光
- 高光层：动态渐变偏移
- 边缘：box-shadow 银边 + 动态模糊

### 银丝粒子

- 数量：10-15 个
- 动画：向上飘动 + 透明度渐变
- 周期：随机 2-4s

### 鼠标交互

- quickTo 驱动液面起伏
- scaleX 局部微调
- 离开后惯性恢复

## 清理机制

组件卸载时自动清理：

- ScrollTrigger 实例
- GSAP 时间线
- GSAP 补间动画
- ticker 回调
- 事件监听器
