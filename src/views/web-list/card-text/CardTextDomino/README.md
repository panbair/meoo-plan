# CardTextDomino - 多米诺骨牌·连锁显字

桌面横陈，文字由成排的立体骨牌紧密堆砌，初始全部直立如黑色矮墙。连锁反应沿笔画迅速传播，骨牌依次倒下，文字如白色浅浮雕完整浮现。

## 动画特点

- **立体骨牌**: CSS 3D 实现厚度与阴影效果
- **连锁反应**: Timeline 驱动骨牌依次倾倒
- **物理回馈**: 触底弹跳 + 轻微滑移
- **反射阴影**: 桌面反射随骨牌倒伏实时偏移
- **Hover还原**: 鼠标划过可将局部骨牌重新立起

## 技术实现

- Vue 3 Composition API + TypeScript
- GSAP 动画引擎 + ScrollTrigger
- CSS 3D Transform (perspective, rotateX, translateZ)
- Timeline stagger 连锁效果
- 物理弹性动画 (elastic.out)

## 使用示例

```vue
<template>
  <CardTextDomino 
    title="连锁反应" 
    subtitle="倒下的艺术 · 秩序的崩塌"
    :tile-size="20"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '连锁反应' | 标题文字 |
| subtitle | string | '倒下的艺术 · 秩序的崩塌' | 副标题 |
| tileSize | number | 20 | 骨牌尺寸 (px) |

## 动画流程

1. **入场**: 骨牌全部直立
2. **触发**: 首个骨牌开始倾倒
3. **连锁**: 相邻骨牌依次倒下
4. **弹跳**: 触底产生物理回馈
5. **显现**: 骨牌顶面显示文字
6. **Hover**: 鼠标划过重新立起
