# CardTextCrystal 组件

时空晶体重构 · 多维碎片叙事动画组件 - 超现实晶体生长动画方案

## 特性

- **字符级碎片化与逆熵重聚**: 字符分解为几何碎片，非线性引力牵引回归
- **接触闪光与能量环溅射**: 碎片嵌入瞬间的微闪光和能量环涟漪
- **三维景深与玻璃质感**: Z轴变换和模糊度变化
- **柔性斥力场**: 碎片间自动错开的智能轨迹
- **鼠标引力透镜**: 碎片受鼠标引力扰动
- **暗物质背景流**: 暗紫色动态粒子场
- **呼吸光晕**: 文字周围持续脉动的光效
- **晶格锁定与解离**: 卡片进出视口的重组动画

## 使用示例

```vue
<CardTextCrystal
  title="CRYSTAL"
  subtitle="时空重构"
  :paragraphs="['探索未来的无限可能，创造美好的明天。']"
  @animation-start="onStart"
  @animation-complete="onComplete"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | 'CRYSTAL' | 主标题 |
| subtitle | string | '' | 副标题 |
| paragraphs | string[] | [] | 段落内容 |
| animationDuration | number | 2.0 | 动画时长(秒) |
| staggerDelay | number | 0.1 | 交错延迟(秒) |
| fragmentCount | number | 40 | 每个字符的碎片数 |
| fontSize | string | 'clamp(2.5rem, 8vw, 5rem)' | 字体大小 |
| fontWeight | number | 600 | 字重 |
| enableMouseGravity | boolean | true | 是否启用鼠标引力 |
| autoPlay | boolean | true | 是否自动播放 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-complete | - | 动画完成时触发 |
| scroll-progress | progress: number | 滚动进度(0-1) |
