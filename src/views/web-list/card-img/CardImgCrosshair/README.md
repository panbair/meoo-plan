# CardImgCrosshair 十字星芒旋开 · 旗舰级商务遮罩展卷

## 概述

CardImgCrosshair 组件实现了四片十字分割遮罩的对向展开动画效果，模拟精密仪器的舱门解锁，配合青春风格的视觉设计。

## 效果特性

| 特性 | 描述 |
|------|------|
| 四片十字遮罩 | 对角线向外滑开的四象限遮罩 |
| 菱形光标 | 中心装饰 + 闪烁动画 |
| 暖金倒角 | 边缘暖金色光泽效果 |
| 对称美学 | 严格的四向对称动画 |
| 十字残留 | 展开后淡出的细线印记 |
| 青春装饰 | 粒子、渐变、光晕效果 |

## 技术实现

### 核心元素

- `.crosshair-container` - 舞台容器
- `.crosshair-image` - 背景图片层
- `.panel-tl` / `.panel-tr` / `.panel-bl` / `.panel-br` - 四象限遮罩
- `.diamond-marker` - 中心菱形光标
- `.glow-edge` - 边缘暖金光泽
- `.cross-line` - 十字分割线
- `.vignette-overlay` - 暗角层

### 动画阶段

```
[准备 0-10%]      菱形光标闪烁 → 暖金光泽预热
[信号 10-20%]     菱形收缩 → 十字线微微扩宽
[展开 20-70%]     四象限沿对角线向外滑开
[亮相 70-85%]     图像亮度提升 → 暗角消退 → 十字残留
[收尾 85-100%]   十字消失 → 遮罩回卷 → 菱形再现
```

### ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | container | 触发器元素 |
| start | top 100% | 元素顶部到达视口底部时开始 |
| end | bottom -100% | 元素底部离开视口顶部时结束 |
| scrub | 1.5 | 平滑系数 |

## 使用方式

```vue
<template>
  <CardImgCrosshair />
</template>

<script setup lang="ts">
import CardImgCrosshair from '@/views/web-list/card-img/CardImgCrosshair/CardImgCrosshair.vue'
</script>
```

## 动画细节

### 四象限遮罩

- 左上 (tl): `translateX(0%) translateY(0%)` → `translateX(-100%) translateY(-100%)`
- 右上 (tr): `translateX(0%) translateY(0%)` → `translateX(100%) translateY(-100%)`
- 左下 (bl): `translateX(0%) translateY(0%)` → `translateX(-100%) translateY(100%)`
- 右下 (br): `translateX(0%) translateY(0%)` → `translateX(100%) translateY(100%)`

### 菱形光标动画

- 初始状态：`scale(1) rotate(45deg)`
- 闪烁：`scale(0.3) → scale(1.2) → scale(1)`
- 缓动：`elastic.out(1, 0.5)`

### 青春风格元素

- 渐变色遮罩背景
- 彩色粒子装饰
- 弹性动画效果
- 圆角设计
- 毛玻璃面板

## 清理机制

组件卸载时自动清理：

- ScrollTrigger 实例
- GSAP 时间线
- GSAP 补间动画
- 事件监听器
