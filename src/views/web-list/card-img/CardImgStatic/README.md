# CardImgStatic - 静电深渊 · 雪花噪点视差显像

模拟老式电视无信号时的雪花噪点效果，隐藏图像需鼠标探索才能显现。

## 核心特性

- **三层噪点**: 细腻 / 中粒 / 粗粒
- **SVG 滤镜**: feTurbulence + feColorMatrix
- **扫描线**: 60条电视扫描线
- **信号指示**: 动态信号强度条
- **探索显像**: 鼠标揭示隐藏图像

## 层级结构

| 层级 | baseFrequency | 速度 | 混合模式 |
|------|---------------|------|----------|
| 细腻噪点 | 0.8 | 极慢 | screen |
| 中景粒子 | 0.05 | 中速 | overlay |
| 粗粒噪点 | 0.12 | 最快 | lighten |

## 动画说明

### 滚动视差
- 三层以不同速度垂直漂移
- 近层噪点快速翻涌
- 远层细腻噪点极缓蠕动

### 噪点刷新
- 80ms 刷新周期
- 随机改变 seed 值
- 产生无重复雪花效果

### 扫描线
- 60 条交替明暗线
- 模拟 CRT 电视效果

### 信号指示器
- 5 格动态信号强度条
- 信号强度随机闪烁
- 文本随机切换状态

### 鼠标交互
- 移动时隐藏图像显现
- 噪点层局部减弱
- 信号变为 "SIGNAL FOUND"
- 离开后 2 秒恢复噪点

## 使用方式

```vue
<template>
  <CardImgStatic />
</template>

<script setup>
import CardImgStatic from '@/views/web-list/card-img/CardImgStatic/CardImgStatic.vue'
</script>
```

## 图片来源

- 隐藏图像: [Unsplash Ocean](https://images.unsplash.com/photo-1518837695005-2083093ee35b)
