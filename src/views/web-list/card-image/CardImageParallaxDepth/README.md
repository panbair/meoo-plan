# CardImageParallaxDepth — 视差深度图

> **深度图分离 × 多层视差 × 3D 倾斜**

## 概念

使用程序化生成的深度图（Depth Map）将一张风景图分离为 5 个深度层级。每个层级的图像在独立 Canvas 上渲染，通过 CSS 3D `perspective` + `translateZ` 创建真正的空间视差效果。鼠标移动驱动摄像机 `rotateX/rotateY` 倾斜，近距离层响应更快；滚动驱动各层以不同的视差系数位移。

---

## 图层架构（Z 轴 → 远处到近处）

| 层 | 名称 | 深度范围 | translateZ | 视差系数 | 颜色标识 |
|:---:|------|:---:|:---:|:---:|:---:|
| 1 | Sky / Clouds | 0–60 | -140px | 0.12x | `#89c4ff` |
| 2 | Far Mountains | 45–115 | -70px | 0.28x | `#5b9bd5` |
| 3 | Mid Hills | 100–165 | -15px | 0.50x | `#70ad47` |
| 4 | Near Trees | 148–215 | +40px | 0.75x | `#548235` |
| 5 | Foreground | 198–255 | +90px | 1.05x | `#375623` |

- **深度范围重叠**：相邻层有 8-18 像素深度重叠，配合 12px 羽化边缘（softMargin），消除层间硬切缝
- **scale 渐变**：远方层略放大（1.08x），近景层略缩小（0.93x），补偿透视投影缩放

---

## 核心技术

### 1. 程序化深度图生成

不使用外部深度图文件，而是通过 Canvas 2D 实时生成：

```
垂直渐变（远→近）
  + 径向渐变模拟山峰（5 座远山 + 3 座中山 + 3 座近山）
  + 多重正弦/余弦噪声纹理（自然不规则感）
  → 灰度深度图 ImageData
```

### 2. Canvas 像素级图层提取

```
for each pixel (x, y):
  depth = depthMapData[pixel]
  if depth in [minDepth, maxDepth]:
    alpha = 1  // 保留原图像素
  elif depth in软过渡区间:
    alpha = 线性过渡值  // 羽化边缘
  else:
    alpha = 0  // 透明
  → 写入图层 Canvas
```

### 3. CSS 3D 透视场景

```css
.pd-scene  { perspective: 800px; perspective-origin: 50% 45%; }
.pd-camera { transform-style: preserve-3d; }
/* 每个图层: transform: translateZ(var(--z)) scale(var(--s)); */
```

鼠标移动更新 `cameraStyle.transform = rotateX(α) rotateY(β)`，产生真实的 3D 视差倾斜。

### 4. GSAP 滚动驱动多层视差

| 阶段 | 进度 | 效果 |
|:---:|:---:|------|
| 视差分离 | 5–65% | 各层按 parallax 系数沿 Z 轴位移，远方层动得慢，近景层动得快 |
| 视差归位 | 70–95% | 所有层回归原位，深景效果 | 
| 层高亮轮播 | 10–60% | 右侧图例依次高亮标记当前深度层 |

---

## 交互

- **鼠标移动** → 3D 摄像机倾斜（rotateX ±8° / rotateY ±15°），每层 x/y 偏移量由视差系数决定
- **滚动** → 各层 Z 轴分离 + 回归，视差速度 0.12x–1.05x
- **十字准星光标** → `cursor: crosshair`
- **窗口缩放** → 300ms 防抖，自动重新计算 Canvas 尺寸并重绘各层

---

## 使用方式

```vue
<CardImageParallaxDepth />
```

使用 Unsplash 风景图 `photo-1464822759023-fed622ff2c3b`。
