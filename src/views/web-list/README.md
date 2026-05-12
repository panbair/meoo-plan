
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


# 动画效果：# 镜花水月 · 倒影微动视差

## 详细描述

图片悬浮于画面正中，底部带有精心制作的镜像倒影——倒影经垂直翻转、半透明虚化并附加极细的水纹扭曲。用户滚动页面时，主体图片极其缓慢地向上轻移，倒影以略快速度反向微沉，二者之间的缝隙随滚动发生微妙变化，仿佛画面正浮于静谧湖面之上。倒影层自身携带着持续低吟的水纹波动，涟漪在滚动中被轻微放大又收敛，整体仅以几像素的幅度变化，构成克制而高级的镜花水月之境。

## 动画亮点

- 图片拆分为主体层与倒影层（CSS 伪元素或独立元素），倒影使用 `scaleY(-1)`、`opacity: 0.3`、`filter: blur(2px)` 初始化，`ScrollTrigger` 通过 `scrub` 驱动主体 `translateY` 系数 0.08（向上），倒影 `translateY` 系数 -0.15（向下），产生缝隙呼吸感。
- 倒影叠加 SVG `feTurbulence` 滤镜，GSAP 联动 `ScrollTrigger` 进度微调 `baseFrequency`（0.01 → 0.015），使水纹在滚动中轻微增强，产生涟漪扩散的潜暗示。
- 倒影底部边缘叠加极淡的渐变遮罩，模拟水深的自然消退，随倒影下沉而略微加深。
- 全局保持宁静，所有运动幅度不超过 6px，仅在持续滚动中累积出无声的液态漂浮质感。


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


