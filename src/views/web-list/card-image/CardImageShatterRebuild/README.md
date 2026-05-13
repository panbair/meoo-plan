# CardImageShatterRebuild 镜破重圆组件

## 简介

一个具有强烈视觉冲击力的图片入场动画组件，通过 CSS Grid 分割图片为 24 枚碎片，从外向内依次收拢聚合，模拟钻石刀切割后的完美重组。

## 动画效果

### 核心特性

1. **精密切割网格**
   - 6 列 × 4 行 = 24 枚等大矩形碎片
   - CSS clip-path 精确裁切
   - 边缘保留极细切割亮线

2. **随机偏移与旋转**
   - translateX/Y: ±15px 至 ±40px
   - rotateZ: -6deg 至 +6deg
   - rotateX/Y: -3deg 至 +3deg（深度倾斜）

3. **由外向内收拢**
   - 按层级（layer）排序 stagger
   - 外层碎片先启动，内层以 0.04s 递增延迟
   - 形成沿网格由边缘向中心收拢的视觉节奏

4. **接缝辉光效果**
   - 碎片归位瞬间触发边缘辉光
   - box-shadow 极细白光
   - 0.1s 峰值后 0.3s 衰减

5. **亮度过渡与呼吸**
   - 整体 brightness 从 0.8 升至 1.0
   - 四角网格暗影以 5s 周期低频呼吸

## 技术实现

| 技术 | 用途 |
|------|------|
| CSS clip-path | 精确裁切 24 枚碎片 |
| CSS transform | 3D 旋转与位移 |
| GSAP ScrollTrigger | 滚动驱动动画 |
| GSAP stagger | 控制收拢顺序 |
| SCSS | 样式与动画效果 |

## 参数说明

无外部参数，直接通过 ScrollTrigger 滚动控制

## 使用方式

```vue
<template>
  <CardImageShatterRebuild />
</template>
```

## 动画时间轴

```
0s       - 外层碎片开始收拢
0-1.2s   - 所有碎片归位 (power4.in)
0.8s     - 亮度开始过渡
0.8s     - 接缝辉光触发
1.0s     - 覆盖层消失
1.3s+    - 四角暗影呼吸
```

## 碎片层级分布

```
Layer 0 (最外层): 角落碎片，先启动
Layer 1: 边缘碎片
Layer 2: 次边缘碎片
Layer 3: 中间层碎片
Layer 4-5 (中心): 最后启动
```

## 兼容性

- 需要浏览器支持 CSS clip-path
- 需要浏览器支持 CSS 3D transforms
- 需要 GSAP ScrollTrigger 插件
