/********************************************************** WEB SQL DATABASE FUNCTION *************************************************************/
let sqliteDB = function (dbname) {
  let db = openDatabase(dbname, '', '', 65536);
  return {
    //返回数据库名
    getDBName: function () {
      return dbname;
    },
    //初始化数据库，创建表结构
    init: function (tableName, colums) {
      this.switchTable(tableName);
      if (colums.length > 0) {
        this.createTable(colums)
      }
      return this;
    },
    //创建表，colums:[name:字段名,type:字段类型]
    createTable: function (colums) {
      let sql = "CREATE TABLE IF NOT EXISTS " + this._table;
      let t;
      if (colums instanceof Array && colums.length > 0) {
        t = [];
        for (let i in colums) {
          t.push(colums[i].name + ' ' + colums[i].type);
        }
        t = t.join(', ');
      } else if (typeof colums == "object") {
        t += colums.name + ' ' + colums.type;
      }
      sql = sql + " (" + t + ")";
      db.transaction(t => {
        t.executeSql(
          sql,
          null,
          (tx, results) => {

          },
          (tx, error) => {

          })

      })
    },
    //切换表
    switchTable: function (tableName) {
      this._table = tableName;
      return this;
    },
    //插入数据并执行回调函数，支持批量插入
    //data为Array类型，每一组值均为Object类型，每一个Obejct的属性应为表的字段名，对应要保存的值
    insertData: function (data, callback) {
      let that = this;
      let sql = "INSERT INTO " + this._table;
      if (data instanceof Array && data.length > 0) {
        let cols = [],
          qs = [];
        for (let i in data[0]) {
          cols.push(i);
          qs.push('?');
        }
        sql += " (" + cols.join(',') + ") Values (" + qs.join(',') + ")";
      } else {
        return false;
      }
      let p = [],
        d = data,
        pLenth = 0,
        r = [];
      for (let i = 0, dLength = d.length; i < dLength; i++) {
        let k = [];
        for (let j in d[i]) {
          k.push(d[i][j]);
        }
        p.push(k);
      }
      let queue = (b, result) => {
        if (result) {
          r.push(result.insertId || result.rowsAffected);
        }
        if (p.length > 0) {
          db.transaction(t => {
            t.executeSql(sql, p.shift(), queue, (tx, error) => {
              this.updateData(data[0],callback)
            });
          })
        } else {
          if (callback) {
            callback.call(this, r);
          }
        }
      }
      queue();
    },
    _where: '',
    //where语句，支持自写和以对象属性值对的形式
    where: function (where) {
      this._where = "";
      if (typeof where === 'object') {
        let j = this.toArray(where);
        this._where = j.join(' and ');
      } else if (typeof where === 'string') {
        this._where = where;
      }
      return this;
    },
    // 排序语句，propertyName:排序字段  ascending： 是否正序
    sort: function (sort) {
      this._sort = "";
      if (sort.propertyName) {
        this._sort = " ORDER BY " + sort.propertyName + " " + (sort.ascending ? "asc" : "desc")
      }
      return this;
    },
    // 分页语句，limit表明查询多少条结果，offset代表从第几条记录“之后“开始查询
    pagination: function (pagination) {
      this._pagination = "";
      if (pagination && typeof pagination === 'object') {
        if (Number.isInteger(pagination.limit) && Number.isInteger(pagination.offset)) {
          this._pagination = ' limit ' + pagination.limit + ' offset ' + pagination.offset;
        }
      }
      return this;
    },
    //更新数据，data为属性值对形式
    updateData: function (data, callback) {
      let that = this;
      let sql = "Update " + this._table;
      data = this.toArray(data).join(',');
      sql += " Set " + data + " where " + this._where;
      this.doQuery(sql, callback);
    },
    //根据条件保存数据，如果存在则更新，不存在则插入数据
    saveData: function (data, callback) {
      let sql = "Select * from " + this._table + " where " + this._where;
      let that = this;
      this.doQuery(sql, function (r) {
        if (r.length > 0 && r[0] != 0) {
          that.updateData(data, callback);
        } else {
          that.insertData([data], callback);
        }
      });
    },
    // 查询总条数
    getTotal(callback) {
      let sql = "select count(*) as total from " + this._table;
      this.doQuery(sql, callback);
    },
    //获取数据
    getData: function (callback) {
      let that = this;
      let sql = "Select * from " + that._table;
      that._where.length > 0 ? sql += " where " + that._where : "";
      that._sort ? sql += that._sort : "";
      that._pagination ? sql += that._pagination : "";
      that.doQuery(sql, callback);
    },
    //查询，内部方法
    doQuery: function (sql, callback) {
      let that = this;
      let a = [];
      let bb = (b, result) => {
        if (result.rows.length) {
          for (let i = 0; i < result.rows.length; i++) {
            a.push(result.rows.item(i));
          }
        }
        if (callback) {
          callback.call(that, a);
        }
      }
      db.transaction((t) => {
        t.executeSql(sql, [], bb, that.onfail);
      })
    },
    //根据条件删除数据
    deleteData: function (callback) {
      let that = this;
      let sql = "delete from " + that._table;
      that._where.length > 0 ? sql += " where " + that._where : '';
      that.doQuery(sql, callback);
    },
    //删除表
    dropTable: function () {
      let sql = "DROP TABLE IF EXISTS " + this._table;
      this.doQuery(sql);
    },
    onfail: (t, e) => {
      console.log(e.message)
    },
    toArray: function (obj) {
      let t = [];
      obj = obj || {};
      if (obj) {
        for (let i in obj) {
          t.push(i + "='" + obj[i] + "'");
        }
      }
      return t;
    }
  }
}

export default sqliteDB;
