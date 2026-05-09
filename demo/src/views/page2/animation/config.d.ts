/**
 * 动画类型
 */
export type AnimationType = 'timeline' | 'fromto' | 'to'

/**
 * 单个动画配置项
 */
export interface AnimationConfig {
  /** 动画类型 */
  type: AnimationType
  /** GSAP动画参数对象 */
  params: gsap.TweenVars
  /** 可选的from参数（fromto类型使用） */
  fromParams?: gsap.TweenVars
  /** 动画持续时间（秒） */
  duration?: number
  /** 缓动函数 */
  ease?: string
  /** 延迟时间（秒） */
  delay?: number
}

/**
 * 动画配置集合
 */
export interface AnimationConfigCollection {
  [key: string]: AnimationConfig
}

/**
 * 导出的配置对象类型
 */
declare const config: AnimationConfigCollection
export { config }
