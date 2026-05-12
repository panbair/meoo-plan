# CardTextCorona - 日冕物质抛射 · 恒星文字诞生

## 概述

`CardTextCorona` 是一个模拟恒星诞生的炫酷文字动画组件。文字从星尘粒子云中凝聚成型，经历引力坍缩、日冕爆发，最终冷却为稳定的恒星金文。

## 特性

- **星云背景** - Canvas 绘制的闪烁星空
- **日冕光环** - 三层扩散的光环效果
- **引力坍缩** - 粒子向中心聚集
- **恒星点燃** - 从白炽到暖金的冷却过程
- **耀斑喷射** - 鼠标 hover 触发粒子爆发
- **脉冲光晕** - 完成后持续的恒星呼吸

## 使用方式

```vue
<template>
  <CardTextCorona
    title="CORONA"
    subtitle="Stellar Birth Sequence"
    :paragraphs="[
      'Igniting the cosmic forge of consciousness',
      'Where light is born from the void eternal'
    ]"
    :auto-play="true"
    @animation-start="onStart"
    @animation-complete="onComplete"
    @scroll-progress="onProgress"
  />
</template>

<script setup>
import CardTextCorona from './CardTextCorona/CardTextCorona.vue'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'CORONA'` | 主标题文字 |
| `subtitle` | `string` | `'Stellar Birth Sequence'` | 副标题 |
| `paragraphs` | `string[]` | 见默认数组 | 段落内容数组 |
| `autoPlay` | `boolean` | `true` | 是否自动播放动画 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `animation-start` | - | 动画开始时触发 |
| `animation-complete` | - | 动画完成时触发 |
| `scroll-progress` | `progress: number` | 滚动进度 0-100 |

## 动画流程

1. **日冕环展开** - 三层光环向外扩散
2. **字符坍缩** - 从模糊散焦凝聚到清晰
3. **耀斑爆发** - 中心喷射粒子流
4. **恒星冷却** - 从白炽到暖金色
5. **脉冲呼吸** - 完成后持续的脉动光晕

## 技术实现

- Vue 3 Composition API
- GSAP + ScrollTrigger
- Canvas 2D 星空背景
- CSS 日冕光环效果
- 粒子系统耀斑
