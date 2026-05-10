/*
* @ description:
* @ author: panboren
* @ created_at: 2025/1/8 22:23
* @ QQ: 3248874747
*/
import _ from 'lodash'
import {delGsap} from './utils.ts'
import {useUtil} from './right/hooks.ts'
import {useIndexDb} from './useIndexDb.ts'
let util = useUtil()
export const UseApi = () => {
  let router = useRouter()
  let routes = useRoute()
  let queryOptions = routes.query || {}
  let projectListData = ref([])

  // let {
  //   addData,
  //   searchData,
  //   searchIndex,
  //   updateData,
  //   deleteData,
  //   getAllData
  // } = useIndexDb()

  let homeApi = useIndexDb()


  let query = reactive({
    templateView: '',
    id: '',
    state: '',
    ...queryOptions
  })
  // 页面数据数据
  let pageList = ref([])
  // 全部数据
  let listData = ref({})
  let getData = (param) => {
    param = param || {id: query?.id}
    if (!param.id) return util.error('没有找到请求的数据')
    return new Promise(async (resolve, reject) => {
      try {
        util.open()
        // 确保数据库已初始化
        await homeApi.open()
        let data = await homeApi.searchData(+param.id)
        console.log(data)
        listData.value = data || {}
        let list = listData.value?.list ? JSON.parse(listData.value?.list) : []
        pageList.value = list
        console.log(115, listData.value)
        console.log(list)
        util.close()
        util.success()
        resolve(data)
        console.log('edit',pageList.value)
        console.log('获取数据成功', data)
      } catch (error) {
        console.error('获取数据失败:', error)
        util.close()
        util.error()
        reject(error)
      }
    })
  }

  let updateData = (pageList,optios = {}) => {
    return new Promise(async (resolve, reject) => {
      let paramList = delGsap(pageList || [])
      let param = {
        ...optios,
        list: paramList ? JSON.stringify(paramList) : '',
        updateTime: Date.now()
      }
      // 如果没有 createTime，说明是旧数据，添加一个默认时间
      if (!param.createTime) {
        param.createTime = Date.now()
      }
      console.log(889996)
      console.log(param)
      try {
        util.open()
        let data = await homeApi.updateData(param)
        util.close()
        util.success()
        resolve(data)
      } catch (error) {
        util.error()
        reject(error)
        util.close()
      }
    })
  }


  // let param = {
  //   id: activeId.value,
  //   name: '首页',
  //   list: list.value ? JSON.stringify(list.value) : {}
  // }
  // optios 其他参数
  let addData = (pageList,optios = {}) => {
    return new Promise(async (resolve, reject) => {
      let paramList = delGsap(pageList || [])
      let param = {
        ...optios,
        list: paramList ? JSON.stringify(paramList) : '',
        createTime: Date.now(),
        updateTime: Date.now()
      }
      try {
        util.open()


        console.log(8889, param)

        let data = await homeApi.addData(param)
        util.close()
        util.success()
        resolve(data)
      } catch (error) {
        util.error()
        util.close()
        reject(error)
      }
    })
  }

  let download = async (param) => {
    param = param || {id: query?.id}
    if (!param.id) return util.error('请选择要下载内容')
    try {
      util.open()
      const blob =  await homeApi.download(param)
      if (!blob) {
        throw new Error('Network response was not ok')
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'oio-代码.zip' // 设置下载文件的名称
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      util.success()
      util.close()
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error)
      util.error()
      util.close()
    }
  }

  const downloadFile = async () => {
    try {
      const blob = await useFetch('/api/download-file', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'oiomm-code.zip')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('下载失败，请稍后再试')
    }
  }



  let getProjectList = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await homeApi.getAllData()
        console.log(222, data)
        projectListData.value = data || []
        resolve(  data || [])
      } catch (error) {
        console.error('获取数据失败:', error)
        reject(error)
      }
    })
  }


  let removeData = (param) => {
    return new Promise(async (resolve, reject) => {
      try {
        util.open()
        let data = await homeApi.deleteData(+param.id)
        util.close()
        util.success()
        resolve(data)
      } catch (error) {
        util.error()
        util.close()
        reject(error)
      }
    })
  }

  return {
    router,
    routes,
    query,
    pageList,
    listData,
    util,
    projectListData,
    getProjectList,// 获取项目列表
    removeData,// 删除数据
    getData, // 获取数据
    updateData, // 更新数据
    addData,// 添加数据
    download,// 下载数据
    downloadFile// 下载代码
  }


}
