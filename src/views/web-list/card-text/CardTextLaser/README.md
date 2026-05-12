# CardTextLaser - 激光动态蚀刻 · 工业精密文字

## 简介

这是一个工业精密风格的文字动画组件，模拟高能激光在拉丝金属表面蚀刻文字的过程。激光焦点沿字符路径移动，迸射火花，熔融金属隆起，最终白炽光冷却为哑光磨砂纹理。

## 特性

- 激光焦点沿 SVG 路径精确移动
- 火花粒子从焦点实时喷射
- 笔画烧灼动画，drawSVG 描边
- 颜色白炽→冷却橙→暗金过渡
- 鼠标悬停余温效果
- 金属拉丝纹理背景

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'LASER'` | 主标题 |
| `subtitle` | `string` | `''` | 副标题 |
| `paragraphs` | `string[]` | `[]` | 段落内容 |
| `accentColor` | `string` | `'#ff6b35'` | 强调色 |
| `autoPlay` | `boolean` | `true` | 自动播放 |

## 使用示例

```vue
<CardTextLaser
  title="LASER"
  subtitle="PRECISION ENGINEERING"
  :paragraphs="['探索未来的无限可能']"
  accentColor="#ff6b35"
/>
```
