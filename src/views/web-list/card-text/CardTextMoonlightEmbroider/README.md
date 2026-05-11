# CardTextMoonlightEmbroider 月光蚕丝·魔法刺绣文字

## 概述

这是一个模拟深色夜空织料上魔法刺绣效果的动画文本组件。文字以暗纹绣稿隐于其中，一根发光的银蓝蚕丝沿笔画走向逐针穿刺织物，针尖透出冷白月芒，入料时轻跳并溅起星尘，出针时丝线拉出弧光并短暂悬停。

## 效果特性

### 核心视觉效果
- **针尖光点沿路径移动**：使用 MotionPathPlugin 绑定 SVG 笔画路径
- **丝线轨迹渐显**：stroke-dashoffset 动画模拟刺绣过程
- **月光渐变**：月白到银蓝的渐变色丝线
- **星尘粒子爆发**：针尖穿刺时触发随机飞溅的星尘
- **织物呼吸效果**：完成后文字整体轻柔呼吸
- **节点闪光**：刺绣路径上的节点定期闪烁

### 交互效果
- **鼠标悬停抬起**：hover 时字符向上飘动
- **鼠标移动形变**：字符根据鼠标位置产生 skew 形变
- **弹性回归**：鼠标离开后字符弹性归位

### 氛围元素
- **织物纹理**：重复的细线纹理背景
- **星光层**：径向渐变背景光
- **涟漪扩散**：多层向外扩散的圆形涟漪
- **装饰月亮**：右上角发光的月亮元素

## 技术实现

### 动画技术
- **GSAP Timeline**：控制整体动画时序和滚动绑定
- **ScrollTrigger**：滚动触发，支持 scrub 平滑系数
- **MotionPathPlugin**：针尖沿 SVG 路径移动
- **Canvas 粒子系统**：星尘粒子效果
- **stroke-dashoffset**：丝线绘制动画

### 动画时序
1. **0-0.3s**：针尖光点出现
2. **0.2-1.4s**：针尖沿路径移动 + 丝线同步绘制
3. **1.0-1.4s**：文字渐显，模糊到清晰
4. **1.2-1.4s**：节点闪光出现
5. **1.4s+**：进入织物呼吸和鼠标交互状态

### 关键参数
| 参数 | 值 | 说明 |
|------|-----|------|
| 滚动触发起点 | `top 80%` | 元素顶部到达视口80%时开始 |
| 滚动触发终点 | `top 20%` | 元素顶部到达视口20%时结束 |
| 滚动平滑系数 | `1.5` | 值越大动画越平滑 |
| 丝线绘制时长 | `1.2s` | 刺绣过程持续时间 |

## 文件结构

```
CardTextMoonlightEmbroider/
├── CardTextMoonlightEmbroider.vue    # 主组件文件
└── README.md               # 本文档
```

## 使用方式

```vue
<template>
  <CardTextMoonlightEmbroider />
</template>

<script setup>
import CardTextMoonlightEmbroider from './CardTextMoonlightEmbroider/CardTextMoonlightEmbroider.vue'
</script>
```

## 样式变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 背景色 | `#0a0f1a` | 深邃夜空背景 |
| 丝线浅色 | `#e8f4fc` | 月白色丝线 |
| 丝线深色 | `#7eb8da` | 银蓝色丝线 |
| 文字大小 | `clamp(48px, 8vw, 100px)` | 响应式文字大小 |
| 字体 | `Cormorant Garamond` | 优雅衬线字体 |

## 浏览器兼容性

- 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- 需要支持 SVG 和 Canvas
- MotionPathPlugin 需要 GSAP 插件注册

## 性能考虑

- 粒子动画使用 requestAnimationFrame
- 组件卸载时清理所有定时器和动画
- 使用 will-change 优化动画性能
