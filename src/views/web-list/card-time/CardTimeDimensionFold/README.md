# CardTimeDimensionFold 时空折叠卡片阵列

## 效果描述

多维碎片重组为平面的维度撕裂奇观。初始状态卡片散布于3D空间深处，滚动触发时折叠成完美平面网格。

## 技术实现

- **Vue 3** Composition API + TypeScript
- **GSAP** Timeline + ScrollTrigger + Flip
- **Canvas** 维度裂缝特效
- **CSS 3D** Transform 空间效果

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| start | `top 80%` | 滚动触发起点 |
| end | `top 10%` | 滚动触发终点 |
| scrub | `1.5` | 平滑滚动跟随 |
| 3D散射 | translateZ -150~-450 | 深度散布 |

## 核心特性

1. 三维碎片初始：随机X/Y/Z分布 + 独立旋转 + 景深模糊
2. 维度折叠触发：Flip补间3D→2D空间变形
3. 透视动态调整：perspective强度从2000→800
4. 维度裂缝Canvas：闪电路径随进度动态绘制
5. 完全可逆：向上滚动自动反向撕裂
