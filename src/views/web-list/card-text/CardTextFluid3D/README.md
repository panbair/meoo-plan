# CardTextFluid3D - 立体涡流·3D文字流体剧场

深色液体介质中，文字以立体几何体形态悬浮于不同深度层。一股三维涡流螺旋推进，每个立体字符沿其独立流线运动。

## 动画特点

- **真3D体感**: 使用 `transform: perspective()` 及多轴旋转，每个字符独立控制 rotateX/Y/Z
- **三维涡流**: 从左下向右上螺旋推进，字符沿流线运动
- **深度漂移**: translateZ 动态偏移，近大远小增强纵深感
- **鼠标湍流**: 鼠标划过后产生局部湍流，字符围绕光标翻转
- **液体阻力**: 松手后字符缓慢恢复，产生粘稠液体阻力感
- **焦散效果**: 模拟光在水体中折射的动态效果

## 技术实现

- Vue 3 Composition API
- GSAP 动画引擎 (elastic 缓动)
- ScrollTrigger 滚动动画
- CSS 3D Transform
- CSS 滤镜与混合模式

## 使用示例

```vue
<template>
  <CardTextFluid3D 
    title="立体涡流" 
    subtitle="三维空间 · 流体剧场"
    :fluid-intensity="1"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '立体涡流' | 标题文字 |
| subtitle | string | '三维空间 · 流体剧场' | 副标题 |
| fluidIntensity | number | 1 | 流体强度 (0-2) |

## 交互

- **鼠标移动**: 产生局部湍流，字符围绕光标翻转
- **鼠标按下拖动**: 增强湍流效果，字符沿深度方向移动
- **鼠标释放**: InertiaPlugin 接管衰减，缓慢恢复
