# CardImage3DPerfRing — 极致渲染性能 · 工程化优化

## 概述

高端效果必须伴随极致的流畅度。本组件将三大工程化优化技术系统性地应用于 3D 环形旋转展示：

1. **will-change GPU 加速**
2. **backface-visibility 防闪烁**
3. **CSS 变量全局配置化**

## 优化一：will-change — GPU 加速图层提升

### 应用策略

```
动画元素         will-change 值      触发时机
─────────────────────────────────────────────
.pr-ring         transform          始终 (持续旋转)
.pr-card ×8      transform          始终 (环上旋转)
.pr-card__face   transform          始终 (子元素跟随)
.pr-glow         transform          始终 (环境光漂移)
```

### 关键原则

- **提前告知浏览器**：在动画开始前设置 `will-change`，浏览器预先创建 GPU 合成层
- **适度使用**：仅对持续动画的元素使用，避免过度创建层导致 GPU 内存溢出
- **及时释放**：组件 `onUnmounted` 时将 `will-change` 重置为 `auto`

```typescript
onUnmounted(() => {
  // 释放GPU资源
  cardRefs.value.forEach(el => { if (el) el.style.willChange = 'auto' })
  if (ringRef.value) ringRef.value.style.willChange = 'auto'
})
```

## 优化二：backface-visibility — 防闪烁机制

### 问题

3D 环形旋转时，卡片背面朝向观察者。若不隐藏背面：
- 背面内容与正面镜像重叠
- 半透明元素穿透显示
- 旋转到 90°/270° 时出现闪烁

### 解决方案

每张卡片使用**双层结构**确保背面完全遮挡：

```html
<div class="pr-card">           <!-- 卡片容器 -->
  <div class="pr-card__face">   <!-- 正面: backface-visibility: hidden -->
    <img ... />
  </div>
  <div class="pr-card__back">   <!-- 背面覆盖层: backface-visibility: hidden + rotateY(180deg) -->
  </div>
</div>
```

| 元素 | backface-visibility | rotateY | 作用 |
|------|---------------------|---------|------|
| `.pr-card__face` | hidden | 0° | 正面可见，转到背面时隐藏 |
| `.pr-card__back` | hidden | 180° | 始终覆盖背面，防止穿透 |

## 优化三：CSS 变量全局参数配置化

### 变量清单

| CSS 变量 | 默认值 | 用途 | JS 可调 |
|---------|--------|------|---------|
| `--pr-perspective` | 1100px | 3D 透视强度 | ✅ |
| `--pr-radius` | 340px | 环形半径 (卡片距中心距离) | ✅ |
| `--pr-card-w` | 280px | 卡片宽度 | ✅ |
| `--pr-card-h` | 200px | 卡片高度 | ✅ |
| `--pr-bg` | #0a0812 | 场景背景色 | ✅ |

### 一处修改，全局生效

```scss
// 场景透视 — 使用CSS变量
.pr-scene {
  perspective: var(--pr-perspective);  // ← 单点配置
}

// 卡片尺寸 — 使用CSS变量
.pr-card {
  width: var(--pr-card-w);
  height: var(--pr-card-h);
  margin-left: calc(var(--pr-card-w) / -2);  // ← 自动居中
  margin-top: calc(var(--pr-card-h) / -2);
}

// 卡片3D定位 — 使用CSS变量
// rotateY(Ndeg) translateZ(var(--pr-radius))  ← JS动态注入
```

### JS 实时调整 (无需修改 CSS)

```typescript
// 响应式调整透视 → CSS变量自动传播到所有使用处
function adaptPerspective() {
  const w = window.innerWidth
  if (w < 480)      cfg.perspective = 500
  else if (w < 768)  cfg.perspective = 700
  else if (w < 1024) cfg.perspective = 900
  else               cfg.perspective = 1100
  cfg.radius = Math.round(cfg.perspective * 0.31)  // 半径联动
}
// cfg 变化 → computed rootCssVars 自动更新 → CSS变量全局生效
```

## 性能监测

组件内置 FPS 计数器，实时显示在底部面板：
- 🟢 ≥55 FPS — 流畅 (绿色)
- 🟡 30-54 FPS — 可接受 (黄色)
- 🔴 <30 FPS — 卡顿 (红色)

## 8卡片环形布局

| 卡片 | Y旋转角 | translateZ |
|------|---------|-----------|
| VELOCITY | 0° | var(--pr-radius) |
| MOMENTUM | 45° | var(--pr-radius) |
| KINETIC | 90° | var(--pr-radius) |
| DYNAMIC | 135° | var(--pr-radius) |
| PHOTON | 180° | var(--pr-radius) |
| QUANTUM | 225° | var(--pr-radius) |
| PRISMA | 270° | var(--pr-radius) |
| SPECTRUM | 315° | var(--pr-radius) |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 深色性能仪表盘 + 青蓝/紫色科技感 |
| 氛围 | 工程化美学、精密、流畅 |
| FPS面板 | 实时性能可视化 |

## 技术要点

- 🔑 三大优化系统性整合：will-change + backface-visibility + CSS变量
- 🔑 CSS变量由 Vue `computed` 响应式驱动 → 修改 JS 对象自动更新全局样式
- 🔑 自适应透视：根据视口宽度自动调整 perspective 和 radius
- 🔑 组件卸载时清理 will-change 释放 GPU 内存
- 🔑 卡片双层结构 (face + back) 彻底杜绝背面穿透
- 🔑 内置 FPS 监测作为性能验证工具
- 8张卡片均匀分布在 3D 环上 (45° 间隔)
- GSAP ScrollTrigger scrub 驱动旋转
