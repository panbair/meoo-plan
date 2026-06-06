# CardImage3DInteractive — 从"被动观看"到"主动控制"的交互增强

## 概述

高端的 3D 不应只是自动播放的循环动画，而应与用户的真实行为产生深度共鸣。本组件将三个维度的用户交互整合到同一个 3D 场景中——鼠标倾斜、滚动透视穿梭、点击深度聚焦——让用户从"被动观看者"变为"主动控制者"。

## 三大交互维度

### 🖱 鼠标跟随 3D 倾斜

```
光标在左上 → 卡片向左上倾斜 (rotateY:-20° rotateX:+16°)
光标在中央 → 卡片正面朝向 (rotateY:0° rotateX:0°)
光标在右下 → 卡片向右下倾斜 (rotateY:+20° rotateX:-16°)

每张卡片根据自身 Z 深度有不同的响应幅度：
  远景 (Z:-120) → depthFactor 0.36 → 响应柔和
  近景 (Z:+160) → depthFactor 0.92 → 响应敏锐
```

- rAF + lerp 平滑插值 (factor=0.1) 模拟物理惯性
- 自定义光标点 (16px 发光圆跟随鼠标)
- `cursor: none` 隐藏系统光标

### 👁 滚动驱动透视穿梭

```
滚动 0% → perspective-origin: 30% 20%  (俯视角度)
         perspective: 800px          (近焦)

滚动 50% → perspective-origin: 50% 50% (平视)
          perspective: 1100px        (中焦)

滚动 100% → perspective-origin: 70% 80% (仰视角度)
           perspective: 1400px      (远焦)
```

- `perspective-origin` 从上→下 + 左右正弦摆动
- `perspective` 值 800→1400 动态变化
- scrub: 1.5 平滑透视过渡
- 场景辅助微旋转增强空间感

### 🎯 点击深度聚焦

```
点击卡片 → 选中卡片:
  translateZ → 280px (前移)
  scale → 1.15 (放大)
  filter: brightness(1.25) + 发光 drop-shadow

其他卡片:
  translateZ → -100px (退后)
  scale → 0.9 (缩小)
  filter: brightness(0.6) + blur(2px) (模糊)

点击空白区域 → 全部复位
  back.out(1.4) 弹性归位
```

## 5卡片空间分布

| 卡片 | translateZ | X位置 | Y位置 | 鼠标响应深度因子 |
|------|-----------|-------|-------|----------------|
| FOCUS.ONE | -120px | -16vw | -18vh | 0.36 (远景·弱响应) |
| FOCUS.TWO | -40px | +14vw | -8vh | 0.52 |
| FOCUS.THREE | +40px | -12vw | +4vh | 0.68 |
| FOCUS.FOUR | +100px | +10vw | +14vh | 0.80 |
| FOCUS.FIVE | +160px | -6vw | +20vh | 0.92 (近景·强响应) |

## 交互状态面板

底部实时显示三个维度的当前状态：
- 🖱 倾斜角度 X/Y
- 👁 透视模式 (俯视穿梭/平视巡航/仰视升空)
- 🎯 当前聚焦卡片

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色科技感 · 蓝紫光晕 |
| 交互 | 鼠标+滚动+点击 三维控制 |
| 光标 | 自定义发光圆点 (16px) |
| 氛围 | 主动探索、深度互动 |

## 技术要点

- 🔑 三大交互维度合为一体：鼠标倾斜 + 滚动透视 + 点击聚焦
- 🔑 `perspective-origin` 由 GSAP ScrollTrigger onUpdate 实时驱动
- 🔑 `perspective` 值动态变化 (800→1400)，增强空间穿梭感
- 🔑 卡片鼠标响应基于 Z 深度差异化 (depthFactor 0.36~0.92)
- 🔑 rAF + lerp 平滑鼠标倾斜 (factor=0.1)
- 🔑 点击聚焦使用 GSAP tween 直接操作 translateZ/scale/filter
- 🔑 点击空白区域自动复位所有卡片
- `will-change: perspective, perspective-origin` 确保透视变化 GPU 加速
