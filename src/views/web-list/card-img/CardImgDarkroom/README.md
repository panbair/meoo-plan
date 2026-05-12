# CardImgDarkroom · 暗房印相 · 银盐显隐滚动联动

## 概述

CardImgDarkroom 组件实现"暗房印相·银盐显隐滚动联动"效果。图片如一张尚未定影的银盐接触印相纸，初始被高密度黑色遮罩完全覆盖。用户滚动时，无形曝光灯从上方扫过，遮罩如同显影液中的银盐从上方溶解释放，图片渐次浮现；反向滚动时，曝光灯逆回扫，已显影区域重新被遮罩覆盖。

## 动画效果

### 滚动曝光显影动画（核心）

| 元素 | 初始状态 | 最终状态 | 同步机制 |
|------|----------|----------|----------|
| 主容器 | opacity: 0, scale: 0.88, y: 20 | 正常显示 | scrub |
| 图片 | blur: 20px, brightness: 0.3, scale: 0.88 | blur: 0, brightness: 1, scale: 1 | scrub |
| 曝光遮罩 | clipPath: inset(0%) | clipPath: inset(100%) | scrub |
| 扫描线 | top: 0%, opacity: 0 | top: 100% | scrub |
| 安全灯叠加 | opacity: 0.4 | opacity: 0.05 | scrub |
| 边缘银光 | opacity: 0 | opacity: 0.4 | scrub |
| 银盐颗粒 | opacity: 0.8 | opacity: 0.3 | scrub |
| 暖光晕 | scale: 0.85, opacity: 0 | 正常显示 | scrub |
| 脉冲光晕 | scale: 0.7, opacity: 0 | 正常显示 | scrub |
| 暗角 | opacity: 0.95 | opacity: 0.5 | scrub |
| 背景安全灯 | opacity: 0.3 | opacity: 0.6 | scrub |
| 标题 | opacity: 0, blur: 5px, y: 15 | 正常显示 | scrub |

### ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | parent | 触发器元素 |
| start | 'top 100%' | 元素顶部到达视口top 100%时开始 |
| end | 'top 20%' | 元素顶部到达视口top 20%时结束 |
| scrub | 1.5 | 平滑系数 |

### 属性联动表

| 属性 | 初始值 | 最终值 | 说明 |
|------|--------|--------|------|
| blur | 20px | 0px | 显影清晰度 |
| brightness | 0.3 | 1.0 | 曝光强度 |
| scale | 0.88 | 1.0 | 构图归位 |
| clip-path | inset(0%) | inset(100%) | 遮罩溶出 |

### 循环呼吸动画（独立于滚动）

| 动画 | 范围 | 周期 | 效果 |
|------|------|------|------|
| 脉冲光晕 | scale + opacity | 4s | 呼吸灯效 |
| 暖光晕 | scale + opacity | 5s | 柔和脉动 |
| 暗角呼吸 | opacity | 6s | 氛围变化 |
| 安全灯背景 | opacity | 7s | 暗房氛围 |
| 银盐颗粒 | opacity | 2s | 闪烁质感 |
| 边缘银光 | opacity | 3s | 光泽流转 |

### 粒子系统

| 粒子类型 | 数量 | 动画 | 说明 |
|----------|------|------|------|
| 银盐颗粒 | 60 | 微弱闪烁 | 暗房银盐质感 |

## 视觉层次

1. **背景层**：深棕黑渐变 + 安全灯琥珀光晕
2. **粒子层**：银盐颗粒漂浮
3. **扫描线层**：曝光扫描线指示器
4. **遮罩层**：曝光遮罩（clip-path 控制溶出）
5. **框架层**：暖光晕 + 脉冲光晕
6. **图片层**：银盐颗粒 + 安全灯叠加 + 边缘银光
7. **暗角层**：动态暗角
8. **边框层**：四角琥珀色角框

## 技术实现

### 色彩系统

- 主背景：深棕黑 `#0a0806` ~ `#1a1008`
- 安全灯色：`rgba(200, 120, 60, 0.15)`
- 暖光晕：`rgba(200, 140, 80, 0.2)`
- 银盐颗粒：`rgba(255, 220, 180, 0.7)`
- 文字色：暖白色 `#ffeedd`

### 曝光遮罩实现

```typescript
// 遮罩从上方溶出
exposureTl.to(maskRef.value, {
  clipPath: 'inset(100% 0% 0% 0%)',
  duration: 1,
  ease: 'none',
})
```

### 扫描线效果

```typescript
// 扫描线移动
exposureTl.to(scannerLineRef.value, {
  top: '100%',
  opacity: 0.6,
  duration: 1,
  ease: 'none',
})
```

### 银盐颗粒 SVG

```svg
<filter id="silver-grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" />
  <feColorMatrix type="saturate" values="0" />
  <feBlend mode="overlay" />
</filter>
```

### 动画周期表

| 动画组 | 周期 | 类型 |
|--------|------|------|
| 脉冲光晕 | 4s | 独立循环 |
| 暖光晕 | 5s | 独立循环 |
| 暗角呼吸 | 6s | 独立循环 |
| 安全灯背景 | 7s | 独立循环 |
| 银盐颗粒 | 2s | 独立循环 |
| 边缘银光 | 3s | 独立循环 |

## 使用说明

```vue
<template>
  <CardImgDarkroom />
</template>

<script setup lang="ts">
import CardImgDarkroom from '@/views/web-list/card-img/CardImgDarkroom/CardImgDarkroom.vue'
</script>
```

## 动画清理

组件卸载时自动清理所有动画：

```typescript
onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
```
