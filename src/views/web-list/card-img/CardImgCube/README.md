# CardImgCube · 光影魔方

> 图片被装裱于一张具有厚度与金属边框的悬浮卡片中，初始以微倾角度悬于深色空间中，后置一束方向恒定的主光源，投射出长而清晰的斜影。Timeline 驱动卡片绕垂直轴缓慢匀速旋转。

## 效果预览

- **主题**: 光影魔方 · 3D悬浮卡片旋转
- **图片**: 山地风光摄影（Unsplash）
- **配色**: 深蓝、金属银、蓝光点缀
- **动画**: 匀速旋转、光影变化、鼠标跟随

## 核心技术

### CSS 3D 属性
- `transform-style: preserve-3d` 保持3D空间
- `perspective: 1200px` 设置透视距离
- `backface-visibility: hidden` 隐藏背面

### 卡片结构
| 层级 | 元素 | 说明 |
|------|------|------|
| 正面 | 图片层 | 320×450px，山地风光 |
| 背面 | 深色层 | 模拟卡片背面 |
| 顶边 | 金属高光 | 动态渐变模拟光泽 |
| 左侧 | 受光面 | 亮度较高 |
| 右侧 | 背光面 | 较暗 |

### 投影系统
- 独立伪元素生成投影
- GSAP 驱动 `translateX` 和 `skewX` 变化
- 模拟光照投影实时响应

## 动画特效

### 旋转动画
- 周期: 8秒匀速旋转
- 前0.5秒急速启动获得惯性感
- 缓动 `none` 保持匀速

### 俯仰微调
- `rotateX` 在 ±5° 之间循环
- 周期: 4秒
- `yoyo: true` 往复动画

### 鼠标交互
- `rotateY` 跟随鼠标 X 偏移
- `rotateX` 跟随鼠标 Y 偏移（反向）
- 投影同步跟随偏移

### 金属高光
- 顶部边框渐变动画
- `backgroundPositionX` 循环
- 模拟光照移动效果

## 使用方式

```vue
<template>
  <CardImgCube />
</template>

<script setup lang="ts">
import CardImgCube from '@/views/web-list/card-img/CardImgCube/CardImgCube.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
- CSS 3D Transforms
- Unsplash 山地风光图片

## 注意事项

- 组件占满视口，外部需控制滚动区域
- 图片加载需要网络支持
- 建议在深色背景页面使用效果更佳
