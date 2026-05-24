# CardImageHolographicPrism — 全息棱镜爆发（Pro 增强版）

## 设计理念

**6-Fragment · Prism Split · Laser Beams · Rainbow Glow** — 全屏沉浸式光学棱镜体验，将6张相关主题的图片切割为三角形碎片，从中心向外爆发扩散，配合激光束和彩虹光晕，创造震撼的全息视觉效果。

## 核心特性（Pro 增强版）

### 1. 6个三角形棱镜碎片
- **上**: 山峰图片1，旋转0°
- **右上**: 山峰图片2，旋转60°
- **右下**: 山峰图片3，旋转120°
- **下**: 山峰图片4，旋转180°
- **左下**: 山峰图片5，旋转240°
- **左上**: 山峰图片6，旋转300°

### 2. 六边形对称布局
- **初始状态**: 6个碎片聚集在中心，形成完整六边形
- **每个碎片**: 400×400px 三角形区域
- **clip-path**: 精确的三角形裁剪路径
- **视觉效果**: 像棱镜折射出的光谱

### 3. 爆发动画组合
每个碎片的动画包含：
- **旋转归零**: 从初始角度 (0°/60°/120°/...) → 0°
- **缩放放大**: scale 0.3 → 1.0
- **位置归中**: 从偏移位置 → 中心 (0, 0)
- **透明度**: opacity 0 → 1
- **色相还原**: hue-rotate (0°/60°/120°/...) → 0°
- **模糊消除**: blur(10px) → blur(0px)

### 4. Canvas 激光束系统
- **12条激光束**: 从中心向外辐射
- **旋转动画**: 随滚动进度旋转 720°
- **彩虹渐变**: 每条光束不同色相 (hsl)
- **长度增长**: 100px → 400px
- **宽度增加**: 2px → 6px
- **透明度提升**: 0.3 → 0.8

### 5. 中心光晕特效
- **径向渐变**: `rgba(255,255,255,0.8) → transparent`
- **高斯模糊**: `blur(20px)` 营造柔和光效
- **动态缩放**: scale 1 → 3 随滚动扩大
- **透明度降低**: opacity 1 → 0.2 逐渐消失

### 6. 彩虹边框发光
- **渐变色彩**: `#ff0000 → #ff8c00 → #ffff00 → #00ff00 → #00ffff → #0000ff → #ff00ff`
- **动画流动**: `rainbow-shift` 3s 循环
- **边框宽度**: 2px 发光边缘
- **阴影效果**: `box-shadow: 0 0 30px rgba(255,255,255,0.3)`

### 7. 深色宇宙背景
- **配色方案**: `#1a0033 → #0a001a → #000000`
- **径向渐变**: 从中心紫色到边缘黑色
- **宇宙氛围**: 营造深邃空间感

### 8. 霓虹渐变标题
- **文字渐变**: `#ff00ff → #ff8c00 → #00ffff`
- **三层发光**: 紫色、粉色、白色 text-shadow
- **赛博朋克**: 强烈的未来科技感

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 碎片配置
```typescript
const fragments: PrismFragment[] = [
  {
    id: 0,
    clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)', // 上三角形
    rotation: 0,
    scale: 0.3,
    x: 0,
    y: -150,
    hue: 0,
    delay: 0
  },
  // ... 其他5个碎片
]
```

#### ② 爆发动画
```typescript
fragmentRefs.value.forEach((fragEl, i) => {
  const frag = fragments[i]

  mainTl.fromTo(fragEl,
    {
      rotation: frag.rotation,      // 初始旋转角度
      scale: frag.scale,            // 初始缩小
      x: frag.x,                    // X轴偏移
      y: frag.y,                    // Y轴偏移
      opacity: 0,                   // 完全透明
      filter: `hue-rotate(${frag.hue}deg) blur(10px)`  // 色相+模糊
    },
    {
      rotation: 0,                  // 旋转归零
      scale: 1,                     // 放大到原尺寸
      x: 0,                         // X轴归中
      y: 0,                         // Y轴归中
      opacity: 1,                   // 完全不透明
      filter: 'hue-rotate(0deg) blur(0px)',  // 色彩还原+清晰
      duration: 1,
      delay: frag.delay,            // 错开时序
      ease: 'power3.out'            // 先快后慢
    },
    0  // 所有碎片同时开始
  )
})
```

#### ③ Canvas 激光束生成
```typescript
function generateLightBeams(progress: number) {
  lightBeams = []
  const centerX = cw / 2
  const centerY = ch / 2
  const beamCount = 12

  for (let i = 0; i < beamCount; i++) {
    // 计算角度（随滚动旋转）
    const angle = (i / beamCount) * Math.PI * 2 + progress * Math.PI * 4
    
    // 计算终点坐标
    const length = 100 + progress * 300
    const x2 = centerX + Math.cos(angle) * length
    const y2 = centerY + Math.sin(angle) * length

    lightBeams.push({
      x1: centerX,
      y1: centerY,
      x2,
      y2,
      width: 2 + progress * 4,
      color: `hsl(${(i * 30 + progress * 360) % 360}, 100%, 70%)`,
      alpha: 0.3 + progress * 0.5
    })
  }
}
```

#### ④ 激光束绘制
```typescript
function draw() {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, cw, ch)

  // 绘制12条激光束
  lightBeams.forEach((beam) => {
    ctx.beginPath()
    ctx.moveTo(beam.x1, beam.y1)
    ctx.lineTo(beam.x2, beam.y2)
    ctx.strokeStyle = beam.color
    ctx.lineWidth = beam.width
    ctx.globalAlpha = beam.alpha
    ctx.stroke()
    ctx.globalAlpha = 1
  })

  // 绘制中心光晕
  const gradient = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, 100)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(cw / 2, ch / 2, 100, 0, Math.PI * 2)
  ctx.fill()
}
```

#### ⑤ 彩虹边框动画
```scss
@keyframes rainbow-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hp-fragment-border {
  background: linear-gradient(135deg, 
    #ff0000, #ff8c00, #ffff00, 
    #00ff00, #00ffff, #0000ff, #ff00ff
  );
  background-size: 400% 400%;
  animation: rainbow-shift 3s ease infinite;
}
```

## 配置参数（Pro 版）

```typescript
// 碎片配置
const fragments = [
  { rotation: 0, scale: 0.3, x: 0, y: -150, hue: 0, delay: 0 },
  { rotation: 60, scale: 0.3, x: 130, y: -75, hue: 60, delay: 0.05 },
  { rotation: 120, scale: 0.3, x: 130, y: 75, hue: 120, delay: 0.1 },
  { rotation: 180, scale: 0.3, x: 0, y: 150, hue: 180, delay: 0.15 },
  { rotation: 240, scale: 0.3, x: -130, y: 75, hue: 240, delay: 0.2 },
  { rotation: 300, scale: 0.3, x: -130, y: -75, hue: 300, delay: 0.25 }
]

// Canvas 激光束
const beamCount = 12           // 激光束数量
const beamLength = 100-400     // 长度范围 (px)
const beamWidth = 2-6          // 宽度范围 (px)
const rotationSpeed = 720°     // 旋转速度

// 碎片尺寸
const fragmentSize = 400       // 碎片尺寸 (px)
const initialScale = 0.3       // 初始缩放
```

## 视觉效果

### 初始状态（未滚动）
- 6个三角形碎片聚集在中心
- 每个碎片缩小到 30% 并带有不同角度
- 碎片带有不同的色相偏移（彩虹色）
- 碎片模糊度 10px，透明度 0
- Canvas 无激光束
- 中心光晕明亮

### 滚动过程
1. **0-25% 进度**: 开始爆发
   - 碎片开始向外移动
   - 旋转角度逐步归零
   - 色相偏移减少
   - 模糊度降低
   - 激光束开始出现（短小）

2. **25-50% 进度**: 持续扩散
   - 碎片继续放大
   - 位置向中心靠拢
   - 透明度提升
   - 激光束变长变宽
   - 中心光晕扩大

3. **50-75% 进度**: 接近完成
   - 碎片基本到达中心
   - 色相完全还原
   - 图片清晰锐利
   - 激光束达到最大长度
   - 中心光晕开始淡化

4. **75-100% 进度**: 完美聚合
   - 6个碎片完美拼接成六边形
   - 所有图片清晰可见
   - 激光束最宽最亮
   - 中心光晕几乎消失
   - 彩虹边框持续流动

### 交互效果
- **滚动控制**: 用户通过滚动精确控制爆发过程
- **错开时序**: 6个碎片依次启动（delay 0.05s）
- **激光旋转**: 12条光束随滚动旋转720°
- **彩虹流动**: 边框渐变色持续循环

## 使用场景

✅ **科技官网** - 展示光学、激光、显示技术  
✅ **艺术装置** - 数字艺术、光影互动  
✅ **品牌宣传** - 需要强烈视觉冲击力的场景  
✅ **产品展示** - 高科技产品、光学仪器  
✅ **创意作品集** - 摄影师、设计师作品展示  
✅ **教育平台** - 光学原理、色彩科学教学  

## 性能优化

- ✅ `will-change: transform, opacity, filter` - GPU 加速
- ✅ Canvas 自动清理（生命周期管理）
- ✅ ScrollTrigger 正确清理（onUnmounted）
- ✅ gsap.context 统一管理动画上下文
- ✅ 增量更新（只更新可见激光束）
- ✅ CSS 动画硬件加速（transform）

## 浏览器兼容性

- ✅ Chrome / Edge (完全支持)
- ✅ Firefox (完全支持)
- ✅ Safari (完全支持)
- ⚠️ IE11 (不支持，需要 polyfill)

## 扩展建议

### 自定义图片
```typescript
const images = [
  'your-image-1.jpg',  // 替换为6张相关主题图片
  'your-image-2.jpg',
  'your-image-3.jpg',
  'your-image-4.jpg',
  'your-image-5.jpg',
  'your-image-6.jpg'
]
```

### 调整碎片数量
```typescript
// 扩展到 8 个碎片（八边形）
const fragments = [
  { rotation: 0, ... },
  { rotation: 45, ... },
  { rotation: 90, ... },
  // ... 共8个
]
```

### 改变爆发强度
```typescript
// 更强的爆发效果
x: 200, y: 200  // 原 130, 150
scale: 0.2      // 原 0.3

// 更弱的爆发效果
x: 80, y: 80    // 原 130, 150
scale: 0.5      // 原 0.3
```

### 修改激光束数量
```typescript
// 更多激光束（更密集）
const beamCount = 24  // 原 12

// 更少激光束（更稀疏）
const beamCount = 6   // 原 12
```

### 添加鼠标交互
```typescript
// 鼠标移动时碎片轻微跟随
sectionRef.value.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  
  fragmentRefs.value.forEach((fragEl, i) => {
    gsap.to(fragEl, {
      x: mouseX * 20,
      y: mouseY * 20,
      duration: 0.5
    })
  })
})
```

## 与其他组件对比

| 特性 | **HolographicPrism** | RGBChannelSplit | ParallaxLayerFusion |
|------|---------------------|-----------------|---------------------|
| 图片数量 | **6张主题相关** | 1张×3通道 | 6张不同场景 |
| 分割方式 | **三角形棱镜** | 水平偏移 | 视差滚动 |
| 动画类型 | **爆发聚合** | 对齐重组 | 分层移动 |
| Canvas 特效 | **激光束+光晕** | 色彩条分析 | 雾气粒子 |
| 边框特效 | ✅ 彩虹流动 | ❌ | ❌ |
| 旋转动画 | ✅ 6个角度 | ❌ | ❌ |
| 适用场景 | 光学科技 | 色彩科学 | 风景景深 |

## 版本历史

- **v1.0 (Pro)** - 全新创作
  - ✨ 6个三角形棱镜碎片
  - 🎯 六边形对称布局
  - 💥 爆发聚合动画（旋转+缩放+位移+色相+模糊）
  - 🔦 Canvas 激光束系统（12条，旋转720°）
  - 🌈 彩虹边框流动特效
  - 💫 中心光晕动态缩放
  - 🎨 深色宇宙背景 + 霓虹标题
  - ⚡ 性能优化（GPU加速、自动清理）
