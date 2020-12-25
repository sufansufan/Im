export default class IndexedDBClient {

  constructor() {
    /**
     * 数据库操作对象
     **/
    this.db = null;
    this.dbName = ""
  }

  /**
   * 获取数据库操作对象
   * @param {*} DBName 
   * @param {*} DBVersion 
   * @param {*} StoreArray 需要创建的仓库 eg：[{name:aa,options:{keyPath:id}}},{name:bb,options:{keyPath:id}}},...]
   */
  static getInstance(DBName, DBVersion, StoreArray, onsuccess) {
    if (!this.instance) {
      // 创建数据库对象
      this.instance = new IndexedDBClient();
      // 初始化数据库操作对象
      this.instance.dbName = DBName;
      var request = indexedDB.open(DBName, DBVersion);
      // 数据库版本变更或首次创建
      request.onupgradeneeded = (event) => {
        this.instance.db = event.target.result;
        for (let i = 0; i < StoreArray.length; i++) {
          const store = StoreArray[i];
          this.instance.db.createObjectStore(store.name, store.options);
        }
      };
      // 成功  
      request.onsuccess = (event) => {
        this.instance.db = event.target.result;
        if (onsuccess) {
          onsuccess();
        }
      };
      // 失败
      request.onerror = (event) => {
        alert("不能打开数据库,错误代码: " + event.target.errorCode);
      };
    } else {
      return this.instance;
    }
  }

  /**
   * 创建数据仓库
   * @param {*} name 仓库名称
   * @param {*} keyPath 主键名称
   */
  createStore(name, keyPath) {
    if (!this.db.objectStoreNames.contains(name)) {
      let options = {};
      if (keyPath) {
        options.keyPath = keyPath;
      }
      this.db.createObjectStore(name, options)
    }
  }

  /**
   * 删除数据库
   * @param {} dbDataArray 
   */
  delete() {
    indexedDB.deleteDatabase(this.dbName)
  }

  /**
   * 保存或更新
   * @param {*} dbDataArray
   */
  save(dbDataArray) {
    let transactionArray = [];
    for (var i = 0; i < dbDataArray.length; i++) {
      let storeDataObj = dbDataArray[i];
      let transaction = this.db.transaction(storeDataObj.storeName, "readwrite");
      transaction.oncomplete = () => {}
      transaction.onerror = () => {}
      transaction.onabort = () => {}
      transactionArray.push(transaction);
    }

    try {
      for (var i = 0; i < transactionArray.length; i++) {
        let transaction = transactionArray[i];
        let storeDataObj = dbDataArray[i];
        let objectStore = transaction.objectStore(storeDataObj.storeName)
        for (var j = 0; j < storeDataObj.data.length; j++) {
          let data = storeDataObj.data[j];
          let request = objectStore.put(data.value, data.key)
          request.onsuccess = (event) => {

          };
          request.onerror = () => {
            for (var k = 0; k < transactionArray.length; k++) {
              let transaction = transactionArray[k];
              transaction.abort();
            }
          }
        }
      }
    } catch (e) {
      for (var i = 0; i < transactionArray.length; i++) {
        let transaction = transactionArray[i];
        transaction.abort();
      }
    }
  };

  /** 
   * 查询所有
   */
  getAll(db_store_name, success, error) {
    let request = this.db
      .transaction(db_store_name, "readwrite")
      .objectStore(db_store_name)
      .getAll();

    request.onsuccess = (event) => {
      if (success) {
        success(event.target.result)
      }
    }
    request.onerror = (err) => {
      if (error) {
        error(err)
      }
    }
  };
}
