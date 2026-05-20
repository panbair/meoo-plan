# CardTimeGitCommit Git提交历史

## 效果描述
卡片沿git分支树排列，merge/branch动画，commit节点发光。模拟Git版本控制的分支图。

## 技术实现
### 动画阶段
1. **初始commit** — 第一个节点从上方出现
2. **分支生长** — SVG路径沿分支延伸，commit节点逐个亮起
3. **Merge合并** — 分支线条汇合，合并节点爆发光效
4. **HEAD指针** — 当前位置指针跟随滚动移动

### 核心技术
- SVG路径 stroke-dashoffset 动画绘制分支线
- GSAP ScrollTrigger scrub 驱动
- commit节点 scale + glow 发光效果
- 分支颜色编码

## 使用方法
```vue
<CardTimeGitCommit />
```

