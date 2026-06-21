
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

#  深入分析需求，发挥你的创造力和想象力，开发出酷炫的图片组件，震撼图片组件，具有强烈视觉冲击力的图片组件。

# 在这个文件（meoo-plan/src/views/web-list/card-scroll）里面开发图片组件，酷炫的图片组件，震撼图片组件

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-scroll）里面的组件，不要创建重复了，不能覆盖已经有的组件。

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
card-scroll/
└── CardScrolleXxxx/
    └── CardScrollXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用


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


# 开发下面内容

当前屏幕全屏一张图片，用户竖滚，一张图片随着滚动向上移动，用户继续滚，图片随着滚动继续向上移动， 接下来三张以此类推，四张一字排开，4张图片刚好铺满屏幕，图片之间的间隔30px，要看到图片从底部向上移动的过程。


