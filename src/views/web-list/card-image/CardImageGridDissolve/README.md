# CardImageGridDissolve — 网格碎片溶解飘散（Pro 增强版）

## 设计理念

**Dissolve · Scatter · Assemble · Energy Burst** — 全屏沉浸式网格碎片溶解体验，80个高清碎片从混沌状态爆发聚合，形成震撼的视觉冲击力。

## 核心特性（Pro 增强版）

### 1. 高清网格切割 (10×8 = 80片)
- **更高密度**：从 48 片提升到 80 片，细节更丰富
- **自动生成**：无需手动编写，JS 动态计算
- **精确拼接**：背景定位算法确保无缝拼接
### 2. 增强的溶解效果
- **初始模糊度**：20-30px（原 15-25px）
- **透明度渐变**：从 0 到 1 平滑过渡
- **缩放差异**：0.6-0.9 随机缩放，增强立体感
- **实现“溶解”质感**，而非生硬的显隐切换

### 3. 增强的飘散位移
- **X/Y 偏移**：±80px（原 ±60px），飘散幅度更大
- **旋转角度**：±30°（原 ±22.5°），旋转更剧烈
- **模拟能量爆发**，避免整齐划一的呆板感
- **每个碎片独立随机**，层次分明

### 4. 优化的滚动触发
- `start: 'top 75%'` - **重要内容提前展示**（黄金法则）
- `end: 'bottom 15%'` - 更长的动画区间
- `scrub: 1.8` - 更流畅的响应性
- `toggleActions: 'play none none reverse'` - 滚动入场播放、滚出还原

### 5. 全屏沉浸设计
- **尺寸**：100vw × 100vh 占据整个视口
- **背景**：渐变紫蓝配色 (#667eea → #764ba2)
- **明亮色彩**：非灰色阴沉，科技感十足
- **光晕效果**：碎片边缘发光，增强视觉冲击

### 6. 性能优化升级
- **will-change**：提示浏览器优化 transform, opacity, filter
- **GSAP stagger**：批量动画，避免卡顿
- **ScrollTrigger scrub**：1.8s 平滑绑定
- **完整清理**：组件卸载时销毁所有动画
- **适配各类设备**：响应式设计

## 技术实现

### GSAP 实现思路（Pro 版）

#### ① 组件初始化
```typescript
// 自动生成 10×8 = 80 个碎片
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    fragments.push({
      offsetX: (Math.random() - 0.5) * 160, // ±80px
      offsetY: (Math.random() - 0.5) * 160,
      rotation: (Math.random() - 0.5) * 60,  // ±30°
      blur: 20 + Math.random() * 10,         // 20-30px
      scale: 0.6 + Math.random() * 0.3       // 0.6-0.9
    })
  }
}
```

#### ② 滚动触发配置（黄金法则）
```typescript
ScrollTrigger.create({
  trigger: sectionRef.value!,
  start: 'top 75%',   // 重要内容提前展示
  end: 'bottom 15%',
  scrub: 1.8,         // 更流畅的响应性
  toggleActions: 'play none none reverse'
})
```

#### ③ 碎片动画逻辑（增强版）
```typescript
gsap.fromTo(fragmentRefs.value,
  {
    opacity: 0,
    filter: (i) => `blur(${fragments[i].blur}px)`,
    x: (i) => fragments[i].offsetX,
    y: (i) => fragments[i].offsetY,
    rotation: (i) => fragments[i].rotation,
    scale: (i) => fragments[i].scale
  },
  {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0, y: 0, rotation: 0, scale: 1,
    duration: 1.2,
    stagger: {
      amount: 1.2,           // 增加总错开时间
      grid: [COLS, ROWS],    // [10, 8]
      from: 'center',        // 从中心向外爆发
      ease: 'power2.inOut'
    },
    ease: 'power3.out'       // 更强烈的先快后慢质感
  }
)
```

#### ④ 时序控制（能量爆发）
- **stagger.amount**: 1.2s 总错开时间（原 0.8s）
- **stagger.grid**: [10, 8] 高清网格布局
- **stagger.from**: 'center' 从中心向外爆发
- **stagger.ease**: 'power2.inOut' 加速再减速
- 模拟能量爆发的震撼效果

#### ⑤ 缓动曲线升级
- 选用 **power3.out** 缓动（原 expo.out）
- 让碎片归位时更快速的初始速度
- 贴合能量爆发的强烈质感
- 避免生硬卡顿，保持流畅度

## 配置参数（Pro 版）

```typescript
const COLS = 10             // 列数（建议 8-12）
const ROWS = 8              // 行数（建议 6-10）
const TOTAL = COLS * ROWS   // 总碎片数 80

// 碎片随机范围（增强版）
offsetX: ±80px              // 水平飘散幅度（原 ±60px）
offsetY: ±80px              // 垂直飘散幅度
rotation: ±30°              // 旋转幅度（原 ±22.5°）
blur: 20-30px               // 初始模糊度（原 15-25px）
scale: 0.6-0.9              // 初始缩放（新增）
```

## 动画亮点（Pro 版）

### 视觉效果升级
1. **能量爆发**：从中心向外的 stagger 时序，模拟能量释放
2. **高清细节**：80 个碎片提供更丰富的视觉层次
3. **强烈对比**：power3.out 缓动带来更震撼的速度变化
4. **光晕效果**：碎片边缘发光，科技感十足
5. **全屏沉浸**：100vw × 100vh 占据整个视口
6. **明亮配色**：渐变紫蓝背景 (#667eea → #764ba2)
7. **Hover 交互**：鼠标悬停翻转显示第二张图片
8. **状态追踪**：底部实时显示组装进度

### 性能优化升级
- ✅ `will-change: transform, opacity, filter`
- ✅ GSAP stagger 批量动画（1.2s 总时长）
- ✅ ScrollTrigger scrub 1.8s 平滑绑定
- ✅ 组件卸载时完整清理动画
- ✅ 响应式设计，适配移动端

## 图片资源

- `imageA`: 山景 (photo-1506905925346)
- `imageB`: 谷景 (photo-1470071459604)

## 使用场景

✅ 产品图片展示  
✅ 团队照片墙  
✅ 案例作品集  
✅ 画廊式布局  
✅ 任何需要震撼视觉冲击的图片展示

## 滚动触发黄金法则（本组件采用）

- **重要内容**: `start: 'top 75%'` （提前展示）← 本组件使用
- **一般内容**: `start: 'top 80-85%'` （标准触发）
- **补充内容**: `start: 'top 90%'` （接近才触发）
- **scrub 值**: 1-2 秒 平衡流畅度和响应性 ← 本组件使用 1.8s
