import Axios from 'Axios'
import UUID from 'uuid'
/**
 * 异步请求池对象
 */
export default class AxiosRequestPool{

  constructor(token,os,maxNumber){
    console.log("初始化异步请求池对象")
    this.maxNumber = maxNumber?maxNumber:6;// 相同地址最大连接数
    this.connectionMap = new Map();// 连接存储对象


    // 全局的Axios默认值
    // Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    Axios.defaults.transformRequest = [ (data)=> {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }
    ];
    Axios.defaults.baseURL = '';
    Axios.defaults.headers.common['token'] = token;
    Axios.defaults.headers.common['os'] = os;
    Axios.defaults.withCredentials=true;
    Axios.defaults.timeout = 1000*60;
  }

  /**
   * 发起请求
   * @param type
   * @param url
   * @param params
   * @returns {*}
   */
  axios(type,url,params){
    const axiosObject = {uuid:UUID.v1(),type:type,url:url,params:params};
    let axiosObjects = this.connectionMap.get(url);
    if(axiosObjects && axiosObjects.length > 0 ){
      if(axiosObjects.length < this.maxNumber){
        axiosObjects.push(axiosObject);
        this.connectionMap.set(url,axiosObjects);
        return this.getAxios(axiosObject);
      }else{
        return new Promise((resolve,reject)=>{
          resolve();
        });
      }
    }else{
      axiosObjects = new Array();
      axiosObjects.push(axiosObject);
      this.connectionMap.set(url,axiosObjects);
      return this.getAxios(axiosObject);
    }
  }

  /**
   * 构建请求对象
   * @param axiosObject
   * @returns {*}
   */
  getAxios(axiosObject){
    if( axiosObject ){
      const uuid = axiosObject.uuid;
      const url = axiosObject.url;
      const type = axiosObject.type;
      const params = axiosObject.params;
      const self = this;
      console.log((type == 'get')+":==================")
      if(type == 'get'){
        return new Promise((resolve,reject)=>{
          Axios.get(url).then((response)=>{
            self.deleteAxiosObject(axiosObject);
            resolve(response);
          }).catch((response)=>{
            reject(response);
          });
        });
      }else if(type == 'post'){
        return new Promise((resolve,reject)=>{
          Axios.post(url,params).then((response)=>{
            self.deleteAxiosObject(axiosObject);
            resolve(response);
          }).catch((response)=>{
            reject(response);
          });
        });
      }
    }
    return null;
  };

  /**
   * 从请求池中删除请求对象
   * @param axiosObject
   */
  deleteAxiosObject(axiosObject) {
    if(axiosObject){
      let axiosObjects = this.connectionMap.get(axiosObject.url);
      let existIndex = -1;
      for(let i=0;i<axiosObjects.length;i++){
        if( axiosObjects[i].uuid == axiosObject.uuid ){
          existIndex = i;
        }
      }
      if(existIndex != -1){
        axiosObjects.splice(existIndex,1);
        this.connectionMap.set(axiosObject.url,axiosObjects);
      }
    }
  }
}


