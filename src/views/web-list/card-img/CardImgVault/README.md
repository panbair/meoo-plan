# CardImgVault · 锁芯旋入

## 效果概述

图片如同一扇精密保险箱的厚重柜门，初始完全不可见——并非被遮罩遮挡，而是自身处于纯黑之中，同时绕画面中心极轻微地逆时针偏转约 2.5°，仿佛密码锁盘尚未拨至正确刻度。Timeline 驱动无形开锁机制启动：画面从纯黑中极缓地淡出显现，同时绕中心顺时针微微回旋，如同锁盘被一只经验丰富的手稳准拨动。旋转与淡入严格同步——每一丝角度的回正都释放出相应比例的可见度，角度归零的瞬间透明度恰好达到满值。归零刹那，画面中心闪过一道极细的十字光标线，旋即消失，象征密码正确、柜门开启、内容安全呈现。

## 核心特性

### 初始状态
- `opacity: 0`，`rotateZ: -2.5deg`
- `transformOrigin: center center`
- 模拟密码盘未归位的微偏状态

### GSAP Timeline 动画
| 属性 | 初始值 | 终止值 | 时长 | 缓动 |
|------|--------|--------|------|------|
| opacity | 0 | 1 | 2.2s | power3.inOut |
| rotateZ | -2.5deg | 0deg | 2.2s | power3.inOut |

### 视觉元素
- **十字光标**：归零瞬间闪现 0.15s，`opacity` 跳至 0.6 后渐隐消失
- **锁芯装饰**：圆形锁环 + 中心点，强化保险箱意象
- **金属柜门阴影**：四角内阴影，低频呼吸动画

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
CardImgVault/
├── CardImgVault.vue    # 组件源码
└── README.md           # 本文档
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
