# CardTimeSpatialDepth

3D 悬浮景深卡片组件 - 空间层次感 + quickTo 实时交互

## 效果特点

- **景深模糊消散入场**：卡片从深处升起，模糊逐渐消散 (`blur(12px)` → `blur(0px)`)
- **quickTo 实时交互**：鼠标移动时使用 GSAP quickTo 驱动卡片 3D 跟随
- **多层 Z 轴深度**：5 张卡片分布在不同深度层 (0.1 ~ 0.9)
- **3D 透视背景**：透视网格 + 地平线效果

## 技术实现

- Vue 3 Composition API + TypeScript
- GSAP + ScrollTrigger
- quickTo 实时鼠标跟随
- CSS 3D transform
- 景深模糊 + Z轴位移

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 入场时长 | 1s | 卡片从深处升起 |
| 模糊消散 | 12px → 0px | 根据深度层级 |
| quickTo 响应 | 0.6s | 鼠标跟随延迟 |
| Z 轴位移 | -400px ~ 80px | 根据深度变化 |
