# CardImageCrossfadeMosaic — 分形递归马赛克

## 设计理念

**Fractal Recursive · Self-Similar Pattern** — 基于谢尔宾斯基三角形分形结构的全屏沉浸式体验，40个三角形从混沌状态爆发聚合，展现自相似图案的无限深度和数学之美。

## 核心特性

### 1. 谢尔宾斯基分形结构
- **递归深度**: 3层 (Level 0-3)
- **三角形总数**: 1 + 3 + 9 + 27 = 40个
- **自相似性**: 每个层级都包含缩小版的自身结构
- **数学美感**: 展现分形几何的无限递归特性

### 2. 螺旋旋转动画
- **层级旋转**: 每层不同的基础旋转角度 (0°, 120°, 240°, 360°)
- **动态螺旋**: 滚动时逐步旋转360°，创造螺旋上升效果
- **缩放配合**: scale(0.01 → 1.0~1.45)，层级越高放大越明显

### 3. 全屏图片拼接
- **背景模式**: `background-size: cover` + `background-position: center`
- **视觉效果**: 每个三角形显示完整图片，形成重复拼贴艺术
- **Hover交互**: 鼠标悬停翻转显示第二张图片

### 4. Canvas粒子系统
- **分层粒子**: 不同层级使用不同颜色 (蓝/紫/粉/青)
- **触发机制**: 三角形激活时爆发粒子
- **生命周期**: 自动清理过期粒子，避免内存泄漏
- **辉光效果**: shadowBlur 增强视觉冲击

### 5. 深度指示器
- **实时显示**: DEPTH: 0/3 → 3/3
- **科技感**: 等宽字体 + 发光效果
- **进度反馈**: 清晰展示当前递归深度

### 6. 明亮配色方案
- **渐变背景**: #667eea → #764ba2 (紫蓝色)
- **光晕效果**: 白色径向渐变叠加
- **非灰色阴沉**: 符合规范要求的明亮设计

## 技术实现

### 分形生成算法

```typescript
function generateFractalTriangles(depth: number): FractalTriangle[] {
  const triangles: FractalTriangle[] = []
  
  function subdivide(x: number, y: number, size: number, level: number) {
    if (level > depth) return
    
    // 添加当前三角形
    triangles.push({ id, level, x, y, size, delay: level * 0.15 })
    
    if (level < depth) {
      // 三个子三角形 (谢尔宾斯基模式)
      subdivide(x - quarterSize, y + quarterSize, halfSize, level + 1)
      subdivide(x + quarterSize, y + quarterSize, halfSize, level + 1)
      subdivide(x, y - quarterSize, halfSize, level + 1)
    }
  }
  
  subdivide(0.5, 0.5, BASE_SIZE, 0)
  return triangles
}
```

### 缓动函数

```typescript
// 三次缓入缓出
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// 分形缩放 (层级相关)
function fractalScaleEase(t: number, level: number): number {
  const baseScale = 0.01
  const maxScale = 1 + level * 0.15
  return baseScale + easeInOutCubic(t) * (maxScale - baseScale)
}

// 分形旋转 (层级相关)
function fractalRotateEase(t: number, level: number): number {
  const baseRotation = level * 120
  return baseRotation + t * 360
}
```

### ScrollTrigger 配置

```typescript
ScrollTrigger.create({
  trigger: sectionRef.value!,
  start: 'top 75%',   // 重要内容提前展示
  end: 'bottom 15%',
  scrub: 1.8,         // 更流畅的响应性
  onUpdate(self) {
    const p = self.progress
    // 逐层激活三角形
    fractalTriangles.forEach((tri, idx) => {
      const t = clamp((p - tri.delay) / 0.25, 0, 1)
      // 更新 transform 和 opacity
    })
  }
})
```

## 配置参数

```typescript
const FRACTAL_DEPTH = 3    // 递归深度 (建议 2-4)
const BASE_SIZE = 1        // 基础尺寸单位

// 层级延迟
delay: level * 0.15        // Level 0: 0s, Level 1: 0.15s, ...

// 缩放范围
scale: 0.01 → 1.0~1.45     // 层级越高，最终缩放越大

// 旋转范围
rotation: base + t * 360°  // Level 0: 0°→360°, Level 1: 120°→480°, ...
```

## 动画亮点

### 视觉效果
1. **层级递进展开**: 从 Level 0 到 Level 3 逐层揭示
2. **螺旋旋转**: 每层不同的旋转速度和角度
3. **弹性缩放**: 小三角形快速放大，大三角形缓慢展开
4. **粒子爆发**: 三角形激活时彩色粒子向外扩散
5. **深度追踪**: 实时显示当前递归深度
6. **Hover翻转**: 鼠标悬停查看第二张图片

### 性能优化
- ✅ `will-change: transform, opacity`
- ✅ DOM 缓存避免重复查询
- ✅ 增量更新 (仅变化超过阈值时更新)
- ✅ Canvas 粒子生命周期管理
- ✅ 组件卸载时完整清理动画

## 图片资源

- `imageA`: 山景 (photo-1506905925346)
- `imageB`: 谷景 (photo-1470071459604)

## 使用场景

✅ 数学/科学主题网站  
✅ 艺术作品展示  
✅ 创意机构官网  
✅ 科技产品展示  
✅ 任何需要震撼视觉冲击的图片展示

## 滚动触发黄金法则

- **重要内容**: `start: 'top 75%'` （提前展示）← 本组件使用
- **一般内容**: `start: 'top 80-85%'` （标准触发）
- **补充内容**: `start: 'top 90%'` （接近才触发）
- **scrub 值**: 1-2 秒 平衡流畅度和响应性 ← 本组件使用 1.8s
