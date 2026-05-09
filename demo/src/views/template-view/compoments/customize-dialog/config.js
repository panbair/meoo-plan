/*
* @Author: panboren
* @Date: 2024/11/5$
* @LastModifiedBy: Administrator$
* @QQ: 3248874747
*/

import {easeList} from '../config-form.js'


export const keyData = [
  {
    key: 'duration',
    label: '过度',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    attrs: {
      min: 0, // 假设宽度不能为负
      max: 100000, // 假设高度不能超过 1000
      step: 1
    },
    attributeType: 'animation',
    animationType: true
  },
  {
    key: 'ease',
    label: '缓动',
    value: '',
    type: 'string',
    tag: 'select',
    unit: '',
    attributeType: 'animation',
    options: easeList
  },
  {
    key: 'xPercent',
    label: 'x轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '%',
    attrs: {
      min: -100000, // 假设宽度不能为负
      max: 100000, // 假设高度不能超过 1000
      step: 100,
      stepStrictly: true
    }
  },
  {
    key: 'yPercent',
    label: 'y轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '%',
    attrs:{
      min: -100000, // 假设宽度不能为负
      max: 100000, // 假设高度不能超过 1000
      step: 100,
      stepStrictly: true
    }
  },
  {
    key: 'background',
    subKey: 'backgroundList',
    label: '背景色',
    value: '',
    type: 'string',
    tag: 'linear-color',
    unit: ''
  },
  {
    key: 'rotate',
    label: '旋转',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    attrs: {
      min: -360, // 旋转角度可以从 -360 到 360
      max: 360,
      step: 1
    }
  },
  {
    key: 'scale',
    label: '缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    attrs: {
      min: 0, // 缩放值通常不能为负（取决于具体实现）
      max: 100000, // 假设高度不能超过 1000
      step: 1
    }
  },
  {
    key: 'scaleX',
    label: 'x轴缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    attrs: {
      min: 0, // 缩放值通常不能为负（取决于具体实现）
      max: 100000, // 假设高度不能超过 1000
      step: 1
    }
  },
  {
    key: 'scaleY',
    label: 'y轴缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    attrs: {
      min: 0, // 缩放值通常不能为负（取决于具体实现）
      max: 100000, // 假设高度不能超过 1000
      step: 1
    }
  },
  {
    key: 'skew',
    label: '倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    attrs: {
      min: -360, // 缩放值通常不能为负（取决于具体实现）
      max: 360, // 假设高度不能超过 1000
      step: 1
    }
  },
  {
    key: 'skewX',
    label: 'x轴倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    attrs: {
      min: -360, // 缩放值通常不能为负（取决于具体实现）
      max: 360, // 假设高度不能超过 1000
      step: 1
    }

  },
  {
    key: 'skewY',
    label: 'y轴倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    attrs: {
      min: -360, // 缩放值通常不能为负（取决于具体实现）
      max: 360, // 假设高度不能超过 1000
      step: 1
    }
  }
]

export const keys = ['duration','ease','xPercent','yPercent','background','rotate','scale','skew']



export const keys2 = ['background']



export const keyData2 = [
  {
    key: 'background',
    subKey: 'backgroundList',
    label: '背景色',
    value: '',
    type: 'string',
    tag: 'linear-color',
    unit: ''
  },
  {
    key: 'bgUrl',
    label: '背景图',
    value: '',
    type: 'string',
    tag: 'background-image',
    unit: ''
  }
]