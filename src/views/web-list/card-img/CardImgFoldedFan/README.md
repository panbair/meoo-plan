# CardImgFoldedFan - 折扇展骨

折扇展开效果，模拟古典折扇与现代画廊交融的优雅陈列。

## 效果描述

深色展台上，一组图片如收拢的折扇，全部折叠在画面左侧。滚动时，扇骨按顺序向右侧优雅旋开，每张图片以自身左缘为轴旋转展开，形成流畅的扇骨依次弹开节奏。

## 核心特性

- 图片初始 `rotateY: -85deg`，全部紧贴左侧
- `transformOrigin: left center`，利用 `perspective` 建立 3D 空间
- GSAP `timeline` + `stagger` 驱动依次展开
- `ease: power3.out` 末段叠加微弱回弹
- 底部公共阴影同步拉伸
- 高光线随角度移动，强化骨片立体感

## 技术实现

- Vue 3 Composition API
- GSAP ScrollTrigger scrub 驱动
- CSS 3D perspective + transform-style
- SCSS 样式预处理
