# CardImageVolumetricFog — 体积雾大气透视

> **深度图 × 体积雾层 × 大气散射**

## 核心概念

基于深度图将场景分离为 **5 个景深层级**，每层叠加不同浓度的"体积雾"（白色半透明层 + `backdrop-filter: blur()`）。滚动时雾气动态消散，从浓雾弥漫到清晰可见，模拟真实的大气透视效果。

## 多层级架构

```
Layer 1: 远景天空 (z: -100px, 雾密度 80%, 模糊 10px)
Layer 2: 远景山脉 (z: -60px,  雾密度 60%, 模糊 7px)
Layer 3: 中景建筑 (z: -30px,  雾密度 40%, 模糊 5px)
Layer 4: 近景树木 (z: 0px,    雾密度 20%, 模糊 3px)
Layer 5: 前景人物 (z: 30px,   雾密度 5%,  模糊 1px)
Layer 6: 体积雾粒子 Canvas (90 个漂浮粒子, mix-blend-mode: screen)
Layer 7: 上帝光 SVG 径向光束 (7 条不同角度/宽度的光束, 丁达尔效应)
Layer 8: 大气散射覆盖层 (冷色调 soft-light 混合)
Layer 9: 信息面板 + 深度指示器 + 进度条
```

## GSAP 动画时间线 (ScrollTrigger)

| 进度段 | 效果描述 | 技术实现 |
|--------|----------|----------|
| 0~15%   | 远景天空开始消散 | CSS `--vf-density` 从 80%→0, CSS `--vf-blur` 递减 |
| 5~35%   | 远景山脉消散 | 每层消退区间错开 15-18% |
| 15~50%  | 中景建筑消散 | 最近层先清、最远层后清 |
| 20~70%  | 上帝光从出现到最亮 | SVG opacity 0→0.8→0 (峰值在 45-70%) |
| 30~70%  | 近景树木消散 | `backdrop-filter: blur()` 动态计算 |
| 40~100% | 前景人物完全清理 | 全局雾浓度 1→0 |
| 0~100%  | 体积雾粒子缩减 | Canvas 粒子大小/透明度 × (0.3+multiplier×0.7) |

## 核心技术

- **CSS 自定义属性驱动**：每层通过 `style.setProperty('--vf-density', ...)` 实时更新雾密度和模糊度
- **深度掩码**：`mask-image: linear-gradient(to bottom, ...)` 为每层创建不同深度区域的雾效模拟
- **`backdrop-filter: blur()`**：叠加半透明白色背景，对底层图像产生真实朦胧模糊
- **Canvas 粒子系统**：90 个漂浮粒子，偏向画面上部（雾浓区域），每 40ms 刷新，`mix-blend-mode: screen`
- **丁达尔效应**：SVG 7 条不同角度/宽度/颜色的径向光束，整体 opacity 随雾消散过程呈现三角形曲线（出现→峰值→减弱）
- **大气散射**：soft-light 混合模式覆盖层，冷蓝色调随雾消散从浓变淡

## 关键参数

| 参数 | 值 | 说明 |
|------|-----|------|
| fogLayers | 5 | 景深层级数量 |
| particles | 90 | 漂浮雾粒子数 |
| godRays | 7 | 上帝光束数 |
| particleRefresh | 40ms | 粒子渲染间隔 |
| scrub | 1.2 | ScrollTrigger 平滑度 |
| backdrop-filter | CSS variable | 动态模糊 (10px→0px) |
