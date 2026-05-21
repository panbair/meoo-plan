# CardTimeRubiksCube 魔方旋转

## 效果描述
3×3网格的卡片，每行/列可独立旋转打乱再还原。模拟魔方还原过程。

## 技术实现
### 动画阶段
1. **完整态** — 3×3卡片有序排列
2. **打乱** — 滚动触发行列独立旋转打乱
3. **还原** — 继续滚动逐步还原
4. **完成** — 全部归位庆祝光效

### 核心技术
- CSS Grid 3×3布局
- GSAP ScrollTrigger scrub 行列旋转
- translateX/Y 行列位移
- 3D rotateX/Y 翻转效果

## 使用方法
```vue
<CardTimeRubiksCube />
```

