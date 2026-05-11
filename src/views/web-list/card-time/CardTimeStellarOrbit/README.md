# CardTimeStellarOrbit - 宇宙星轨律动卡片组件

## 效果特点

- **初始状态**：卡片压缩为宇宙奇点，聚集中心，缩放0、深度模糊
- **滚动触发**：卡片沿星轨节奏螺旋散开
- **四段核心动画**：
  1. **星轨散开**：螺旋轨迹 + 多圈旋转
  2. **悬浮升空**：向上漂浮 + Z轴拉伸
  3. **智能重组**：对齐网格 + 辉光点亮
  4. **星轨环绕**：永久圆周飞行循环
- **双向闭环**：反向回收、旋转坠落、收缩回奇点

## 技术实现

- **GSAP Timeline** 多段复合动画
- **ScrollTrigger** `scrub: 1.5` 精准绑定
- **GSAP Stagger** 波浪节奏散开
- **3D 螺旋/圆周运动** x/y/z 三轴联动

## 组件结构

```
CardTimeStellarOrbit/
├── CardTimeStellarOrbit.vue  # 主组件
└── README.md                 # 本文档
```

## 动画阶段

| 阶段 | 效果 |
|------|------|
| 奇点 | scale:0, blur:15px, rotation:±720° |
| 散开 | stagger.grid, spiral, scale:0.9 |
| 升空 | y:-40, z:80 |
| 重组 | rotation:0 |
| 环绕 | sin/cos 圆周运动 |

## 使用说明

组件会被 `index.vue` 的 glob 模式自动扫描加载。
