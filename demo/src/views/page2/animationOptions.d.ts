/**
 * 动画选项分组
 */
export interface AnimationOptionGroup {
  /** 分组标签 */
  label: string
  /** 动画选项列表 */
  options: AnimationOption[]
}

/**
 * 单个动画选项
 */
export interface AnimationOption {
  /** 动画标签/名称 */
  label: string
  /** 动画唯一标识值 */
  value: string
}

/**
 * 动画选项集合（数组形式）
 */
declare const animationOptions: AnimationOptionGroup[]
export { animationOptions }
