# 📦 导出组件源码功能说明

## ✨ 功能概述

现在点击"📥 导出完整方案"按钮，不仅会导出方案配置，还会自动收集并导出所有推荐组件的源代码！

---

## 🎯 使用方法

### 第1步：生成方案

1. 填写网站需求信息
2. 选择视觉风格
3. 选择功能模块
4. 设置性能预算
5. 点击"🚀 生成智能方案"

### 第2步：查看方案

在生成的3套方案中，选择您最喜欢的一套（点击标签页切换）

### 第3步：导出方案

点击底部的 **"📥 导出完整方案"** 按钮

系统会自动：
1. 收集当前方案中的所有组件名称
2. 从 web-list 目录加载这些组件的源代码
3. 打包成 JSON 文件
4. 下载到您的电脑

---

## 📁 导出的文件内容

导出的 JSON 文件包含以下部分：

### 1. 元数据 (metadata)
```json
{
  "exportTime": "2026-05-17T10:30:00.000Z",
  "generatorVersion": "1.0.0",
  "totalComponents": 12,
  "failedComponents": []
}
```

### 2. 需求信息 (requirements)
您填写的所有表单数据

### 3. 方案详情 (solution)
完整的方案配置，包括：
- 方案名称、描述
- 性能评级、复杂度
- 各模块的组件推荐
- 配色方案

### 4. 组件源码 (components) ⭐ 核心功能
```json
{
  "ScrollModernCards": "<template>...</template><script>...</script><style>...</style>",
  "AccordionCards": "<template>...</template><script>...</script><style>...</style>",
  "MagneticButton": "...",
  ...
}
```

每个组件都包含完整的 Vue 单文件组件代码！

### 5. 使用说明 (usage)
如何在项目中使用这些组件的详细指南

---

## 💡 使用导出的组件

### 步骤1：解压文件

下载的 JSON 文件可以直接用文本编辑器打开查看。

### 步骤2：提取组件代码

从 JSON 文件中复制需要的组件源码，例如：

```javascript
// 从 components 字段复制 ScrollModernCards 的代码
const scrollModernCardsCode = exportData.components.ScrollModernCards
```

### 步骤3：创建组件文件

在您的项目中创建 `.vue` 文件：

```
src/components/ScrollModernCards.vue
```

粘贴复制的组件代码。

### 步骤4：导入并使用

```vue
<template>
  <div>
    <ScrollModernCards :data="cardsData" />
  </div>
</template>

<script setup>
import ScrollModernCards from './components/ScrollModernCards.vue'

const cardsData = [
  { title: '卡片1', content: '...' },
  { title: '卡片2', content: '...' }
]
</script>
```

---

## 🔍 工作原理

### 组件加载流程

```
用户点击导出
    ↓
收集方案中的组件名称
    ↓
遍历 web-list 目录
    ↓
查找匹配的 .vue 文件
    ↓
读取文件内容（源码）
    ↓
缓存到内存
    ↓
打包到 JSON
    ↓
下载文件
```

### 优化的预加载机制

为了提升性能，系统在页面加载时会：

1. **扫描所有组件**
   - 遍历 `src/views/web-list/**/**/*.vue`
   - 建立组件名到文件路径的映射

2. **预加载到缓存**
   - 使用 `import.meta.glob` 异步加载
   - 存储在 `componentSourceCache` Map 中

3. **快速检索**
   - 导出时直接从缓存获取
   - 无需再次读取文件系统

---

## 📊 示例输出

假设您生成了一个科技公司官网方案，导出的文件可能包含：

```json
{
  "metadata": {
    "exportTime": "2026-05-17T10:30:00.000Z",
    "generatorVersion": "1.0.0",
    "totalComponents": 8,
    "failedComponents": []
  },
  "requirements": {
    "websiteType": "corporate",
    "industry": "tech",
    "companyName": "未来科技",
    ...
  },
  "solution": {
    "name": "方案B - 平衡优化版",
    "icon": "⚖️",
    "badge": "推荐",
    "modules": [
      {
        "name": "首页英雄区",
        "components": [
          { "name": "TextTypewriter", "type": "文字动画", "purpose": "打字机标题" },
          { "name": "AuroraBorealis", "type": "背景效果", "purpose": "极光背景" },
          { "name": "MagneticButton", "type": "交互按钮", "purpose": "CTA按钮" }
        ]
      },
      ...
    ]
  },
  "components": {
    "TextTypewriter": "<template>\n  <div class=\"typewriter\">\n    ...\n  </div>\n</template>\n\n<script setup>\n...\n</script>\n\n<style scoped>\n...\n</style>",
    "AuroraBorealis": "...",
    "MagneticButton": "...",
    ...
  },
  "usage": {
    "title": "组件使用说明",
    "steps": "..."
  }
}
```

---

## ⚠️ 注意事项

### 1. 组件可能找不到

如果某些组件未找到，会在 `failedComponents` 列表中显示。

**原因**:
- 组件名称拼写错误
- 组件不在 web-list 目录中
- 组件文件结构不符合预期

**解决**:
- 检查组件名称是否正确
- 手动从项目中复制该组件
- 联系开发团队添加缺失组件

### 2. 文件大小

包含多个组件源码的 JSON 文件可能较大（几百KB到几MB）。

**建议**:
- 使用代码编辑器查看（如 VS Code）
- 可以使用 JSON 格式化工具美化输出

### 3. 依赖关系

某些组件可能依赖其他文件或库：

- GSAP 动画库
- 外部图片资源
- 工具函数

**使用前请确保**:
```bash
npm install gsap
```

并在组件中正确导入。

---

## 🎨 高级用法

### 批量提取组件

使用脚本自动提取所有组件：

```javascript
// extract-components.js
const fs = require('fs')
const exportData = JSON.parse(fs.readFileSync('website-solution.json', 'utf-8'))

// 创建 components 目录
if (!fs.existsSync('./components')) {
  fs.mkdirSync('./components')
}

// 提取每个组件
Object.entries(exportData.components).forEach(([name, code]) => {
  const filePath = `./components/${name}.vue`
  fs.writeFileSync(filePath, code, 'utf-8')
  console.log(`✅ 已提取: ${name}`)
})

console.log(`\n🎉 共提取 ${Object.keys(exportData.components).length} 个组件`)
```

运行：
```bash
node extract-components.js
```

### 自动生成导入语句

```javascript
// 生成导入代码
const imports = Object.keys(exportData.components)
  .map(name => `import ${name} from './components/${name}.vue'`)
  .join('\n')

console.log(imports)
```

输出：
```vue
import TextTypewriter from './components/TextTypewriter.vue'
import AuroraBorealis from './components/AuroraBorealis.vue'
import MagneticButton from './components/MagneticButton.vue'
...
```

---

## 📝 常见问题

### Q1: 为什么有些组件没找到？

A: 可能原因：
- 组件名称不匹配
- 组件不在 web-list 目录
- 文件命名不规范

检查控制台日志查看具体哪些组件失败。

### Q2: 可以只导出部分组件吗？

A: 目前会导出方案中引用的所有组件。如需选择性导出，可以：
1. 导出完整方案
2. 手动从 JSON 中删除不需要的组件
3. 保存文件

### Q3: 导出的代码可以直接使用吗？

A: 大部分情况下可以，但需要注意：
- 安装必要的依赖（如 GSAP）
- 检查是否有外部资源引用
- 根据项目结构调整导入路径

### Q4: 如何更新组件源码？

A: 
1. 修改 web-list 目录中的源文件
2. 刷新页面（重新加载组件缓存）
3. 重新导出方案

---

## 🚀 未来改进

计划添加的功能：

- [ ] 导出为 ZIP 压缩包（包含文件夹结构）
- [ ] 自动生成 package.json
- [ ] 包含 README 文档
- [ ] 支持自定义组件库
- [ ] 在线预览组件效果
- [ ] 一键部署到 CodeSandbox

---

## 📞 需要帮助？

如有问题或建议：

1. **查看控制台日志**
   - 按 F12 打开开发者工具
   - 查看详细的加载过程

2. **提交 Issue**
   - GitHub Issues
   - 描述问题和复现步骤

3. **联系开发团队**
   - Email: support@example.com

---

**祝您使用愉快！** 🎉
