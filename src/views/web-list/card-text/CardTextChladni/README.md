# CardTextChladni - 声驻波成型 · 克拉尼文字显影

## 概述

`CardTextChladni` 是一个模拟克拉尼图形（Chladni Pattern）的文字动画组件。散落的粒子受声频驱动，逐渐汇聚于文字轮廓的节点位置，形成精密的声学图案。

## 特性

- **粒子散落** - 800个粒子初始随机分布
- **布朗运动** - 未激活时的热运动状态
- **声频汇聚** - 粒子向文字轮廓聚集
- **涟漪扩散** - 成型时的同心波纹
- **微振颤** - 完成后持续的驻波振动
- **鼠标交互** - 移动鼠标产生干扰涟漪

## 使用方式

```vue
<template>
  <CardTextChladni
    title="CHLADNI"
    subtitle="Standing Wave Resonance"
    :paragraphs="[
      'Sand grains dancing to invisible frequencies',
      'Patterns emerge from chaos at the nodal lines'
    ]"
    :auto-play="true"
    @animation-start="onStart"
    @animation-complete="onComplete"
    @scroll-progress="onProgress"
  />
</template>

<script setup>
import CardTextChladni from './CardTextChladni/CardTextChladni.vue'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'CHLADNI'` | 主标题文字 |
| `subtitle` | `string` | `'Standing Wave Resonance'` | 副标题 |
| `paragraphs` | `string[]` | 见默认数组 | 段落内容数组 |
| `autoPlay` | `boolean` | `true` | 是否自动播放动画 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `animation-start` | - | 动画开始时触发 |
| `animation-complete` | - | 动画完成时触发 |
| `scroll-progress` | `progress: number` | 滚动进度 0-100 |

## 动画流程

1. **粒子散落** - 800个粒子随机分布做布朗运动
2. **频率扫描** - 进度条从0到100%
3. **汇聚成型** - 粒子向文字轮廓节点聚集
4. **涟漪扩散** - 字符成型时产生同心波纹
5. **驻波颤振** - 完成后持续微米级振动

## 技术实现

- Vue 3 Composition API
- GSAP + ScrollTrigger
- Canvas 2D 粒子系统
- 布朗运动模拟
- CSS 涟漪动画
