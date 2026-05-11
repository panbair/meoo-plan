# CardImgRift 时空裂隙卡片组件

> 利用 GSAP Flip 插件实现宇宙大爆炸式卡片展开动画

## 效果特点

### 🌌 时空裂隙概念
- **奇点收缩（隐藏态）**: 卡片汇聚于中心能量奇点
- **宇宙爆发（滚动触发）**: 卡片如大爆炸般向四周扩散
- **逆熵回溯（双向动画）**: 滚动回退时卡片被重新吸收

### ✨ 视觉特效
- 脉冲核心光晕动画
- 能量涟漪扩散效果
- 卡片边缘霓虹光效
- 扫描线故障艺术（Glitch）
- 悬浮粒子系统

### 🎬 动画实现
- **GSAP Flip**: 记录最终状态，重置到奇点，自动计算扩散路径
- **ScrollTrigger**: scrub: 2 双向滚动驱动
- **随机 stagger**: 模拟粒子扩散的随机性

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 Composition API | 响应式组件 |
| GSAP Flip | 状态记录与反转 |
| GSAP ScrollTrigger | 滚动驱动 |
| CSS 3D Transforms | 透视效果 |
| SCSS Variables | 主题管理 |

## 动画阶段

| 阶段 | 效果 |
|------|------|
| 奇点积聚 | 脉冲核心收缩，卡片透明旋转 |
| 大爆炸 | 卡片沿随机路径喷射扩散 |
| 涟漪扩散 | 能量波纹从中心向外扩散 |
| 落地稳定 | 卡片形成 3×2 网格 |

## 卡片数据

6 张时空主题图片：
- 时间裂隙 - ANOMALY
- 熵增逆转 - ENTROPY
- 维度折叠 - DIMENSION
- 视界蒸发 - HORIZON
- 虚时隧道 - TUNNEL
- 量子退相干 - QUANTUM

## 响应式断点

| 断点 | 布局 |
|------|------|
| ≥1000px | 3列网格 |
| ≥650px | 2列网格 |
| <650px | 单列布局 |

## 使用方式

```vue
<template>
  <CardImgRift />
</template>

<script setup>
import CardImgRift from './card-img/CardImgRift/CardImgRift.vue'
</script>
```

## 组件注册

已在 `src/views/web-list/index.vue` 自动注册，glob 模式引入。
