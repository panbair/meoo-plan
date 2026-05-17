# 🧪 AI接口调用测试指南

## 📋 概述

本文档帮助您验证AI接口是否正确调用，并提供详细的调试方法。

---

## 🔍 如何确认AI接口被调用

### 方法一：查看浏览器控制台日志 ⭐ 推荐

1. **打开浏览器开发者工具**
   - Windows/Linux: 按 `F12` 或 `Ctrl+Shift+I`
   - Mac: 按 `Cmd+Option+I`
   - 或者右键页面 → "检查"

2. **切换到 Console（控制台）标签**

3. **配置AI API**（如果还没配置）
   - 点击右上角"⚙️ 配置AI"按钮
   - 输入API密钥并保存

4. **生成方案**
   - 填写表单信息
   - 点击"🚀 生成智能方案"按钮

5. **观察控制台输出**

---

## ✅ 成功的日志标志

如果AI接口被正确调用，您会看到以下日志：

### 1. 配置阶段
```
✅ AI服务已配置: qwen
```
或
```
✅ AI服务已从本地存储加载: qwen
```

### 2. 开始生成
```
🚀 开始调用AI API生成方案...
📝 用户需求: {
  websiteType: "corporate",
  industry: "tech",
  visualStyle: "tech",
  modules: ["hero", "about", "products"]
}
```

### 3. AI服务内部日志
```
🎯 ========== 开始生成网站方案 ==========
用户需求: {...}

📝 系统提示词长度: 3500 字符
📝 用户提示词长度: 800 字符

🔧 AI服务配置: {
  provider: "qwen",
  model: "qwen-max",
  baseUrl: "https://dashscope.aliyuncs.com/api/v1",
  hasApiKey: true
}

📤 发送AI请求...
模型: qwen-max
消息数量: 2
Temperature: 0.8
Max Tokens: 4000
```

### 4. 收到响应
```
📥 收到AI响应
响应状态: 200
Token使用: {
  prompt_tokens: 4300,
  completion_tokens: 2500,
  total_tokens: 6800
}

✅ AI返回成功
响应内容长度: 5000 字符

🔍 开始解析AI响应...
提取的JSON字符串长度: 4800 字符

✅ JSON解析成功
方案数量: 3
分析内容: 基于您的需求分析，我们为您生成了3套不同风格的方案...

✅ AI方案生成成功！
📊 生成了 3 套方案

📊 AI分析: 基于您的需求分析...
💡 AI建议: [...]
```

---

## ❌ 失败的日志标志

### 情况1: 未配置API密钥
```
⚠️ 未配置API密钥，将使用本地模拟模式
💡 请在页面右上角点击"配置AI"按钮设置API密钥

使用本地模拟模式生成方案...
```

**解决方案**: 配置API密钥

---

### 情况2: API调用失败
```
❌ AI聊天请求失败:
错误类型: AxiosError
错误消息: Request failed with status code 401
HTTP状态: 401
响应数据: {
  error: {
    message: "Invalid API key",
    code: "invalid_api_key"
  }
}

❌ 方案生成失败: Error: Invalid API key
```

**常见错误代码**:
- `401` - API密钥无效
- `403` - 权限不足或未开通服务
- `429` - 请求频率超限
- `500` - 服务器内部错误
- `Network Error` - 网络连接问题

---

### 情况3: JSON解析失败
```
✅ AI返回成功
响应内容长度: 3000 字符

🔍 开始解析AI响应...
❌ 解析AI响应失败: SyntaxError: Unexpected token...
原始响应内容: 抱歉，我无法...

⚠️ 使用降级方案（本地模拟数据）
```

**原因**: AI返回的内容不是有效的JSON格式

**解决方案**: 
- 检查提示词是否正确
- 尝试更换模型
- 系统会自动降级到本地模拟模式

---

## 🔧 调试步骤

### 第1步: 确认API配置

在控制台输入：
```javascript
// 检查localStorage中的配置
console.log(JSON.parse(localStorage.getItem('ai-api-config')))

// 应该输出类似：
// {
//   provider: "qwen",
//   apiKey: "sk-xxxxx...",
//   baseUrl: "",
//   model: ""
// }
```

### 第2步: 手动测试API调用

在控制台输入：
```javascript
// 导入AI服务（需要在模块环境中）
import { aiService } from '@/api/ai'

// 测试简单对话
aiService.chat({
  messages: [
    { role: 'user', content: '你好' }
  ]
}).then(result => {
  console.log('测试结果:', result)
})
```

### 第3步: 检查网络请求

1. 打开开发者工具的 **Network（网络）** 标签
2. 筛选 `fetch` 或 `XHR` 请求
3. 生成方案时，查找 `/chat/completions` 请求
4. 查看请求详情：
   - **Headers**: 检查Authorization头
   - **Payload**: 检查发送的数据
   - **Response**: 检查返回的数据

---

## 📊 各平台的典型响应

### 通义千问 (Qwen)

**请求URL**: 
```
POST https://dashscope.aliyuncs.com/api/v1/chat/completions
```

**请求头**:
```
Authorization: Bearer sk-xxxxxxxx
Content-Type: application/json
```

**成功响应** (HTTP 200):
```json
{
  "output": {
    "choices": [{
      "message": {
        "role": "assistant",
        "content": "{...JSON内容...}"
      }
    }]
  },
  "usage": {
    "prompt_tokens": 4300,
    "completion_tokens": 2500,
    "total_tokens": 6800
  }
}
```

---

### DeepSeek

**请求URL**: 
```
POST https://api.deepseek.com/v1/chat/completions
```

**成功响应** (HTTP 200):
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{...JSON内容...}"
    }
  }],
  "usage": {
    "prompt_tokens": 4300,
    "completion_tokens": 2500,
    "total_tokens": 6800
  }
}
```

---

### OpenAI

**请求URL**: 
```
POST https://api.openai.com/v1/chat/completions
```

**成功响应** (HTTP 200):
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{...JSON内容...}"
    }
  }],
  "usage": {
    "prompt_tokens": 4300,
    "completion_tokens": 2500,
    "total_tokens": 6800
  }
}
```

---

## 🐛 常见问题排查

### Q1: 控制台没有任何AI相关日志？

**可能原因**:
1. 没有配置API密钥
2. 代码没有正确加载
3. 使用了本地模拟模式

**解决方法**:
```javascript
// 在控制台检查
console.log('API配置:', localStorage.getItem('ai-api-config'))
console.log('环境变量:', import.meta.env.VITE_AI_API_KEY)
```

---

### Q2: 看到"使用本地模拟模式"？

**原因**: 未检测到API密钥

**解决方法**:
1. 点击右上角"配置AI"
2. 输入有效的API密钥
3. 保存后刷新页面重试

---

### Q3: API返回401错误？

**原因**: API密钥无效

**解决方法**:
1. 检查密钥是否正确复制（没有多余空格）
2. 确认密钥未过期
3. 在AI平台控制台重新创建密钥
4. 更新配置

---

### Q4: API返回403错误？

**原因**: 权限不足或服务未开通

**解决方法**:
1. 登录AI平台控制台
2. 确认已开通相应服务
3. 确认账户有足够余额
4. 检查是否有IP限制

---

### Q5: Network Error？

**原因**: 网络连接问题

**解决方法**:
1. 检查网络连接
2. 确认可以访问AI平台（可能需要科学上网）
3. 检查防火墙设置
4. 尝试切换网络

---

### Q6: JSON解析失败？

**原因**: AI返回的内容格式不正确

**解决方法**:
1. 查看原始响应内容
2. 尝试降低temperature参数
3. 简化提示词
4. 更换模型
5. 系统会自动降级到本地模式

---

## 📝 完整的测试流程

### 测试清单

- [ ] 1. 打开浏览器控制台
- [ ] 2. 配置AI API密钥
- [ ] 3. 看到"✅ AI服务已配置"日志
- [ ] 4. 填写表单信息
- [ ] 5. 点击"生成智能方案"
- [ ] 6. 看到"🚀 开始调用AI API"日志
- [ ] 7. 看到"📤 发送AI请求"日志
- [ ] 8. 看到"📥 收到AI响应"日志
- [ ] 9. 看到"✅ JSON解析成功"日志
- [ ] 10. 看到"✅ AI方案生成成功"日志
- [ ] 11. 页面显示3套方案

如果所有步骤都通过，说明AI接口调用成功！✅

---

## 💡 优化建议

### 1. 减少日志噪音

生产环境可以关闭详细日志：

```typescript
// 在 ai.config.ts 中添加
const DEBUG = import.meta.env.DEV

if (!DEBUG) {
  console.log = () => {} // 禁用日志
}
```

### 2. 添加性能监控

```typescript
const startTime = performance.now()
const result = await aiService.generateSolution(request)
const endTime = performance.now()
console.log(`⏱️ AI调用耗时: ${endTime - startTime}ms`)
```

### 3. 错误上报

```typescript
if (!response.success) {
  // 上报错误到监控系统
  reportError('AI_API_ERROR', {
    provider: config.provider,
    error: response.error
  })
}
```

---

## 📞 需要帮助？

如果按照以上步骤仍然无法确认AI接口调用：

1. **截图控制台日志**
   - 包含所有彩色日志
   - 包含任何错误信息

2. **检查Network标签**
   - 找到 `/chat/completions` 请求
   - 截图请求和响应

3. **提供以下信息**
   - 使用的AI提供商
   - 浏览器版本
   - 错误消息（如果有）

4. **联系方式**
   - GitHub Issues
   - Email: support@example.com

---

**祝您测试顺利！** 🎉
