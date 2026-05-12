# CardImgAurora · 极光天幕

> 多层极光背景视差效果，结合真实极光摄影图片，营造沉浸式极光体验。

## 效果预览

- **主题**: 极光之舞 · 多层光帘背景视差
- **图片**: 挪威特罗姆瑟极光摄影
- **配色**: 翠绿、紫罗兰、青蓝、冷白
- **动画**: 四层视差、光束蠕动、鼠标扰动、星光闪烁

## 层级架构

| 层级 | 元素 | 速度系数 | 效果 |
|------|------|---------|------|
| 背景 | Unsplash极光图片 | 0.08 | 随滚动缩放+平移 |
| 远景 | 翠绿/紫罗兰极光 | 0.06 | 最慢，深色，模糊 |
| 中景 | 青蓝/翠绿极光 | 0.15 | 中速，mix-blend-mode: screen |
| 近景 | 多层混合极光 | 0.3 | 最快，高亮 |
| 粒子 | 60个星光粒子 | 0.2 | 闪烁上浮效果 |

## 动画特效

### 视差滚动
- `ScrollTrigger` 驱动多层差异化速度漂移
- 背景图片缩放从1.1到1.2
- 各层极光以不同速度垂直移动

### 光束蠕动
- GSAP ticker 驱动正弦/余弦摆动
- 远/中/近景三层不同频率波动

### 鼠标交互
- 光晕跟随鼠标移动
- 极光层受鼠标位置扰动
- 图片轻微跟随鼠标偏移

### 色相呼吸
- 极光色调在翠绿与紫罗兰之间循环
- 饱和度随滚动变化

## 使用方式

```vue
<template>
  <CardImgAurora />
</template>

<script setup lang="ts">
import CardImgAurora from '@/views/web-list/card-img/CardImgAurora/CardImgAurora.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
- Unsplash 真实极光图片

## 注意事项

- 组件占满视口，外部需控制滚动区域
- 图片加载需要网络支持
- 建议在深色背景页面使用效果更佳
