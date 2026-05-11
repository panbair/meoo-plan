# CardTextCyber - 数据流解压 · 赛博信息实体化

## 简介

这是一个赛博朋克风格的数据终端动画组件，模拟全息数据终端的视觉环境。文字从乱码逐渐"解压"为可读信息，配合垂直数据流和扫描线效果。

## 特性

- 字符级乱序到有序过渡，高速刷新模拟解密
- 全局取样扫描线与滚动同步
- 垂直数据流粒子背景
- 解压完成后冷绿磷光效果
- CRT 信号干扰鼠标效果

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'CYBER'` | 主标题 |
| `subtitle` | `string` | `''` | 副标题 |
| `paragraphs` | `string[]` | `[]` | 段落内容 |
| `glowColor` | `string` | `'#00ff88'` | 磷光颜色 |
| `scanSpeed` | `number` | `1.5` | 扫描速度 |

## 使用示例

```vue
<CardTextCyber
  title="CYBER"
  subtitle="DATA DECRYPTION"
  :paragraphs="['探索未来的无限可能']"
  glowColor="#00ff88"
/>
```
