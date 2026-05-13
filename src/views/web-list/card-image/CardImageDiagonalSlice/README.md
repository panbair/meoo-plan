# CardImageDiagonalSlice · 裂隙刻痕

对角线切割入场动画组件。图片被一道从左上至右下的锋利对角线刻痕穿透，两块三角形残片滚动合拢。

## 动画效果

### 核心特效

| 特效 | 描述 |
|------|------|
| **对角切割** | 沿 -55° 对角线分割两块 |
| **分离姿态** | 初始各向外偏移80px/60px，旋转±4° |
| **滚动合拢** | ScrollTrigger 驱动位移和旋转归零 |
| **刻痕辉光** | 合拢瞬间金属蓝白光脉冲 |
| **残影暗痕** | 极淡对角线刻痕低频呼吸 |

### 动画阶段

```
top 80%     初始分离姿态
top 80-50%  滚动驱动合拢 2s
center      辉光脉冲 + 刻痕显现
center+     残影低频呼吸
```

### 视觉效果

```
初始: 两块分离 + 旋转偏移
  ↓ 滚动牵引
中段: 高速合拢 + 旋转归零
  ↓
合拢: 刻痕辉光爆发
  ↓
完成: 完整图片 + 暗痕呼吸
```

## 使用方式

```vue
<template>
  <CardImageDiagonalSlice />
</template>

<script setup>
import CardImageDiagonalSlice from '@/views/web-list/card-image/CardImageDiagonalSlice/CardImageDiagonalSlice.vue'
</script>
```

## 设计规范

- **图片**: 覆盖全屏 `100vw × 100vh`
- **背景**: 深色渐变 `#0a0a12 → #12121f`
- **刻痕角度**: -55° 对角线
- **合拢曲线**: `power3.inOut`
- **scrub**: 1.5s 平衡响应

## 技术实现

- **Vue 3 Composition API**
- **GSAP + ScrollTrigger**
- **clip-path** 三角形切割
- **CSS transforms** 位移旋转
- **box-shadow** 刻痕辉光
