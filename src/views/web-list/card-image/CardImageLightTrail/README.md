# CardImageLightTrail — 光绘长曝

## 概述
模拟长曝光摄影——光线一笔一划描绘出画面。黑暗画布中，光迹逐渐累积绘制出图片轮廓。

## 核心动画
```
快门打开 → 曝光开始(brightness:0.05→1.5) →
光线粒子从中心向外螺旋扩散 → 画面渐清晰 →
快门关闭(brightness→0.05) → 下一张曝光开始
```

## 视觉元素
- 双层Canvas(主画布+粒子画布)
- 暖色光粒子(400个, hue:30-70)
- 中心光源指示器(发光点+光晕)
- EXP曝光时间显示(BULB模式)
- 黑底暖光配色(金色/琥珀色)

## 技术要点
- Canvas粒子系统根据currentExposure值动态生成
- brightness + saturate filter模拟曝光
- 粒子数量与曝光进度联动
- requestAnimationFrame双层绘制
- mtl.call()更新exposure状态
