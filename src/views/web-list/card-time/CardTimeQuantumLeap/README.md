# CardTimeQuantumLeap 量子跃迁面板

## 效果描述

滚动触发的多维空间折叠动画，模拟量子跃迁效果。初始状态所有面板压缩为一维线条，滚动触发时沿多轴立体弹射展开。

## 技术实现

- **Vue 3** Composition API + TypeScript
- **GSAP** Timeline + ScrollTrigger
- **CSS 3D** Transform 空间效果

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| start | `top 80%` | 滚动触发起点 |
| end | `top 20%` | 滚动触发终点 |
| scrub | `1.5` | 平滑滚动跟随 |
| stagger | `0.06` | 随机顺序面板延迟 |

## 核心特性

1. 初始压缩：面板聚集中心，scaleX 极小
2. 量子展开：xPercent/yPercent/scaleXYZ 同步动画
3. 旋转扭曲：随机初始角度产生空间撕裂感
4. 光影特效：brightness/blur 动态滤镜
5. 双向无缝：支持滚动反向折叠回归
