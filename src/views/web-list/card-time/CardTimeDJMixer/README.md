# CardTimeDJMixer DJ混音台

## 效果描述
双唱片机布局，卡片像黑胶唱片旋转，crossfader控制切换。模拟DJ打碟体验。

## 技术实现
### 动画阶段
1. **唱片机出现** — 左右两台唱片机入场
2. **唱片旋转** — 卡片组成黑胶唱片纹理持续旋转
3. **Crossfader切换** — 滚动驱动推子左右移动，控制左右唱片淡入淡出
4. **搓碟效果** — 交互时唱片快速正反转

### 核心技术
- GSAP ScrollTrigger scrub 驱动crossfader
- CSS rotation 持续旋转唱片
- opacity/scale 淡入淡出切换
- 3D perspective 唱片倾斜视角

## 使用方法
```vue
<CardTimeDJMixer />
```

