# GSAP 动画组件完整清单 (321个组件)

> **项目位置**: `demo/src/views/web/components/`  
> **总数**: 321个 Vue 组件  
> **技术栈**: Vue 3 + TypeScript + GSAP 3 + ScrollTrigger  
> **用途**: 企业网站高级动画效果库

---

## 📊 组件分类统计

| 分类 | 数量 | 说明 |
|------|------|------|
| 基础卡片组件 | 15 | 非滚动触发的卡片动画 |
| 3D效果组件 | 25 | 3D变换、旋转、透视效果 |
| 滚动触发组件 | 230+ | 基于ScrollTrigger的滚动动画 |
| 文字特效组件 | 20 | 文字变形、流动、揭示效果 |
| 图片特效组件 | 45 | 图片变形、视差、滤镜效果 |
| 粒子/物理组件 | 15 | 粒子系统、物理模拟 |
| 导航/UI组件 | 10 | 导航栏、按钮、表单等 |
| 背景/环境组件 | 12 | 极光、星云、波浪等背景 |

---

## 🎴 一、基础卡片组件 (15个)

### 1. AccordionCards.vue
- **类型**: 手风琴卡片
- **动画特性**: 
  - 弹性展开/收起动画 (elastic.out)
  - 箭头旋转动画 (back.out)
  - 光效增强动画
  - 特征标签交错动画 (stagger)
  - 悬停交互效果
- **适用场景**: 产品展示、FAQ、服务介绍
- **关键技术**: gsap.timeline, elastic easing, stagger

### 2. Card3DFlipGallery.vue
- **类型**: 3D翻转卡片画廊
- **动画特性**: 3D翻转、透视变换
- **适用场景**: 作品集展示、产品对比

### 3. CardStack.vue
- **类型**: 卡片堆叠
- **动画特性**: 堆叠展开、层级切换
- **适用场景**: 时间线、步骤展示

### 4. FlipCards.vue
- **类型**: 翻转卡片
- **动画特性**: 正反面翻转、悬停触发
- **适用场景**: 团队成员、产品特性

### 5. MorphingCards.vue
- **类型**: 变形卡片
- **动画特性**: 形状变形、平滑过渡
- **适用场景**: 创意展示、数据可视化

### 6. ParallaxCards.vue
- **类型**: 视差卡片
- **动画特性**: 多层视差、深度感
- **适用场景**: 故事叙述、产品介绍

### 7. StaggerCards.vue
- **类型**: 交错卡片
- **动画特性**: 交错入场、序列动画
- **适用场景**: 列表展示、网格布局

### 8. FadeInStack.vue
- **类型**: 淡入堆叠
- **动画特性**: 渐显堆叠、透明度变化
- **适用场景**: 内容分层、优先级展示

### 9. FloatingImages.vue
- **类型**: 浮动图片
- **动画特性**: 悬浮动画、漂浮效果
- **适用场景**: 装饰元素、氛围营造

### 10. HorizontalScrollCards.vue
- **类型**: 横向滚动卡片
- **动画特性**: 水平滚动、拖拽交互
- **适用场景**: 时间线、流程展示

### 11. MagneticOrbit.vue
- **类型**: 磁吸轨道
- **动画特性**: 磁吸效果、轨道运动
- **适用场景**: 交互式导航、特色功能

### 12. SlidingPanels.vue
- **类型**: 滑动面板
- **动画特性**: 面板滑动、内容切换
- **适用场景**: 标签页、内容分区

### 13. TabSwitch.vue
- **类型**: 标签切换
- **动画特性**: 标签切换、内容过渡
- **适用场景**: 分类展示、选项卡

### 14. CollectionsModal.vue
- **类型**: 集合模态框
- **动画特性**: 弹窗动画、遮罩过渡
- **适用场景**: 详情展示、表单提交

### 15. CircularProgress.vue
- **类型**: 圆形进度条
- **动画特性**: 环形进度、数字递增
- **适用场景**: 数据统计、加载状态

---

## 🎬 二、滚动触发组件 (230+个)

### 📌 卡片类滚动组件 (40个)

#### 1. ScrollModernCards.vue
- **动画**: 现代美学卡片，从右侧滑入，内部元素交错动画
- **特性**: 序号、符号、名称、标签、进度条分步动画
- **缓动**: power3.out, back.out(1.7)
- **适用**: 技能展示、特性列表

#### 2. ScrollElegantCards.vue
- **动画**: 优雅卡片，精致过渡效果
- **特性**: 高端商务风格，细腻动画
- **适用**: 奢侈品、高端品牌

#### 3. ScrollMinimalistCards.vue
- **动画**: 极简主义卡片，简洁明了
- **特性**: 留白设计，克制动画
- **适用**: 简约风格网站

#### 4. ScrollCleanCards.vue
- **动画**: 清爽卡片，干净利落
- **特性**: 清晰层次，适度动画
- **适用**: 通用企业网站

#### 5. ScrollCardZoom.vue
- **动画**: 卡片缩放揭示
- **特性**: 从中心放大，焦点突出
- **适用**: 重点内容强调

#### 6. ScrollCardRotate3D.vue
- **动画**: 卡片3D旋转
- **特性**: Y轴旋转，立体感强
- **适用**: 科技感展示

#### 7. ScrollCardGlass.vue
- **动画**: 毛玻璃卡片
- **特性**: backdrop-filter模糊效果
- **适用**: 现代UI设计

#### 8. ScrollCardMorph.vue
- **动画**: 卡片形态变化
- **特性**: 圆角、尺寸动态变化
- **适用**: 创意交互

#### 9. ScrollCardFloat.vue
- **动画**: 卡片浮动
- **特性**: 上下浮动，轻盈感
- **适用**: 装饰性内容

#### 10. ScrollCardBorder.vue
- **动画**: 卡片边框动画
- **特性**: 边框绘制、发光效果
- **适用**: 强调边界

#### 11. ScrollCardWave.vue
- **动画**: 卡片波浪效果
- **特性**: 波浪形变形
- **适用**: 流体设计

#### 12. ScrollCardRipple.vue
- **动画**: 卡片涟漪效果
- **特性**: 点击涟漪扩散
- **适用**: 交互反馈

#### 13. ScrollCardPolaroid.vue
- **动画**: 拍立得风格卡片
- **特性**: 复古照片风格
- **适用**: 相册、回忆录

#### 14. ScrollCardStack.vue
- **动画**: 卡片堆叠滚动
- **特性**: 层叠展开
- **适用**: 步骤流程

#### 15. ScrollCard3D.vue
- **动画**: 3D卡片基础版
- **特性**: 简单3D变换
- **适用**: 快速实现

#### 16. ScrollCard3DFlip.vue
- **动画**: 卡片3D翻转
- **特性**: 正反面切换
- **适用**: 信息对比

#### 17. ScrollCardMorphReveal.vue
- **动画**: 形态变化揭示
- **特性**: 变形+内容揭示
- **适用**: 惊喜效果

#### 18. ScrollVortexCards.vue
- **动画**: 漩涡卡片
- **特性**: 螺旋进入
- **适用**: 创意开场

#### 19. ScrollWaveCards.vue
- **动画**: 波浪卡片组
- **特性**: 波浪式排列
- **适用**: 团队展示

#### 20. ScrollRippleCards.vue
- **动画**: 涟漪卡片组
- **特性**: 连锁反应
- **适用**: 关联内容

#### 21. ScrollPrismCards.vue
- **动画**: 棱镜卡片
- **特性**: 光线折射效果
- **适用**: 光学主题

#### 22. ScrollQuantumCards.vue
- **动画**: 量子卡片
- **特性**: 量子态叠加
- **适用**: 科技前沿

#### 23. ScrollNeonTrailCards.vue
- **动画**: 霓虹轨迹卡片
- **特性**: 光轨跟随
- **适用**: 赛博朋克

#### 24. ScrollNeonAuraCards.vue
- **动画**: 霓虹光环卡片
- **特性**: 光环脉动
- **适用**: 未来科技

#### 25. ScrollNeonEclipseCards.vue
- **动画**: 霓虹日食卡片
- **特性**: 日食遮蔽效果
- **适用**: 神秘主题

#### 26. ScrollNeonFluxCards.vue
- **动画**: 霓虹流变卡片
- **特性**: 能量流动
- **适用**: 动态能量

#### 27. ScrollNeonPlasmaCards.vue
- **动画**: 霓虹等离子卡片
- **特性**: 等离子体效果
- **适用**: 高能物理

#### 28. ScrollNeonPrismCards.vue
- **动画**: 霓虹棱镜卡片
- **特性**: 光谱分解
- **适用**: 光学艺术

#### 29. ScrollHoloCards.vue
- **动画**: 全息卡片
- **特性**: 全息投影感
- **适用**: 科幻主题

#### 30. ScrollLiquidCards.vue
- **动画**: 液体卡片
- **特性**: 液态变形
- **适用**: 流体设计

#### 31. ScrollMagneticCards.vue
- **动画**: 磁吸卡片
- **特性**: 鼠标跟随磁吸
- **适用**: 交互体验

#### 32. ScrollPixelCards.vue
- **动画**: 像素卡片
- **特性**: 像素化风格
- **适用**: 复古游戏

#### 33. ScrollOrigamiCards.vue
- **动画**: 折纸卡片
- **特性**: 折叠展开
- **适用**: 手工艺术

#### 34. ScrollRibbonCards.vue
- **动画**: 丝带卡片
- **特性**: 丝带飘动
- **适用**: 优雅装饰

#### 35. ScrollZenGardenCards.vue
- **动画**: 禅意花园卡片
- **特性**: 宁静和谐
- **适用**: 冥想、瑜伽

#### 36. ScrollEmberCards.vue
- **动画**: 余烬卡片
- **特性**: 火星飞溅
- **适用**: 火焰主题

#### 37. ScrollCrystalVaultCards.vue
- **动画**: 水晶宝库卡片
- **特性**: 水晶折射
- **适用**: 珍贵物品

#### 38. ScrollCyberPunkCards.vue
- **动画**: 赛博朋克卡片
- **特性**: 故障艺术+霓虹
- **适用**: 未来都市

#### 39. ScrollMagneticOrbitCards.vue
- **动画**: 磁吸轨道卡片
- **特性**: 轨道环绕
- **适用**: 天体系统

#### 40. ScrollAccordionGallery.vue
- **动画**: 手风琴画廊
- **特性**: 展开显示图片
- **适用**: 作品集

---

### 🖼️ 图片特效滚动组件 (45个)

#### 基础图片效果

##### 1. ScrollImageReveal.vue
- **动画**: 图片揭示
- **特性**: 遮罩移除，图片显现
- **适用**: 首屏图片

##### 2. ScrollImageParallax.vue
- **动画**: 图片视差
- **特性**: 多层不同速度移动
- **适用**: 深度场景

##### 3. ScrollImageBlur.vue
- **动画**: 图片模糊到清晰
- **特性**: blur滤镜渐变
- **适用**: 焦点转移

##### 4. ScrollImageClip.vue
- **动画**: 图片裁剪揭示
- **特性**: clip-path动画
- **适用**: 几何形状

##### 5. ScrollImageCrossfade.vue
- **动画**: 图片交叉淡入淡出
- **特性**: 多图片交替
- **适用**: 轮播展示

##### 6. ScrollImageMorph.vue
- **动画**: 图片变形
- **特性**: SVG morphing
- **适用**: 形状变换

##### 7. ScrollImageMisalign.vue
- **动画**: 图片错位
- **特性**: RGB通道分离
- **适用**: 故障艺术

##### 8. ScrollImageTilt.vue
- **动画**: 图片倾斜
- **特性**: 3D倾斜变换
- **适用**: 视角变化

##### 9. ScrollImageFlow.vue
- **动画**: 图片流动
- **特性**: 波浪式流动
- **适用**: 连续展示

##### 10. ScrollImageWave.vue
- **动画**: 图片波浪
- **特性**: 正弦波变形
- **适用**: 水面效果

#### 高级图片效果

##### 11. ScrollImageSpectrum.vue
- **动画**: 光谱扫描
- **特性**: 彩虹色扫描线
- **适用**: 科技分析

##### 12. ScrollImageHolographic.vue
- **动画**: 全息投影
- **特性**: 全息色彩偏移
- **适用**: 未来科技

##### 13. ScrollImagePixelate.vue
- **动画**: 像素化揭示
- **特性**: 从像素到清晰
- **适用**: 数字化主题

##### 14. ScrollImageKaleidoscope.vue
- **动画**: 万花筒
- **特性**: 对称镜像
- **适用**: 艺术展示

##### 15. ScrollImageLiquid.vue
- **动画**: 液体变形
- **特性**: WebGL液体模拟
- **适用**: 流体艺术

##### 16. ScrollImageDistort.vue
- **动画**: 扭曲变形
- **特性**: 波浪扭曲
- **适用**: 梦幻效果

##### 17. ScrollImageGlitch.vue
- **动画**: 故障艺术
- **特性**: 数字故障效果
- **适用**: 赛博朋克

##### 18. ScrollImage3D.vue
- **动画**: 3D变换
- **特性**: rotateX/Y/Z
- **适用**: 立体展示

##### 19. ScrollImageHologram.vue
- **动画**: 全息图
- **特性**: 扫描线+发光
- **适用**: 科幻界面

##### 20. ScrollImagePrism.vue
- **动画**: 棱镜效果
- **特性**: 光线折射分解
- **适用**: 光学展示

##### 21. ScrollImageNeon.vue
- **动画**: 霓虹光效
- **特性**: 霓虹边框发光
- **适用**: 夜间主题

##### 22. ScrollImageCyber.vue
- **动画**: 赛博风格
- **特性**: 网格+扫描线
- **适用**: 未来城市

##### 23. ScrollImagePortal.vue
- **动画**: 传送门
- **特性**: 漩涡吸入效果
- **适用**: 时空穿越

##### 24. ScrollImageQuantum.vue
- **动画**: 量子态
- **特性**: 概率云效果
- **适用**: 量子物理

##### 25. ScrollImageAurora.vue
- **动画**: 极光效果
- **特性**: 极光色彩流动
- **适用**: 自然奇观

##### 26. ScrollImageVortex.vue
- **动画**: 漩涡
- **特性**: 螺旋扭曲
- **适用**: 黑洞主题

#### 3D几何图片效果

##### 27. ScrollImageCuboid.vue
- **动画**: 长方体
- **特性**: 3D长方体展开
- **适用**: 包装盒

##### 28. ScrollImagePyramid.vue
- **动画**: 金字塔
- **特性**: 四面体展开
- **适用**: 古文明

##### 29. ScrollImageSphere.vue
- **动画**: 球体
- **特性**: 球形映射
- **适用**: 行星展示

##### 30. ScrollImageTorus.vue
- **动画**: 环形体
- **特性**: 甜甜圈形状
- **适用**: 抽象艺术

##### 31. ScrollImageMirror.vue
- **动画**: 镜像反射
- **特性**: 镜面倒影
- **适用**: 对称美学

##### 32. ScrollImageSepia.vue
- **动画**: 怀旧色调
- **特性**: sepia滤镜
- **适用**: 复古照片

##### 33. ScrollImageShatter.vue
- **动画**: 破碎效果
- **特性**: 碎片飞散
- **适用**: 冲击力

##### 34. ScrollImageRippleDistort.vue
- **动画**: 涟漪扭曲
- **特性**: 水波纹变形
- **适用**: 水面倒影

##### 35. ScrollImageFoldUnfold.vue
- **动画**: 折叠展开
- **特性**: 纸张折叠
- **适用**: 地图展开

##### 36. ScrollImageGallerySwipe.vue
- **动画**: 滑动画廊
- **特性**: 触摸滑动
- **适用**: 移动端

##### 37. ScrollImageMasonry.vue
- **动画**: 瀑布流
- **特性**: 不规则网格
- **适用**: Pinterest风格

##### 38. ScrollImageCircle.vue
- **动画**: 圆形裁剪
- **特性**: circle()裁剪
- **适用**: 头像展示

##### 39. ScrollImagePanorama.vue
- **动画**: 全景图
- **特性**: 横向滚动全景
- **适用**: 风景展示

##### 40. ScrollImageStack3D.vue
- **动画**: 3D堆叠
- **特性**: Z轴堆叠
- **适用**: 卡片堆叠

##### 41. ScrollImageStackReveal.vue
- **动画**: 堆叠揭示
- **特性**: 逐层揭开
- **适用**: 分层内容

##### 42. ScrollImageZoomReveal.vue
- **动画**: 缩放揭示
- **特性**: 从细节到全貌
- **适用**: 微观宏观

##### 43. ScrollImageCrystal.vue
- **动画**: 水晶效果
- **特性**: 晶莹剔透
- **适用**: 珠宝展示

##### 44. ScrollImageIceText.vue
- **动画**: 冰晶文字
- **特性**: 冰冻效果
- **适用**: 冬季主题

##### 45. ScrollImageFrostBreath.vue
- **动画**: 霜冻呼吸
- **特性**: 结霜效果
- **适用**: 寒冷氛围

---

### 📝 文字特效滚动组件 (20个)

#### 1. ScrollTextFlow.vue
- **动画**: 文字流动
- **特性**: 字符逐个流动
- **适用**: 标题展示

#### 2. ScrollTextShadow.vue
- **动画**: 文字阴影
- **特性**: 长阴影延伸
- **适用**: 立体文字

#### 3. ScrollTextGlow.vue
- **动画**: 文字发光
- **特性**: neon发光效果
- **适用**: 霓虹招牌

#### 4. ScrollTextMask.vue
- **动画**: 文字遮罩
- **特性**: 图片填充文字
- **适用**: 创意标题

#### 5. ScrollTextSplit.vue
- **动画**: 文字分裂
- **特性**: 字符分离重组
- **适用**: 动态标题

#### 6. ScrollTextScatter.vue
- **动画**: 文字散落
- **特性**: 字符随机散落
- **适用**: 爆炸效果

#### 7. ScrollTextScramble.vue
- **动画**: 文字解密
- **特性**: 乱码到明文
- **适用**: 黑客风格

#### 8. ScrollTextColumns.vue
- **动画**: 文字列
- **特性**: 矩阵雨效果
- **适用**: 代码雨

#### 9. ScrollTextCurtain.vue
- **动画**: 文字幕布
- **特性**: 幕布拉开
- **适用**: 戏剧开场

#### 10. ScrollTextJustify.vue
- **动画**: 文字对齐
- **特性**: 分散对齐动画
- **适用**: 排版展示

#### 11. ScrollTextWaveMorph.vue
- **动画**: 文字波浪变形
- **特性**: 波浪形+变形
- **适用**: 流体文字

#### 12. ScrollTextWaveSplit.vue
- **动画**: 文字波浪分裂
- **特性**: 波浪式分离
- **适用**: 动态分隔

#### 13. ScrollText3D.vue
- **动画**: 3D文字
- **特性**: 3D旋转文字
- **适用**: 立体标题

#### 14. ScrollTextBlur.vue
- **动画**: 文字模糊
- **特性**: 模糊到清晰
- **适用**: 焦点转换

#### 15. ScrollTextCascadEffect.vue
- **动画**: 文字级联
- **特性**: 瀑布式下落
- **适用**: 字符雨

#### 16. ScrollParticleText.vue
- **动画**: 粒子文字
- **特性**: 粒子组成文字
- **适用**: 科技标题

#### 17. ScrollMatrixText.vue
- **动画**: 矩阵文字
- **特性**: 绿色代码雨
- **适用**: 黑客帝国

#### 18. ScrollOutlineText.vue
- **动画**: 轮廓文字
- **特性**: 描边动画
- **适用**: 线条艺术

#### 19. ScrollStarText.vue
- **动画**: 星光文字
- **特性**: 闪烁星光
- **适用**: 梦幻标题

#### 20. ScrollWavyText.vue
- **动画**: 波浪文字
- **特性**: 正弦波起伏
- **适用**: 轻松氛围

---

### 🎯 其他滚动组件 (125+个)

#### 视差滚动类 (15个)

1. **ScrollParallaxLayers.vue** - 多层视差
2. **ScrollParallaxDepth.vue** - 深度视差
3. **ScrollParallaxGallery.vue** - 视差画廊
4. **ScrollParallaxText.vue** - 视差文字
5. **ScrollParallaxCursor.vue** - 光标视差
6. **ScrollParallaxCardsScroll.vue** - 卡片视差滚动
7. **ScrollParallaxLayer.vue** - 单层视差
8. **FixedParallax.vue** - 固定视差
9. **CascadeParallax.vue** - 级联视差
10. **DiagonalParallax.vue** - 对角线视差
11. **ImageParallax.vue** - 图片视差
12. **ScrollImageParallaxZoom.vue** - 视差缩放
13. **ScrollStickyReveal.vue** - 粘性揭示
14. **ScrollHoverReveal.vue** - 悬停揭示
15. **ScrollLensReveal.vue** - 透镜揭示

#### 3D滚动类 (20个)

1. **Scroll3DCube.vue** - 3D立方体滚动
2. **Scroll3DTunnel.vue** - 3D隧道
3. **Scroll3DGallery.vue** - 3D画廊
4. **ScrollCarousel3D.vue** - 3D轮播
5. **ScrollCubeCarousel.vue** - 立方体轮播
6. **ScrollSphereCarousel.vue** - 球形轮播
7. **ScrollHelixCarousel.vue** - 螺旋轮播
8. **ScrollCoverFlowGallery.vue** - 封面流
9. **ScrollStackGallery.vue** - 堆叠画廊
10. **ScrollCylinderGallery.vue** - 圆柱画廊
11. **ScrollOrbitGallery.vue** - 轨道画廊
12. **ScrollRotationGallery.vue** - 旋转画廊
13. **ScrollPerspective.vue** - 透视变换
14. **ScrollImage3DExtrude.vue** - 3D挤出
15. **ScrollImageSphere.vue** - 球体图片
16. **ScrollImageTorus.vue** - 环形图片
17. **ScrollImagePyramid.vue** - 金字塔图片
18. **ScrollImageCuboid.vue** - 长方体图片
19. **Holographic3D.vue** - 全息3D
20. **Cube3D.vue** - 基础3D立方体

#### 磁性/物理类 (15个)

1. **ScrollMagnetic.vue** - 磁吸效果
2. **ScrollMagneticField.vue** - 磁场
3. **ScrollMagneticFluid.vue** - 磁性流体
4. **ScrollMagneticGrid.vue** - 磁性网格
5. **ScrollMagneticRotate.vue** - 磁性旋转
6. **ScrollPhysicsBounce.vue** - 物理弹跳
7. **ScrollShapeElastic.vue** - 弹性形状
8. **SpringBounce.vue** - 弹簧弹跳
9. **BouncingBall.vue** - 弹跳球
10. **ScrollGravityBounce.vue** - 重力弹跳
11. **ScrollPinchZoom.vue** - 捏合缩放
12. **ScrollMagnify.vue** - 放大镜
13. **MagneticButton.vue** - 磁吸按钮
14. **ScrollDragReveal.vue** - 拖拽揭示
15. **ScrollSwipeUp.vue** - 上滑揭示

#### 液体/流体类 (12个)

1. **ScrollLiquidWave.vue** - 液体波浪
2. **ScrollLiquidButtons.vue** - 液体按钮
3. **ScrollLiquidDistort.vue** - 液体扭曲
4. **ScrollLiquidMetal.vue** - 液态金属
5. **ScrollLiquidMorph.vue** - 液体变形
6. **ScrollLiquidText.vue** - 液体文字
7. **ScrollLiquidTextMorph.vue** - 液体文字变形
8. **ScrollFluidPanels.vue** - 流體面板
9. **ScrollFluidText.vue** - 流体文字
10. **OceanWaves.vue** - 海洋波浪
11. **LiquidWave.vue** - 基础液体波浪
12. **ScrollLavaFlow.vue** - 熔岩流动

#### 粒子/爆炸类 (10个)

1. **ScrollParticleExplosion.vue** - 粒子爆炸
2. **ScrollParticleWave.vue** - 粒子波浪
3. **ParticleExplosion.vue** - 基础粒子爆炸
4. **ScrollStardustReveal.vue** - 星尘揭示
5. **ScrollCosmicDust.vue** - 宇宙尘埃
6. **NebulaVortex.vue** - 星云漩涡
7. **GalaxySpiral.vue** - 银河螺旋
8. **DNAHelix.vue** - DNA螺旋
9. **SolarSystem.vue** - 太阳系
10. **QuantumField.vue** - 量子场

#### 霓虹/发光类 (15个)

1. **ScrollNeonGlow.vue** - 霓虹发光
2. **ScrollNeonGrid.vue** - 霓虹网格
3. **ScrollNeonMatrix.vue** - 霓虹矩阵
4. **ScrollNeonPulse.vue** - 霓虹脉冲
5. **ScrollNeonRain.vue** - 霓虹雨
6. **ScrollNeonText.vue** - 霓虹文字
7. **NeonGlowText.vue** - 霓虹发光文字
8. **ScrollPrismGlow.vue** - 棱镜发光
9. **ScrollElectricArc.vue** - 电弧
10. **ScrollLaserLine.vue** - 激光线
11. **ScrollSolarFlare.vue** - 太阳耀斑
12. **ScrollEnergyOrb.vue** - 能量球
13. **AuroraBorealis.vue** - 北极光
14. **GradientFlow.vue** - 渐变流动
15. **CyberpunkCity.vue** - 赛博城市

#### 故障/赛博类 (12个)

1. **ScrollGlitch.vue** - 故障效果
2. **ScrollGlitchEffect.vue** - 故障艺术
3. **ScrollGlitchText.vue** - 故障文字
4. **ScrollCyberGrid.vue** - 赛博网格
5. **ScrollCyberPulse.vue** - 赛博脉冲
6. **ScrollCyberText.vue** - 赛博文字
7. **ScrollInvert.vue** - 反色效果
8. **ScrollHueRotate.vue** - 色相旋转
9. **ScrollBlendModeMix.vue** - 混合模式
10. **ScrollTemporalDistortion.vue** - 时间扭曲
11. **ScrollTemporalFlux.vue** - 时间通量
12. **ScrollTimeWarp.vue** - 时间弯曲

#### 折叠/纸张类 (8个)

1. **ScrollPaperFold.vue** - 纸张折叠
2. **ScrollFoldEffect.vue** - 折叠效果
3. **ScrollFoldCard.vue** - 折叠卡片
4. **FoldEffect.vue** - 基础折叠
5. **ScrollOrigamiCards.vue** - 折纸卡片
6. **ScrollInkDiffusion.vue** - 墨水扩散
7. **ScrollInkReveal.vue** - 墨水揭示
8. **WaveReveal.vue** - 波浪揭示

#### 进度/时间线类 (10个)

1. **Timeline.vue** - 基础时间线
2. **ScrollTimeline.vue** - 滚动时间线
3. **OverlappingTimeline.vue** - 重叠时间线
4. **StaggerTimeline.vue** - 交错时间线
5. **TimelineSequence.vue** - 时间线序列
6. **ScrollProgress.vue** - 滚动进度
7. **ScrollBreadcrumb.vue** - 面包屑导航
8. **NumberCounter.vue** - 数字计数器
9. **InfiniteScrollText.vue** - 无限滚动文字
10. **ScrollInfiniteScroll.vue** - 无限滚动

#### 导航/UI类 (10个)

1. **ScrollFloatingNav.vue** - 浮动导航
2. **ScrollNavMorph.vue** - 导航变形
3. **ScrollTabSwitch.vue** - 标签切换
4. **ScrollThemeSwitch.vue** - 主题切换
5. **HorizontalScroll.vue** - 横向滚动
6. **ScrollContrast.vue** - 对比展示
7. **ScrollAccentColor.vue** - 强调色
8. **ScrollBackgroundPattern.vue** - 背景图案
9. **ScrollCursorFollower.vue** - 光标跟随
10. **ScrollDynamicShadow.vue** - 动态阴影

#### 特殊效果类 (13个)

1. **ScrollStorytelling.vue** - 故事叙述
2. **ScrollSvgPathDraw.vue** - SVG路径绘制
3. **ScrollLoadingArt.vue** - 加载艺术
4. **ScrollSplitReveal.vue** - 分裂揭示
5. **ScrollSplitTransition.vue** - 分裂过渡
6. **ScrollScaleOnScroll.vue** - 滚动缩放
7. **ScrollElasticMorph.vue** - 弹性变形
8. **ScrollElasticScale.vue** - 弹性缩放
9. **ScrollElasticText.vue** - 弹性文字
10. **ScrollMorphGallery.vue** - 变形画廊
11. **ScrollMorphPath.vue** - 变形路径
12. **ScrollMorphingText.vue** - 变形文字
13. **ScrollShapeShift.vue** - 形状变换

#### 量子/科幻类 (8个)

1. **ScrollQuantumLeap.vue** - 量子跃迁
2. **ScrollQuantumPortal.vue** - 量子传送门
3. **ScrollQuantumTextEntangle.vue** - 量子纠缠文字
4. **QuantumWormhole.vue** - 量子虫洞
5. **ScrollInfinityFlow.vue** - 无限流动
6. **ScrollInfinityMirrors.vue** - 无限镜像
7. **ScrollPortalText.vue** - 传送门文字
8. **ScrollCrystalShatter.vue** - 水晶破碎

#### 其他创意类 (12个)

1. **ScrollReveal.vue** - 基础揭示
2. **ScrollSpiralReveal.vue** - 螺旋揭示
3. **ScrollGridMorph.vue** - 网格变形
4. **ScrollGeometricFlow.vue** - 几何流动
5. **ScrollMagneticOrbitCards.vue** - 磁吸轨道卡片
6. **ScrollHologramGallery.vue** - 全息画廊
7. **ScrollHologramText.vue** - 全息文字
8. **ScrollHolographicText.vue** - 全息文字高级
9. **ScrollPrismText.vue** - 棱镜文字
10. **ScrollFireText.vue** - 火焰文字
11. **ScrollThunderText.vue** - 雷电文字
12. **ScrollRainText.vue** - 雨水文字

---

## 🌌 三、背景/环境组件 (12个)

### 1. AuroraBorealis.vue
- **效果**: 北极光背景
- **特性**: 渐变光带流动
- **适用**: 自然主题、梦幻背景

### 2. NebulaVortex.vue
- **效果**: 星云漩涡
- **特性**: 粒子星云旋转
- **适用**: 宇宙主题

### 3. OceanWaves.vue
- **效果**: 海洋波浪
- **特性**: 正弦波叠加
- **适用**: 海洋、水主题

### 4. GradientFlow.vue
- **效果**: 渐变流动
- **特性**: 颜色渐变动画
- **适用**: 通用背景

### 5. CyberpunkCity.vue
- **效果**: 赛博城市
- **特性**: 建筑轮廓+霓虹
- **适用**: 未来都市

### 6. GalaxySpiral.vue
- **效果**: 银河螺旋
- **特性**: 螺旋星系
- **适用**: 天文主题

### 7. QuantumWormhole.vue
- **效果**: 量子虫洞
- **特性**: 隧道穿越
- **适用**: 科幻场景

### 8. VolcanicEruption.vue
- **效果**: 火山喷发
- **特性**: 粒子喷射
- **适用**: 能量爆发

### 9. Tornado.vue
- **效果**: 龙卷风
- **特性**: 螺旋上升
- **适用**: 风暴主题

### 10. LiquidWave.vue
- **效果**: 液体波浪
- **特性**: 流体波动
- **适用**: 液体背景

### 11. CircleMotion.vue
- **效果**: 圆形运动
- **特性**: 轨道旋转
- **适用**: 几何背景

### 12. RotatingRings.vue
- **效果**: 旋转环
- **特性**: 同心圆旋转
- **适用**: 加载、装饰

---

## 🎨 四、特殊功能组件 (10个)

### 1. ImageComparison.vue
- **功能**: 图片对比滑块
- **特性**: 左右拖动对比
- **适用**: 前后对比

### 2. GlassmorphismGallery.vue
- **功能**: 毛玻璃画廊
- **特性**: backdrop-filter
- **适用**: 现代UI

### 3. CircleGallery.vue
- **功能**: 圆形画廊
- **特性**: 环形排列
- **适用**: 循环展示

### 4. RotationCarousel.vue
- **功能**: 旋转让播
- **特性**: 360度旋转
- **适用**: 产品展示

### 5. ScaleShapes.vue
- **功能**: 缩放形状
- **特性**: 几何形缩放
- **适用**: 抽象艺术

### 6. ScaleWave.vue
- **功能**: 缩放松弛
- **特性**: 波浪式缩放
- **适用**: 节奏感

### 7. RotateScale.vue
- **功能**: 旋转缩放
- **特性**: 组合变换
- **适用**: 复合动画

### 8. ZoomPan.vue
- **功能**: 缩放平移
- **特性**: 类似地图操作
- **适用**: 大图浏览

### 9. TextDistortion.vue
- **功能**: 文字扭曲
- **特性**: 波形扭曲
- **适用**: 迷幻效果

### 10. TextReveal.vue
- **功能**: 文字揭示
- **特性**: 逐字显现
- **适用**: 标题动画

---

## 📚 五、辅助组件 (9个)

### 1. TextTypewriter.vue
- **效果**: 打字机
- **特性**: 逐字输入
- **适用**: 引言、标语

### 2. TextScroll.vue
- **效果**: 文字滚动
- **特性**: marquee效果
- **适用**: 跑马灯

### 3. Timeline.vue
- **效果**: 时间线
- **特性**: 垂直时间轴
- **适用**: 发展历程

### 4. StaggerGrid.vue
- **效果**: 交错网格
- **特性**: 网格交错入场
- **适用**: 作品集

### 5. MorphGrid.vue
- **效果**: 变形网格
- **特性**: 网格单元变形
- **适用**: 数据可视化

### 6. FadeInStack.vue
- **效果**: 淡入堆叠
- **特性**: 层级淡入
- **适用**: 内容分层

### 7. CollectionsModal.vue
- **效果**: 集合模态框
- **特性**: 弹窗展示
- **适用**: 详情查看

### 8. CircularProgress.vue
- **效果**: 圆形进度
- **特性**: 环形进度条
- **适用**: 加载、统计

### 9. NumberCounter.vue
- **效果**: 数字计数
- **特性**: 数字递增动画
- **适用**: 数据统计

---

## 🔧 六、技术实现要点

### 核心依赖
```json
{
  "gsap": "^3.12.0",
  "@vueuse/core": "^10.0.0",
  "vue": "^3.3.0"
}
```

### 常用GSAP插件
- **ScrollTrigger**: 滚动触发动画
- **TweenMax**: 补间动画
- **Timeline**: 时间轴控制
- **EasePack**: 缓动函数包

### 常用缓动函数
- `power2.out` - 标准减速
- `power3.out` - 强烈减速
- `elastic.out(1, 0.75)` - 弹性效果
- `back.out(1.7)` - 回弹效果
- `expo.out` - 指数减速
- `circ.out` - 圆形减速

### 性能优化策略
1. **will-change**: 提前声明动画属性
2. **transform + opacity**: 使用GPU加速属性
3. **ScrollTrigger批处理**: 批量创建触发器
4. **虚拟滚动**: 大数据量时使用
5. **防抖节流**: 滚动事件优化
6. **组件懒加载**: 按需导入组件

### 响应式设计
- 移动端简化动画
- 减少粒子数量
- 禁用复杂效果
- 触摸手势适配

---

## 💡 七、企业网站应用场景映射

### 首页英雄区
推荐组件:
- `TextTypewriter` - 打字机标题
- `MagneticButton` - CTA按钮
- `AuroraBorealis` / `GradientFlow` - 动态背景
- `ScrollReveal` - 内容揭示

### 关于我们
推荐组件:
- `Timeline` - 发展历程
- `NumberCounter` - 数据统计
- `ScrollElegantCards` - 团队介绍
- `FloatingImages` - 装饰元素

### 产品展示
推荐组件:
- `ScrollModernCards` - 产品卡片
- `Scroll3DGallery` - 3D展示
- `ImageComparison` - 前后对比
- `AccordionCards` - 特性展开

### 技术优势
推荐组件:
- `Cube3D` - 技术架构
- `ParticleExplosion` - 核心技术
- `ScrollNeonGlow` - 亮点强调
- `DNAHelix` - 创新理念

### 成功案例
推荐组件:
- `ScrollCarousel3D` - 案例轮播
- `ScrollStackGallery` - 案例堆叠
- `ScrollMinimalistCards` - 简洁展示
- `ImageParallax` - 场景深度

### 联系我们
推荐组件:
- `GlassmorphismGallery` - 联系卡片
- `LiquidButtons` - 提交按钮
- `MagneticButton` - 社交图标
- `ScrollFloatingNav` - 浮动客服

---

## 🎯 八、学习建议

### 初学者路径
1. 先掌握基础卡片组件 (15个)
2. 学习ScrollTrigger基本原理
3. 实践简单滚动组件 (20个)
4. 理解缓动函数和时序控制
5. 挑战复杂3D和粒子效果

### 进阶技巧
1. **组合动画**: 多个组件串联
2. **自定义缓动**: 创造独特节奏
3. **WebGL集成**: Three.js + GSAP
4. **性能调优**: 60fps流畅度
5. **无障碍设计**: 减少动画偏好

### 最佳实践
1. 始终清理ScrollTrigger实例
2. 使用gsap.context()管理作用域
3. 避免过度动画影响用户体验
4. 提供关闭动画的选项
5. 测试不同设备和浏览器

---

## 📊 九、组件索引速查

### 按字母顺序
```
AccordionCards, AuroraBorealis, BouncingBall, 
Card3DFlipGallery, CardStack, CascadeParallax, 
CircleGallery, CircleMotion, CircularProgress, 
CollectionsModal, Cube3D, CyberpunkCity, 
DiagonalParallax, DNAHelix, FadeInStack, 
FixedParallax, FlipCards, FloatingImages, 
FoldEffect, GalaxySpiral, GlassmorphismGallery, 
GradientFlow, Holographic3D, HorizontalScroll, 
HorizontalScrollCards, ImageComparison, ImageParallax, 
... (共321个)
```

### 按难度分级
- ⭐ 初级 (50个): 基础卡片、简单滚动
- ⭐⭐ 中级 (150个): 视差、3D、文字特效
- ⭐⭐⭐ 高级 (80个): 粒子、WebGL、复杂组合
- ⭐⭐⭐⭐ 专家 (41个): 量子效果、自定义Shader

---

## 🚀 十、快速开始示例

### 使用ScrollModernCards
```vue
<template>
  <div>
    <ScrollModernCards />
  </div>
</template>

<script setup>
import ScrollModernCards from './components/ScrollModernCards.vue'
</script>
```

### 自定义配置
```javascript
// 修改items数组来自定义内容
const items = [
  { symbol: '◯', name: 'Custom', tag: '自定义', value: 95 }
]
```

### 调整动画参数
```javascript
// 在组件内修改GSAP配置
gsap.to('.card', {
  duration: 1.2,        // 动画时长
  ease: 'power3.out',   // 缓动函数
  stagger: 0.15         // 交错延迟
})
```

---

## 📝 总结

这个包含**321个GSAP动画组件**的库为企业网站开发提供了丰富的视觉表现力。每个组件都经过精心设计，遵循现代Web动画最佳实践，可以直接应用于各类企业网站模块。

**核心价值**:
- ✅ 开箱即用，无需从零开发
- ✅ 高度可定制，灵活适配需求
- ✅ 性能优化，保证流畅体验
- ✅ 分类清晰，便于查找使用
- ✅ 文档完善，降低学习成本

**适用项目**:
- 企业官网
- 产品展示页
- 创意作品集
- 营销活动页
- SaaS产品落地页

---

*生成时间: 2026-05-16*  
*组件总数: 321个*  
*技术栈: Vue 3 + TypeScript + GSAP 3*
