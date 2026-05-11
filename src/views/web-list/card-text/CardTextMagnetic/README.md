# CardTextMagnetic - 磁力线场组件

同性相斥，异极相吸。文字如同磁场中的粒子，展现电磁力的奇妙互动。

## 动画特点

- **磁场粒子**: 150+ 粒子沿磁场线螺旋运动
- **同性相斥**: 相同极性粒子互相排斥
- **异性相吸**: 不同极性粒子相互吸引
- **鼠标交互**: 鼠标靠近时字符根据极性被推开或拉近
- **粒子轨迹**: 粒子带有运动轨迹，增强动态感
- **极性配色**: 红蓝双色区分正负极性

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎 (elastic 缓动)
- ScrollTrigger 滚动动画
- Canvas 粒子系统
- 物理模拟（磁场力、中心引力）

## 使用示例

```vue
<template>
  <CardTextMagnetic 
    title="磁力线场" 
    subtitle="同性相斥 · 异极相吸"
    :magnetic-strength="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '磁力线场' | 标题文字 |
| subtitle | string | '同性相斥 · 异极相吸' | 副标题 |
| magneticStrength | number | 1 | 磁场强度 (0-2) |

## 交互

- **鼠标移动**: 字符根据极性被推开或拉近
- **鼠标离开**: 字符弹性恢复原位
