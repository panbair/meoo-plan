# CardMirage - 海市蜃楼

## 简介

CardMirage 是一个模拟海市蜃楼幻境效果的主题卡片组件。通过热浪扭曲、城市剪影、镜像反射等视觉效果，营造出虚实交错、神秘梦幻的氛围。

## 效果预览

- **热浪扭曲背景** - 底部热浪层动态起伏，模拟沙漠热气流
- **城市剪影** - 多栋建筑轮廓，窗户闪烁动画
- **镜像反射层** - 顶部倒影效果，增强空间感
- **海市蜃楼卡片** - 5 张主题卡片，悬停时产生光效变化
- **滚动动画** - 标题、副标题、卡片随滚动产生位移、模糊、旋转效果

## 基础用法

```vue
<template>
  <CardMirage />
</template>

<script setup lang="ts">
import CardMirage from './CardMirage/CardMirage.vue'
</script>
```

## 组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 无 | - | - | 组件无需传入参数，使用内置数据 |

## 数据配置

组件内部定义了以下数据结构，可在组件源码中修改：

### 建筑数据 (buildings)

自动生成 10 栋建筑，包含：
- `style` - CSS 样式（left, height, width）
- `windows` - 窗户数组，每个窗户包含闪烁动画

### 卡片数据 (mirageCards)

```typescript
const mirageCards = [
  { icon: '🏛️', title: '幻境宫殿', desc: '在沙漠深处浮现的辉煌建筑群' },
  { icon: '🌊', title: '水中城市', desc: '倒映在天空之境的未来都市' },
  { icon: '⛰️', title: '空中楼阁', desc: '云端之上的神秘悬浮城堡' },
  { icon: '🌫️', title: '雾中港湾', desc: '被薄雾笼罩的宁静港湾' },
  { icon: '✨', title: '星光绿洲', desc: '黑暗中闪耀的神秘水源' }
]
```

## 技术实现

### 动画类型

| 动画类型 | 实现方式 | 说明 |
|----------|----------|------|
| 热浪扭曲 | GSAP to | y 轴往复运动，duration: 3s |
| 闪烁效果 | GSAP to | opacity 往复，duration: 0.5s |
| badge 入场 | GSAP fromTo | scale + rotation + opacity |
| 标题入场 | GSAP fromTo | y + filter blur + opacity |
| 卡片入场 | GSAP fromTo + stagger | y + scale + opacity |
| 滚动消失 | ScrollTrigger | y + opacity + blur + skewY |
| 卡片翻转 | ScrollTrigger | y + rotateY + scale + saturate |

### DOM 引用管理

使用 Vue3 `ref` + `Map` 管理多个卡片的 DOM 引用：

```typescript
const cardRefs = ref(new Map<number, HTMLElement>())

// 模板中使用
:ref="el => cardRefs.set(i, el as HTMLElement)"
```

### 动画清理

所有动画通过 `cleanupFns` 数组管理，组件卸载时统一清理：

```typescript
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// 保存清理函数
cleanupFns.push(() => tl.kill())
cleanupFns.push(() => st.kill())

// 组件卸载时清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
```

## 文件结构

```
CardMirage/
├── CardMirage.vue    # 组件源码
└── README.md         # 本文档
```

## 样式变量

可在组件源码的 `<style>` 部分修改以下变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 背景渐变 | `#1a0a2e → #16213e → #0f3460 → #e94560` | 底部到顶部渐变色 |
| 卡片背景 | `rgba(26, 10, 46, 0.7)` | 半透明深紫色 |
| 边框颜色 | `rgba(233, 69, 96, 0.3)` | 粉红色边框 |
| 模糊程度 | `20px` | 卡片毛玻璃效果 |

## 浏览器兼容性

- 支持 CSS `backdrop-filter` 的浏览器（需要浏览器前缀）
- 支持 CSS `clip-path` 的浏览器
- GSAP 3.12+ 支持所有现代浏览器
