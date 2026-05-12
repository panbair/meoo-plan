# CardImgInk · 墨漪生花 · 水墨浸染径向展开

## 效果概述

素白宣纸基底，图片以隐形墨迹潜伏于纸面之下。一滴无形清墨落入画面中心，浓墨从落点沿纸纤维向外晕染，以不规则的径向形态徐徐扩散——墨色所到处图像渐显，未及处仍隐于纸白。

## 设计亮点

- 动态 SVG 滤镜（feTurbulence + feDisplacementMap）模拟墨迹晕染
- 径向渐变遮罩从中心扩散至画面外缘
- 边缘毛绒羽化效果，随时间从粗砺演变为细腻
- 墨丝渗透使用 SVG 路径随机分布
- 水渍边缘残留极淡灰蓝色环
- 湿墨渐干色泽沉淀效果

## 技术实现

- Vue 3 Composition API + TypeScript
- GSAP + ScrollTrigger 动画
- SVG feTurbulence 扰动滤镜
- SCSS 样式预处理
