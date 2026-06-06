# CardImage3DBookOpen — CSS3 3D 精装翻书

## 概述

纯 CSS3 3D 模拟精装书的翻开过程。书本初始合拢，用户竖滚驱动硬壳封面沿书脊旋转打开，随后内页逐张翻过。左封面和右封面分别沿各自的边缘（`transform-origin: right/left center`）翻转，每张"页"都是一张高质量图片。

## CSS3 3D 核心技术

| 属性 | 值 | 作用 |
|------|-----|------|
| `perspective` | 900px | 3D透视距离 |
| `transform-style` | `preserve-3d` | 保持每页和书本的3D空间 |
| `transform-origin` | `right/left center` | 🔑 翻页的旋转轴 |
| `rotateY(±175°)` | 各页不同 | 页面沿书脊翻转 |
| `backface-visibility` | `hidden` | 翻过去的页面隐藏背面 |

## 翻开序列

| 滚动进度 | 翻动内容 | 翻转角度 |
|---------|---------|---------|
| 0→1.5 | 硬壳封面翻开 | rotateY: 0→ -175° |
| 1.5→2.7 | 第一张内页翻过 | rotateY: 0→ -175° |
| 2.7→3.9 | 第二张内页翻过 | rotateY: 0→ 175° |
| 3.9→5 | 第三张内页翻过 | rotateY: 0→ -175° |

## 书本结构

| 元素 | 定位 | 翻转轴 |
|------|------|--------|
| 左封面 | left: 0, width: 50% | transform-origin: right center |
| 右封面 | right: 0, width: 50% | transform-origin: left center |
| 内页1-3 | 交替左右 | 交替 right/left center |
| 书脊 | left: 50% | 固定不转 |
| 封面厚度 | 封面边缘 | 3D厚度效果 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暖黄 / 书页米白 / 咖啡棕 / 鎏金 |
| 氛围 | 典雅、书香、温暖 |
| 背景 | 暖奶油白渐变 + 台灯光晕 |
| 字体 | Georgia 衬线字体（页码/书名） |

## 特色元素

- **台灯光晕**：模拟书桌台灯的暖黄色泽
- **书脊装饰**：三条鎏金装订线
- **封面厚度**：3D 侧边表现精装硬壳的物理厚度
- **页码指示器**：底部显示当前页/总页数（Georgia 衬线数字）
- **场景旋转**：整体场景随翻页微妙旋转，强化立体感

## 技术要点

- 纯 CSS3 3D 模拟物理翻书
- 关键：`transform-origin` 设为书脊边缘实现真实翻转
- GSAP ScrollTrigger 驱动翻页序列（`scrub: 1.5`）
- 5张 Unsplash 高质量图片对应封面/内页/封底
- 封面的3D厚度用渐变模拟
- backface-visibility: hidden 确保翻过去的页面不可见
