export const getOriginalStyles = (el, hoverStyles) => {
  const originalStyles = {}
  Object.keys(hoverStyles)?.forEach(key => {
    originalStyles[key] = window.getComputedStyle(el)[key]
  })
  return originalStyles
}

/*
import {onUnmounted, ref} from 'vue'
import gsap from 'gsap'
import {computedStyle} from '~~/components/form-dialog/config'
export const getOriginalStyles = (el,hoverStyles)=>{
  const originalStyles = {}
  Object.keys(hoverStyles)?.forEach((key) => {
    originalStyles[key] = window.getComputedStyle(el)[key]
  })
  return originalStyles
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      console.log('focus')
      el.focus()
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      console.log(binding, vnode)
      return {}
    }
  }),
  nuxtApp.vueApp.directive('drag', {
    mounted(el, binding) {
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight
      const position = ref({
        x: binding.value?.initialX ?? 0,
        y: binding.value?.initialY ?? 0
      })


      const offset = ref({ x: 0, y: 0 })
      const isDragging = ref(false)
      let requestFrame: number | null = null

      // 设置元素的初始样式
      el.style.position = 'fixed'
      el.style.margin = '0'
      el.style.border = 'none'
      el.style.padding = '0'
      el.style.willChange = 'transform'
      el.style.zIndex = '999'
      el.style.display = 'block'

      // 初始化元素位置（考虑页面滚动）
      el.style.left = `${position.value.x}px`
      el.style.top = `${position.value.y}px`


      console.log(269, position, el.style.left , el.style.top  )

      const handleMouseDown = (event: MouseEvent) => {
        isDragging.value = true
        const rect = el.getBoundingClientRect()
        offset.value.x = event.clientX - rect.left
        offset.value.y = event.clientY - rect.top
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        event.preventDefault()
      }

      const updatePosition = () => {
        if (requestFrame !== null) {
          cancelAnimationFrame(requestFrame)
        }
        requestFrame = requestAnimationFrame(() => {
          el.style.left = `${position.value.x}px`
          el.style.top = `${position.value.y}px`
          requestFrame = null
        })
      }

      const handleMouseMove = (event: MouseEvent) => {
        if (isDragging.value) {
          let newX = event.clientX - offset.value.x
          let newY = event.clientY - offset.value.y

          // 限制拖拽范围在窗口内
          newX = Math.max(0, Math.min(newX, windowWidth - el.offsetWidth))
          newY = Math.max(0, Math.min(newY, windowHeight - el.offsetHeight))

          position.value.x = newX
          position.value.y = newY
          updatePosition() // 调用更新函数而不是直接设置样式
        }
      }

      const handleMouseUp = () => {
        isDragging.value = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        if (requestFrame !== null) {
          cancelAnimationFrame(requestFrame)
          requestFrame = null
        }
      }

      el.addEventListener('mousedown', handleMouseDown)

      const resize = ()=>{
        console.log('resize')
        windowWidth = window.innerWidth
        windowHeight = window.innerHeight
      }

      window.addEventListener('resize', resize)

      // 清理函数
      const cleanup = () => {
        el.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('resize', resize)
        if (requestFrame !== null) {
          cancelAnimationFrame(requestFrame)
          requestFrame = null
        }
      }

      // 使用 onUnmounted 钩子来注册清理函数
      onUnmounted(cleanup)
    }
  }),
  nuxtApp.vueApp.directive('hover', {
    mounted(el, binding) {
      // 从指令的值（如果有的话）中获取自定义的hover样式
      // 这里我们假设binding.value是一个对象，包含hover时的样式

      const formData = binding.value || {}
      if(Object.keys(formData)?.length <= 0 ) {
        return
      }
      const hoverStyles = computedStyle(formData.hoverStyle,formData.hoverKeys)
      const originalStyles = getOriginalStyles(el,hoverStyles)

      console.log('hoverStyles',hoverStyles)
      console.log('originalStyles',originalStyles)

      // 可以在el上存储一些数据，以便稍后在unbind或其他钩子中使用
      el.__vueHoverAnimation__ = {
        originalStyles,
        hoverStyles
      }

      // 创建鼠标移入时的事件处理函数
      const handleMouseOver = () => {
        console.log('handleMouseOver',el.__vueHoverAnimation__)
        gsap.to(el, {
          ...el.__vueHoverAnimation__.hoverStyles
        })
      }

      // 创建鼠标移出时的事件处理函数
      const handleMouseOut = () => {
        console.log('handleMouseOut',el.__vueHoverAnimation__)
        gsap.to(el, {
          ...el.__vueHoverAnimation__ .originalStyles
        })
      }
      el.__vueHoverAnimation__.handleMouseOver = handleMouseOver
      el.__vueHoverAnimation__.handleMouseOut = handleMouseOut
      // 添加事件监听器
      el.addEventListener('mouseover', handleMouseOver)
      el.addEventListener('mouseout', handleMouseOut)
    },
    updated(el, binding) {
      const formData = binding.value || {}
      const hoverStyles = computedStyle(formData.hoverStyle,formData.hoverKeys)
      const originalStyles = getOriginalStyles(el,hoverStyles)
      // 当绑定值更新时，更新hover样式
      if (binding.value) {
        el.__vueHoverAnimation__.hoverStyles = hoverStyles
        el.__vueHoverAnimation__.originalStyles = originalStyles
      }
      // 注意：这里不需要立即应用新样式，因为鼠标事件会在需要时触发动画
    },
    unmounted(el) {
      // 移除事件监听器
      if (el.__vueHoverAnimation__) {
        const { handleMouseOver, handleMouseOut } = el.__vueHoverAnimation__
        el.removeEventListener('mouseover', handleMouseOver)
        el.removeEventListener('mouseout', handleMouseOut)

        // 清理我们在el上存储的数据
        delete el.__vueHoverAnimation__
      }
    }
  })
})
//
// const op = {
//   'duration': 2,
//   'h': 100,
//   'repeat': 2,
//   'delay': 1,
//   'yoyo': 1,
//   'w': 300,
//   'x': 300,
//   'y': 400,
//   'rotate': 50,
//   'scaleX': 2,
//   'scaleY': 2,
//   'skewX': 40,
//   'skewY': 50,
//   'border': '2px solid rgba(152, 3, 3, 1)',
//   'borderList': {
//     'borderWidth': 2,
//     'borderStyle': 'solid',
//     'borderColor': 'rgba(152, 3, 3, 1)'
//   },
//   'boxShadow': '1px 1px 1px 1px #333,1px 2px 2px 2px rgba(202, 21, 21, 1)',
//   'boxShadowList': {
//     'insetValue': 'outset',
//     'list': [
//       {
//         'hShadow': 1,
//         'vShadow': 1,
//         'blurRadius': 1,
//         'color': '#333',
//         'spread': 1
//       },
//       {
//         'hShadow': 1,
//         'vShadow': 2,
//         'blurRadius': 2,
//         'color': 'rgba(202, 21, 21, 1)',
//         'spread': 2
//       }
//     ]
//   },
//   'borderRadius': 50,
//   'blur': 2,
//   'grayscale': 2,
//   'hue-rotate': 30,
//   'saturate': 10,
//   'sepia': 2,
//   'opacity': 0.5,
//   'margin': 10,
//   'padding': 20,
//   'color': 'rgba(0, 187, 255, 1)',
//   'fontSize': 28,
//   'fontWeight': 'bold',
//   'letterSpacing': 12,
//   'lineHeight': 50,
//   'textShadow': '1px 1px 1px #333,2px 2px 2px rgba(11, 21, 211, 1)',
//   'textShadowList': [
//     {
//       'hShadow': 1,
//       'vShadow': 1,
//       'blurRadius': 1,
//       'color': '#333'
//     },
//     {
//       'hShadow': 2,
//       'vShadow': 2,
//       'blurRadius': 2,
//       'color': 'rgba(11, 21, 211, 1)'
//     }
//   ],
//   'zIndex': 10
// }*/
