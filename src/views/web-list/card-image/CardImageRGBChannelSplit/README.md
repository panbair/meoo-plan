# CardImageRGBChannelSplit — RGB通道分离重组（Pro 增强版）

## 设计理念

**Chromatic Aberration · Color Separation · Pixel Analysis** — 全屏沉浸式色彩科学体验，将单张图片分解为红/绿/蓝三个颜色通道，通过滚动控制逐步对齐重组，展现数字图像的本质之美。

## 核心特性（Pro 增强版）

### 1. RGB 三通道独立控制
- **红色通道**: 从左侧偏移 -80px 移入
- **绿色通道**: 保持中心位置（基准）
- **蓝色通道**: 从右侧偏移 +80px 移入
- **混合模式**: `mix-blend-mode: screen`，叠加后还原彩色

### 2. 色差光晕特效（Chromatic Aberration）
- **初始状态**: 三通道完全分离，产生强烈的色差效果
- **过渡过程**: 逐步对齐，色差逐渐消失
- **最终状态**: 完美重合，还原清晰彩色图片
- **视觉冲击**: 模拟相机镜头的色散现象

### 3. Canvas 像素级色彩分析
- **色彩条可视化**: 50个随机分布的彩色横条
- **动态生成**: 根据滚动进度实时更新位置和颜色
- **分离效果**: 初期色彩条分散，后期集中
- **艺术效果**: 抽象的数字美学表达

### 4. 通道对齐率实时显示
- **进度条**: 彩虹渐变 (`#ff0000 → #00ff00 → #0000ff`)
- **百分比**: 0% → 100% 精确显示
- **发光效果**: `box-shadow` 营造科技感
- **实时更新**: 每帧同步滚动进度

### 5. 通道标签动态变化
- **R/G/B 标识**: 底部居中显示
- **颜色对应**: 红色/绿色/蓝色文字
- **透明度渐变**: 0.3 → 1.0 随滚动增强
- **大写样式**: 专业科技感

### 6. 深色科技背景
- **配色方案**: `#0a0a0a → #1a1a2e → #16213e`
- **黑蓝渐变**: 突出RGB通道的鲜艳色彩
- **多层叠加**: 营造深邃空间感

### 7. RGB 渐变标题
- **文字渐变**: `#ff0000 → #00ff00 → #0000ff`
- **三层发光**: 红/绿/蓝 text-shadow
- **霓虹效果**: 强烈的赛博朋克风格

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 通道配置
```typescript
const maxOffset = 80 // 最大偏移量

// 红色通道：从左侧移入
gsap.fromTo(redChannelRef.value,
  { x: -maxOffset, opacity: 0.7 },
  { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }
)

// 绿色通道：保持中心（基准）
gsap.fromTo(greenChannelRef.value,
  { opacity: 0.7 },
  { opacity: 1, duration: 1, ease: 'power2.out' }
)

// 蓝色通道：从右侧移入
gsap.fromTo(blueChannelRef.value,
  { x: maxOffset, opacity: 0.7 },
  { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }
)
```

#### ② 对齐率追踪
```typescript
ScrollTrigger.create({
  trigger: sectionRef.value!,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 2,
  onUpdate(self) {
    const progress = self.progress
    alignmentPercent.value = Math.round(progress * 100)

    // 更新进度条
    alignmentBarRef.value.style.width = `${progress * 100}%`

    // 更新百分比文字
    alignmentPercentRef.value.textContent = `${alignmentPercent.value}%`

    // 触发 Canvas 色彩条
    __rgbGenerateBars?.(progress)

    // 通道标签颜色变化
    channelLabelsRef.value.forEach((label, i) => {
      const colors = ['#ff0000', '#00ff00', '#0000ff']
      const opacity = 0.3 + progress * 0.7
      label.style.color = colors[i]
      label.style.opacity = String(opacity)
    })
  }
})
```

#### ③ Canvas 色彩条生成
```typescript
function generateColorBars(progress: number) {
  colorBars = []
  const barCount = 50

  for (let i = 0; i < barCount; i++) {
    const x = Math.random() * cw
    const y = Math.random() * ch
    const width = 20 + Math.random() * 60
    const height = 2 + Math.random() * 4

    // 根据进度调整分离程度
    const separation = (1 - progress) * 100

    colorBars.push({
      x: x + (Math.random() - 0.5) * separation,
      y,
      width,
      height,
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
      alpha: 0.3 + Math.random() * 0.4
    })
  }
}
```

#### ④ 色彩条绘制
```typescript
function draw() {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, cw, ch)

  colorBars.forEach((bar) => {
    ctx.fillStyle = `rgba(${bar.r}, ${bar.g}, ${bar.b}, ${bar.alpha})`
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
  })
}
```

## 配置参数（Pro 版）

```typescript
// 通道偏移
const maxOffset = 80         // 最大偏移量 (px)

// Canvas 色彩条
const barCount = 50          // 色彩条数量
const barWidth = 20-80       // 宽度范围 (px)
const barHeight = 2-6        // 高度范围 (px)

// 对齐率
const alignmentStart = 0%    // 初始对齐率
const alignmentEnd = 100%    // 最终对齐率
```

## 视觉效果

### 初始状态（未滚动）
- 红色通道偏左 -80px
- 绿色通道居中
- 蓝色通道偏右 +80px
- 三通道叠加产生强烈色差（类似3D眼镜效果）
- 对齐率显示 `0%`
- Canvas 色彩条分散排列

### 滚动过程
1. **0-25% 进度**: 开始对齐
   - 红色通道向右移动
   - 蓝色通道向左移动
   - 色差逐渐减小
   - 对齐率达到 25%

2. **25-50% 进度**: 持续对齐
   - 三通道接近重合
   - 彩色图片逐渐清晰
   - 色差光晕减弱
   - 对齐率达到 50%

3. **50-75% 进度**: 基本对齐
   - 三通道几乎重合
   - 图片基本恢复彩色
   - 仅剩轻微色差
   - 对齐率达到 75%

4. **75-100% 进度**: 完全对齐
   - 三通道完美重合
   - 清晰彩色图片呈现
   - 色差完全消失
   - 对齐率达到 100%

### 交互效果
- **滚动控制**: 用户通过滚动精确控制对齐过程
- **实时反馈**: 对齐率进度条和百分比实时更新
- **色彩变化**: 通道标签颜色从暗淡到鲜艳
- **Canvas 动画**: 色彩条随进度集中排列

## 使用场景

✅ **摄影作品集** - 展示色彩科学知识  
✅ **设计教育** - RGB 颜色模型教学演示  
✅ **科技公司官网** - 图像处理、显示技术  
✅ **艺术装置** - 数字艺术、色彩实验  
✅ **品牌宣传** - 需要科技感的视觉呈现  
✅ **UI/UX 展示** - 色彩理论应用案例  

## 性能优化

- ✅ `will-change: transform, opacity` - GPU 加速
- ✅ `mix-blend-mode: screen` - 硬件加速混合
- ✅ Canvas 自动清理（生命周期管理）
- ✅ ScrollTrigger 正确清理（onUnmounted）
- ✅ gsap.context 统一管理动画上下文
- ✅ 增量更新（只更新可见色彩条）

## 浏览器兼容性

- ✅ Chrome / Edge (完全支持)
- ✅ Firefox (完全支持)
- ✅ Safari (完全支持)
- ⚠️ IE11 (不支持，需要 polyfill)

## 扩展建议

### 自定义图片
```typescript
const imageSrc = 'your-image.jpg'  // 替换为任意高清图片
```

### 调整偏移强度
```typescript
// 更强的色差效果
const maxOffset = 150  // 原 80px

// 更弱的色差效果
const maxOffset = 40   // 原 80px
```

### 扩展到 CMYK
```typescript
// 添加青色、品红、黄色、黑色通道
const channels = [
  { name: 'cyan', color: '#00ffff' },
  { name: 'magenta', color: '#ff00ff' },
  { name: 'yellow', color: '#ffff00' },
  { name: 'black', color: '#000000' }
]
```

### 改变混合模式
```scss
.rgb-channel {
  mix-blend-mode: lighten;  // 原 screen
  // 其他选项: multiply, overlay, hard-light
}
```

### 添加更多指标
```typescript
// 色相分布图
const hueDistribution = [...]

// 饱和度曲线
const saturationCurve = [...]

// 亮度直方图
const luminanceHistogram = [...]
```

## 与其他组件对比

| 特性 | **RGBChannelSplit** | HologramStack | ParallaxLayerFusion |
|------|---------------------|---------------|---------------------|
| 图片数量 | **1张×3通道** | 1张×3通道 | 6张真实图片 |
| 分离方式 | **水平偏移** | 水平偏移 | 视差滚动 |
| 混合模式 | ✅ screen | ❌ | ❌ |
| 对齐指示 | **进度条+百分比** | 文字显示 | 无 |
| Canvas 可视化 | **色彩条分析** | RGB噪点 | 雾气粒子 |
| 适用场景 | 色彩科学 | 全息科技 | 风景景深 |

## 版本历史

- **v1.0 (Pro)** - 全新创作
  - ✨ RGB 三通道独立控制
  - 🎯 水平偏移对齐算法（±80px）
  - 📊 Canvas 像素级色彩分析
  - 📈 通道对齐率实时显示（进度条+百分比）
  - 🏷️ 通道标签动态变化（R/G/B）
  - 🎨 深色科技背景 + RGB渐变标题
  - ⚡ 性能优化（GPU加速、混合模式）
