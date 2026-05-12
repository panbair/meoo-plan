
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-img）里面开发图片组件，酷炫的图片组件，震撼图片组件

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-img）里面的组件，不要创建重复了，不能覆盖已经有的组件。

## 代码严格符合vue3组件开源规范

# 注意获取元素要用vue3的方式 ref获取dom
# gsap获取元素要用vue3的方式，如果直接用classname,有重复classname可能会造成冲突， 比如：tl.fromTo('.header-badge'）,tl.to('.header-badge'）等，都是不行的


#  图片地址到这里取：https://images.unsplash.com
## 比如：https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80

## 组件宽高都是:
height: 100vh;
width: 100vw;

## 组件ui设计风格：不要灰色，阴沉。


## 内容要根据组件宽高设计

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

### 文件结构

```
card-img/
└── CardImgXxxx/
    └── CardImgXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用


# 动画效果：# 砚池墨雨 · 多点晕染径向展开

## 详细描述
素白宣纸上，图片以隐形墨色潜伏。Timeline 启动后，画面中五至七个随机位置同时落入无形墨滴，各自向外不规则晕染扩散。多重墨圈边缘彼此渗透、交融，形成浓淡相生的墨层叠加，图像随墨色同步渐显。墨圈汇合处出现短暂的色阶渐变和水渍融痕，最终所有墨域融合为完整画面。整体呈现墨雨洒落、自然融合的东方艺术感。

## 动画亮点
- 图片上覆多个独立的 SVG 或 DOM 圆形遮罩，位置随机分布，GSAP 驱动各自半径从零扩散至覆盖全图，`duration: 2s`，`stagger: 0.1`。
- 每个遮罩边缘携带 `feTurbulence` 扰动，GSAP 分别控制 `baseFrequency` 和扩散曲线，使边缘毛绒且不规则。
- 图像显现随遮罩重叠程度同步，使用 `opacity` 和 `filter: brightness()` 联动，融合区浓度自然加深。
- 墨圈接合时生成细短墨丝伪元素，沿切线方向短暂延展后消失，模拟纤维导墨。
- 完成后全图亮度微降，边缘残留极淡水渍环痕，增强宣纸触感。



## 元素要完全进入屏幕后开始，在元素完全离开后结束

### ScrollTrigger 参数说明

| 参数 | 值              | 说明 |
|------|----------------|------|
| `trigger` | `parent`       | 触发器元素 |
| `start` | `'top 100%'`   | 元素顶部到达视口top 100%时开始 |
| `end` | `'bottom 20%'` | 元素顶部到达视口bottom 20%时结束 |
| `scrub` | `1.5`          | 平滑系数，值越大动画越平滑 |


### ScrollTrigger的start，end参数根据实际情况来定义。
黄金法则：
重要内容：start: 'top 75%' （提前展示）
一般内容：start: 'top 80-85%' （标准触发）
补充内容：start: 'top 90%' （接近才触发）
scrub值：1-2秒 平衡流畅度和响应性


### 动画清理
let cleanupFns: TweenCleanup[] = []

1 保存清理函数

2 组件卸载时清理动画,这个组件所有gsap动画全部清理掉.

3 检查一下组件的 onUnmounted 清理逻辑，看看是否正确清理了 ScrollTrigger 和其他动画。有的就处理。


