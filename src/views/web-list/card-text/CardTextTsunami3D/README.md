# CardTextTsunami3D - 惊涛浮字 · 3D立体文字海啸

## 效果描述

深蓝海洋表面，文字以立体金属块阵列排布。远处涌来无形巨浪，波峰依次掠过字阵。每个立体字符随波峰陡然升起、倾斜，在浪尖处经历极致透视拉伸，随后随波谷沉降并反向倾斜。整段文字如同漂浮在海面的立体浮雕被海浪揉动，光影随波浪起伏扫过金属表面。鼠标点击产生投石入水效果，激起环形波浪向四周扩散，扰动静止的字阵。

## 动画亮点

- 每个文字块设置 `perspective` 和 `rotateX/Y/Z`，构成3D立体浮雕感，表面带有金属光泽渐变
- Timeline 驱动全局波浪相位，GSAP 批量更新每个字的 `y`（波高）、`rotateX`（倾斜）和 `scale`（缩放），遵循正弦波公式
- 波峰经过时字符叠加短暂高光 `box-shadow`，波谷则投下暗影，模拟水面反射
- 鼠标点击位置触发涟漪波纹，向外扩散推力，字符被依次托起再落下，配合 `elastic.out` 产生余波
- 随机微泡粒子从字块间隙上浮，使用 `requestAnimationFrame` 给与上浮速度和水平漂移

## 技术实现

| 特性 | 实现方式 |
|------|----------|
| 3D立体感 | `transform-style: preserve-3d` + `perspective` |
| 波浪动画 | GSAP 正弦波函数驱动多轴旋转 |
| ScrollTrigger | 控制波浪幅度随滚动增强 |
| 点击涟漪 | 环形波纹 + 字符推离/回弹 |
| 气泡粒子 | Canvas 2D 绘制 + 物理漂移 |

## ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `container` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数，值越大动画越平滑 |

## 使用方式

```vue
<template>
  <CardTextTsunami3D />
</template>

<script setup lang="ts">
import CardTextTsunami3D from './card-text/CardTextTsunami3D/CardTextTsunami3D.vue'
</script>
```
