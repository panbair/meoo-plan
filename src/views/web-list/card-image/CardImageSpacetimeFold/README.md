# CardImageSpacetimeFold — 时空折叠投影（Pro 增强版）

## 设计理念

**9-Grid · 3D Fold · Time Sequence · Spacetime Distortion** — 全屏沉浸式时间序列体验，9张同一场景不同时刻的图片组成3×3网格，滚动时折叠成立方体3D结构，配合时空扭曲特效，展现时间的流动与空间的折叠。

## 核心特性（Pro 增强版）

### 1. 9张时间序列图片
- **06:00** - 清晨微光
- **08:00** - 早晨日出
- **10:00** - 上午阳光
- **12:00** - 中午强光
- **14:00** - 下午明亮
- **16:00** - 傍晚柔和
- **18:00** - 黄昏金色
- **20:00** - 夜晚深蓝
- **22:00** - 深夜黑暗

### 2. 3×3网格布局
- **初始状态**: 平面网格，覆盖整个屏幕
- **每个单元格**: 33.333% × 33.333%
- **时间标签**: 每个格子底部显示对应时间
- **边框分隔**: 1px 白色半透明边框

### 3. 3D折叠动画
每个单元格的变换包含：
- **Z轴位移**: 根据位置计算偏移量 (-100px ~ +100px)
- **X轴旋转**: ±15° 倾斜
- **Y轴旋转**: ±15° 倾斜
- **缩放**: 1.0 → 0.85 轻微缩小
- **模糊**: blur(0px) → blur(2px) 景深效果
- **透明度**: 1.0 → 0.9 轻微淡化

### 4. Canvas 时空扭曲特效
- **扭曲网格线**: 20×20 网格，随滚动正弦波扭曲
- **动态色彩**: `hsl(200-260, 100%, 70%)` 蓝紫渐变
- **脉冲光点**: 30个随机分布的闪烁光点
- **透明度提升**: 0.1 → 0.4 随滚动增强

### 5. 时间指示器
- **右上角显示**: 当前主要时间段
- **动态切换**: 06:00 → 08:00 → ... → 22:00
- **大号字体**: clamp(2rem, 5vw, 3.5rem)
- **发光效果**: 蓝色 text-shadow

### 6. 深色宇宙背景
- **配色方案**: `#0a0a1a → #1a1a3e → #2d1b4e`
- **蓝紫渐变**: 营造时空深邃感
- **多层叠加**: 与9张图片形成对比

### 7. 蓝紫渐变标题
- **文字渐变**: `#64c8ff → #9664ff → #c864ff`
- **三层发光**: 蓝色、紫色、粉色 text-shadow
- **科技感**: 强烈的未来时空氛围

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 网格配置
```typescript
interface GridCell {
  id: number
  row: number    // 0-2
  col: number    // 0-2
  z: number
  rotateX: number
  rotateY: number
  scale: number
  blur: number
}

// 生成3×3网格
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    cells.push({
      id: row * 3 + col,
      row,
      col,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      blur: 0
    })
  }
}
```

#### ② 3D折叠动画
```typescript
cellRefs.value.forEach((cellEl, i) => {
  const cell = cells[i]
  const row = cell.row
  const col = cell.col

  // 计算3D位置（中心为基准）
  const zOffset = (row - 1) * 50 + (col - 1) * 50
  const rotateX = (row - 1) * 15
  const rotateY = (col - 1) * 15

  mainTl.fromTo(cellEl,
    {
      z: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1
    },
    {
      z: zOffset,           // Z轴偏移
      rotateX,              // X轴旋转
      rotateY,              // Y轴旋转
      scale: 0.85,          // 缩小
      filter: 'blur(2px)',  // 模糊
      opacity: 0.9,         // 半透明
      duration: 1,
      ease: 'power2.inOut'
    },
    0  // 所有单元格同时开始
  )
})
```

#### ③ Canvas 扭曲网格生成
```typescript
function generateGrid(progress: number) {
  gridLines = []
  
  const cols = 20
  const rows = 20
  const cellWidth = cw / cols
  const cellHeight = ch / rows

  // 垂直线（带扭曲）
  for (let i = 0; i <= cols; i++) {
    const x = i * cellWidth
    const distortion = Math.sin(i * 0.5 + progress * Math.PI * 4) * 20 * progress

    gridLines.push({
      x1: x + distortion,
      y1: 0,
      x2: x - distortion,
      y2: ch,
      alpha: 0.1 + progress * 0.3,
      color: `hsl(${200 + progress * 60}, 100%, 70%)`
    })
  }

  // 水平线（带扭曲）
  for (let j = 0; j <= rows; j++) {
    const y = j * cellHeight
    const distortion = Math.cos(j * 0.5 + progress * Math.PI * 4) * 20 * progress

    gridLines.push({
      x1: 0,
      y1: y + distortion,
      x2: cw,
      y2: y - distortion,
      alpha: 0.1 + progress * 0.3,
      color: `hsl(${200 + progress * 60}, 100%, 70%)`
    })
  }
}
```

#### ④ 脉冲光点绘制
```typescript
function draw() {
  const time = Date.now() * 0.001
  
  lightPoints.forEach((point) => {
    const pulse = Math.sin(time * 2 + point.pulse) * 0.3 + 0.7
    ctx.beginPath()
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100, 200, 255, ${point.alpha * pulse})`
    ctx.fill()
  })
}
```

#### ⑤ 时间指示器更新
```typescript
onUpdate(self) {
  const progress = self.progress
  const labelIndex = Math.min(8, Math.floor(progress * 9))
  timeIndicatorRef.value.textContent = timeLabels[labelIndex]
}
```

## 配置参数（Pro 版）

```typescript
// 网格配置
const GRID_SIZE = 3            // 3×3网格
const CELL_COUNT = 9           // 总单元格数

// 3D变换参数
const Z_OFFSET = 50            // Z轴偏移基数 (px)
const ROTATE_ANGLE = 15        // 旋转角度 (度)
const FINAL_SCALE = 0.85       // 最终缩放
const BLUR_AMOUNT = 2          // 模糊度 (px)

// Canvas 特效
const GRID_COLS = 20           // 网格列数
const GRID_ROWS = 20           // 网格行数
const DISTORTION_AMPLITUDE = 20 // 扭曲振幅 (px)
const LIGHT_POINTS = 30        // 光点数量
```

## 视觉效果

### 初始状态（未滚动）
- 9张图片组成完整的3×3平面网格
- 每张图片显示不同的时间段
- 网格线清晰，无扭曲
- 时间指示器显示 `06:00`

### 滚动过程
1. **0-25% 进度**: 开始折叠
   - 四个角开始向Z轴移动
   - 轻微的X/Y轴旋转
   - 网格线开始扭曲
   - 时间指示器切换到 `08:00`

2. **25-50% 进度**: 持续折叠
   - 3D效果逐渐明显
   - 中心单元格保持相对平整
   - 边缘单元格倾斜更大
   - 网格扭曲加剧
   - 时间指示器显示 `12:00-14:00`

3. **50-75% 进度**: 接近平面
   - 形成立方体般的3D结构
   - 单元格间产生深度差
   - 模糊效果增强
   - 光点闪烁更明显
   - 时间指示器显示 `18:00`

4. **75-100% 进度**: 完全折叠
   - 9个单元格形成不规则3D表面
   - 每个单元格有不同的倾斜角度
   - 整体呈现时空扭曲效果
   - 时间指示器显示 `22:00`

### 交互效果
- **滚动控制**: 用户通过滚动精确控制折叠过程
- **透视变化**: perspective: 2000px 营造强烈3D感
- **网格扭曲**: 正弦波扭曲模拟时空弯曲
- **光点脉冲**: 实时闪烁营造能量感

## 使用场景

✅ **旅游官网** - 展示景区一天中的变化  
✅ **摄影作品集** - 时间序列摄影作品展示  
✅ **教育平台** - 天文、气象课程的时间变化  
✅ **品牌宣传** - 需要时间维度叙事的场景  
✅ **艺术装置** - 数字艺术、时空主题展览  
✅ **数据可视化** - 时间序列数据的艺术化呈现  

## 性能优化

- ✅ `will-change: transform, filter, opacity` - GPU 加速
- ✅ `transform-style: preserve-3d` - 3D 渲染优化
- ✅ Canvas 自动清理（生命周期管理）
- ✅ ScrollTrigger 正确清理（onUnmounted）
- ✅ gsap.context 统一管理动画上下文
- ✅ 增量更新（只更新可见网格线）

## 浏览器兼容性

- ✅ Chrome / Edge (完全支持)
- ✅ Firefox (完全支持)
- ✅ Safari (完全支持)
- ⚠️ IE11 (不支持，需要 polyfill)

## 扩展建议

### 自定义图片
```typescript
const timeImages = [
  'your-morning.jpg',    // 替换为9张时间序列图片
  'your-noon.jpg',
  'your-evening.jpg',
  // ... 共9张
]
```

### 调整网格大小
```typescript
// 扩展到 4×4 网格（16张图片）
const GRID_SIZE = 4
const CELL_COUNT = 16

// 缩小到 2×2 网格（4张图片）
const GRID_SIZE = 2
const CELL_COUNT = 4
```

### 修改3D强度
```typescript
// 更强的3D效果
const Z_OFFSET = 100     // 原 50
const ROTATE_ANGLE = 30  // 原 15

// 更弱的3D效果
const Z_OFFSET = 25      // 原 50
const ROTATE_ANGLE = 8   // 原 15
```

### 改变网格密度
```typescript
// 更密集的网格（更细腻的扭曲）
const GRID_COLS = 40     // 原 20
const GRID_ROWS = 40     // 原 20

// 更稀疏的网格（更明显的扭曲）
const GRID_COLS = 10     // 原 20
const GRID_ROWS = 10     // 原 20
```

### 添加鼠标交互
```typescript
// 鼠标移动时轻微旋转整个网格
sectionRef.value.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  
  gsap.to('.sf-grid-container', {
    rotateY: mouseX * 10,
    rotateX: -mouseY * 10,
    duration: 0.5
  })
})
```

## 与其他组件对比

| 特性 | **SpacetimeFold** | ParallaxLayerFusion | HolographicPrism |
|------|-------------------|---------------------|------------------|
| 图片数量 | **9张时序** | 6张不同场景 | 6张主题相关 |
| 布局方式 | **3×3网格** | 全屏分层 | 六边形碎片 |
| 动画类型 | **3D折叠** | 视差滚动 | 爆发聚合 |
| 时间维度 | ✅ 一天变化 | ❌ | ❌ |
| Canvas 特效 | **扭曲网格+光点** | 雾气粒子 | 激光束 |
| 数据指示 | **时间标签** | 无 | 无 |
| 适用场景 | 时间序列 | 风景景深 | 光学科技 |

## 版本历史

- **v1.0 (Pro)** - 全新创作
  - ✨ 9张时间序列图片（06:00-22:00）
  - 🎯 3×3网格布局 + 3D折叠动画
  - 🌀 Canvas 时空扭曲网格（20×20）
  - 💫 脉冲光点系统（30个）
  - 🕐 动态时间指示器
  - 🎨 深色宇宙背景 + 蓝紫标题
  - ⚡ 性能优化（GPU加速、自动清理）
