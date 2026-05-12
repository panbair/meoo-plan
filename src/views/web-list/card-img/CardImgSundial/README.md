# CardImgSundial · 日晷移影

## 效果概述

图片如一枚古老的日晷盘面，初始静置于深色石台之上，画面微微侧倾约 3°，仿佛被漫长岁月推移了原位，同时完全透明、不可见。一束虚拟的午后斜光从画面右上方投射而下。Timeline 驱动日晷开始极缓慢地绕垂直轴顺时针回旋，旋转过程中画面从完全透明渐次显影，如同光在缓慢移动中逐层照亮了晷面的刻度。当旋转抵达归正位置的瞬间——不多不少恰是它原本应指向的角度——画面完全凝实为清晰影像。

## 核心特性

### 初始状态
- `opacity: 0`，`rotateZ: -3deg`
- 图片微微侧倾，营造被时间推移偏离的微妙感
- 日晷指针阴影完全隐藏

### GSAP Timeline 动画
| 属性 | 初始值 | 终止值 | 时长 | 缓动 |
|------|--------|--------|------|------|
| opacity | 0 | 1 | 2s | sine.inOut |
| rotateZ | -3deg | 0deg | 2s | sine.inOut |
| scale | 0.95 | 1 | 2s | sine.inOut |

### 视觉元素
- **午后斜光**：右上方伪元素半透明渐变，`opacity` 随动画从 0 升至 0.15
- **日晷指针阴影**：画面正中极细三角形，在旋转归零瞬间显现
- **刻度装饰**：12 个刻度环绕圆盘，3 的倍数刻度更长
- **中心轴点**：金色光晕圆点

## ScrollTrigger 配置

```javascript
{
  trigger: parentRef.value,
  start: 'top 100%',
  end: 'bottom 20%',
  scrub: 1.5
}
```

## 文件结构

```
CardImgSundial/
├── CardImgSundial.vue    # 组件源码
└── README.md             # 本文档
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
