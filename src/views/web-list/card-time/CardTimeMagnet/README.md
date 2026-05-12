# CardTimeMagnet - 磁场扭曲·悬浮卡片环绕

## 设计理念

超现实交互艺术装置感 - 多张卡片围绕无形中心点呈环形悬浮排列，模拟磁场扭曲效果。整体结构公转展示，每张卡片依次受磁场脉冲发生自转与Z轴弹跳，鼠标悬停时产生磁力吸引交互。

## 视觉风格

### 配色方案
- **主色调**: #0a0a1a → #1a1a3a → #0f0f2a (深空背景)
- **磁蓝**: rgba(99, 102, 241) - 核心磁场颜色
- **磁紫**: rgba(168, 85, 247) - 辅助渐变
- **磁青**: rgba(59, 130, 246) - 点缀色
- **文字**: #fff / rgba(199, 210, 254)

### 色彩分布
| 元素 | 颜色 | 用途 |
|------|------|------|
| 卡片1 | 磁蓝色 | 星际导航 |
| 卡片2 | 磁紫色 | 能量核心 |
| 卡片3 | 磁青色 | 量子传输 |
| 卡片4 | 青色 | 磁场护盾 |
| 卡片5 | 粉色 | 引力场域 |
| 卡片6 | 绿色 | 脉冲引擎 |

## 动画效果

### 1. 入场动画
- 卡片从 scale(0.5) opacity(0) 渐变入场
- stagger 间隔 0.1s，back.out(1.7) 弹性缓动
- 整体轨道倾斜 15° 展示

### 2. 环绕旋转
- 轨道整体绕 Z 轴旋转 360°
- 时长 4s，线性缓动

### 3. 磁场脉冲
- 每张卡片依次触发
- 自转 360° + Z轴弹跳 60px
- scale 放大至 1.1
- 弹性回归初始状态

### 4. 磁力吸引交互
- 鼠标进入容器后实时计算
- 距离越近吸引越强
- 最大偏移 80px
- rotationX/Y 跟随鼠标角度

## 组件结构

```
magnet-orbit-container/
├── magnetic-field-bg      # 磁场背景（旋转锥形渐变）
├── magnetic-core         # 中心磁场核心
│   ├── core-ring-1       # 环形 60px
│   ├── core-ring-2       # 环形 80px
│   ├── core-ring-3       # 环形 100px
│   └── core-pulse        # 脉冲光点
├── magnet-orbit          # 卡片轨道容器
│   └── magnet-card × 6   # 悬浮卡片
├── orbit-lines           # SVG 轨道线
└── magnetic-particles    # 磁力粒子
```

## 技术实现

### 核心逻辑
1. **3D 环形排列**: 使用 CSS transform + JavaScript 计算角度位置
2. **轨道旋转**: GSAP 控制容器 rotationZ 属性
3. **磁场脉冲**: 每张卡片独立 timeline + stagger
4. **鼠标交互**: mousemove 实时计算距离与偏移

### 关键代码
```javascript
// 卡片环形分布
cards.forEach((card, i) => {
  const angle = (i / total) * Math.PI * 2
  const x = Math.cos(angle) * RADIUS
  const y = Math.sin(angle) * RADIUS * 0.4
  const rotationY = (angle * 180) / Math.PI
})

// 磁场吸引计算
const dist = Math.hypot(mouseX - baseX, mouseY - baseY)
const pull = Math.max(0, 1 - dist / 500) * 80
```

### ScrollTrigger 参数
| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | container | 触发器元素 |
| start | 'top 80%' | 元素顶部到达视口80%时开始 |
| end | 'top 20%' | 元素顶部到达视口20%时结束 |
| scrub | 1.5 | 平滑系数 |

## 交互动效

| 交互 | 效果 |
|------|------|
| 滚动触发 | 轨道旋转 + 卡片脉冲入场 |
| 鼠标移动 | 卡片受磁力吸引偏移 + 3D旋转 |
| 鼠标离开 | 卡片回归轨道位置 |
| 卡片悬停 | 边框高亮 + 发光增强 |

## 尺寸规格

- 容器: 100vw × 100vh
- 卡片: 160px × 200px
- 轨道半径: 280px
- 核心尺寸: 100px × 100px
