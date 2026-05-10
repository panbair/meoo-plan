/**
 * IndexedDB 工具类 - 兼容多浏览器
 * 支持现代浏览器及 IE10+ 等旧版浏览器
 */
class IndexedDBHelper {
  constructor(dbName, version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null

    // 浏览器兼容性处理
    this.indexedDB = window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB

    // IDBKeyRange 兼容性处理
    this.IDBKeyRange = window.IDBKeyRange ||
            window.webkitIDBKeyRange ||
            window.msIDBKeyRange
  }

  /**
     * 检查浏览器是否支持 IndexedDB
     * @returns {boolean}
     */
  static isSupported() {
    return !!(window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB)
  }

  /**
     * 打开数据库连接
     * @param {Array} stores 仓库配置数组 [{name, keyPath, autoIncrement, indexes}]
     * @returns {Promise}
     */
  openDB(stores = []) {
    return new Promise((resolve, reject) => {
      if (!this.indexedDB) {
        reject(new Error('浏览器不支持 IndexedDB'))
        return
      }

      const request = this.indexedDB.open(this.dbName, this.version)

      request.onsuccess = (event) => {
        this.db = event.target.result
        console.log(`数据库 ${this.dbName} 打开成功`)
        resolve(this.db)
      }

      request.onerror = (event) => {
        console.error('数据库打开失败:', event.target.error)
        reject(new Error(`数据库打开失败: ${event.target.error}`))
      }

      request.onblocked = (event) => {
        console.warn('数据库打开被阻止:', event)
        reject(new Error('数据库打开被阻止'))
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        stores.forEach(storeConfig => {
          let objectStore

          // 如果仓库已存在，先删除再创建（仅在升级时）
          if (db.objectStoreNames.contains(storeConfig.name)) {
            db.deleteObjectStore(storeConfig.name)
          }

          // 创建对象仓库
          objectStore = db.createObjectStore(storeConfig.name, {
            keyPath: storeConfig.keyPath || 'id',
            autoIncrement: storeConfig.autoIncrement !== undefined ? storeConfig.autoIncrement : false
          })

          // 创建索引
          if (storeConfig.indexes && Array.isArray(storeConfig.indexes)) {
            storeConfig.indexes.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique !== undefined ? index.unique : false
              })
            })
          }
        })

        console.log(`数据库 ${this.dbName} 升级完成`)
      }
    })
  }

  /**
     * 关闭数据库连接
     */
  closeDB() {
    if (this.db) {
      this.db.close()
      this.db = null
      console.log(`数据库 ${this.dbName} 已关闭`)
    }
  }

  /**
     * 删除数据库
     * @param {string} dbName 数据库名称
     * @returns {Promise}
     */
  static deleteDB(dbName) {
    return new Promise((resolve, reject) => {
      const indexedDB = window.indexedDB ||
                window.mozIndexedDB ||
                window.webkitIndexedDB ||
                window.msIndexedDB

      if (!indexedDB) {
        reject(new Error('浏览器不支持 IndexedDB'))
        return
      }

      const deleteReq = indexedDB.deleteDatabase(dbName)

      deleteReq.onsuccess = () => {
        console.log(`数据库 ${dbName} 删除成功`)
        resolve()
      }

      deleteReq.onerror = (event) => {
        console.error('数据库删除失败:', event.target.error)
        reject(new Error(`数据库删除失败: ${event.target.error}`))
      }

      deleteReq.onblocked = () => {
        console.warn('数据库删除被阻止')
        reject(new Error('数据库删除被阻止'))
      }
    })
  }

  /**
     * 添加数据
     * @param {string} storeName 仓库名称
     * @param {object} data 数据对象
     * @returns {Promise}
     */
  addData(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.add(data)

      request.onsuccess = () => {
        console.log('数据添加成功')
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error('数据添加失败:', event.target.error)
        reject(new Error(`数据添加失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 批量添加数据
     * @param {string} storeName 仓库名称
     * @param {Array} dataList 数据数组
     * @returns {Promise}
     */
  addDataBatch(storeName, dataList) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const promises = []

      dataList.forEach(data => {
        const request = objectStore.add(data)
        const promise = new Promise((res, rej) => {
          request.onsuccess = () => res(request.result)
          request.onerror = (event) => rej(new Error(`数据添加失败: ${event.target.error}`))
        })
        promises.push(promise)
      })

      Promise.all(promises)
        .then(results => {
          console.log('批量数据添加成功')
          resolve(results)
        })
        .catch(error => {
          console.error('批量数据添加失败:', error)
          reject(error)
        })
    })
  }

  /**
     * 通过主键获取数据
     * @param {string} storeName 仓库名称
     * @param {any} key 主键值
     * @returns {Promise}
     */
  getDataByKey(storeName, key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.get(key)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error('数据查询失败:', event.target.error)
        reject(new Error(`数据查询失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 通过索引获取数据
     * @param {string} storeName 仓库名称
     * @param {string} indexName 索引名称
     * @param {any} indexValue 索引值
     * @returns {Promise}
     */
  getDataByIndex(storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const index = objectStore.index(indexName)
      const request = index.get(indexValue)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error('索引查询失败:', event.target.error)
        reject(new Error(`索引查询失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 获取所有数据
     * @param {string} storeName 仓库名称
     * @returns {Promise}
     */
  getAllData(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)

      // 使用 getAll (现代浏览器)
      if (objectStore.getAll) {
        const request = objectStore.getAll()

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = (event) => {
          console.error('获取所有数据失败:', event.target.error)
          reject(new Error(`获取所有数据失败: ${event.target.error}`))
        }
      } else {
        // 兼容旧版浏览器，使用游标遍历
        const data = []
        const request = objectStore.openCursor()

        request.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            data.push(cursor.value)
            cursor.continue()
          } else {
            resolve(data)
          }
        }

        request.onerror = (event) => {
          console.error('游标遍历失败:', event.target.error)
          reject(new Error(`游标遍历失败: ${event.target.error}`))
        }
      }
    })
  }

  /**
     * 通过游标读取数据
     * @param {string} storeName 仓库名称
     * @returns {Promise}
     */
  cursorGetData(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const data = []
      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.openCursor()

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        } else {
          resolve(data)
        }
      }

      request.onerror = (event) => {
        console.error('游标读取失败:', event.target.error)
        reject(new Error(`游标读取失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 通过索引和游标查询记录
     * @param {string} storeName 仓库名称
     * @param {string} indexName 索引名称
     * @param {any} indexValue 索引值
     * @returns {Promise}
     */
  cursorGetDataByIndex(storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const data = []
      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const index = objectStore.index(indexName)

      // 兼容性处理
      const keyRange = this.IDBKeyRange ?
        this.IDBKeyRange.only(indexValue) :
        IDBKeyRange.only(indexValue)

      const request = index.openCursor(keyRange)

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        } else {
          resolve(data)
        }
      }

      request.onerror = (event) => {
        console.error('索引游标查询失败:', event.target.error)
        reject(new Error(`索引游标查询失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 通过索引和游标分页查询记录
     * @param {string} storeName 仓库名称
     * @param {string} indexName 索引名称
     * @param {any} indexValue 索引值
     * @param {number} page 页码（从1开始）
     * @param {number} pageSize 每页条数
     * @returns {Promise}
     */
  cursorGetDataByIndexAndPage(storeName, indexName, indexValue, page, pageSize) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const data = []
      let counter = 0
      let advanced = true

      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const index = objectStore.index(indexName)

      // 兼容性处理
      const keyRange = this.IDBKeyRange ?
        this.IDBKeyRange.only(indexValue) :
        IDBKeyRange.only(indexValue)

      const request = index.openCursor(keyRange)

      request.onsuccess = (event) => {
        const cursor = event.target.result

        if (page > 1 && advanced) {
          advanced = false
          if (cursor) {
            cursor.advance((page - 1) * pageSize)
          } else {
            resolve(data)
          }
          return
        }

        if (cursor && counter < pageSize) {
          data.push(cursor.value)
          counter++
          cursor.continue()
        } else {
          resolve(data)
        }
      }

      request.onerror = (event) => {
        console.error('分页查询失败:', event.target.error)
        reject(new Error(`分页查询失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 更新数据
     * @param {string} storeName 仓库名称
     * @param {object} data 数据对象
     * @returns {Promise}
     */
  updateData(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.put(data)

      request.onsuccess = () => {
        console.log('数据更新成功')
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error('数据更新失败:', event.target.error)
        reject(new Error(`数据更新失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 通过主键删除数据
     * @param {string} storeName 仓库名称
     * @param {any} key 主键值
     * @returns {Promise}
     */
  deleteData(storeName, key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.delete(key)

      request.onsuccess = () => {
        console.log('数据删除成功')
        resolve()
      }

      request.onerror = (event) => {
        console.error('数据删除失败:', event.target.error)
        reject(new Error(`数据删除失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 通过索引和游标删除指定的数据
     * @param {string} storeName 仓库名称
     * @param {string} indexName 索引名
     * @param {any} indexValue 索引值
     * @returns {Promise}
     */
  cursorDelete(storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const deletedKeys = []
      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const index = objectStore.index(indexName)

      // 兼容性处理
      const keyRange = this.IDBKeyRange ?
        this.IDBKeyRange.only(indexValue) :
        IDBKeyRange.only(indexValue)

      const request = index.openCursor(keyRange)

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          const deleteRequest = cursor.delete()
          deletedKeys.push(cursor.key)

          deleteRequest.onsuccess = () => {
            console.log('游标删除记录成功')
          }

          deleteRequest.onerror = (event) => {
            console.error('游标删除记录失败:', event.target.error)
          }

          cursor.continue()
        } else {
          console.log(`通过索引 ${indexName} 删除了 ${deletedKeys.length} 条记录`)
          resolve(deletedKeys)
        }
      }

      request.onerror = (event) => {
        console.error('游标删除失败:', event.target.error)
        reject(new Error(`游标删除失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 清空仓库数据
     * @param {string} storeName 仓库名称
     * @returns {Promise}
     */
  clearStore(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readwrite')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.clear()

      request.onsuccess = () => {
        console.log(`仓库 ${storeName} 数据已清空`)
        resolve()
      }

      request.onerror = (event) => {
        console.error('清空数据失败:', event.target.error)
        reject(new Error(`清空数据失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 统计仓库中数据条数
     * @param {string} storeName 仓库名称
     * @returns {Promise}
     */
  count(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未连接'))
        return
      }

      const transaction = this.db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const request = objectStore.count()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error('统计数据条数失败:', event.target.error)
        reject(new Error(`统计数据条数失败: ${event.target.error}`))
      }
    })
  }

  /**
     * 检查数据库连接状态
     * @returns {boolean}
     */
  isConnected() {
    return !!this.db
  }
}

export default IndexedDBHelper
