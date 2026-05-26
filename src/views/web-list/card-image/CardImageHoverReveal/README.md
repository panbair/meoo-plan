# CardImageHoverReveal — 光效揭示

## 设计理念

**Hover Light Sweep · Shine Reveal** — 鼠标悬停时图片放大+提亮+光效扫过的沉浸式图片卡片组件。8张卡片以4x2网格排列，滚动入场，悬停产生流畅的光效动画。

## 核心特性

### 1. 光效扫过动画
- **光效层**: 半透明线性渐变 + skewX(-20°) 倾斜
- **动画方式**: GSAP `fromTo` x: -120% → 120%
- **持续时间**: 0.7s，power2.inOut 缓动
- **完成重置**: 动画结束后自动归位

### 2. 图片悬浮效果
- **缩放**: scale(1 → 1.12)
- **滤镜**: `brightness(1.15) saturate(1.2)` 双重增强
- **过渡时间**: 0.45s power2.out

### 3. 3D 倾斜感应
- **跟随鼠标**: `rotateX/Y` 微调（±6°/±4°）
- **平滑过渡**: GSAP 0.3s power1.out
- **perserve-3d**: 启用3D渲染上下文

### 4. 卡片整体动效
- **上浮**: y → -8px
- **阴影增强**: box-shadow 亮度提升至 rgba(100, 130, 255, 0.25)
- **底部光条**: scaleX 0.3 → 1.0 展开动画

### 5. 滚动入场
- **标题**: 4个元素依次从下飞入 (stagger 0.1s)
- **卡片**: 8张卡片 stagger 0.08s，back.out(1.4) 弹性缓动
- **进度条**: 滚动驱动 scaleX 填写

### 6. Canvas 粒子背景
- **40个粒子**: 向上漂浮，渐变淡出
- **颜色**: rgba(130, 160, 255, alpha)
- **自动补充**: 粒子数低于40时按概率生成新粒子

## 技术实现

### 鼠标悬停流程
```typescript
// onCardEnter
gsap.to(img, { scale: 1.12, filter: 'brightness(1.15) saturate(1.2)', duration: 0.45 })
gsap.fromTo(shine, { x: '-120%', opacity: 0 }, { x: '120%', opacity: 0.35, duration: 0.7 })
gsap.to(glow, { opacity: 1, scaleX: 1, duration: 0.4 })
gsap.to(card, { y: -8, boxShadow: '...', duration: 0.4 })

// onCardLeave — 全部反向恢复
gsap.to(img, { scale: 1, filter: 'brightness(1) saturate(1)', duration: 0.5 })
gsap.to(shine, { opacity: 0, duration: 0.3 })
gsap.to(glow, { opacity: 0, scaleX: 0.3, duration: 0.4 })
gsap.to(card, { y: 0, rotateX: 0, rotateY: 0, boxShadow: '...', duration: 0.5 })
```

### ScrollTrigger 配置
```typescript
// 标题入场
ScrollTrigger.create({
  trigger: container,
  start: 'top 80%',
  end: 'top 40%',
  toggleActions: 'play none none none'
})

// 卡片依次入场（每张 start 递减3%）
// 第i张: start: `top ${80 - i * 3}%`
```

## 配置参数
```typescript
const HOVER_SCALE = 1.12       // 悬停缩放比例
const HOVER_BRIGHTNESS = 1.15  // 悬停亮度
const HOVER_SATURATE = 1.2     // 悬停饱和度
const SHINE_DURATION = 0.7     // 光效扫过时间(s)
const TILT_X_MAX = 6           // X轴最大倾斜角度
const TILT_Y_MAX = 4           // Y轴最大倾斜角度
const PARTICLE_COUNT = 40      // 背景粒子数量
```

## 动画亮点

### 视觉效果
1. 光效扫过 + 倾斜跟随 + 上浮 + 阴影增强 → 四维悬停反馈
2. 底部渐变光条展开 → 视觉锚点强化
3. Canvas 粒子向上漂浮 → 深度感营造

### 性能优化
- ✅ `will-change: transform, box-shadow` 预先声明
- ✅ GSAP `overwrite: 'auto'` 避免动画冲突
- ✅ `requestAnimationFrame` 双层嵌套确保 DOM 就绪
- ✅ `cancelAnimationFrame` 组件卸载时清理
- ✅ 所有 ScrollTrigger 实例在 `onUnmounted` 中 kill

## 图片资源
- 使用 `picsum.photos` 占位图（8张不同 seed）
- `crossorigin="anonymous"` 属性避免跨域问题

## 使用场景
✅ 作品集展示
✅ 电商产品页
✅ 相册画廊
✅ 团队成员卡片
✅ 博客文章缩略图

## 滚动触发黄金法则
- **标题区**: `start: 'top 80%'` — 用户即将看到时触发
- **卡片区**: `start: 'top 80%'` 递进 `-3%/张` — 卡片依次入场
- **进度条**: `scrub: 0.5` — 平滑跟随滚动
