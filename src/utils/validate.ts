/**
 * 验证工具
 */

/**
 * 判断是否为外部链接
 */
export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 脱敏手机号
 * @param phone 手机号
 * @returns 脱敏后的手机号 如: 138****8000
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 脱敏邮箱
 * @param email 邮箱
 * @returns 脱敏后的邮箱 如: a***@163.com
 */
export function maskEmail(email: string): string {
  if (!email) return email
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const maskedName = name.length > 3 ? name.slice(0, 2) + '***' : name.charAt(0) + '***'
  return `${maskedName}@${domain}`
}

/**
 * 脱敏身份证号
 * @param idCard 身份证号
 * @returns 脱敏后的身份证号 如: 110***********1234
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 15) return idCard
  return idCard.replace(/(\d{3})\d+(\d{4})/, '$1***********$2')
}

/**
 * 脱敏银行卡号
 * @param cardNo 银行卡号
 * @returns 脱敏后的银行卡号 如: **** **** **** 1234
 */
export function maskBankCard(cardNo: string): string {
  if (!cardNo) return cardNo
  const last4 = cardNo.slice(-4)
  return `**** **** **** ${last4}`
}

/**
 * 脱敏真实姓名
 * @param name 真实姓名
 * @returns 脱敏后的姓名 如: 张*
 */
export function maskName(name: string): string {
  if (!name) return name
  if (name.length === 2) return name.charAt(0) + '*'
  if (name.length >= 3) return name.charAt(0) + '*' + name.slice(-1)
  return name
}

/**
 * 必填验证
 */
export function required(message: string = '该字段不能为空') {
  return {
    required: true,
    message,
    trigger: 'blur'
  }
}

/**
 * 手机号验证
 */
export function validatePhone(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

/**
 * 邮箱验证
 */
export function validateEmail(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  ) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

/**
 * 身份证验证
 */
export function validateIdCard(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}

/**
 * URL验证
 */
export function validateUrl(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (
    !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
  ) {
    callback(new Error('请输入正确的URL地址'))
  } else {
    callback()
  }
}

/**
 * 密码验证
 */
export function validatePassword(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
    callback(new Error('密码必须包含大小写字母和数字，且长度不小于8位'))
  } else {
    callback()
  }
}

/**
 * 数字验证
 */
export function validateNumber(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^\d+$/.test(value)) {
    callback(new Error('请输入数字'))
  } else {
    callback()
  }
}

/**
 * 浮点数验证
 */
export function validateFloat(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^\d+(\.\d+)?$/.test(value)) {
    callback(new Error('请输入有效的数字'))
  } else {
    callback()
  }
}

/**
 * 中文验证
 */
export function validateChinese(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error('请输入中文'))
  } else {
    callback()
  }
}

/**
 * 英文验证
 */
export function validateEnglish(rule: any, value: string, callback: any) {
  if (!value) {
    callback()
  } else if (!/^[a-zA-Z]+$/.test(value)) {
    callback(new Error('请输入英文字母'))
  } else {
    callback()
  }
}

/**
 * 长度验证
 */
export function validateLength(min: number, max: number) {
  return function (rule: any, value: string, callback: any) {
    if (!value) {
      callback()
    } else if (value.length < min || value.length > max) {
      callback(new Error(`长度应在 ${min} 到 ${max} 个字符之间`))
    } else {
      callback()
    }
  }
}
