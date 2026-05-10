# CardTimeMaterialAwakening 材质觉醒卡片

> 材质觉醒·光扫与色彩呼吸 - 卡片从灰度休眠态苏醒的仪式感动画

## 特性

- 🌟 **材质苏醒动画**: 卡片从灰度状态逐渐恢复色彩
- ✨ **光扫效果**: 优雅的光带从左向右划过卡片表面
- 💫 **色彩呼吸**: 滚动驱动的双向动画效果
- 🎯 **3D悬停**: 鼠标跟随的透视倾斜效果
- 🔄 **滚动触发**: ScrollTrigger 控制的入场与交互动画

## 动画原理

### 1. 初始状态
- 卡片呈现灰度 (`grayscale(100%)`)
- 背景为浅灰色 `#d1d5db`
- 阴影较浅
- 边框光效不可见

### 2. 光扫效果
使用伪元素 `.card-shine` 模拟光泽条：
- 初始位置: `left: -100px`
- 动画结束: `left: calc(100% + 60px)`
- 配合 `skewX` 实现斜向光效

### 3. 觉醒过程
- 卡片从下方浮入
- 光扫从左向右划过
- 灰度逐渐归零
- 背景变白
- 阴影增强
- 边框光效显现

### 4. 双向滚动
- `scrub: 2` 实现平滑的滚动绑定
- 卡片带有轻微的呼吸缩放效果
- 向上滚动时动画可逆

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

## 使用方式

```vue
<template>
  <CardTimeMaterialAwakening />
</template>

<script setup lang="ts">
import CardTimeMaterialAwakening from '@/views/web-list/card-time/CardTimeMaterialAwakening/CardTimeMaterialAwakening.vue'
</script>
```

## 组件结构

```
CardTimeMaterialAwakening/
├── CardTimeMaterialAwakening.vue  # 主组件
└── README.md                      # 文档
```

## 关键代码

### GSAP 动画设置

```typescript
// 构建材质觉醒主时间线
const masterTL = gsap.timeline({
  scrollTrigger: {
    trigger: galleryRef.value,
    start: 'top 75%',
    toggleActions: 'play none none reverse'
  }
})

// 卡片入场 + 光扫 + 颜色觉醒
cardTL.fromTo(card,
  { y: 80, opacity: 0, scale: 0.85, filter: 'grayscale(100%)' },
  { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
)
.fromTo(shine,
  { left: '-100px' },
  { left: 'calc(100% + 60px)', duration: 1.2, ease: 'power3.inOut' },
  0.3
)
.to(card,
  { filter: 'grayscale(0%)', backgroundColor: '#ffffff', duration: 1 },
  0.3
)
```

### 清理机制

```typescript
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && sectionRef.value?.contains(st.vars.trigger as Element)) {
      st.kill()
    }
  })
})
```

## 样式变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `--card-hue` | 动态值 | 卡片主题色调 |

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 许可证

MIT
