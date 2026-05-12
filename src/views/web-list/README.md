
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


# 动画效果：# 镜湖倒影 · 涟漪视差映像

## 详细描述

背景由一幅经典风景摄影与它的水面倒影构成，画面被水平中线精确分割。上半部是真实景物的原色影像，下半部是经过倒转、略微压暗并附加波纹扭曲的倒影层。用户滚动时，真实景物层以极缓速度向下漂移，而倒影层以差异化速度向上浮升，二者在中线处产生微弱的错位，仿佛水深正在微妙变化。倒影层自身持续经历低频波动——细密的水纹在表面缓缓滑过，产生非均匀的拉伸与挤压。鼠标移动时，光标所触之处激起一圈圈扩散的圆形涟漪，打破倒影的平静，水纹从光标处向外传播并逐渐衰减。整体色调随滚动在晨曦的金粉与午后的清蓝之间轻柔过渡。

## 动画亮点

- 背景拆分为真实层与倒影层，使用 `position: fixed` 分置，`ScrollTrigger` 驱动真实层 `translateY` 系数 0.04，倒影层系数 -0.1，产生上下逆向的视差错层。
- 倒影层叠加 SVG `feDisplacementMap` 滤镜，GSAP 控制其 `scale` 与 `baseFrequency` 以低频正弦波变动，模拟水纹的持续波动。
- 鼠标 `quickTo` 以点击或悬停位置为中心，驱动一圈 `scale` 从 0 到 3、`opacity` 从 0.6 到 0 的涟漪环快速扩散，同时局部扭曲度瞬间增强后衰减。
- 涟漪交互使用 `Physics2D` 风格的推力衰减函数，多个涟漪可叠加，形成自然水面扰动。
- 色调过渡由 GSAP 驱动 `filter: hue-rotate()` 和 `brightness()` 随滚动进度缓慢偏移，强化晨曦到午后时间流动的隐喻。





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


