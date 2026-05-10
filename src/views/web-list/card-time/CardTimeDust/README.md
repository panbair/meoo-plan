# CardTimeDust - 记忆尘埃 · 粒子聚合为卡片

## 设计理念

初始状态，一堆微小的发光粒子松散地漂浮在容器中。当用户滚动到该区域，粒子们仿佛接收到统一指令，群集飞行，精确组合成一张张清晰卡片。随后卡片上浮现内容。过程如同《复仇者联盟》中纳米战甲的组合，充满未来科技感和数字生命感。

## 核心特性

### 粒子系统
- 每张卡片由 **16 个小方块**（4×4 网格）组成
- 初始状态：粒子随机散布在大范围内（-400px ~ 400px）
- 每个粒子有随机初始旋转（-180° ~ 180°）、缩放（0.2 ~ 0.7）、透明度（0.2 ~ 0.5）

### 聚合动画
- **阶段1**：光晕出现，暗示即将聚合
- **阶段2**：粒子飞向目标位置，使用 `power3.out` 缓动
- **阶段3**：粒子变为卡片主题色，添加发光效果
- **阶段4**：光晕消散
- **阶段5**：卡片内容渐显，带模糊到清晰过渡

### 视觉设计
- 深色背景配合紫色/粉色光晕
- 背景星空效果，50 个随机闪烁星星
- 能量条动画展示
- 底部旋转光环提示

## 技术实现

### 3D 公式
```
目标 X = col * (cardWidth / 4)  // 列位置
目标 Y = row * (cardHeight / 4)  // 行位置
```

### GSAP ScrollTrigger
```typescript
ScrollTrigger: {
  trigger: card,
  start: 'top 80%',
  end: 'top 30%',
  scrub: 1.5  // 平滑滚动绑定
}
```

### 动画清理
- `cleanupFns` 数组存储所有 timeline kill 函数
- 组件卸载时执行所有清理
- `ScrollTrigger.getAll().forEach(st => st.kill())` 清理所有触发器

## 组件结构

```
CardTimeDust/
├── CardTimeDust.vue    # 主组件
└── README.md           # 文档
```

## 使用方法

```vue
<template>
  <CardTimeDust />
</template>

<script setup lang="ts">
import CardTimeDust from '@/views/web-list/card-time/CardTimeDust/CardTimeDust.vue'
</script>
```

## 卡片数据

| 图标 | 标题 | 英文名 | 描述 | 色相 |
|------|------|--------|------|------|
| ◈ | 量子 | Quantum | 微观世界的奥秘 | 280° |
| ❖ | 觉醒 | Awaken | 意识的曙光 | 320° |
| ✧ | 涅槃 | Phoenix | 重生的力量 | 200° |
| ◇ | 无限 | Infinity | 永恒的循环 | 45° |

## 视觉效果

1. **粒子初始态**：蓝粉渐变色的发光粒子随机散布
2. **聚合过程**：粒子群集飞向目标，带随机 stagger
3. **卡片成形**：粒子变为统一主题色，添加发光边框
4. **内容渐显**：模糊到清晰，back.out 缓动弹出
5. **悬浮交互**：图标放大旋转，边框发光
