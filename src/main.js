// ----- 设置主域
if (document.domain.indexOf("zgjdy.cn") !== -1) {
  document.domain = "zgjdy.cn"
}
// *******************************************
// ********* 初始化Vue
// *******************************************
import Vue from 'vue'

// ----- 移除vue启动时打印信息
Vue.config.productionTip = false;


// at.js
import $ from 'jquery'
import "./js/at/jquery.atwho.css"
import "./js/at/jquery.caret"
import "./js/at/jquery.atwho"

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);


// ----- 加载扩展组件
import "./js/expansion/expansion"

// ----- 加载全局过滤器
import "./filters/dateFormatFilter"

// ----- 发送消息组件
import VChateditor from 'v-chateditor'
Vue.use(VChateditor);

// ----- 操作剪切板组件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

// ----- 图片预览组件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview, {
  fullscreenEl: false,
  shareButtons: [{
    id: 'download',
    label: '下载',
    url: '{{raw_image_url}}',
    download: true
  }]
})

// ----- 自定义组件
import App from './App.vue'
import store from './store/index'
import urlUtils from './utils/urlUtils'
import Client from './js/sdk/client';

// ----- 初始化SDK
let setCacheTimeoutId = "";
let onNoAuthorizationTimeoutId = "";
Vue.prototype.SDK = Client.getInstance({
  // ********************* 配置
  isAutoReconnect: true,
  // ********************* 属性参数
  token: urlUtils.getParams("token"),
  account: urlUtils.getParams("account"),
  url: 'wss://' + urlUtils.getParams("ws"),
  openApiUrl: (window.location.protocol + "//") + urlUtils.getParams("openApiUrl"),
  companyId: urlUtils.getParams("companyId"),
  env: (parent.location.host.split(".")[0] == "www" ? "default" : parent.location.host.split(".")[0]),
  // ********************* 回调函数
  // cache刷新回调
  onMsg: (cache) => {
    clearTimeout(setCacheTimeoutId);
    setCacheTimeoutId = setTimeout(() => {
      console.log(cache);
      store.dispatch("setCache", cache);
      let meetingChatroomDom = parent.document.getElementById("meetingChatroom");
      if(meetingChatroomDom && meetingChatroomDom.contentWindow["meetingChatroom_onMsg"]){
        meetingChatroomDom.contentWindow["meetingChatroom_onMsg"](cache);
      }
      parent.localStorage.setItem("meetingChatroom_onMsg","true")
    }, 100);
  },
  // 连接成功回调
  onConnect: () => {
    store.dispatch("setHeaderLinkStatus", 1);
    let meetingChatroomDom = parent.document.getElementById("meetingChatroom");
    if(meetingChatroomDom && meetingChatroomDom.contentWindow["meetingChatroom_onConnect"]){
      meetingChatroomDom.contentWindow["meetingChatroom_onConnect"]();
    }
    parent.localStorage.setItem("meetingChatroom_onConnect","true")
  },
  // 断开连接回调
  onDisconnect: () => {
    store.dispatch("setHeaderLinkStatus", -1);
    let meetingChatroomDom = parent.document.getElementById("meetingChatroom");
    if(meetingChatroomDom && meetingChatroomDom.contentWindow["meetingChatroom_onDisconnect"]){
      meetingChatroomDom.contentWindow["meetingChatroom_onDisconnect"]();
    }
    parent.localStorage.setItem("meetingChatroom_onDisconnect","true")
  },
  // 连接错误回调
  onError: () => {

  },
  // 通知回调
  onNotify: () => {

  },
  // 身份失效回调
  onNoAuthorization: () => {
    clearTimeout(onNoAuthorizationTimeoutId);
    onNoAuthorizationTimeoutId = setTimeout(() => {
      ElementUI.MessageBox('身份失效，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        parent.app.logoutBs();
      }).catch(() => {
        parent.app.logoutBs();
      });
      let meetingChatroomDom = parent.document.getElementById("meetingChatroom");
      if(meetingChatroomDom && meetingChatroomDom.contentWindow["meetingChatroom_onNoAuthorization"]){
        meetingChatroomDom.contentWindow["meetingChatroom_onNoAuthorization"]();
      }
      parent.localStorage.setItem("meetingChatroom_onNoAuthorization","true")
    }, 100)
  },
  // 初始化完成回调
  onInit: () => {
    setTimeout(() => {
      Client.getInstance().refreshCache();
      store.dispatch("setCacheInitStatus");
      let meetingChatroomDom = parent.document.getElementById("meetingChatroom");
      if(meetingChatroomDom && meetingChatroomDom.contentWindow["meetingChatroom_onInit"]){
        meetingChatroomDom.contentWindow["meetingChatroom_onInit"]();
      }
      parent.localStorage.setItem("meetingChatroom_onInit","true")
    }, 100)
  }
});


// *******************************************
// ********* 浏览器配置
// *******************************************

// 阻止浏览器拖动元素
document.ondragstart = () => false;
// 关闭所有弹框
document.onclick = () => {
  store.dispatch("setHeaderSearchVisible", false);
  store.dispatch("setSessionTreeContextMenuVisible", false);
  store.dispatch("closeMessageContextmenuVisible");
}



new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
