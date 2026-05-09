/*
* @ description:
* @ author: panboren
* @ created_at: 2024/11/13 23:52
* @ QQ: 3248874747
*/




export let hoverList = [
  {
    'label': 'shrink',
    'value': 'ph-shrink',
    'id': 1
  },
  {
    'label': 'pulse',
    'value': 'ph-pulse',
    'id': 2
  },
  {
    'label': 'pulse-grow',
    'value': 'ph-pulse-grow',
    'id': 3
  },
  {
    'label': 'pulse-shrink',
    'value': 'ph-pulse-shrink',
    'id': 4
  },
  {
    'label': 'push',
    'value': 'ph-push',
    'id': 5
  },
  {
    'label': 'pop',
    'value': 'ph-pop',
    'id': 6
  },
  {
    'label': 'bounce-in',
    'value': 'ph-bounce-in',
    'id': 7
  },
  {
    'label': 'grow',
    'value': 'ph-grow',
    'id': 8
  },
  {
    'label': 'bounce-out',
    'value': 'ph-bounce-out',
    'id': 9
  },
  {
    'label': 'rotate',
    'value': 'ph-rotate',
    'id': 10
  },
  {
    'label': 'grow-rotate',
    'value': 'ph-grow-rotate',
    'id': 11
  },
  {
    'label': 'float',
    'value': 'ph-float',
    'id': 12
  },
  {
    'label': 'sink',
    'value': 'ph-sink',
    'id': 13
  },
  {
    'label': 'bob',
    'value': 'ph-bob',
    'id': 14
  },
  {
    'label': 'hang',
    'value': 'ph-hang',
    'id': 15
  },
  {
    'label': 'skew',
    'value': 'ph-skew',
    'id': 16
  },
  {
    'label': 'skew-forward',
    'value': 'ph-skew-forward',
    'id': 17
  },
  {
    'label': 'skew-backward',
    'value': 'ph-skew-backward',
    'id': 18
  },
  {
    'label': 'wobble-horizontal',
    'value': 'ph-wobble-horizontal',
    'id': 19
  },
  {
    'label': 'wobble-vertical',
    'value': 'ph-wobble-vertical',
    'id': 20
  },
  {
    'label': 'wobble-to-bottom-right',
    'value': 'ph-wobble-to-bottom-right',
    'id': 21
  },
  {
    'label': 'wobble-to-top-right',
    'value': 'ph-wobble-to-top-right',
    'id': 22
  },
  {
    'label': 'wobble-top',
    'value': 'ph-wobble-top',
    'id': 23
  },
  {
    'label': 'wobble-bottom',
    'value': 'ph-wobble-bottom',
    'id': 24
  },
  {
    'label': 'wobble-skew',
    'value': 'ph-wobble-skew',
    'id': 25
  },
  {
    'label': 'buzz',
    'value': 'ph-buzz',
    'id': 26
  },
  {
    'label': 'buzz-out',
    'value': 'ph-buzz-out',
    'id': 27
  },
  {
    'label': 'forward',
    'value': 'ph-forward',
    'id': 28
  },
  {
    'label': 'backward',
    'value': 'ph-backward',
    'id': 29
  },
  // {
  //   'label': 'radial-in',
  //   'value': 'ph-radial-in',
  //   'id': 41
  // },
  // {
  //   'label': 'rectangle-in',
  //   'value': 'ph-rectangle-in',
  //   'id': 42
  // },
  // {
  //   'label': 'shutter-in-horizontal',
  //   'value': 'ph-shutter-in-horizontal',
  //   'id': 44
  // },
  // {
  //   'label': 'shutter-in-vertical',
  //   'value': 'ph-shutter-in-vertical',
  //   'id': 46
  // },
  // {
  //   'label': 'ripple-out',
  //   'value': 'ph-ripple-out',
  //   'id': 51
  // },
  // {
  //   'label': 'ripple-in',
  //   'value': 'ph-ripple-in',
  //   'id': 52
  // },
  // {
  //   'label': 'outline-out',
  //   'value': 'ph-outline-out',
  //   'id': 53
  // },
  // {
  //   'label': 'outline-in',
  //   'value': 'ph-outline-in',
  //   'id': 54
  // },
  // {
  //   'label': 'round-corners',
  //   'value': 'ph-round-corners',
  //   'id': 55
  // },
  {
    'label': 'grow-shadow',
    'value': 'ph-grow-shadow',
    'id': 66
  }

]

export let userHover = ()=>{

  const color = ref('#fff') // 响应式颜色值
  const color2 = ref('rgba(0,0,0,0.5)') // 响应式颜色值
  const color3 = ref('#dcdfe6') // 响应式颜色值\
  let hoverBorder = ref('4px solid  #dcdfe6')
  const cssVars = computed(() => {
    return {
      '--hover-bg': color.value, // CSS 变量名与值
      '--hover-bg1': color2.value,
      '--hover-shadow': color3.value,
      '--hover-border': hoverBorder.value
    }
  })

  return {
    cssVars
  }

}


export const easeList = [
  {
    'label': 'none',
    'value': 'none'
  },
  {
    'label': 'power1.in',
    'value': 'power1.in'
  },
  {
    'label': 'power1.out',
    'value': 'power1.out'
  },
  {
    'label': 'power1.inOut',
    'value': 'power1.inOut'
  },
  {
    'label': 'power2.in',
    'value': 'power2.in'
  },
  {
    'label': 'power2.out',
    'value': 'power2.out'
  },
  {
    'label': 'power2.inOut',
    'value': 'power2.inOut'
  },
  {
    'label': 'power3.in',
    'value': 'power3.in'
  },
  {
    'label': 'power3.out',
    'value': 'power3.out'
  },
  {
    'label': 'power3.inOut',
    'value': 'power3.inOut'
  },
  {
    'label': 'power4.in',
    'value': 'power4.in'
  },
  {
    'label': 'power4.out',
    'value': 'power4.out'
  },
  {
    'label': 'power4.inOut',
    'value': 'power4.inOut'
  },
  {
    'label': 'back.in(1.7)',
    'value': 'back.in(1.7)'
  },
  {
    'label': 'back.out(1.7)',
    'value': 'back.out(1.7)'
  },
  {
    'label': 'back.inOut(1.7)',
    'value': 'back.inOut(1.7)'
  },
  {
    'label': 'bounce.in',
    'value': 'bounce.in'
  },
  {
    'label': 'bounce.out',
    'value': 'bounce.out'
  },
  {
    'label': 'bounce.inOut',
    'value': 'bounce.inOut'
  },
  {
    'label': 'circ.in',
    'value': 'circ.in'
  },
  {
    'label': 'circ.out',
    'value': 'circ.out'
  },
  {
    'label': 'circ.inOut',
    'value': 'circ.inOut'
  },
  {
    'label': 'elastic.in(1,0.3)',
    'value': 'elastic.in(1,0.3)'
  },
  {
    'label': 'elastic.out(1,0.3)',
    'value': 'elastic.out(1,0.3)'
  },
  {
    'label': 'elastic.inOut(1,0.3)',
    'value': 'elastic.inOut(1,0.3)'
  },
  {
    'label': 'expo.in',
    'value': 'expo.in'
  },
  {
    'label': 'expo.out',
    'value': 'expo.out'
  },
  {
    'label': 'expo.inOut',
    'value': 'expo.inOut'
  },
  {
    'label': 'sine.in',
    'value': 'sine.in'
  },
  {
    'label': 'sine.out',
    'value': 'sine.out'
  },
  {
    'label': 'sine.inOut',
    'value': 'sine.inOut'
  },
  {
    'label': 'steps(12)',
    'value': 'steps(12)'
  },
  {
    'label': 'slow(0.7,0.7,false)',
    'value': 'slow(0.7,0.7,false)'
  },
  {
    'label': 'expoScale(0.5,7,none)',
    'value': 'expoScale(0.5,7,none)'
  }
]
































