# CardImageCrossCrack · 十字裂痕

十字交叉切割入场动画组件。图片被十字交叉的精密刻痕贯穿，四块残片滚动合拢。

## 动画效果

### 核心特效

| 特效 | 描述 |
|------|------|
| **十字切割** | 水平 + 垂直交叉 |
| **四分残片** | 左上、右上、左下、右下 |
| **分离姿态** | 各沿对角线偏移 + 随机旋转 |
| **同步合拢** | ScrollTrigger 驱动归位 |
| **中心辉光** | 交汇处白光脉冲 |
| **残影暗痕** | 极淡十字低频呼吸 |

### 动画阶段

```
top 80%     初始四分分离
top 80-50%  滚动驱动合拢 2s
center      中心辉光脉冲
center+     十字暗痕显现
```

### 视觉效果

```
初始: 四块分离 + 对角偏移
  ↓ 滚动牵引
中段: 四向合拢 + 旋转归零
  ↓
合拢: 中心白光爆发
  ↓
完成: 完整图片 + 暗痕呼吸
```

## 使用方式

```vue
<template>
  <CardImageCrossCrack />
</template>

<script setup>
import CardImageCrossCrack from '@/views/web-list/card-image/CardImageCrossCrack/CardImageCrossCrack.vue'
</script>
```

## 设计规范

- **图片**: 覆盖全屏 `100vw × 100vh`
- **背景**: 深色渐变 `#08080f → #0f0f1a`
- **切割方式**: 水平 + 垂直十字
- **偏移量**: ±35-40px 对角线
- **旋转**: ±3-4deg 随机
- **合拢曲线**: `power3.inOut`
- **scrub**: 1.5s

## 技术实现

- **Vue 3 Composition API**
- **GSAP + ScrollTrigger**
- **clip-path** 四象限切割
- **CSS transforms** 对角位移旋转
- **box-shadow** 刻痕辉光
