# CardImgAbyss 视差深渊图片组件

> 多层视差深渊滚动组件 - 营造无限深空的视觉震撼

## 效果特点

### 🎯 多层视差
- **远景层**: 模糊淡化，营造深度感
- **中景层**: 清晰展示，视觉焦点
- **近景层**: 发光边框，突出层次

### 🌌 深度视差
- 3层图片独立 z-index 定位
- 滚动时产生真实的空间纵深感
- 3D perspective 透视增强立体效果

### ✨ 视觉效果
- 星空闪烁背景动画
- 光束从上往下扫描
- 霓虹发光边框脉动
- 深渊核心旋转动画

## 技术实现

| 技术 | 说明 |
|------|------|
| Vue 3 Composition API | 响应式组件架构 |
| GSAP ScrollTrigger | 滚动驱动动画 |
| GSAP Timeline | 多层动画协同 |
| CSS 3D Transforms | 空间透视效果 |
| SCSS Variables | 主题色管理 |

## 动画阶段

| 阶段 | 效果 |
|------|------|
| 星星显现 | 随机闪烁的星空背景 |
| 远景浮现 | 模糊图片淡入扩展 |
| 中景展开 | 清晰主图放大展示 |
| 近景浮现 | 发光边框卡片叠加 |
| 文字浮现 | 描述文字渐显 |

## 图片数据

3 张 Unsplash 高清图片（q=90 清晰）：
- 蓝色星球 - 地球俯瞰
- 星云深处 - 宇宙星云
- 银河走廊 - 银河系

## 响应式断点

| 断点 | 卡片宽度 | 卡片高度 |
|------|----------|----------|
| ≥1200px | 420px | 560px |
| ≥900px | 360px | 480px |
| ≥600px | 280px | 380px |
| <600px | 220px | 300px |

## 使用方式

```vue
<template>
  <CardImgAbyss />
</template>

<script setup>
import CardImgAbyss from './card-img/CardImgAbyss/CardImgAbyss.vue'
</script>
```

## 组件注册

已在 `src/views/web-list/index.vue` 自动注册，访问页面即可查看。
