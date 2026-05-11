# CardTimeVoyage - 奢华之旅卡片

> 顶级轻奢 3D 景深旋转滑入，电影镜头级视觉体验

## 特性

- 🎬 **3D 景深旋转滑入** - Y 轴旋转 + 透视 + 从下方滑入
- ✨ **中心优先对称扩散** - C3 → C2/C4 → C1/C5
- 🌟 **五重复合动画** - 位移 + 旋转 + 缩放 + 阴影 + 透明度
- 💫 **永久悬浮呼吸微动** - sine.inOut 丝滑循环
- 🎭 **奢华金色主题** - 温暖的香槟金调色

## 动画逻辑

### 入场时序（中心向两侧扩散）

```
Step 1: C3 (中间) 优先入场 → back.out(1.4) 弹性
Step 2: [C2, C4] 同步入场 → -0.45 重叠
Step 3: [C1, C5] 收尾入场 → -0.4 重叠
Step 4: 永久悬浮呼吸 → stagger from center
```

### 初始化状态

```javascript
gsap.set(cards, {
  opacity: 0,
  y: 60,        // 从下方升起
  scale: 0.8,   // 缩小状态
  rotateY: 25,  // Y轴旋转
  boxShadow: '0 0 0 rgba(0,0,0,0)'
})
```

## 使用方式

```vue
<template>
  <CardTimeVoyage />
</template>

<script setup lang="ts">
import CardTimeVoyage from './card-time/CardTimeVoyage/CardTimeVoyage.vue'
</script>
```

## 卡片数据

```typescript
interface VoyageCard {
  title: string      // 旅程阶段标题
  desc: string       // 描述
  color: string      // 主色调 (HEX)
  label: string      // 元数据标签
  value: string      // 元数据值
  percent: string    // 进度百分比
  icon: string       // SVG图标
}
```

## CSS 变量

| 变量 | 说明 |
|------|------|
| `--card-color` | 卡片主色调 |
| `--card-index` | 卡片索引 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
- CSS 3D Transform
