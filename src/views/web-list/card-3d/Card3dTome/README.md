# Card3dTome - 维度典籍·异次元书册的3D展页仪式

> 时空裂隙中获取远古知识的3D翻页效果

## 效果特点

- **立体书脊初始态**：
  - 12张卡片沿Z轴层叠形成发光书脊
  - `rotateX(-90deg)` 竖立状态，仅顶部边缘发光
  - `backface-visibility: hidden` 隐藏背面
  - 书脊投射出蓝紫色流动辉光

- **滚动驱动的神圣展页**：
  - 书脊从中间裂开，准备散开
  - `stagger.from: 'center'` 从中央向两侧依次翻平
  - `rotateX: -90deg → 0deg` 翻页动作
  - `power4.inOut` 缓动，前慢后快，轻柔落入网格

- **动态光影效果**：
  - 竖立时：`box-shadow: 0 -15px 40px` 顶部强光
  - 翻平后：均匀柔和阴影
  - `filter: brightness(1.4) → brightness(1)` 能量态凝结

- **完全双向操控**：
  - 向上滚动，网格卡片竖立聚拢回书脊
  - 所有光影反向流动

## 技术实现

- **CSS 3D 书脊构建**：
  - `perspective: 1800px` 透视深度
  - `transform-style: preserve-3d` 维持3D空间
  - `translateZ` 制造书脊厚度感

- **GSAP Flip 双态补间**：
  - `Flip.getState` 捕获平面网格状态
  - `gsap.set` 强制转移至书脊3D位姿
  - `Flip.from` 自动计算完整翻页路径

- **交错翻页序列**：
  - `stagger.from: 'center'` 中央优先
  - `stagger: 0.08s` 翻页延迟
  - `scrub: 2` 平滑滚动

## 视觉设计

| 元素 | 设计 |
|------|------|
| 书脊辉光 | 蓝紫色渐变，模糊光晕 |
| 页面边缘 | 顶部发光线框 |
| 典籍字体 | Cinzel + Courier New |
| 金色标题 | 古典书卷气质 |
| 符号装饰 | ◇ ◆ ○ ◈ |

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| perspective | 1800px | 透视深度 |
| 书脊间距 | 10px | Z轴层叠距离 |
| rotateX | -90° → 0° | 翻页角度 |
| stagger | 0.08s | 翻页延迟 |
| ease | power4.inOut | 翻页缓动 |
| scrub | 2 | 平滑滚动 |

## 文件结构

```
card-3d/
├── Card3dTome/
│   ├── Card3dTome.vue  # 组件源码
│   └── README.md      # 文档
```

## 使用方式

```vue
<template>
  <Card3dTome />
</template>

<script setup>
import Card3dTome from './card-3d/Card3dTome/Card3dTome.vue'
</script>
```

## 注意事项

- 组件会自动注册 GSAP ScrollTrigger 和 Flip 插件
- 使用 Vue3 `ref` 数组精准绑定 DOM
- 展页动画从书脊中央向两侧展开
- 组件卸载时清理所有 GSAP 动画和 ScrollTrigger
