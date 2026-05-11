# CardTextOrigami - 折纸显形 · 立体折字

## 效果描述

素色桌面背景，文字以精致立体折纸形态存在。初始时每个字母像被揉皱的纸团，布满不规则折痕与叠角。Timeline 启动后，纸团逐面展开，折痕依次摊平，纸角顺滑翻落，最终平整为带有折痕残留的立体文字浮雕。环境光随展开掠过纸面，呈现柔和纸纹与投影。鼠标拖拽可旋转视角，从背面欣赏折痕痕迹，完全展开后文字保持立体厚度，仿佛刚从折纸艺术中诞生。

## 动画亮点

- 每个字母由多个 CSS 3D 面片构成折纸模型，通过 `rotateX/Y` 控制折叠角度
- Timeline 按字母顺序依次展开，面片从揉皱状态过渡到平整，带轻微弹性
- 展开过程中伴随折痕纹理闪烁，纸面呈现柔和米白色
- 鼠标拖动全局旋转视角，GSAP 驱动平滑跟踪
- 字母阴影随鼠标角度自动调整位置与模糊度，强化立体浮雕感

## 技术实现

| 特性 | 实现方式 |
|------|----------|
| 3D折纸 | `perspective` + `rotateX/Y` + `transform-style: preserve-3d` |
| 入场动画 | Timeline 控制逐字符从揉皱到展开 |
| 鼠标旋转 | 拖拽计算鼠标位置驱动 `rotateX/Y` |
| 动态阴影 | 根据鼠标位置计算阴影偏移和模糊度 |
| 折痕效果 | 周期性 box-shadow 闪烁模拟折痕反光 |
| ScrollTrigger | 滚动时增强字符旋转摆动 |

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
  <CardTextOrigami />
</template>

<script setup lang="ts">
import CardTextOrigami from './card-text/CardTextOrigami/CardTextOrigami.vue'
</script>
```

## 交互说明

- **鼠标拖拽**: 旋转整个文字视角
- **鼠标移动**: 阴影位置随鼠标变化
