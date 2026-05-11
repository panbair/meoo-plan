# CardTimeGravitonSling - 引力弹弓卡片组件

## 概述

时空裂隙卡片组件——引力弹弓与光年轨迹的跃迁奇观。卡片从中心"奇点"沿贝塞尔曲线飞散，带有光年轨迹拖尾效果。

## 效果特点

- **奇点压缩初始**：所有卡片蜷缩在中心的"奇点"中，scale:0，带旋转和高亮
- **滚动驱动发射**：向下滚动时，卡片沿优美弧形轨迹飞向网格位置
- **贝塞尔路径**：使用二次贝塞尔曲线生成弧形飞行路径
- **光年轨迹拖尾**：Canvas 动态绘制光轨，颜色渐变渐隐
- **脉冲序列动画**：卡片依次发射，形成节奏感
- **双向完美回溯**：向上滚动时，卡片沿原轨迹返回

## 技术实现

- **GSAP Timeline** 多段动画串联
- **ScrollTrigger** 滚动绑定，scrub 平滑跟随
- **贝塞尔曲线插值** 自定义路径动画
- **Canvas 动态轨迹系统** 实时绘制和清理轨迹
- **Vue3 Composition API** ref 精准绑定 DOM

## 使用方法

```vue
<template>
  <CardTimeGravitonSling />
</template>

<script setup lang="ts">
import CardTimeGravitonSling from './CardTimeGravitonSling/CardTimeGravitonSling.vue'
</script>
```

## 属性说明

无外部属性，完全通过 ScrollTrigger 滚动驱动动画。

## 卡片数据

| ID | 标题 | 描述 | 能量 | 质量 |
|----|------|------|------|------|
| 01 | Antimatter | Opposite matter creating quantum void | 1.8TeV | 0.511MeV |
| 02 | Dark Energy | Accelerating cosmic expansion | 3.2μeV | ∞ |
| 03 | Quantum Foam | Spacetime at Planck scale | 1.22TeV | 21.1μg |
| 04 | Neutrino Wind | Ghost particles traversing dimensions | 0.1eV | <0.12eV |
| 05 | Graviton | Force carrier of gravity | 10^-33GeV | 10^-66g |
| 06 | Higgs Field | Giving mass to particles | 126GeV | 125GeV |
| 07 | String Vibration | Fundamental cosmic strings | 10^19GeV | 10^-8kg |
| 08 | Vacuum State | Lowest energy quantum state | -0.5ℏω | 0 |
| 09 | Cosmic Ray | High-energy particles from space | 10^20eV | proton |
| 10 | Hawking Radiation | Black hole quantum emission | T formula | variable |
| 11 | Zero Point | Quantum vacuum fluctuation | 1/2ℏω | virtual |
| 12 | Cosmic Origin | The birth of everything | ∞ | 0 |

## 动画阶段

1. **引力场出现** (0-0.8s) - 中心引力场环和核心渐显
2. **标题渐入** (0.2-1s) - 头部标题依次显示
3. **卡片飞散** (0-各卡独立) - 沿贝塞尔曲线飞向目标位置
4. **轨迹拖尾** - Canvas 实时绘制飞行轨迹
5. **持续浮动** - 完成后卡片轻微上下漂浮
6. **进度指示** - 底部显示滚动深度百分比

## 响应式断点

- **1200px+**: 卡片 220x300px
- **768-1200px**: 卡片 180x260px
- **480-768px**: 卡片 150x220px
- **<480px**: 卡片 130x190px
