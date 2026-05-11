# CardTimeBlackHole 黑洞引力扭曲卡片

## 效果描述

滚动触发的黑洞引力扭曲特效。初始状态所有卡片被黑洞吸附在中心奇点，滚动时卡片挣脱引力爆炸扩散。

## 技术实现

- **Vue 3** Composition API + TypeScript
- **GSAP** Timeline + ScrollTrigger
- **CSS 3D** Transform 空间效果

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| start | `top 75%` | 滚动触发起点 |
| end | `top 25%` | 滚动触发终点 |
| scrub | `1.2` | 超丝滑滚动跟随 |
| stagger | `0.05` | 随机顺序扩散 |
| ease | `elastic.out(1.2, 0.8)` | 弹性缓动 |

## 核心特性

1. 初始状态：卡片被黑洞引力吸附，scale=0，z=-800
2. 引力挣脱：elastic.out 弹性缓动产生超强挣脱感
3. 光效爆发：brightness(1.4) + drop-shadow 强化视觉
4. 双向无缝：向上滚动卡片被吞噬回奇点
5. 动态模糊：blur(30px→0) 模拟引力扭曲效果
