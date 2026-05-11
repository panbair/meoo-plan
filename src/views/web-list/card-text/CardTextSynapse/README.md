# CardTextSynapse - 突触脉冲神经态文字

## 概述

`CardTextSynapse` 是一个模拟神经网络突触激活的炫酷文字动画组件。文字由隐形的神经网络连接，脉冲逐字点亮，配合放电粒子和呼吸光晕效果。

## 特性

- **神经网络背景** - Canvas 动态绘制的神经网络节点
- **突触脉冲动画** - 逐字激活的蓝紫电脉冲效果
- **放电粒子** - 字符激活时迸射的火花粒子
- **呼吸光晕** - 完成后持续的神经电位振荡
- **鼠标视差** - 移动鼠标产生局部轴突响应
- **滚动绑定** - ScrollTrigger 控制动画进度

## 使用方式

```vue
<template>
  <CardTextSynapse
    title="SYNAPSE"
    subtitle="Neural Pulse Activation"
    :paragraphs="[
      'Bio-digital consciousness emerging from silicon dreams',
      'Synaptic pathways illuminate the path to digital evolution'
    ]"
    :auto-play="true"
    @animation-start="onStart"
    @animation-complete="onComplete"
    @scroll-progress="onProgress"
  />
</template>

<script setup>
import CardTextSynapse from './CardTextSynapse/CardTextSynapse.vue'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'SYNAPSE'` | 主标题文字 |
| `subtitle` | `string` | `'Neural Pulse Activation'` | 副标题 |
| `paragraphs` | `string[]` | 见默认数组 | 段落内容数组 |
| `autoPlay` | `boolean` | `true` | 是否自动播放动画 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `animation-start` | - | 动画开始时触发 |
| `animation-complete` | - | 动画完成时触发 |
| `scroll-progress` | `progress: number` | 滚动进度 0-100 |

## 动画流程

1. **神经网络激活** - 背景节点依次点亮
2. **字符脉冲** - 逐字激活，伴随火花粒子
3. **呼吸光晕** - 完成后持续的神经振荡
4. **鼠标交互** - 移动鼠标产生局部反应

## 技术实现

- Vue 3 Composition API
- GSAP + ScrollTrigger
- Canvas 2D 神经网络背景
- SVG 连接线
- 粒子系统
