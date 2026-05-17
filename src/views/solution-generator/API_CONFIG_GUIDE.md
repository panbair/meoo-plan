# 🔑 AI API 配置指南

## 📖 概述

智能方案生成器支持连接真实的AI API，以生成更智能、更个性化的网站设计方案。如果不配置API，系统将使用本地模拟模式生成基础方案。

---

## ⚙️ 配置方式

### 方式一：页面配置（推荐）⭐

1. **打开配置界面**
   - 访问 `http://localhost:5173/solution-generator`
   - 点击右上角的"⚙️ 配置AI"按钮

2. **选择AI提供商**
   - 通义千问 (Qwen) - 推荐中文场景
   - DeepSeek - 性价比高
   - OpenAI (GPT) - 国际通用
   - 自定义 - 其他兼容OpenAI格式的API

3. **输入API密钥**
   - 从对应的AI平台获取API密钥
   - 粘贴到"API密钥"输入框
   - 点击"保存配置"

4. **验证配置**
   - 配置成功后，右上角按钮会显示"✅ AI已连接"
   - 生成方案时将使用真实AI API

**优点**: 
- ✅ 操作简单，无需修改代码
- ✅ 配置保存在浏览器本地
- ✅ 可以随时修改和切换

---

### 方式二：环境变量配置

适用于开发团队或生产环境部署。

#### 步骤1: 创建 .env 文件

在项目根目录创建 `.env.local` 文件：

```bash
# AI服务提供商: qwen | deepseek | openai | custom
VITE_AI_PROVIDER=qwen

# API密钥（请从对应平台获取）
VITE_AI_API_KEY=your-api-key-here

# 基础URL（可选，使用默认值可不填）
VITE_AI_BASE_URL=

# 模型名称（可选，使用默认值可不填）
VITE_AI_MODEL=
```

#### 步骤2: 重启开发服务器

```bash
npm run dev
```

#### 各平台配置示例

**通义千问 (Qwen)**:
```env
VITE_AI_PROVIDER=qwen
VITE_AI_API_KEY=sk-xxxxxxxxxxxxxxxx
VITE_AI_BASE_URL=https://dashscope.aliyuncs.com/api/v1
VITE_AI_MODEL=qwen-max
```

**DeepSeek**:
```env
VITE_AI_PROVIDER=deepseek
VITE_AI_API_KEY=sk-xxxxxxxxxxxxxxxx
VITE_AI_BASE_URL=https://api.deepseek.com/v1
VITE_AI_MODEL=deepseek-chat
```

**OpenAI**:
```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-xxxxxxxxxxxxxxxx
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4
```

---

## 🔑 获取API密钥

### 1. 通义千问 (Qwen)

**适用场景**: 中文内容生成、国内用户

**获取步骤**:
1. 访问 [阿里云DashScope控制台](https://dashscope.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 开通DashScope服务
4. 创建API密钥
5. 复制密钥并配置

**定价**: 
- 免费额度: 每月100万tokens
- 付费: 约¥0.008-0.12/千tokens（根据模型不同）

**推荐模型**:
- `qwen-max` - 最强性能
- `qwen-plus` - 平衡性能和成本
- `qwen-turbo` - 快速响应

---

### 2. DeepSeek

**适用场景**: 高性价比、代码生成

**获取步骤**:
1. 访问 [DeepSeek平台](https://platform.deepseek.com/)
2. 注册账号
3. 进入API Keys页面
4. 创建新的API密钥
5. 复制密钥并配置

**定价**:
- 免费额度: 新用户赠送
- 付费: 约$0.07-0.14/百万tokens（非常便宜）

**推荐模型**:
- `deepseek-chat` - 对话模型
- `deepseek-coder` - 代码专用

---

### 3. OpenAI (GPT)

**适用场景**: 国际通用、高质量输出

**获取步骤**:
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号（需要海外手机号）
3. 进入API Keys页面
4. 创建新的Secret Key
5. 复制密钥并配置

**定价**:
- GPT-4: $0.03/千tokens（输入）, $0.06/千tokens（输出）
- GPT-3.5: $0.0005/千tokens（输入）, $0.0015/千tokens（输出）

**推荐模型**:
- `gpt-4` - 最强性能
- `gpt-4-turbo` - 更快更便宜
- `gpt-3.5-turbo` - 经济实惠

---

## 🔒 安全说明

### API密钥存储

**页面配置方式**:
- ✅ 密钥存储在浏览器localStorage
- ✅ 不会上传到任何服务器
- ✅ 仅在当前浏览器可用
- ⚠️ 清除浏览器数据会丢失配置

**环境变量方式**:
- ✅ 存储在服务器端
- ✅ 所有用户共享配置
- ✅ 适合团队项目
- ⚠️ 不要将.env文件提交到Git

### 安全建议

1. **不要分享API密钥**
   - API密钥等同于密码
   - 不要公开分享或硬编码在代码中

2. **设置使用限额**
   - 在AI平台设置月度预算上限
   - 避免意外高额费用

3. **定期轮换密钥**
   - 建议每3-6个月更换一次
   - 发现泄露立即撤销

4. **监控使用情况**
   - 定期检查API使用量
   - 设置异常使用告警

---

## 💡 使用建议

### 何时使用AI API？

**推荐使用**:
- ✅ 需要个性化、高质量的方案
- ✅ 项目预算充足
- ✅ 对方案质量要求高
- ✅ 经常生成不同方案

**可以使用本地模式**:
- ⚠️ 只是体验功能
- ⚠️ 预算有限
- ⚠️ 对方案要求不高
- ⚠️ 偶尔使用

### 成本控制

**通义千问**:
- 每次方案生成约消耗 2000-4000 tokens
- 成本约 ¥0.02-0.05/次
- 100元可使用约 2000-5000 次

**DeepSeek**:
- 每次方案生成约消耗 2000-4000 tokens
- 成本约 $0.0002-0.0006/次
- 10美元可使用约 16000-50000 次

**OpenAI**:
- 每次方案生成约消耗 2000-4000 tokens
- 成本约 $0.06-0.18/次（GPT-4）
- 10美元可使用约 55-166 次

**推荐**: 对于中文场景，通义千问性价比最高；追求性价比选DeepSeek。

---

## ❓ 常见问题

### Q1: 配置后没有效果？

**检查清单**:
1. 确认API密钥正确（没有多余空格）
2. 检查网络连接是否正常
3. 查看浏览器控制台是否有错误信息
4. 确认API账户有足够余额

### Q2: 如何切换AI提供商？

**方法**:
1. 点击右上角"配置AI"按钮
2. 选择不同的提供商
3. 输入新的API密钥
4. 保存配置

### Q3: API调用失败怎么办？

**系统会自动降级**:
- 如果API调用失败，系统会自动切换到本地模拟模式
- 仍然可以生成基础方案
- 查看控制台错误信息进行排查

### Q4: 可以多人共享配置吗？

**环境变量方式**: 
- ✅ 是的，所有用户共享同一配置

**页面配置方式**:
- ❌ 每个浏览器独立配置
- 💡 可以将配置导出分享给团队成员

### Q5: 如何清除配置？

**页面配置**:
1. 打开浏览器开发者工具（F12）
2. 进入Application/Storage标签
3. 找到Local Storage
4. 删除 `ai-api-config` 键

**环境变量**:
- 删除或注释掉 `.env.local` 中的相关配置
- 重启开发服务器

---

## 🚀 快速开始

### 3分钟完成配置

1. **选择平台** → 推荐通义千问（中文好、便宜）
2. **注册账号** → 访问对应平台官网
3. **获取密钥** → 在控制台创建API Key
4. **配置系统** → 点击右上角"配置AI"按钮
5. **测试生成** → 填写需求，生成方案

### 测试是否成功

配置完成后：
1. 右上角显示"✅ AI已连接"
2. 生成方案时看到"连接AI服务..."提示
3. 方案内容更加详细和个性化
4. 控制台显示"📊 AI分析"和"💡 AI建议"

---

## 📞 技术支持

遇到问题？

1. **查看控制台日志**
   - 按F12打开开发者工具
   - 查看Console标签的错误信息

2. **检查API平台状态**
   - 确认API服务正常运行
   - 查看平台公告

3. **联系支持**
   - GitHub Issues
   - Email: support@example.com

---

## 📚 相关文档

- [快速启动指南](./QUICK_START.md)
- [完整功能说明](./README.md)
- [使用示例](./USAGE_EXAMPLES.md)
- [项目总结](./PROJECT_SUMMARY.md)

---

**祝您使用愉快！** 🎉
