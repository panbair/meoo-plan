# CardImage3DCompassClock — CSS3 3D 罗盘时钟 · 数学与 DOM 融合

## 概述

将 JavaScript 三角函数（`Math.sin` / `Math.cos`）与 CSS 3D 变换结合，打造一个仿佛悬浮在空中的精密机械罗盘时钟。16 方位罗盘标记 + 60 个刻度标记全部通过极坐标→直角坐标转换后由 CSS `rotate()` + `translateY()` 精确定位，时针/分针/秒针的角度由实时时间通过数学公式计算。

## 数学应用

### 时间 → 角度转换

```javascript
// 时针：12小时=360° → 每小时30° + 每分钟偏移0.5°
hourAngle = ((hours % 12) + minutes / 60) * 30

// 分针：60分钟=360° → 每分钟6° + 每秒偏移0.1°
minuteAngle = (minutes + seconds / 60) * 6

// 秒针：60秒=360° → 每秒6° + 毫秒平滑
secondAngle = (seconds + ms / 1000) * 6
```

### 极坐标 → 直角坐标

```javascript
function polarToCart(angleDeg, radius) {
  const rad = (angleDeg - 90) * Math.PI / 180  // -90°使0°指向12点
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  }
}
```

### 罗盘方位定位 (16方位 × 22.5°)

```
N(0°) NNE(22.5°) NE(45°) ENE(67.5°)
E(90°) ESE(112.5°) SE(135°) SSE(157.5°)
S(180°) SSW(202.5°) SW(225°) WSW(247.5°)
W(270°) WNW(292.5°) NW(315°) NNW(337.5°)

CSS: rotate(angle) translateY(-148px) rotate(-angle)
     ↑ 旋转到角度    ↑ 径向推出        ↑ 文字回正
```

### 60个刻度标记 (6° 间隔)

```
每个刻度:
  rotate(angle) translateY(-138px)
  0°, 6°, 12°, ..., 354°
  整点标记 (0/5/10/...): 宽3px 高10px 金色
  普通标记: 宽1px 高5px 暗色
```

## 3D 机械结构

```
Z:+22  中心轴承 (宝石)
Z:+18  秒针 (红色, 细)
Z:+14  分针 (金色, 中)
Z:+10  时针 (金色, 粗)
Z:0    陀螺仪环 + 罗盘标记 + 60刻度
Z:-4   钟面圆盘 (暗色, 放射渐变)
```

### 3D 旋转观察

| 滚动 | stage rotateX | stage rotateY | gyroRing |
|------|--------------|--------------|----------|
| 0→40% | 0° → +30° | 0° | rotateY 0→360° |
| 40→90% | +30° → -20° | 0° → +45° | 持续旋转 |
| 90→100% | -20° → 0° | +45° → 0° | 归位 |

## 实时时钟循环

```javascript
function clockLoop() {
  const now = new Date()
  // 计算小时/分钟/秒 + 毫秒
  // 更新 hourAngle / minuteAngle / secondAngle (响应式)
  // → CSS rotate() 自动更新
  requestAnimationFrame(clockLoop) // 60fps 平滑
}
```

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色机械 · 黄铜/金色 · 精密仪表 |
| 氛围 | 陀螺仪、航海罗盘、机械钟表 |
| 装饰 | 16方位罗盘 + 60刻度 + 同心装饰环 |

## 技术要点

- 🔑 `requestAnimationFrame` 实时时钟循环 (含毫秒平滑)
- 🔑 三角函数计算：时间→角度、极坐标→rotate+translateY
- 🔑 16方位 + 60刻度全部通过角度循环 + CSS定位生成
- 🔑 指针使用 `transform-origin: 50% 100%` 以中心为轴旋转
- 🔑 秒针含毫秒平滑 (`seconds + ms/1000`)
- 🔑 陀螺仪环独立 rotateY 旋转 + 场景视角变换
- 🔑 3D指针 translateZ 分层悬浮 (时针10/分针14/秒针18)
- GSAP ScrollTrigger scrub 驱动视角旋转
