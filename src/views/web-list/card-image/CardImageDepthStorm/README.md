# CardImageDepthStorm 深度风暴·3D碎片散合组件

## 简介

一个具有强烈视觉冲击力的 3D 图片入场动画组件，通过三深度层将图片分割为 20 枚碎片，模拟空间风暴撕裂后从不同深度层回归聚合的震撼效果。

## 动画效果

### 核心特性

1. **三深度层分割**
   - 5 列 × 4 行 = 20 枚碎片
   - 前景层: translateZ +30px, scale 1.05
   - 中景层: translateZ 0, scale 1.0
   - 远景层: translateZ -30px, scale 0.95

2. **随机偏移与 3D 旋转**
   - translateX/Y: ±20px 至 ±50px
   - rotateX/Y/Z: -5deg 至 +5deg
   - 远景碎片带有 blur(1px) 失焦效果

3. **空间弯曲滑翔轨迹**
   - 碎片归位沿轻微弧线飞行
   - 通过 keyframes 实现曲率偏移
   - 模拟穿越深度屏障的视觉感

4. **分层收拢顺序**
   - 外层碎片先启动
   - 前景/远景碎片优先
   - 中景碎片 0.05s 延迟跟进

5. **接缝辉光与深度光效**
   - 边缘 box-shadow 极细冷色光
   - 深度光效模拟层间光晕
   - 0.1s 峰值后 0.3s 衰减

6. **景深过渡**
   - 远景碎片 blur 逐渐归零
   - 亮度从 0.75 过渡至 1.0
   - 四角深度暗影 5s 呼吸

## 技术实现

| 技术 | 用途 |
|------|------|
| CSS transform-style: preserve-3d | 3D 变换层级 |
| CSS perspective | 深度透视 |
| CSS clip-path | 精确裁切碎片 |
| GSAP keyframes | 弧线轨迹动画 |
| GSAP ScrollTrigger | 滚动驱动 |
| GSAP stagger | 控制收拢顺序 |

## 参数说明

无外部参数，直接通过 ScrollTrigger 滚动控制

## 使用方式

```vue
<template>
  <CardImageDepthStorm />
</template>
```

## 动画时间轴

```
0s       - 外层碎片开始收拢
0-1.5s   - 碎片归位 (power3.inOut)
0.3s     - 弧线偏移起点
0.7s     - 弧线偏移归零
1.0s     - 亮度开始过渡
1.1s     - 接缝辉光触发
1.2s     - 辉光消失
1.5s+    - 深度暗影呼吸
```

## 深度层分布

```
前景层 (30%): 最快归位，带放大效果
中景层 (40%): 标准归位，保持原尺度
远景层 (30%): 归位时失焦逐渐清晰
```

## 兼容性

- 需要浏览器支持 CSS 3D transforms
- 需要浏览器支持 CSS clip-path
- 需要 GSAP ScrollTrigger 插件
- 建议使用 GPU 加速设备
