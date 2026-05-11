# Card3dEntanglement - 时空裂隙卡片组件

> 量子纠缠与虚实坍缩的镜像融合效果

## 效果特点

- **分裂奇点初始**：每张卡片都由实体与虚影两部分纠缠而成
  - 实体使用青蓝色强光晕 `box-shadow: 0 0 50px rgba(0, 255, 255, 0.8)`
  - 虚影使用品红色偏转光晕 `box-shadow: 0 0 50px rgba(255, 0, 255, 0.8)`
  - 虚影初始 `scaleX(-1)` 产生镜面反射
  - 两者呈对角线分离，漂浮在不同深度的 Z 空间

- **滚动触发融合坍缩**：
  - 随着滚动条下移，实体与虚影相互靠近并旋转对齐
  - 虚影逐渐透明，色散光晕收敛，模糊消失
  - 最终完全重叠坍缩为一张完整的卡片

- **完美双向坍缩**：
  - 向上滚动时，完整卡片再次劈裂为实体与虚影
  - 逆向飞回纠缠态，所有阴影、模糊、镜像效果完美倒放

## 技术实现

- **双重元素架构**：每张"逻辑卡片"包含两个 DOM 元素
  - 主实体卡片（`.card-entity`）：青蓝色调，强光晕
  - 镜像虚影（`.card-shadow`）：品红色调，镜像翻转

- **GSAP Flip 双轨补间**：
  - `Flip.getState` 同时捕获所有实体与虚影的最终状态
  - `gsap.set` 将每对实体与虚影转移到纠缠分裂位置
  - `Flip.from` 统一驱动它们回到最终网格

- **ScrollTrigger 双向驱动**：
  - `scrub: 2` 平滑滚动控制
  - `toggleActions: 'play reverse play reverse'` 双向播放

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| perspective | 1800px | 容器透视深度 |
| blur | 4-8px | 纠缠态模糊程度 |
| entity offset | ±100-250px | 实体偏移量 |
| shadow offset | ±100-250px | 虚影偏移量 |
| Z depth | ±150-350px | Z轴深度差 |
| stagger | 0.08s | 卡片间延迟 |

## 使用方式

```vue
<template>
  <Card3dEntanglement />
</template>

<script setup>
import Card3dEntanglement from './card-3d/Card3dEntanglement/Card3dEntanglement.vue'
</script>
```

## 注意事项

- 组件会自动注册 GSAP 插件
- 使用 Vue3 `ref` 数组管理实体与虚影引用
- 组件卸载时自动清理所有 GSAP 动画和 ScrollTrigger
