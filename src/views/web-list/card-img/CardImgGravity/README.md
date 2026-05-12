# CardImgGravity - 时空曲率 · 引力透镜背景视差

模拟超大质量引力源扭曲时空的背景效果，呈现爱因斯坦环与引力透镜现象。

## 核心特性

- **同心环带系统**: 三层差异化旋转速度
- **SVG 扭曲滤镜**: feTurbulence + feDisplacementMap
- **引力源核心**: 脉冲动画 + 光晕效果
- **鼠标交互**: 引力场随光标偏转

## 层级结构

| 层级 | 直径 | 旋转方向 | 旋转速度 | 颜色 |
|------|------|----------|----------|------|
| 内环 | 300px | 顺时针 | 快速 | 橙红 |
| 中环 | 500px | 逆时针 | 中速 | 蓝紫 |
| 外环 | 700px | 顺时针 | 慢速 | 紫罗兰 |

## 动画说明

### 滚动视差
- 内环: 旋转360°，向心收缩
- 中环: 逆时针180°，向外舒张
- 外环: 旋转90°，轻微收缩

### 扭曲强度
- 滚动驱动 displacementMap scale
- 范围: 0 → 15
- 基础频率同步变化

### 引力核心
- 脉冲动画 + 旋转环
- 中心光点 + 外发光
- 曲率指示器实时更新

### 鼠标交互
- 引力源中心跟随光标
- 扭曲场同步偏转
- 离开后弹性恢复

## 使用方式

```vue
<template>
  <CardImgGravity />
</template>

<script setup>
import CardImgGravity from '@/views/web-list/card-img/CardImgGravity/CardImgGravity.vue'
</script>
```
