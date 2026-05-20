# CardTimeCaustics 焦散光纹

## 效果描述
模拟水面折射产生的焦散光纹在卡片表面流动，如同阳光透过泳池水面的光影效果。

## 技术实现

### 动画阶段
1. **水面初始化** — Canvas绘制动态焦散光纹
2. **光纹流动** — 多层正弦波叠加模拟水面折射
3. **卡片覆盖** — 焦散光纹作为overlay覆盖在卡片上流动
4. **交互响应** — 鼠标移动影响光纹波动方向

### 核心技术
- Canvas 2D 焦散算法（多层sin/cos叠加）
- GSAP ScrollTrigger 触发启动
- mix-blend-mode: overlay 光纹混合
- requestAnimationFrame 实时渲染

## 视觉效果
- 泳池底部焦散光纹效果
- 光斑随波纹流动变形
- 蓝绿色水下氛围
- 卡片内容透过水光显示

## 使用方法
```vue
<CardTimeCaustics />
```

