/*
 * @Author: panboren
 * @Date: 2024/11/5$
 * @LastModifiedBy: Administrator$
 * @QQ: 3248874747
 */

import { isTrue } from './utils'

export const animationTypeData = [
  {
    label: '滚动条/滚轮触发',
    value: 'scroll'
  },
  {
    label: '鼠标进出触发',
    value: 'mouse'
  }
]
export const easeList = [
  {
    label: 'none',
    value: 'none'
  },
  {
    label: 'power1.in',
    value: 'power1.in'
  },
  {
    label: 'power1.out',
    value: 'power1.out'
  },
  {
    label: 'power1.inOut',
    value: 'power1.inOut'
  },
  {
    label: 'power2.in',
    value: 'power2.in'
  },
  {
    label: 'power2.out',
    value: 'power2.out'
  },
  {
    label: 'power2.inOut',
    value: 'power2.inOut'
  },
  {
    label: 'power3.in',
    value: 'power3.in'
  },
  {
    label: 'power3.out',
    value: 'power3.out'
  },
  {
    label: 'power3.inOut',
    value: 'power3.inOut'
  },
  {
    label: 'power4.in',
    value: 'power4.in'
  },
  {
    label: 'power4.out',
    value: 'power4.out'
  },
  {
    label: 'power4.inOut',
    value: 'power4.inOut'
  },
  {
    label: 'back.in(1.7)',
    value: 'back.in(1.7)'
  },
  {
    label: 'back.out(1.7)',
    value: 'back.out(1.7)'
  },
  {
    label: 'back.inOut(1.7)',
    value: 'back.inOut(1.7)'
  },
  {
    label: 'bounce.in',
    value: 'bounce.in'
  },
  {
    label: 'bounce.out',
    value: 'bounce.out'
  },
  {
    label: 'bounce.inOut',
    value: 'bounce.inOut'
  },
  {
    label: 'circ.in',
    value: 'circ.in'
  },
  {
    label: 'circ.out',
    value: 'circ.out'
  },
  {
    label: 'circ.inOut',
    value: 'circ.inOut'
  },
  {
    label: 'elastic.in(1,0.3)',
    value: 'elastic.in(1,0.3)'
  },
  {
    label: 'elastic.out(1,0.3)',
    value: 'elastic.out(1,0.3)'
  },
  {
    label: 'elastic.inOut(1,0.3)',
    value: 'elastic.inOut(1,0.3)'
  },
  {
    label: 'expo.in',
    value: 'expo.in'
  },
  {
    label: 'expo.out',
    value: 'expo.out'
  },
  {
    label: 'expo.inOut',
    value: 'expo.inOut'
  },
  {
    label: 'sine.in',
    value: 'sine.in'
  },
  {
    label: 'sine.out',
    value: 'sine.out'
  },
  {
    label: 'sine.inOut',
    value: 'sine.inOut'
  },
  {
    label: 'steps(12)',
    value: 'steps(12)'
  },
  {
    label: 'slow(0.7,0.7,false)',
    value: 'slow(0.7,0.7,false)'
  },
  {
    label: 'expoScale(0.5,7,none)',
    value: 'expoScale(0.5,7,none)'
  }
]

export const keyAnimation = [
  {
    key: 'duration',
    label: '过度',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'animation',
    animationType: true
  },
  {
    key: 'repeat',
    label: '重复',
    value: -1,
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: -1, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'animation',
    animationType: true
  },
  {
    key: 'delay',
    label: '延迟',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'animation',
    animationType: true
  },
  {
    key: 'yoyo',
    label: '往返',
    value: 0,
    type: 'number',
    tag: 'select',
    unit: '',
    attributeType: 'animation',
    animationType: true,
    options: [
      {
        label: '循环',
        value: 1
      },
      {
        label: '不循环',
        value: 0
      }
    ]
  }
]
export const keyAnimation2 = [
  {
    key: 'toKey',
    label: '动画方向',
    value: '',
    type: 'string',
    tag: 'select',
    unit: '',
    attributeType: 'animation',
    options: [
      {
        label: '从哪里来',
        value: 'from'
      },
      {
        label: '到哪里去',
        value: 'to'
      }
    ]
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
  }
]

export const keyAnimation3 = [
  {
    key: 'duration',
    label: '过度',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'animation',
    animationType: true
  }
]

export const keyAnimation4 = [
  {
    key: 'xPercent',
    label: 'x轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 100
  },
  {
    key: 'yPercent',
    label: 'y轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 100
  }
]

export const keyData = [
  {
    key: 'w',
    label: '宽',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'h',
    label: '高',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'x',
    label: 'x轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'y',
    label: 'y轴平移',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000, // 假设宽度不能为负
    max: 100000, // 假设高度不能超过 1000
    step: 1
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
  // {
  //   key: 'z',
  //   label: 'z轴平移',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  {
    key: 'rotate',
    label: '旋转',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    min: -360, // 旋转角度可以从 -360 到 360
    max: 360,
    step: 1
  },
  {
    key: 'scale',
    label: '轴缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 缩放值通常不能为负（取决于具体实现）
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'scaleX',
    label: 'x轴缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 缩放值通常不能为负（取决于具体实现）
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'scaleY',
    label: 'y轴缩放',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0, // 缩放值通常不能为负（取决于具体实现）
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'skew',
    label: '倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    min: -360, // 缩放值通常不能为负（取决于具体实现）
    max: 360, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'skewX',
    label: 'x轴倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    min: -360, // 缩放值通常不能为负（取决于具体实现）
    max: 360, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'skewY',
    label: 'y轴倾斜',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    min: -360, // 缩放值通常不能为负（取决于具体实现）
    max: 360, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'border',
    subKey: 'borderList',
    label: '边框',
    value: '',
    type: 'string',
    tag: 'border-pick',
    unit: ''
  },
  {
    key: 'boxShadow',
    subKey: 'boxShadowList',
    label: '盒子阴影',
    value: '',
    type: 'string',
    tag: 'box-shadow',
    unit: ''
  },
  // {
  //   key: 'borderWidth',
  //   label: '边框大小',
  //   value: '',
  //   type: 'number',
  //   tag: 'input-number',
  //   unit: 'px',
  //   min: 0, // 缩放值通常不能为负（取决于具体实现）
  //   max: 100000, // 假设高度不能超过 1000
  //   step: 1
  // },
  // {
  //   key: 'borderColor',
  //   label: '边框颜色',
  //   value: '',
  //   type: 'string',
  //   tag: 'color',
  //   unit: ''
  // },
  // {
  //   key: 'borderHeight',
  //   label: '边框高度',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  {
    key: 'borderRadius',
    label: '圆角',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0, // 缩放值通常不能为负（取决于具体实现）
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'blur',
    label: '模糊效果',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0,
    max: 100, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'grayscale',
    label: '灰度效果',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '%',
    min: 0,
    max: 100,
    step: 1
  },
  {
    key: 'hue-rotate',
    label: '色相旋转',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'deg',
    min: 0,
    max: 360, // 可以在 UI 上提供色相旋转的范围限制
    step: 1
  },
  {
    key: 'saturate',
    label: '饱和度',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '%',
    min: 0,
    max: 100,
    step: 1
  },
  {
    key: 'sepia',
    label: '褐色效果',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '%',
    min: 0,
    max: 100,
    step: 1
  },
  {
    key: 'opacity',
    label: '透明度',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: 0,
    max: 1,
    step: 0.1
  },
  // {
  //   key: 'left',
  //   label: '左偏移',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  // {
  //   key: 'right',
  //   label: '右偏移',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  // {
  //   key: 'top',
  //   label: '上偏移',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  // {
  //   key: 'bottom',
  //   label: '下偏移',
  //   value: 0,
  //   type: 'number',
  //   tag: 'input',
  //   unit: 'px'
  // },
  {
    key: 'margin',
    label: '外边距',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000,
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'padding',
    label: '内边距',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: -100000,
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'color',
    label: '字体颜色',
    value: '',
    type: 'string',
    tag: 'color',
    unit: '',
    attributeType: 'font'
  },
  {
    key: 'fontSize',
    label: '字体大小',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 12,
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'font'
  },
  {
    key: 'fontWeight',
    label: '字体粗细',
    value: '',
    type: 'string',
    tag: 'select',
    unit: '',
    attributeType: 'font',
    options: [
      {
        label: 'normal',
        value: 'normal'
      },
      {
        label: 'bold',
        value: 'bold'
      },
      {
        label: 'bolder',
        value: 'bolder'
      },
      {
        label: 'lighter',
        value: 'lighter'
      }
    ]
  },
  {
    key: 'letterSpacing',
    label: '字符间距',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0,
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'font'
  },
  {
    key: 'lineHeight',
    label: '行高',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: 'px',
    min: 0,
    max: 100000, // 假设高度不能超过 1000
    step: 1,
    attributeType: 'font'
  },
  {
    key: 'textShadow',
    subKey: 'textShadowList',
    label: '文本阴影',
    value: '',
    type: 'string',
    tag: 'text-shadow',
    unit: '',
    attributeType: 'font'
  },
  {
    key: 'zIndex',
    label: '层级',
    value: '',
    type: 'number',
    tag: 'input-number',
    unit: '',
    min: -100000,
    max: 100000, // 假设高度不能超过 1000
    step: 1
  },
  {
    key: 'fill',
    label: '图片填充',
    value: '',
    type: 'string',
    tag: 'select',
    unit: '',
    attributeType: '',
    options: [
      {
        label: 'fill',
        value: 'fill'
      },
      {
        label: 'contain',
        value: 'contain'
      },
      {
        label: 'cover',
        value: 'cover'
      },
      {
        label: 'none',
        value: 'none'
      },
      {
        label: 'scale-down',
        value: 'scale-down'
      }
    ]
  },

  {
    key: 'lazy',
    label: '懒加载',
    value: '',
    type: 'string',
    tag: 'select',
    unit: '',
    attributeType: '',
    options: [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
  }
]

/*

// blur: 模糊效果。
// grayscale: 灰度效果。
// hueRotate: 色相旋转。
// opacity: 透明度。
// saturate: 饱和度。
// sepia: 褐色效果

// x, y: 沿 X 轴和 Y 轴平移。
// rotate: 旋转角度。
// scaleX, scaleY: 沿 X 轴和 Y 轴缩放。
// skewX, skewY: 沿 X 轴和 Y 轴倾斜。
// transformOrigin: 变换的原点
//
// color: 文本颜色。
// opacity: 控制元素的透明度，取值范围为 0 到 1
// color: 文本颜色。
// backgroundColor: 背景颜色。
// borderColor: 边框颜色。
// fill: SVG 元素的填充颜色。

// left, right, top, bottom: 控制元素的位置。
// width, height: 控制元素的宽度和高度。
// margin, padding: 控制元素的外边距和内边距。
// borderWidth: 控制元素的边框宽度

// gsap.to(".image", { duration: 1, blur: 5, grayscale: 1, hueRotate: 180, saturate: 200, sepia: 1 });
// gsap.to(".box", { duration: 1, x: 100, y: 50, rotate: 45, scaleX: 1.5, scaleY: 1.5, skewX: 10, skewY: 10, transformOrigin: "center center" });

// .element {
//   filter: blur(5px) grayscale(100%) hue-rotate(90deg) saturate(2) sepia(50%);
//           blur(0px) grayscale(69%) hue-rotate(245deg) saturate(44) sepia(100%)
//   opacity: 0.7; /!* 这不是滤镜，但经常与滤镜一起使用 *!/
    // }
//
// p {
//   text-shadow: 1px 1px 2px #ff0000, -1px -1px 2px #0000ff;
// }
// text-shadow: h-shadow v-shadow blur-radius spread-radius color;

*/

export const units = (function () {
  let obj = {}
  keyData.forEach(item => {
    obj[item.key] = item.unit
  })
  return obj
})()
export const filterStyle = (style, itemData) => {
  let keys = ['w', 'h', 'x', 'y']
  for (let key in style) {
    if (keys.includes(key)) {
      itemData[key] = style[key]
    }
  }
}

export const filterTransformStyle = (style, keys) => {
  let str = ''
  // transform: translateX(-50%) translateY(-50%) scaleX(1) scaleY(1) translateZ(0);
  for (let key in style) {
    if (keys.includes(key)) {
      let value = style[key]
      if (value || value === '0' || value === 0) {
        if (key === 'x' || key === 'y') {
          let k = {
            x: 'translateX',
            y: 'translateY'
          }
          str += `${k[key]}(${value}${units[key]})`
        } else {
          str += `${key}(${value}${units[key]}) `
        }
      }
    }
  }
  if (str) {
    return str
  }
}

export const computedStyle = (styleData = {}, keys = []) => {
  // let styleData = formData?.style || {}
  // let keys = formData?.keys || []
  let styleOptions = {}
  keys.forEach(key => {
    let value = styleData[key]
    if (value || value === '0' || value === 0) {
      styleOptions[key] = value + units[key]
    }
  })
  let filterKeys = ['blur', 'grayscale', 'hue-rotate', 'saturate', 'sepia']
  let transKeys = ['rotate', 'scale', 'scaleX', 'scaleY', 'skew', 'skewX', 'skewY']
  let transform = filterTransformStyle(styleData, transKeys)
  let filter = filterTransformStyle(styleData, filterKeys)
  isTrue(styleData.w) ? (styleOptions.width = styleData.w + units['w']) : null
  isTrue(styleData.h) ? (styleOptions.height = styleData.h + units['h']) : null

  if (transform) {
    styleOptions.transform = transform
  }
  if (filter) {
    styleOptions.filter = filter
  }
  return styleOptions
}

export const getTypeOption = () => {
  return [
    {
      value: 'img',
      label: '图片'
    },
    {
      value: 'text',
      label: '文本'
    },
    {
      value: 'swiper',
      label: '轮播图'
    },
    // {
    //   value: 'audio',
    //   label: '音频'
    // },
    {
      value: 'video',
      label: '视频'
    }
  ]
}
