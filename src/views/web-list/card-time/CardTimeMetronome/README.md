# CardTimeMetronome 节拍器

## 效果描述
卡片随节拍器摆锤左右摆动，每拍一张卡片入场。模拟机械节拍器的律动感。

## 技术实现
### 动画阶段
1. **节拍器结构** — 三角底座+摆锤出现
2. **摆锤摆动** — 匀速左右摆动，transformOrigin底部
3. **节拍入场** — 每次摆到极限位置时一张卡片弹入
4. **速度控制** — 滚动控制BPM速度

### 核心技术
- GSAP rotation yoyo repeat:-1 摆动
- ScrollTrigger 控制timeScale
- back.out 弹性入场
- 节拍计数器

## 使用方法
```vue
<CardTimeMetronome />
```

