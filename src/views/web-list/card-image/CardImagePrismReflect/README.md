# CardImagePrismReflect — 棱镜折射反射（Pro 增强版）

## 设计理念

**Spectrum · Refraction · Rainbow Dispersion** — 全屏沉浸式棱镜分光体验，96个三角形碎片从混沌状态爆发聚合，展现光的色散与折射之美。

## 核心特性（Pro 增强版）

### 1. 三棱镜分光效果
- **RGB色散**：每个碎片带有随机色相偏移 (hue-rotate)
- **彩虹光谱**：滚动时逐步归零，模拟白光分解为七彩光
- **多层折射**：前后双面图片翻转，创造玻璃折射感

### 2. 高密度三角形网格
- **碎片数量**：12×8 = **96片**三角形
- **精确拼接**：背景定位算法确保无缝拼接成完整大图
- **立体悬浮**：初始缩放 0.5-0.85，营造深度层次感

### 3. 增强的动画参数
```typescript
offsetX: ±100px      // 水平飘散幅度（原 ±60px）
offsetY: ±100px      // 垂直飘散幅度
rotation: ±45°       // 旋转幅度（原 ±22.5°）
blur: 25px           // 初始模糊度（原 15-25px）
scale: 0.5-0.85      // 初始缩放差异（新增）
hue: 0-360°          // 随机色相偏移（新增）
```

### 4. 优化的滚动触发
- `start: 'top 70%'` - 重要内容提前展示
- `scrub: 2` - 更流畅的响应性
- `stagger: { from: 'center' }` - 从中心向外爆发扩散
- `power3.out` - 先快后慢的震撼质感

### 5. Canvas 彩色粒子系统
- **彩虹光点**：随机色相 (hue) 的发光粒子
- **径向渐变**：每个粒子都有光晕效果
- **向上飘浮**：模拟光线散射的物理效果
- **动态生成**：根据滚动进度实时控制粒子密度

### 6. 深色渐变背景
- **紫黑配色**：`#1a0033 → #0d001a → #000000`
- **多层光晕**：紫色、粉色、蓝色径向渐变叠加
- **科技感十足**：非灰色阴沉设计

### 7. 彩虹渐变标题
- **文字渐变**：`#ff0080 → #ff8c00 → #40e0d0 → #7b68ee`
- **发光阴影**：三层不同颜色的 text-shadow
- **霓虹效果**：强烈的视觉冲击力

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 组件初始化
```typescript
// 自动生成 12×8 = 96 个三角形碎片
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    fragments.push({
      offsetX: (Math.random() - 0.5) * 200, // ±100px
      offsetY: (Math.random() - 0.5) * 200,
      rotation: (Math.random() - 0.5) * 90,  // ±45°
      scale: 0.5 + Math.random() * 0.35,     // 0.5-0.85
      hue: Math.random() * 360               // 0-360°
    })
  }
}
```

#### ② 滚动触发配置（黄金法则）
```typescript
ScrollTrigger.create({
  trigger: sectionRef.value!,
  start: 'top 70%',   // 重要内容提前展示
  end: 'bottom 10%',
  scrub: 2,           // 更流畅的响应性
  toggleActions: 'play none none reverse'
})
```

#### ③ 碎片动画逻辑（增强版）
```typescript
gsap.fromTo(fragmentRefs.value,
  {
    opacity: 0,
    filter: (i) => `blur(25px) hue-rotate(${fragments[i].hue}deg)`,
    x: (i) => fragments[i].offsetX,
    y: (i) => fragments[i].offsetY,
    rotation: (i) => fragments[i].rotation,
    scale: (i) => fragments[i].scale
  },
  {
    opacity: 1,
    filter: 'blur(0px) hue-rotate(0deg)',
    x: 0, y: 0, rotation: 0, scale: 1,
    duration: 1.5,
    stagger: {
      amount: 1.5,
      grid: [COLS, ROWS],
      from: 'center'  // 从中心向外扩散
    },
    ease: 'power3.out',  // 先快后慢
    onUpdate: function() {
      __prismSpawn?.(this.progress())  // 触发粒子
    }
  }
)
```

#### ④ Canvas 粒子系统
```typescript
// 绘制彩色光点（带径向渐变）
ctx.beginPath()
ctx.arc(p.x, p.y, p.r + t * 2, 0, Math.PI * 2)
const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${a})`)
gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`)
ctx.fillStyle = gradient
ctx.fill()
```

#### ⑤ Hover 翻转效果
```scss
.pr-fragment:hover {
  .pr-front { transform: rotateY(180deg); }
  .pr-back { transform: rotateY(360deg); }
}
```

## 配置参数（Pro 版）

```typescript
const COLS = 12            // 列数（建议 10-14）
const ROWS = 8             // 行数（建议 6-10）
const TOTAL = COLS * ROWS  // 总碎片数 96

// 碎片随机范围（增强版）
offsetX: ±100px            // 水平飘散幅度（原 ±60px）
offsetY: ±100px            // 垂直飘散幅度
rotation: ±45°             // 旋转幅度（原 ±22.5°）
blur: 25px                 // 初始模糊度（固定值）
scale: 0.5-0.85            // 初始缩放差异（新增）
hue: 0-360°                // 随机色相偏移（新增）
```

## 视觉效果

### 初始状态（未滚动）
- 96个三角形碎片分散在屏幕各处
- 每个碎片带有不同的色相偏移（彩虹色）
- 高模糊度 (25px) + 全透明 + 缩小状态

### 滚动过程
1. **碎片聚合**：从中心向外逐步清晰、归位
2. **色散还原**：hue-rotate 从随机值逐步归零
3. **模糊消除**：blur 从 25px 降至 0px
4. **缩放放大**：scale 从 0.5-0.85 放大到 1.0
5. **粒子爆发**：Canvas 层持续生成彩色光点

### 最终状态（完全滚动）
- 所有三角形精确拼接成一张完整的山景图（Image A）
- 色彩恢复正常（无色相偏移）
- 图片清晰锐利（无模糊）
- Hover 任意碎片可翻转看到谷景图（Image B）

## 使用场景

✅ **产品展示页** - 高科技产品、光学仪器  
✅ **创意作品集** - 摄影师、设计师作品展示  
✅ **科技官网** - AI、VR/AR、光电技术公司  
✅ **艺术装置** - 数字艺术、光影互动  
✅ **品牌宣传** - 需要强烈视觉冲击力的场景  

## 性能优化

- ✅ `will-change: transform, opacity, filter` - GPU 加速
- ✅ `transform-style: preserve-3d` - 3D 渲染优化
- ✅ Canvas 粒子自动清理（生命周期管理）
- ✅ ScrollTrigger 正确清理（onUnmounted）
- ✅ gsap.context 统一管理动画上下文
- ✅ 增量更新（只更新可见粒子）

## 浏览器兼容性

- ✅ Chrome / Edge (完全支持)
- ✅ Firefox (完全支持)
- ✅ Safari (完全支持，包括 -webkit-box-reflect)
- ⚠️ IE11 (不支持，需要 polyfill)

## 扩展建议

### 自定义图片
```typescript
const imageA = 'your-image-url.jpg'  // 正面图片
const imageB = 'your-image-url.jpg'  // 背面图片（hover翻转可见）
```

### 调整网格密度
```typescript
const COLS = 16  // 更密集（192片）
const ROWS = 12
```

### 修改色散强度
```typescript
// 在模板中调整 hue-rotate 范围
filter: (i) => `blur(25px) hue-rotate(${fragments[i].hue * 0.5}deg)`
```

### 改变背景配色
```scss
.pr-bg {
  background:
    radial-gradient(ellipse at 30% 20%, rgba(255, 0, 0, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(0, 255, 0, 0.12) 0%, transparent 50%);
}
```

## 版本历史

- **v2.0 (Pro)** - 全新重制版
  - ✨ 碎片数量提升至 96 片 (12×8)
  - 🌈 新增 RGB 色散效果 (hue-rotate)
  - 💫 增强动画参数（±100px 飘散、±45° 旋转）
  - 🎨 彩虹渐变标题 + 彩色粒子系统
  - 🖼️ 全屏设计 (100vw × 100vh)
  - ⚡ 性能优化（GPU 加速、增量更新）

- **v1.0** - 原始百叶窗版本（已废弃）
