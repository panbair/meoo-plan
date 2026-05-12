# 登录功能开发计划

## 1. 需求概述
开发一个完整的登录模块，支持用户名密码登录和手机验证码登录。

## 2. 功能清单
- [ ] 用户名 + 密码登录
- [ ] 手机号 + 验证码登录
- [ ] 记住登录状态（7天免登录）
- [ ] 登录错误提示
- [ ] 登录次数限制（错误3次锁定15分钟）
- [ ] 忘记密码入口
- [ ] 注册入口
- [ ] 第三方登录（微信）

## 3. 技术方案
- 前端：Vue 3 + TypeScript + Pinia
- 表单验证：VeeValidate + Yup
- 样式：SCSS + CSS Variables

## 4. 数据结构
见上面的 User、LoginRequest、LoginResponse

## 5. API 接口
- POST /api/login
- POST /api/verify-code
- POST /api/refresh-token

## 6. 组件结构
- views/Login.vue
- components/LoginForm.vue
- components/VerifyCodeInput.vue
- composables/useLogin.ts

## 7. 注意事项
- 密码需要加密传输
- Token 需要安全存储
- 错误处理要友好


第二：

帮我开发一个登录模块，按照以下计划执行：

1. 需求：用户名密码登录 + 手机验证码登录
2. 技术：Vue 3 + TypeScript + Pinia
3. 功能点：[上面列出的功能]
4. 数据结构：[上面定义的结构]
5. API：[上面设计的接口]
6. 组件：[上面规划的结构]

请先确认这个计划是否符合要求，然后再开始开发。

专业开发 = 计划 + 确认 + 实施

你可以开发比这个还要好的组件吗？也是用gsap开发，


# 需求：在这个(src/views/web-list/card-text)文件里面:
1. 创建一个组件，这个组件应该有如下功能：

