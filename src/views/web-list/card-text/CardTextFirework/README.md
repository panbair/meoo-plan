# CardTextFirework - 烟花篆刻 · 夜空爆字

## 效果描述

盛夏夜空，文字以看不见的引线预埋于天幕。Timeline 沿笔画顺序点燃引线，烟花弹依次升空并在节点处炸开。每次爆炸的星火沿笔画方向辐射扩散，色彩从炽白转为各色光珠，短促闪耀后暗灭。全部节点依次引爆后，文字在余烬中完整浮现，随后所有光点同时二次绽放，汇聚成璀璨的烟火字章。鼠标点击任意位置会额外发射一枚烟花，炸开处局部文字短暂扰动重组。

## 动画亮点

- 每个字符安置烟花弹，Timeline 以 `stagger` 控制升空延迟，赋予上升初速
- 爆点使用径向粒子扩散，颜色渐变从白炽到该节点专属色，`scale` 与 `opacity` 速降，模拟烟花生命周期
- 余烬粒子继续受重力下落并带微光拖尾，使用 `shadowBlur` 与 `opacity` 消退
- 全部节点完成后，所有文字粒子同步再燃，`scale` 从 0 到 1.5，形成终场烟花
- 鼠标点击触发新烟花，爆点处字符短暂外移后凭 `elastic.out` 弹性归位

## 技术实现

| 特性 | 实现方式 |
|------|----------|
| 夜空背景 | Canvas 绘制150颗闪烁星星 |
| 烟花发射 | 物理上升 + 尾焰效果 |
| 爆炸粒子 | 60-100颗径向扩散 + 轨迹 |
| 文字动画 | GSAP scale + opacity 弹性出现 |
| 点击交互 | 涟漪发射 + 字符扰动回弹 |
| ScrollTrigger | 滚动触发随机烟花 + 发光增强 |

## ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `container` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数 |

## 使用方式

```vue
<template>
  <CardTextFirework />
</template>

<script setup lang="ts">
import CardTextFirework from './card-text/CardTextFirework/CardTextFirework.vue'
</script>
```
