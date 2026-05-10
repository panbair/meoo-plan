import { onMounted, onUnmounted } from 'vue'
import IndexedDBHelper from './indexDb'

export const useIndexDb = (options) => {
  let dbHelper = null
  const dbName = 'oiommAppDB'
  const storeName = 'oioData'

  const open = async () => {
    try {
      // 检查浏览器支持
      if (!IndexedDBHelper.isSupported()) {
        console.warn('当前浏览器不支持 IndexedDB，将使用降级方案')
        // 可以在这里初始化 localStorage 等降级方案
        return Promise.reject(new Error('浏览器不支持 IndexedDB'))
      }

      // 初始化数据库
      dbHelper = new IndexedDBHelper(dbName, 1)

      // 打开数据库并创建仓库
      await dbHelper.openDB(options || [{
        name: storeName,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
          { name: 'list', keyPath: 'list', unique: true },
          { name: 'name', keyPath: 'name', unique: false },
          { name: 'templateView', keyPath: 'templateView', unique: false }
        ]
      }])

      console.log('数据库初始化成功')
      return Promise.resolve()
    } catch (error) {
      console.error('数据库初始化失败:', error)
      return Promise.reject(error)
    }
  }

  const addData = async (data) => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      const id = await dbHelper.addData(storeName, data)
      console.log('添加用户数据，主键为:', id)
      return Promise.resolve(id)
    } catch (error) {
      console.error('添加数据失败:', error)
      return Promise.reject(error)
    }
  }

  const searchData = async (id) => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      // 查询数据
      const result = await dbHelper.getDataByKey(storeName, id)
      console.log('查询到的用户数据:', result)
      return Promise.resolve(result)
    } catch (error) {
      console.error('查询数据失败:', error)
      return Promise.reject(error)
    }
  }

  const searchIndex = async (indexName, indexValue) => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      // 通过索引查询
      const result = await dbHelper.getDataByIndex(storeName, indexName, indexValue)
      console.log(`通过索引 ${indexName} 查询到的数据:`, result)
      return Promise.resolve(result)
    } catch (error) {
      console.error('索引查询失败:', error)
      return Promise.reject(error)
    }
  }

  const updateData = async (data) => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      const result = await dbHelper.updateData(storeName, data)
      console.log('更新数据成功:', result)
      return Promise.resolve(result)
    } catch (error) {
      console.error('更新数据失败:', error)
      return Promise.reject(error)
    }
  }

  const deleteData = async (id) => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      await dbHelper.deleteData(storeName, id)
      console.log('删除数据成功，ID:', id)
      return Promise.resolve()
    } catch (error) {
      console.error('删除数据失败:', error)
      return Promise.reject(error)
    }
  }

  const getAllData = async () => {
    try {
      // 检查数据库连接
      if (!dbHelper || !dbHelper.isConnected()) {
        throw new Error('数据库未连接')
      }

      const result = await dbHelper.getAllData(storeName)
      console.log('获取所有数据:', result)
      return Promise.resolve(result)
    } catch (error) {
      console.error('获取所有数据失败:', error)
      return Promise.reject(error)
    }
  }

  const close = () => {
    try {
      // 组件销毁时关闭数据库连接
      if (dbHelper && dbHelper.isConnected()) {
        dbHelper.closeDB()
        console.log('数据库连接已关闭')
      }
      return Promise.resolve()
    } catch (error) {
      console.error('关闭数据库失败:', error)
      return Promise.reject(error)
    }
  }

  onMounted(async () => {
    try {
      await open()
    } catch (error) {
      console.error('数据库初始化失败:', error)
    }
  })

  onUnmounted(() => {
    close()
  })

  return {
    open,
    close,
    addData,
    searchData,
    searchIndex,
    updateData,
    deleteData,
    getAllData
  }
}
