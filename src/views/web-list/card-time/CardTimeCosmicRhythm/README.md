# CardTimeCosmicRhythm - 星际律动卡片阵列

## 概述

星际律动卡片阵列 - 节奏化散开·悬浮·重组·飞行动画。卡片从中心能量方块状态，通过波浪式节奏散开、悬浮升空、姿态重组，最终形成规整的3D悬浮阵列。

## 效果特点

- **初始状态**：所有卡片紧密堆叠在容器中心，压缩成一维线条（scale:0.02），带旋转和模糊效果
- **滚动触发**：向下滚动时，卡片跟随波浪节奏依次散开
- **核心动画**：
  1. **节奏散开**：按波浪顺序弹射扩散，从中心向外扩散
  2. **悬浮升空**：散开后卡片自动向上悬浮，产生Z轴高度差
  3. **姿态重组**：自动旋转归位，形成规整阵列
  4. **自由飞行**：完全展开后卡片轻微上下漂浮，形成动态呼吸感
- **双向闭环**：向上滚动时，卡片按反向节奏回收、堆叠回能量方块
- **视觉冲击**：3D纵深 + 律动节奏 + 悬浮飞行 + 粒子背景

## 技术实现

- **GSAP Timeline** 多段动画串联（脉冲→标题→散开→悬浮→重组→飞行）
- **ScrollTrigger** 滚动绑定全程，scrub平滑跟随，双向完美还原
- **波浪式Stagger** 节奏化序列动画，从中心向外扩散
- **GSAP 3D变换** x/y/z三轴位移 + 旋转 + 悬浮
- **Canvas粒子系统** 背景漂浮粒子效果
- **Vue3 Composition API** ref精准绑定DOM

## 使用方法

```vue
<template>
  <CardTimeCosmicRhythm />
</template>

<script setup lang="ts">
  import CardTimeCosmicRhythm from './CardTimeCosmicRhythm/CardTimeCosmicRhythm.vue'
</script>
```

## 卡片数据

| 编号 | 标题 | 描述 | 频率 |
|------|------|------|------|
| 01 | Pulsar | Rotating neutron star broadcasting cosmic beacons | 1420MHz |
| 02 | Quasar | Active galactic nucleus radiating intense energy | 3C273 |
| 03 | Magnetar | Neutron star with extreme magnetic field | 10¹⁴T |
| 04 | Blazar | Active galaxy with jet pointing to Earth | γ-ray |
| 05 | Seyfert | Spiral galaxy with luminous core | UV |
| 06 | Nova | Thermonuclear explosion on stellar surface | 10⁶L☉ |
| 07 | Supernova | Catastrophic stellar death explosion | 10¹⁰L☉ |
| 08 | Pulsar | Rotating neutron star broadcasting cosmic beacons | 1420MHz |
| 09 | Quasar | Active galactic nucleus radiating intense energy | 3C273 |

## 动画阶段

1. **脉冲环出现** (0-0.5s) - 中心脉冲环渐显
2. **标题渐入** (0.2-0.8s) - 头部标题依次显示
3. **节奏散开** (0.4-1.6s) - 波浪式从中心向外扩散
4. **悬浮升空** (1.2-1.8s) - Z轴高度差
5. **姿态重组** (1.4-1.8s) - 微调旋转归位
6. **页脚出现** (1.5-2s) - 底部状态指示
7. **自由漂浮** (持续) - 循环呼吸动画
8. **粒子背景** (持续) - Canvas粒子系统

## 视觉元素

- **能量网格背景**：动态脉冲网格线
- **脉冲环**：三层扩散环动画
- **波形动画**：卡片内的动态波形条
- **节拍指示器**：底部8条动态跳动的节拍条
- **粒子场**：背景漂浮的光点

## 响应式断点

- **1200px+**: 卡片 200x280px
- **768-1200px**: 卡片 170x250px
- **480-768px**: 卡片 150x220px
- **<480px**: 卡片 130x190px
