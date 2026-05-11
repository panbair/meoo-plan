# CardTimeHologram - 全息投影卡片

> 未来科技风格的全息卡片组件，模拟全息投影界面的视觉效果

## 特性

- 🎯 **全息扫描线** - 上下移动的扫描条效果
- 🌟 **RGB色彩偏移** - 悬停时的RGB分离效果
- ✨ **粒子背景** - 漂浮的全息粒子
- 🔲 **科技边框** - 四角装饰性边框
- 💫 **光晕效果** - 动态的全息光晕
- 📊 **卡片悬浮** - 悬停时的3D变换效果

## 动画效果

### 入场动画
- 徽章旋转缩放入场
- 标题模糊展开 + 斜切效果
- 卡片错落滑落 + 弹性回弹（柔和商务风）
- 底部渐显

### 滚动动画 (ScrollTrigger)
- 标题向上移动 + 模糊消失
- 副标题字母间距变化
- 卡片3D旋转 + 亮度/色相变化
- 整体亮度随滚动增强

## 使用方式

```vue
<template>
  <CardTimeHologram />
</template>

<script setup lang="ts">
import CardTimeHologram from './card-time/CardTimeHologram/CardTimeHologram.vue'
</script>
```

## 组件参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| - | - | - | 自包含组件，无需外部参数 |

## 数据结构

```typescript
interface HoloCard {
  title: string      // 卡片标题
  desc: string       // 描述文字
  color: string      // 主色调 (HEX)
  hue: number        // 色相值 (HSL)
  icon: string       // SVG图标
  metrics: Array<{ value: string, label: string }>  // 指标数据
}
```

## CSS 变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--holo-color` | `#00f5ff` | 全息主色调 |
| `--holo-hue` | `188` | 色相值 |
| `--card-delay` | `index * 0.1` | 卡片延迟 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
