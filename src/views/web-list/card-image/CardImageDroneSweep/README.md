# CardImageDroneSweep — FPV穿越

## 概述
第一人称无人机视角——图片是3D空间中的"广告牌"，无人机俯冲/侧倾/拉升穿越画面。FPV OSD叠加屏幕信息。

## 核心动画
```
3D场景 rotateX/Y/Z 变化 → 无人机飞向图片 →
图片scale 1.4→1 → 穿越加速(scale 1→1.2) → 
下一张图片目标 → 俯冲穿越
```

## 视觉元素
- CSS 3D perspective:800px + 广告牌场景
- FPV OSD覆盖层(中心十字准星、地平线、ALT/SPD/BATT/SAT等数据)
- 动态模式切换(ACRO→DIVE→BANK→CLIMB→LAND)
- 蓝天渐变背景
- 飞行数据随帧实时更新

## 技术要点
- 3D场景rotateX/Y/Z 模拟无人机姿态
- 图片scale动画模拟距离变化
- OSD数据通过mtl.call()实时更新
- ScrollTrigger scrub:1.1
