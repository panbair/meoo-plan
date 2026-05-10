# CardTimeCinematic - 电影级叙事卡片

> 顶级高阶 GSAP Timeline 动画，大厂官网级、电影级镜头感

## 特性

- 🎬 **电影级叙事** - 由中心向两侧涟漪扩散的入场时序
- 🌟 **3D 景深效果** - CSS `perspective: 1200px` 开启立体空间
- ✨ **Timeline 嵌套** - 精准时间轴控制，无生硬等待
- 💫 **永久悬浮微动** - 入场结束后柔和呼吸动画
- 🎭 **五章故事结构** - 序章 → 发展 → 高潮 → 转折 → 终章

## 动画逻辑

### 入场叙事时序（中心向两侧扩散）

```
Step 1: C3 (中间卡片) 优先入场 → 视觉焦点
Step 2: [C2, C4] 同步进场 → 第二梯队
Step 3: [C1, C5] 最后铺开 → 最外侧涟漪
Step 4: 全局收尾 → 永久柔和悬浮呼吸
```

### 四属性复合动画

- 3D 旋转 Y轴
- 上下位移
- 缩放
- 透明度 + 阴影动态变化

### 缓动分层

| 阶段 | 缓动 | 效果 |
|------|------|------|
| 入场 | `back.out(1.3)` | 弹性 |
| 微动 | `sine.inOut` | 丝滑 |

## 使用方式

```vue
<template>
  <CardTimeCinematic />
</template>

<script setup lang="ts">
import CardTimeCinematic from './card-time/CardTimeCinematic/CardTimeCinematic.vue'
</script>
```

## 卡片数据

```typescript
interface CinemaCard {
  title: string      // 章节标题
  desc: string       // 描述
  color: string      // 主色调 (HEX)
  tag: string        // 标签
  progress: string   // 进度百分比
  icon: string       // SVG图标
}
```

## CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--card-color` | - | 卡片主色调 |
| `--card-index` | - | 卡片索引 |
| `--card-z` | - | Z轴层级 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
- CSS 3D Transform
