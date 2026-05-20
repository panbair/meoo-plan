# CardTimeZoetrope 走马灯

## 效果描述
卡片排列在圆筒内壁，旋转时通过狭缝产生动画错觉。模拟19世纪视觉玩具。

## 技术实现
### 动画阶段
1. **圆筒静止** — 3D圆筒展示卡片排列
2. **旋转启动** — 滚动触发圆筒旋转
3. **狭缝观察** — 通过顶部狭缝，卡片在特定角度闪现
4. **减速定格** — 滚动停止后圆筒减速，最终定格在某张卡片

### 核心技术
- CSS 3D transform 构建圆筒
- GSAP ScrollTrigger scrub 控制rotateY
- 狭缝遮罩clipPath
- 3D perspective

## 使用方法
```vue
<CardTimeZoetrope />
```

