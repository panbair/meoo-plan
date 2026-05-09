/**
 * Mock 工具函数
 */

import type { MockMethod } from 'vite-plugin-mock'

/**
 * 生成随机ID
 */
export function generateId(): number {
  return Math.floor(Math.random() * 10000)
}

/**
 * 生成随机日期
 */
export function generateDate(start?: Date, end?: Date): string {
  const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const endDate = end || new Date()
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * 生成随机手机号
 */
export function generateMobile(): string {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  return prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
}

/**
 * 生成随机用户名
 */
export function generateUsername(): string {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗']
  const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '华', '平', '刚']
  return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)]
}

/**
 * 生成随机邮箱
 */
export function generateEmail(): string {
  const domains = ['qq.com', '163.com', '126.com', 'gmail.com', 'outlook.com']
  const username = generateUsername()
  return username + Math.floor(Math.random() * 1000) + '@' + domains[Math.floor(Math.random() * domains.length)]
}

/**
 * 成功响应
 */
export function successResponse<T>(data: T, msg = '操作成功'): any {
  return {
    code: 0,
    msg,
    data
  }
}

/**
 * 失败响应
 */
export function errorResponse(msg = '操作失败', code = -1): any {
  return {
    code,
    msg,
    data: null
  }
}

/**
 * 分页响应
 */
export function pageResponse<T>(list: T[], total: number, pageNo = 1, pageSize = 10): any {
  return {
    code: 0,
    msg: 'success',
    data: {
      list,
      total,
      pageNum: pageNo,
      pageSize,
      pages: Math.ceil(total / pageSize)
    }
  }
}
