import _ from 'lodash'

export const isTrue = val => {
  if (val || val === 0 || val === '0') {
    return true
  }
  return false
}
export const isTrueObject = (obj = {}) => {
  const ary = Object.keys(obj) || []
  return ary?.some(key => {
    return isTrue(obj[key])
  })
}

export const delGsap = (ary: any[] = []): any[] => {
  // 使用 lodash 的 cloneDeep 进行深拷贝
  const newAry = _.cloneDeep(ary)

  // 定义一个递归函数来处理数组和嵌套对象
  const recursiveDelete = (items: any[]): void => {
    for (let i = 0; i < items.length; i++) {
      // 直接从当前项中删除指定的键
      delete items[i]['gsap']
      delete items[i]['tween']

      // 如果当前项有 children 属性且是一个数组，则递归调用
      if (Array.isArray(items[i].children)) {
        recursiveDelete(items[i].children)
      }
    }
  }
  // 调用递归函数处理新数组
  recursiveDelete(newAry)
  // 返回处理后的新数组
  return newAry
}

/*


import _ from 'lodash'
export const isTrue = (val) =>{

  if(val || val === 0 || val === '0') {
    return true
  }
  return false

}


export const isTrueArray = (ary = [],key = '') =>{
  return  ary?.some(item => {
    return isTrue(item[key])
  })
}

export const isTrueObject = (obj = {}) =>{
  const ary = Object.keys(obj) || []
  return  ary?.some(key => {
    return isTrue(obj[key])
  })
}

//  删除gsap
// export const  delGsap = (ary = [], key = 'gsap') => {
//   const newAry = _.cloneDeep(ary)
//   debugger
//   for (let i = 0; i < newAry.length; i++) {
//     const cur = newAry[i] || []
//     console.log(key,cur);
//     delete cur[key]
//     if(cur?.children && cur?.children?.length>0) {
//       delGsap(cur.children)
//     }
//   }
//   console.log(156, newAry);
//   return  newAry
// }

export const delGsap = (ary: any[] = []): any[] => {
  // 使用 lodash 的 cloneDeep 进行深拷贝
  const newAry = _.cloneDeep(ary);

  // 定义一个递归函数来处理数组和嵌套对象
  const recursiveDelete = (items: any[]): void => {
    for (let i = 0; i < items.length; i++) {
      // 直接从当前项中删除指定的键
      delete items[i]['gsap'];
      delete items[i]['tween'];


      // 如果当前项有 children 属性且是一个数组，则递归调用
      if (Array.isArray(items[i].children)) {
        recursiveDelete(items[i].children);
      }
    }
  };
  // 调用递归函数处理新数组
  recursiveDelete(newAry);
  // 返回处理后的新数组
  return newAry;
};








import { parse, stringify,fromJSON,toJSON} from 'flatted'


export const JSONStringify = (obj = []) => {
  return obj ? stringify(obj) : obj
}
export const JSONParse = (obj) => {
  return obj ? parse(obj) : obj
}

export const getStorage = () => {
  let data = localStorage.getItem('VIEW_DATA')
  data = data ? JSONParse(data) : []
  return data
}

export const setStorage = (data) => {
  localStorage.removeItem('VIEW_DATA')
  const newData = data ?  _.cloneDeep(data) : []
  localStorage.setItem('VIEW_DATA',JSONStringify(newData))
}

// 滚动到页面
export const scrollToPage = (className)=>{
  if(!className) {
    return
  }
  const dom = document.querySelector(`.${className}`)
  if(dom && dom.scrollIntoView) {
    dom.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}



// 滚动到页面
export const scrollToLink = (link)=>{
  if(link) {
    link = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`
    window.open(link, '_blank')
  }
}
*/
