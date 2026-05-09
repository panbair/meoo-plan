# 模板动画故障排除指南

## 问题描述
点击"编辑模板"或"查看模板"按钮后，没有看到动画效果。

## 已完成的修复

### 1. 创建路由配置
在 `src/router/index.ts` 中添加了两个新路由：
```typescript
{
  path: '/template-view',
  name: 'templateView',
  component: () => import('@/views/template/template-view/index.vue'),
  meta: { title: '查看模板' }
},
{
  path: '/template-edit',
  name: 'templateEdit',
  component: () => import('@/views/template/template-edit/index.vue'),
  meta: { title: '编辑模板' }
}
```

### 2. 创建查看页面
- 文件: `src/views/template/template-view/index.vue`
- 功能: 展示模板动画效果
- 特点: 自动加载动画，滚动查看效果

### 3. 创建编辑页面
- 文件: `src/views/template/template-edit/index.vue`
- 功能: 编辑模式下查看模板动画
- 特点: 支持重新加载动画、随机更换颜色

### 4. 创建模板函数索引
- 文件: `src/views/template/templateIndex.ts`
- 功能: 统一导出所有模板函数
- 解决: 修复了从 Vue 组件导入的问题

## 可能的问题和解决方案

### 问题 1: 动画没有显示

**原因**: GSAP 插件未正确注册或 ScrollTrigger 未刷新

**解决方案**:
1. 打开浏览器控制台 (F12)
2. 检查是否有错误信息
3. 确认 GSAP 和 ScrollTrigger 已正确加载

**检查代码**:
```javascript
// 在 templateFunctions.js 中
import gsap from 'gsap/dist/gsap.js'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'
```

### 问题 2: 路由跳转失败

**原因**: 路由配置不正确或文件路径错误

**解决方案**:
1. 确认路由已正确注册
2. 检查文件路径是否正确
3. 刷新浏览器缓存

**检查路由**:
- 访问 `/template` - 模板列表页
- 访问 `/template-view?templateView=threeDCardFlipAnimation` - 查看页面
- 访问 `/template-edit?templateView=threeDCardFlipAnimation` - 编辑页面

### 问题 3: 模板函数未找到

**原因**: templateFunctions 导入路径错误

**解决方案**:
```typescript
// ❌ 错误的导入方式
import { templateFunctions } from '../index'

// ✅ 正确的导入方式
import { templateFunctions } from '../templateIndex'
```

### 问题 4: DOM 元素未找到

**原因**: DOM 还未渲染完成就执行动画

**解决方案**:
所有模板函数都使用了 `waitForDOM` 辅助函数：
```javascript
const waitForDOM = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    setTimeout(callback, 0)
  }
}
```

## 测试步骤

### 1. 测试模板列表页
1. 访问 `http://localhost:端口/template`
2. 应该看到44个模板卡片
3. 每个卡片有"编辑模板"和"查看模板"按钮

### 2. 测试查看页面
1. 点击任意模板的"查看模板"按钮
2. 页面跳转到 `/template-view`
3. 应该看到5个面板，每个面板有不同的颜色
4. 向下滚动，应该看到动画效果

### 3. 测试编辑页面
1. 点击任意模板的"编辑模板"按钮
2. 页面跳转到 `/template-edit`
3. 应该看到5个面板和控制按钮
4. 点击"重新加载"按钮重新加载动画
5. 点击"随机颜色"按钮更换面板颜色

## 调试技巧

### 1. 打开浏览器控制台
```javascript
// 在浏览器控制台输入
console.log('当前模板:', route.query.templateView)
console.log('模板函数:', templateFunctions[route.query.templateView])
```

### 2. 检查 ScrollTrigger 实例
```javascript
// 在浏览器控制台输入
console.log('ScrollTrigger instances:', window.gsap.ScrollTrigger.getAll())
```

### 3. 检查 DOM 元素
```javascript
// 在浏览器控制台输入
console.log('Panels:', document.querySelectorAll('.panel'))
console.log('Animation Layer:', document.querySelector('.animation-layer'))
```

## 常见错误

### 错误 1: "template is not defined"
**原因**: 模板函数未正确导入

**解决**:
```typescript
// 确保导入了所有需要的函数
import { templateFunctions } from '../templateIndex'
```

### 错误 2: "ScrollTrigger is not defined"
**原因**: GSAP 插件未正确注册

**解决**:
```javascript
// 确保在 templateFunctions.js 中注册了插件
gsap.registerPlugin(ScrollTrigger)
```

### 错误 3: "querySelector returned null"
**原因**: DOM 元素不存在

**解决**:
- 检查 HTML 结构是否正确
- 确保使用了正确的 class 名称
- 等待 DOM 渲染完成

## 文件清单

```
src/views/template/
├── index.vue                      # 模板列表页
├── template-view/
│   └── index.vue                  # 查看页面 ✅ 新建
├── template-edit/
│   └── index.vue                  # 编辑页面 ✅ 新建
├── templateIndex.ts               # 模板函数索引 ✅ 新建
├── templateFunctions.js           # 模板函数实现
└── config-hover.js                # 悬停效果配置
```

## 下一步

如果问题仍然存在，请：

1. 检查浏览器控制台的错误信息
2. 确认所有依赖已正确安装
3. 重启开发服务器
4. 清除浏览器缓存

## 联系支持

如果问题仍未解决，请提供：
- 浏览器控制台的错误信息
- 操作步骤截图
- 项目版本信息

---

**更新日期**: 2026-03-22
**状态**: ✅ 已完成基础修复
**待测试**: ⏳ 需要在浏览器中测试
