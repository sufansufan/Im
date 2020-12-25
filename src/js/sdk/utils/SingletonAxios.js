import axios from "axios";
import ConstantType from "../constant/ConstantType"
import {
  Message
} from "element-ui";

export default class SingletonAxios {
  constructor() {

  }
  static getInstance(token, callback) {
    if (!this.instance) {
      console.log("====> 初始化Axios对象")
      // 创建axios实例
      this.instance = axios.create({
        baseURL: "",
        // 请求超时时间
        timeout: 1000 * 60,
        // // 用于对相应数据进行处理
        // transformRequest: [(data) => {
        //   let ret = ''
        //   for (let it in data) {
        //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //   }
        //   return ret
        // }],
        // 是否携带cookie信息
        withCredentials: true
      });

      // request拦截器
      this.instance.interceptors.request.use(
        config => {
          config.headers["token"] = token;
          config.headers["os"] = ConstantType.ClientType.WEB;
          config.headers["content-type"] = "application/json";
          return config;
        },
        error => {
          console.log(error); // for debug
          Promise.reject(error);
        }
      );

      // response 拦截器
      this.instance.interceptors.response.use(
        response => {
          return response.data;
        },
        error => {
          if (error.message == 'Network Error') {
            if (callback) {
              callback(2);
            }
          }
          return Promise.reject(error);
        }
      );
    }
    return this.instance;
  }
}
