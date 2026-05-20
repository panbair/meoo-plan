# CardTimeNewtonCradle 牛顿摆

## 效果描述
卡片排成一行像牛顿摆，第一张被拉起释放后撞击传递动量，最后一张弹出。展示动量守恒的优雅物理动画。

## 技术实现

### 动画阶段
1. **悬挂态** — 卡片垂直悬挂在"线"上，静止等待
2. **拉起阶段** — 滚动触发第一张卡片向左拉起（旋转）
3. **撞击传递** — 释放后撞击，中间卡片微震，最后一张弹出
4. **往复运动** — 最后一张回落撞击，第一张再弹出，永久循环

### 核心技术
- GSAP timeline 序列动画
- `transformOrigin: 'center top'` 实现摆锤旋转
- 碰撞瞬间的微震 stagger 传递
- `repeat: -1, yoyo: true` 永久往复

### ScrollTrigger 参数
```js
{ trigger: container, start: 'top 75%', toggleActions: 'play none none none' }
```

## 视觉效果
- 悬挂线 + 支架结构
- 碰撞瞬间的冲击波纹
- 金属质感卡片
- 运动模糊效果
- 碰撞点火花粒子

## 使用方法
```vue
<CardTimeNewtonCradle />
```

