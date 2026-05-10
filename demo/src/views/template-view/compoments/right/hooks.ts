import { ElLoading, ElMessage } from 'element-plus'

export const useUtil = (option = {}) =>{
  let loading = null
  const open = () => {
    loading = ElLoading.service({
      lock: true,
      text: '加载中。。。',
      background: 'rgba(0, 0, 0, 0.7)',
      ...option
    })
  }
  const close = () => {
    if(loading && loading.close) {
      loading.close()
    }
  }
  const success = (msg)=>{
    ElMessage.success(msg || '操作成功')
  }
  const error = (msg)=>{
    ElMessage.error(msg || '操作失败')
  }
  return {
    loading,
    open,
    close,
    success,
    error
  }
}