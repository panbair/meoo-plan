# CardTimeTetris 俄罗斯方块

## 效果描述
卡片像俄罗斯方块一样从顶部掉落，自动堆叠排列。经典游戏机制的视觉重现。

## 技术实现
### 动画阶段
1. **游戏区初始化** — 网格背景出现
2. **方块掉落** — 卡片从顶部逐个掉落，带旋转
3. **堆叠排列** — 落到底部自动堆叠对齐
4. **消行特效** — 满行时闪光消除

### 核心技术
- GSAP ScrollTrigger scrub 控制掉落进度
- translateY + rotation 下落动画
- stagger 逐个掉落
- 消行闪光 + scaleY压缩

## 使用方法
```vue
<CardTimeTetris />
```

