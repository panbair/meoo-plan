# CardTimeSpringMesh 弹簧网格

## 效果描述
卡片由弹簧连接成网格，拖拽任意一个卡片，其余跟随物理弹性传导波动。模拟弹簧质点系统。

## 技术实现

### 动画阶段
1. **静止态** — 3×3网格排列，弹簧连接线可见
2. **入场动画** — 卡片从随机位置弹性归位到网格
3. **交互态** — 鼠标拖拽任意卡片，弹簧力传导到相邻卡片
4. **波纹效果** — 释放后波纹式弹性恢复

### 核心技术
- requestAnimationFrame 物理模拟循环
- 胡克定律: `F = -k * displacement`
- 阻尼系数控制衰减
- GSAP ScrollTrigger 触发入场 + 鼠标事件交互

### ScrollTrigger 参数
```js
{ trigger: container, start: 'top 75%', toggleActions: 'play none none none' }
```

## 视觉效果
- SVG弹簧连接线（随拉伸变色）
- 拖拽时弹簧伸缩可视化
- 力传导波纹扩散
- 卡片间距离影响弹簧颜色（拉伸=红色，压缩=蓝色）
- 释放后的弹性振荡

## 使用方法
```vue
<CardTimeSpringMesh />
```

