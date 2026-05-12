# CardImgFlyingStones - 斜阶飞石 · 多图错落入场

## 效果描述

一组 9 张图片悬浮于深灰展墙前，初始各自潜伏在视口之外——沿对角线方向错落分布。Timeline 驱动图片按对角线序列依次飞掠而出，入场时带有旋转与缩放弹性，落地瞬间弹跳一次后锁定，形成连续斜落的飞石阵列。

## 核心动画

- **对角线错落**：9 张图片沿左上到右下方向分布潜伏点
- **依次飞入**：stagger 0.12s，连续斜落
- **旋转缩放**：scale 0.85→1，rotate ±3°→0
- **落地微弹**：y 轴 -4px 回弹，back.out(1.3)
- **阴影加深**：box-shadow 从浅淡加深至稳定
- **亮度齐升**：filter brightness 0.85→1

## 技术实现

- Vue 3 Composition API
- GSAP Timeline + ScrollTrigger
- CSS Grid 3x3 布局
- SCSS 样式

## 视觉效果

- 深灰展墙背景
- 9 张自然风景图片
- 连续斜落飞石效果
- 悬停上浮交互
- 柔和绿白标题
