# CardImageParallaxLayerFusion — 多层景深视差融合（Pro 增强版）

## 设计理念

**6-Layer · Depth Parallax · Mouse Tilt · Atmospheric Particles** — 全屏沉浸式多层图片组合体验，6层真实照片以不同速度滚动，配合3D鼠标倾斜和大气粒子系统，创造前所未有的景深震撼效果。

## 核心特性（Pro 增强版）

### 1. 6层真实图片组合
- **前景层** (2.5x 速度) - 水面波纹，最快速移动
- **近景层** (1.8x 速度) - 近处树木，快速移动
- **中景层** (1.2x 速度) - 中景山丘，中速移动
- **远景层** (0.7x 速度) - 远山，慢速移动
- **天空层** (0.4x 速度) - 云层，极慢移动
- **大气层** (0.2x 速度) - 光效，几乎静止

### 2. 差异化滚动速度
```typescript
speed: 2.5  // 前景最快，产生强烈视差
speed: 1.8  // 近景快速
speed: 1.2  // 中景中速
speed: 0.7  // 远景慢速
speed: 0.4  // 天空极慢
speed: 0.2  // 大气几乎不动
```

### 3. 3D 鼠标倾斜交互
- **旋转范围**: ±15° (X/Y轴)
- **透视深度**: `perspective: 1000px`
- **平滑过渡**: `duration: 0.8s, ease: power2.out`
- **实时更新**: `gsap.ticker` 60fps 流畅响应

### 4. Canvas 大气粒子系统
- **雾气粒子**: 大半径渐变 (r=30-80px)，模拟薄雾
- **光斑粒子**: 小亮点 (r=2-6px)，模拟丁达尔效应
- **向上飘浮**: vy < 0，自然上升消散
- **生命周期**: 200-500ms，平滑淡出

### 5. 景深模糊效果
```typescript
blur: 0   // 前景清晰
blur: 1   // 近景轻微模糊
blur: 2   // 中景模糊
blur: 3   // 远景更模糊
blur: 4   // 天空最模糊
```

### 6. 动态光晕追踪
- **跟随鼠标**: 光晕中心实时追踪光标位置
- **混合模式**: `mix-blend-mode: screen`，营造光效
- **渐变色彩**: `rgba(255,255,200,0.15)`，温暖色调
- **平滑过渡**: 0.5s 缓动跟随

### 7. 深色渐变背景
- **配色方案**: `#0a0e27 → #1a1f3a → #2d1b4e`
- **紫蓝渐变**: 科技感十足，非灰色阴沉
- **多层叠加**: 与6层图片形成深度对比

### 8. 彩虹渐变标题
- **文字渐变**: `#667eea → #764ba2 → #f093fb`
- **三层发光**: 蓝色、紫色、粉色 text-shadow
- **霓虹效果**: 强烈的视觉冲击力

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 图层配置
```typescript
const layers = [
  {
    name: 'foreground',
    url: 'water.jpg',
    speed: 2.5,    // 滚动速度倍率
    z: 80,         // 3D Z轴位置
    blur: 0,       // 模糊度
    opacity: 0.95  // 透明度
  },
  // ... 其他5层
]
```

#### ② 垂直视差滚动
```typescript
layerRefs.value.forEach((layerEl, i) => {
  const layer = layers[i]
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true  // 平滑 scrub
    }
  })

  // 根据 speed 计算移动距离
  tl.fromTo(
    layerEl,
    { y: `${(layer.speed - 1) * -100}%` },
    { y: `${(layer.speed - 1) * 100}%`, duration: 1, ease: 'none' }
  )
})
```

**工作原理**:
- `speed > 1`: 向下移动 (前景快于滚动)
- `speed < 1`: 向上移动 (背景慢于滚动)
- `speed = 1`: 固定不动

#### ③ 3D 鼠标倾斜
```typescript
gsap.ticker.add(() => {
  const rotateX = -mouseY.value * 15  // Y轴控制X旋转
  const rotateY = mouseX.value * 15   // X轴控制Y旋转

  gsap.to(sceneRef.value, {
    rotateX,
    rotateY,
    duration: 0.8,
    ease: 'power2.out',
    transformPerspective: 1000
  })
})
```

#### ④ Canvas 粒子系统
```typescript
// 雾气粒子（大半径渐变）
const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
gradient.addColorStop(0, `rgba(200, 220, 255, ${a})`)
gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
ctx.fillStyle = gradient
ctx.beginPath()
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
ctx.fill()

// 光斑粒子（小亮点）
ctx.beginPath()
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
ctx.fillStyle = `rgba(255, 255, 220, ${a})`
ctx.fill()
```

#### ⑤ 动态光晕追踪
```typescript
gsap.ticker.add(() => {
  const x = (mouseX.value + 1) * 50  // -1~1 → 0~100%
  const y = (mouseY.value + 1) * 50

  gsap.to(glowRef.value, {
    backgroundPosition: `${x}% ${y}%`,
    duration: 0.5,
    ease: 'power2.out'
  })
})
```

## 配置参数（Pro 版）

```typescript
// 6层图片配置
const layers = [
  { speed: 2.5, z: 80,  blur: 0, opacity: 0.95 },  // 前景
  { speed: 1.8, z: 50,  blur: 0, opacity: 0.9 },   // 近景
  { speed: 1.2, z: 20,  blur: 1, opacity: 0.85 },  // 中景
  { speed: 0.7, z: -30, blur: 2, opacity: 0.8 },   // 远景
  { speed: 0.4, z: -70, blur: 3, opacity: 0.75 },  // 天空
  { speed: 0.2, z: -100, blur: 4, opacity: 0.6 }   // 大气
]

// 3D 倾斜
const TILT_ANGLE = 15        // ±15°
const PERSPECTIVE = 1000     // 透视深度

// 粒子系统
const FOG_RADIUS = 30-80     // 雾气半径
const LIGHT_RADIUS = 2-6     // 光斑半径
const PARTICLE_LIFE = 200-500 // 生命周期 (ms)
```

## 视觉效果

### 初始状态（未滚动）
- 6层图片精确对齐，形成完整场景
- 前景清晰，背景逐渐模糊（景深效果）
- Canvas 持续生成雾气粒子和光斑
- 鼠标移动时场景实时倾斜 (±15°)

### 滚动过程
1. **前景层** (2.5x): 快速向下移动，产生强烈视差
2. **近景层** (1.8x): 较快向下移动
3. **中景层** (1.2x): 中速向下移动
4. **远景层** (0.7x): 缓慢向上移动
5. **天空层** (0.4x): 极慢向上移动
6. **大气层** (0.2x): 几乎静止

**最终效果**: 6层图片完全分离，展现惊人的景深层次！

### 交互效果
- **鼠标移动**: 场景实时3D倾斜，模拟真实视角变化
- **光晕追踪**: 温暖光晕跟随光标，营造梦幻氛围
- **粒子飘浮**: 雾气上升消散，光斑随机闪烁

## 使用场景

✅ **旅游官网** - 展示山川湖泊的壮丽景色  
✅ **摄影作品集** - 摄影师作品的高级展示方式  
✅ **自然纪录片** - 生态环境的沉浸式呈现  
✅ **地产项目** - 景观房的全景展示  
✅ **品牌宣传** - 需要强烈视觉冲击力的场景  
✅ **艺术装置** - 数字艺术、互动展览  

## 性能优化

- ✅ `will-change: transform, filter, opacity` - GPU 加速
- ✅ `transform-style: preserve-3d` - 3D 渲染优化
- ✅ Canvas 粒子自动清理（生命周期管理）
- ✅ ScrollTrigger 正确清理（onUnmounted）
- ✅ gsap.context 统一管理动画上下文
- ✅ 增量更新（只更新可见粒子）
- ✅ 移动端禁用3D倾斜（节省性能）

## 浏览器兼容性

- ✅ Chrome / Edge (完全支持)
- ✅ Firefox (完全支持)
- ✅ Safari (完全支持)
- ⚠️ IE11 (不支持，需要 polyfill)

## 扩展建议

### 自定义图片
```typescript
const layers = [
  {
    name: 'foreground',
    url: 'your-foreground.jpg',  // 替换为前景图片
    speed: 2.5,
    z: 80,
    blur: 0,
    opacity: 0.95
  },
  // ... 其他5层
]
```

### 调整视差强度
```typescript
// 增强视差效果
speed: 3.5  // 前景更快
speed: 0.1  // 背景更慢

// 减弱视差效果
speed: 1.5  // 前景较慢
speed: 0.5  // 背景较快
```

### 修改景深模糊
```typescript
// 更强的景深效果
blur: 0, 2, 4, 6, 8, 10  // 递增模糊

// 更弱的景深效果
blur: 0, 0.5, 1, 1.5, 2, 2.5  // 轻微模糊
```

### 改变3D倾斜角度
```typescript
const rotateX = -mouseY.value * 25  // ±25° (原 ±15°)
const rotateY = mouseX.value * 25
```

### 添加更多粒子
```typescript
// 增加粒子密度
if (Math.random() > progress * 0.5) return  // 原 0.3
for (let i = 0; i < 5; i++)  // 原 2
```

## 与其他组件对比

| 特性 | ParallaxLayerFusion | ParallaxDepth | DoubleExposure |
|------|---------------------|---------------|----------------|
| 图片数量 | **6张真实图片** | 1张+深度图 | 2张 |
| 视差层数 | **6层独立滚动** | 5层Canvas提取 | 2层蒙版 |
| 鼠标交互 | **3D倾斜±15°** | 3D倾斜 | 无 |
| 粒子系统 | **雾气+光斑** | 无 | 胶片颗粒 |
| 景深模糊 | **6级差异化** | 无 | 无 |
| 动态光晕 | ✅ 追踪鼠标 | ❌ | ❌ |
| 适用场景 | 风景/旅游/摄影 | 单图景深 | 人像双重曝光 |

## 版本历史

- **v1.0 (Pro)** - 全新创作
  - ✨ 6层真实图片组合
  - 🎯 差异化滚动速度 (0.2x - 2.5x)
  - 🖱️ 3D鼠标倾斜交互 (±15°)
  - 🌫️ Canvas 大气粒子系统 (雾气+光斑)
  - 🔍 景深模糊效果 (6级差异)
  - 💫 动态光晕追踪鼠标
  - 🎨 深色渐变背景 + 彩虹标题
  - ⚡ 性能优化（GPU加速、移动端适配）
