# CardAudioWave - 音频可视化卡片

## 简介

CardAudioWave 是一个具有音频可视化效果的卡片组件，包含波形图、圆形频谱、扫描线等动画效果，营造出专业的音频播放器和音乐可视化器氛围。

## 特性

- **波形可视化** - Canvas 绘制的动态波形
- **圆形频谱** - 32 频段圆形频谱显示
- **扫描线动画** - 上下循环的扫描光效
- **音频条动画** - 模拟音频播放的跳动的条
- **网格背景** - 科技感网格覆盖层
- **3D 翻转效果** - 卡片具有 3D 旋转和悬浮

## 技术实现

- Vue 3 Composition API
- TypeScript 类型定义
- GSAP 动画引擎
- ScrollTrigger 滚动控制
- Canvas 波形绘制
- SCSS 样式预处理

## 动画说明

| 动画类型 | 描述 |
|---------|------|
| 入场动画 | 卡片弹出、图标旋转放大 |
| 滚动动画 | 卡片波动、缩放、旋转 |
| 频谱条 | 32 个频谱条随机跳动 |
| 频谱旋转 | 圆形频谱持续旋转 |
| 扫描线 | 光线从上到下循环 |
| 音频条 | 5 个音频条模拟播放 |

## 使用方式

```vue
<template>
  <CardAudioWave />
</template>

<script setup lang="ts">
import CardAudioWave from '@/views/web-list/card-list/CardAudioWave/CardAudioWave.vue'
</script>
```
