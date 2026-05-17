# 🌐 网络问题排查指南

## ❌ 当前问题

**错误**: `AxiosError: Network Error`

**原因**: 浏览器的跨域限制（CORS）阻止了直接访问通义千问API

---

## ✅ 已实施的解决方案

### 方案：Vite代理配置

我已经为您配置了Vite开发服务器代理，将AI API请求通过本地服务器转发。

**配置位置**: `vite.config.ts`

```typescript
proxy: {
  '/ai-proxy': {
    target: 'https://dashscope.aliyuncs.com',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/ai-proxy/, '/api/v1'),
    secure: true
  }
}
```

**工作原理**:
```
浏览器 → http://localhost:5173/ai-proxy/chat/completions
         ↓
Vite代理 → https://dashscope.aliyuncs.com/api/v1/chat/completions
         ↓
返回响应给浏览器
```

---

## 🔄 下一步操作

### 第1步：重启开发服务器

**必须重启**才能使代理配置生效！

```bash
# 停止当前服务器 (Ctrl+C)

# 重新启动
npm run dev
```

### 第2步：清除浏览器缓存

1. 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
2. 选择"缓存的图片和文件"
3. 点击"清除数据"

或者：
- 按 `Ctrl+F5` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新

### 第3步：重新测试

1. 访问 `http://localhost:5173/solution-generator`
2. 配置AI API（如果还没配置）
3. 生成方案
4. 观察控制台日志

---

## 📊 预期的成功日志

重启后，您应该看到：

```
🔧 配置AI服务: {
  provider: "qwen",
  baseUrl: "/ai-proxy",
  isDev: true,
  usingProxy: true
}

🚀 开始调用AI API生成方案...

🎯 ========== 开始生成网站方案 ==========

📤 发送AI请求...
模型: qwen-max

📥 收到AI响应
响应状态: 200  ← 关键：不再是Network Error

✅ AI返回成功
```

---

## 🔍 如何验证代理是否工作

### 方法一：查看Network标签

1. 打开开发者工具 (F12)
2. 切换到 **Network（网络）** 标签
3. 生成方案
4. 查找请求：
   - **之前**: `https://dashscope.aliyuncs.com/api/v1/chat/completions` (失败)
   - **现在**: `http://localhost:5173/ai-proxy/chat/completions` (成功)

### 方法二：查看控制台日志

寻找这一行：
```
🔧 配置AI服务: { ..., usingProxy: true }
```

如果 `usingProxy: true`，说明代理已启用。

---

## ❓ 如果仍然失败

### 检查清单

#### 1. 确认服务器已重启
```bash
# 检查是否在运行
ps aux | grep vite

# 或者重新启动
npm run dev
```

#### 2. 检查代理配置
打开 `vite.config.ts`，确认有这段配置：
```typescript
'/ai-proxy': {
  target: 'https://dashscope.aliyuncs.com',
  changeOrigin: true,
  ...
}
```

#### 3. 检查端口
确认开发服务器运行在 5173 端口：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

#### 4. 测试代理是否可用

在浏览器中访问：
```
http://localhost:5173/ai-proxy/test
```

应该看到通义千问的响应（可能是404，但说明代理在工作）。

#### 5. 检查防火墙

如果使用公司网络或防火墙：
- 确认可以访问 `dashscope.aliyuncs.com`
- 可能需要配置代理或VPN

---

## 🛠️ 其他解决方案

### 方案二：使用后端服务器（生产环境）

如果您有Node.js后端，可以在后端调用AI API：

```javascript
// server.js (Express示例)
const express = require('express')
const axios = require('axios')
const app = express()

app.post('/api/generate-solution', async (req, res) => {
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000)
```

然后前端调用 `/api/generate-solution`。

---

### 方案三：使用云函数

部署一个云函数（阿里云FC、腾讯云SCF等）来调用AI API。

---

### 方案四：更换AI提供商

如果通义千问的网络问题持续，可以尝试：

**DeepSeek**（通常没有跨域问题）:
```env
VITE_AI_PROVIDER=deepseek
VITE_AI_API_KEY=your-deepseek-key
```

---

## 📝 常见问题

### Q1: 为什么要用代理？

A: 浏览器的同源策略（Same-Origin Policy）阻止前端直接访问不同域的API。代理让请求看起来是来自同一个域。

### Q2: 生产环境也需要代理吗？

A: 不需要。生产环境应该：
- 使用后端服务器调用AI API
- 或使用支持CORS的API
- 或配置Nginx反向代理

### Q3: 代理会影响性能吗？

A: 轻微影响（增加一次转发），但可以忽略不计。主要优势是解决跨域问题。

### Q4: 可以用其他代理工具吗？

A: 可以，例如：
- Nginx反向代理
- http-proxy-middleware
- CORS浏览器插件（仅开发）

---

## 🎯 快速修复步骤总结

```bash
# 1. 停止服务器 (Ctrl+C)

# 2. 重新启动
npm run dev

# 3. 清除浏览器缓存 (Ctrl+Shift+Delete)

# 4. 强制刷新页面 (Ctrl+F5)

# 5. 重新测试
```

---

## 📞 需要帮助？

如果按照以上步骤仍然无法解决：

1. **提供以下信息**:
   - 控制台完整错误日志
   - Network标签的请求截图
   - `vite.config.ts` 中的代理配置

2. **尝试替代方案**:
   - 使用DeepSeek API
   - 使用后端服务器

3. **联系方式**:
   - GitHub Issues
   - Email: support@example.com

---

**祝您问题解决！** 🎉
