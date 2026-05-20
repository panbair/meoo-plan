# CardTimePendulumWave 钟摆波

## 效果描述
多张卡片以不同频率摆动，形成视觉"波"的干涉图案。模拟真实钟摆波装置的迷幻节奏美感。

## 技术实现

### 动画阶段
1. **静止态** — 卡片垂直排列悬挂
2. **启动阶段** — 滚动触发所有钟摆同时释放
3. **波浪形成** — 每个钟摆频率略有不同，逐渐形成波浪图案
4. **干涉图案** — 多种视觉pattern循环交替（蛇形/菱形/对称/混沌）

### 核心技术
- 每个钟摆独立 `gsap.to` + 不同 `duration`
- `transformOrigin: 'center top'` 顶部悬挂点
- 频率公式: `duration = baseDuration + index * deltaT`
- `repeat: -1` 永久循环

### ScrollTrigger 参数
```js
{ trigger: container, start: 'top 75%', toggleActions: 'play pause resume pause' }
```

## 视觉效果
- 15根钟摆，频率递增
- 波浪从同步到异步再回同步的循环
- 摆锤拖尾运动轨迹
- 底部投影跟随摆动
- 渐变色从蓝到紫

## 使用方法
```vue
<CardTimePendulumWave />
```

