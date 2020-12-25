import protobuf from 'protobufjs'
import Messages from './proto/proto'
import MD5 from './utils/md5'
import OSS from 'ali-oss'
import UUID from 'uuid'
import Long from 'long'

let ImWebSocket = Messages.lookup('ImWebSocket')
let ImRequest = Messages.lookup('ImRequest')
let ChatRequest = Messages.lookup('ChatRequest')
let LoginInfoRequest = Messages.lookup('LoginInfoRequest')
let PullMsgRequest = Messages.lookup('PullMsgRequest')
let PullHistoryRequest = Messages.lookup('PullHistoryRequest')
let OperationRequest = Messages.lookup('OperationRequest')
let PullRecentlyRequest = Messages.lookup('PullRecentlyRequest')

let ImResponse = Messages.lookup('ImResponse')
let ChatResponse = Messages.lookup('ChatResponse')
let LoginInfoResponse = Messages.lookup('LoginInfoResponse')
let PullMsgResponse = Messages.lookup('PullMsgResponse')
let PullHistoryResponse = Messages.lookup('PullHistoryResponse')
let OperationResponse = Messages.lookup('OperationResponse')
let PullRecentlyResponse = Messages.lookup('PullRecentlyResponse')

let ImNotify = Messages.lookup('ImNotify')
let ChatMsg = Messages.lookup('ChatMsg')
let HeartPing = Messages.lookup('HeartPing')

import Cache from './cache'
import SingletonAxios from './utils/SingletonAxios'
import ConstantType from './constant/ConstantType'
import MessagesController from './service/MessagesController'
import openApi from './api/openApi'
import IndexedDBClient from './utils/IndexedDBClient'
import SessionsController from './service/SessionsController'

/**
 * PC SDK
 */
export default class Client {

  constructor() {

  }

  /**
   * 获取sdk实例
   * @param params
   */
  static getInstance(params) {
    if (!this.instance) {
      console.log("====> 初始化SDK <====")
      if (params) {
        // console.log("====> 初始化客户端对象")
        if (!this.instance) {
          this.instance = new Client();
        }
        // console.log("====> 初始化参数")
        this.instance.token = this.instance.getParams(params, "token", "未找到Token")
        this.instance.account = this.instance.getParams(params, "account", "未找到account")
        this.instance.deviceId = this.instance.getDeviceId();
        this.instance.url = this.instance.getParams(params, "url", "未找到url（wss地址）")
        this.instance.openApiUrl = this.instance.getParams(params, "openApiUrl", "未找到openApiUrl")
        this.instance.companyId = this.instance.getParams(params, "companyId", "未找到companyId")
        // this.instance.companyId = "c9df55fd12354295a50f0293731ee15d"
        // this.instance.companyId = ""
        this.instance.origin = (window.top == window.self ? "" : parent.location.origin);
        // console.log("====> 初始化回调函数")
        this.instance.onMsg = this.instance.getParams(params, "onMsg", "未找到onMsg（消息通知回掉）")
        this.instance.onConnect = this.instance.getParams(params, "onConnect", "未找到onConnect（连接成功回调）")
        this.instance.onDisconnect = this.instance.getParams(params, "onDisconnect", "未找到onDisconnect（断开连接回调）")
        this.instance.onError = this.instance.getParams(params, "onError", "未找到onError（连接错误回调）")
        this.instance.onNotify = this.instance.getParams(params, "onNotify", "未找到onNotify（通知回调）")
        this.instance.onNoAuthorization = this.instance.getParams(params, "onNoAuthorization", "未找到onNoAuthorization（身份失效回调）")
        this.instance.onInit = this.instance.getParams(params, "onInit", "未找到onInit（初始化完成回调）")
        // console.log("====> 初始化oss 相关配置信息")
        this.instance.env = this.instance.getParams(params, "env", "未找到oss环境")
        this.instance.OSS_PATH_BUCKET = 'jdyh-im' + this.instance.env;
        this.instance.OSS_PATH_REGION = 'oss-cn-zhangjiakou';
        this.instance.ALL_OSS_ENDPOINT = 'oss-cn-zhangjiakou.aliyuncs.com';
        // 初始化数据库对象
        let StoreArray = [{
          name: "Cache"
        }]
        this.instance.IndexedDBClient = IndexedDBClient.getInstance(this.instance.account + "_im1.2", 1, StoreArray);
        // 初始化Axios对象
        this.instance.Axios = SingletonAxios.getInstance(this.instance.token, this.instance.onNoAuthorization);
        console.log("====> 初始化完成 <====")
        console.log(">>>>>>>>> 开始自动连接socket服务")
        this.instance.isAutoReconnect = params.isAutoReconnect;
        if (this.instance.isAutoReconnect) {
          this.instance.connect();
        } else {
          console.log("==== 未设置自动连接，正在等待连接操作")
        }
      }
    }
    window["jdyImWeb_Client"] = ()=> this.instance;
    return this.instance;
  }

  /**
   * 打开websocket连接
   * @param callback
   */
  connect() {
    console.log("====> 开始建立连接")
    this.conn = new WebSocket(this.url + '/websocket')
    this.conn.binaryType = 'arraybuffer'
    this.conn.onopen = () => {
      console.log("<!!!! 连接建立成功")
      this.connected = true
      this.onOpen()
    }
    this.conn.onclose = () => {
      console.log("<!!!! 连接关闭")
      this.connected = false
      this.onClose()
    }
    this.conn.onError = (event) => {
      console.log("<!!!! 发生错误")
      this.onError(event)
    }
    this.conn.onmessage = (event) => {
      this.onMessage(event.data)
    }
  }

  /**
   * 断开websocket连接
   * @param callback
   */
  disconnect() {
    this.conn.close();
  }

  /**
   * 建立连接
   */
  onOpen() {
    this.sendLoginRequest();
    this.reconnectUtil.stop()
  }

  /**
   * 断开链接
   */
  onClose() {
    this.heartCheckUtil.stop();
    MessagesController.getInstance().checkLocalMsgStatus(() => {
      this.refreshCache()
    });
    if (this.onDisconnect) {
      this.onDisconnect();
    }
    if (this.isAutoReconnect) {
      this.reconnectUtil.start()
    }
  }

  /**
   * 连接过程出现异常
   * @param error
   */
  onError(error) {
    console.error(error);
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * 连接过程的通信
   * @param message
   */
  onMessage(message) {
    const buf = protobuf.util.newBuffer(message)
    let websocket = ImWebSocket.decode(buf)

    if (websocket.type == ConstantType.WebSocketType.response) {
      console.log("<<<<< 收到服务器的消息 TYPE：" + websocket.type + " ACTION: " + websocket.action)

      // ========== 0.登录请求响应
      if (websocket.action == ConstantType.ActionType.LOGIN) {
        let loginInfoResponse = LoginInfoResponse.decode(websocket.body)
        console.log("====> 【登录请求响应】 heartTime= " + loginInfoResponse.heartTime.toString() + " code= " + loginInfoResponse.imResponse.code + " msg= " + loginInfoResponse.imResponse.msg)
        // 登录成功
        if (loginInfoResponse.imResponse.code == ConstantType.ResultCodeConstant.SUCCESS) {
          // 加载业务数据
          this.onConnect(); // 执行链接成功调
          Cache.getInstance().init().then(res => {
            this.heartCheckUtil.start(loginInfoResponse.heartTime) // 开始心跳
            if (res == "cache") {
              this.pullMessage();
            } else if (res == "pullRecently") {}
            this.refreshCache(); // 刷新cache
          })
        }
        // 登录失败
        if (loginInfoResponse.imResponse.code == ConstantType.ResultCodeConstant.NO_TOKEN) {
          this.onNoAuthorization(loginInfoResponse.imResponse.code); // 执行登陆失败的回调
        }
      }

      // ========= 1.处理心跳响应
      if (websocket.action == ConstantType.ActionType.HEARTPING) {
        let heartPing = HeartPing.decode(websocket.body);
        console.log("====> 【心跳请求响应】 最新的newestSeqID= " + heartPing.newestSeqID.toString() + " 当前lastSeqId= " + Cache.getInstance().lastSeqId.toString())
        Cache.getInstance().newestSeqID = heartPing.newestSeqID;
        if (Cache.getInstance().lastSeqId.lt(heartPing.newestSeqID)) {
          console.log("====> 检测到【最新消息标识】拉取离线消息")
          this.pullMessage();
        }
      }

      // ========= 11.处理拉取离线消息响应
      if (websocket.action == ConstantType.ActionType.PULLMSG) {
        console.log("====> 【拉取离线消息响应】 ")
        let pullMsgResponse = PullMsgResponse.decode(websocket.body)
        if (pullMsgResponse.msgList && pullMsgResponse.msgList.length > 0) {
          MessagesController.getInstance().sortMsgList(pullMsgResponse.msgList);
          Cache.getInstance().lastSeqId = pullMsgResponse.msgList[pullMsgResponse.msgList.length - 1].sequenceId;
          MessagesController.getInstance().dispatchMessage(
            pullMsgResponse.msgList,
            true,
            () => {
              if (Cache.getInstance().lastSeqId.lt(Cache.getInstance().newestSeqID)) {
                console.log("========= 未拉取到【最新消息标识】拉取离线消息")
                this.pullMessage();
              } else if (Cache.getInstance().newestSeqID.toString() == 0) {
                console.log("========= 检测到【用户登录】拉取离线消息");
                this.pullMessage();
              } else {
                this.refreshCache()
              }
            }
          );
        } else {
          this.onInit();
        }
      }

      // ========= 12.处理拉取历史消息响应
      if (websocket.action == ConstantType.ActionType.HISTORYMSG) {
        let pullHistoryResponse = PullHistoryResponse.decode(websocket.body);
        console.log("--------> 【拉取历史消息响应】 ")
        if (pullHistoryResponse.msgList && pullHistoryResponse.msgList.length > 0) {
          MessagesController.getInstance().sortMsgList(pullHistoryResponse.msgList);
          MessagesController.getInstance().dispatchHistoryMessage(
            pullHistoryResponse.msgList,
            SessionsController.getInstance().getSessionId(this.account, pullHistoryResponse.msgTo, pullHistoryResponse.groupType),
            () => {
              this.refreshCache();
            }
          );
        }
      }

      // ========= 13.从服务器拉取最近消息的响应
      if (websocket.action == ConstantType.ActionType.RecentlyMsg) {
        let pullRecentlyResponse = PullRecentlyResponse.decode(websocket.body)
        console.log("--------> 【拉取最近消息的响应】 ")
        if (pullRecentlyResponse.msgList && pullRecentlyResponse.msgList.length > 0) {
          MessagesController.getInstance().sortMsgList(pullRecentlyResponse.msgList);
          Cache.getInstance().lastSeqId = pullRecentlyResponse.msgList[pullRecentlyResponse.msgList.length - 1].sequenceId;
          MessagesController.getInstance().dispatchMessage(pullRecentlyResponse.msgList, true, () => {
            this.refreshCache();
            this.onInit();
          });
        } else {
          this.refreshCache();
          this.onInit();
        }
      }

      // ========= 21.处理聊天消息响应
      if (websocket.action == ConstantType.ActionType.CHATING) {
        let chatResponse = ChatResponse.decode(websocket.body)
        console.log("--------> 【聊天消息响应】 ")
        // 根据reponseId得到发送的消息并更改状态
        if (Cache.getInstance().reqMap.get(chatResponse.imResponse.reponseId)) {
          Cache.getInstance().reqMap.get(chatResponse.imResponse.reponseId).sendState = ConstantType.MsgSendState.SUCCESS;
          MessagesController.getInstance().updateLocalMessage(ConstantType.ActionType.CHATING, Cache.getInstance().reqMap.get(chatResponse.imResponse.reponseId))
          Cache.getInstance().reqMap.delete(chatResponse.imResponse.reponseId);
          this.refreshCache()
        }
      }

      // ========= 22.处理操作消息响应
      if (websocket.action == ConstantType.ActionType.OPERATING) {
        let operationResponse = OperationResponse.decode(websocket.body)
        console.log("--------> 【操作消息响应】 timeStamp=" + operationResponse.timeStamp.toString() + " code=" + operationResponse.imResponse.code + " msg=" + operationResponse.imResponse.msg)
        let msgTemp = Cache.getInstance().reqMap.get(operationResponse.imResponse.reponseId);
        if (msgTemp) {
          MessagesController.getInstance().updateLocalMessage(ConstantType.ActionType.OPERATING, msgTemp)
          Cache.getInstance().reqMap.delete(operationResponse.imResponse.reponseId);
          this.refreshCache();
        }
      }
    } else if (websocket.type == ConstantType.WebSocketType.notification) {
      // 处理通知
      let imNotify = ImNotify.decode(websocket.body)
      console.log("--------> 【通知响应】 最新 lastseqId= " + imNotify.lastseqId.toString() + " 当前lastSeqId= " + Cache.getInstance().lastSeqId.toString())
      Cache.getInstance().newestSeqID = imNotify.lastseqId;
      if (Cache.getInstance().lastSeqId.lt(imNotify.lastseqId)) {
        console.log("========= 通知响应检测到【最新消息标识】")
        this.pullMessage();
      }
    }
  }

  /**
   * 发送登录请求
   *
   */
  sendLoginRequest() {
    console.log("--------> 发送登录请求 <--------")
    let requestId = this.getRequestId();
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let loginInfoRequest = LoginInfoRequest.create({
      imRequest: imRequest,
      deviceId: this.deviceId,
      token: this.token,
      clientType: 1,
      clientOS: 2,
      appVersion: '1.0.0'
    })
    let loginInfoRequestBuffer = LoginInfoRequest.encode(loginInfoRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.LOGIN,
      imuid: 0,
      lenth: loginInfoRequestBuffer.length,
      crc32: 0,
      body: loginInfoRequestBuffer
    })
    let loginBuffer = ImWebSocket.encode(imWebSocket).finish()
    this.send(loginBuffer);
  }

  /**
   * 与消息服务器通信
   * @param message
   */
  send(message) {
    if (this.connected) {
      this.conn.send(message)
    }
  }

  /**
   * 发送文本消息
   *
   * @param groupType 消息通道类型，分为：单聊、群聊
   * @param to 消息的接收方
   * @param text 发送的消息文本
   * @param isLocal 是否是本地消息
   * @param callback 回调
   * @param unRead 未读人数
   * @param atList 人员对象数组(包含id和名称)
   */
  sendTextMessage(groupType, from, to, text, isLocal, callback, unRead, atList) {
    let requestId = this.getRequestId();
    let msgId = this.getMessageId();
    console.log(">>>>>>>>> 发送文本消息请求 :" + requestId);

    let chatmsg = {
      msgId: msgId,
      content: text,
      description: '',
      remark: '',
      deviceId: this.deviceId,
      platform: 0,
      atList: atList
    };
    let msg = {
      sequenceId: "",
      msgType: ConstantType.MsgType.CHAT,
      groupType: parseInt(groupType),
      msgSecondType: ConstantType.CharSecondType.CAHT_TEXT,
      msgFrom: from + "",
      msgTo: to + "",
      timeStamp: Long.fromString(new Date().getTime().toString()),
      sendState: ConstantType.MsgSendState.SENDING,
      chatMsg: chatmsg,
      unRead: parseInt(unRead),
      readStatus: false
    };
    Cache.getInstance().reqMap.set(requestId, msg);
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let chatMsg = ChatMsg.create(chatmsg)
    let chatRequest = ChatRequest.create({
      imRequest: imRequest,
      msgTo: to + "",
      msgSecondType: ConstantType.CharSecondType.CAHT_TEXT,
      groupType: parseInt(groupType),
      chatMsg: chatMsg
    })
    let charRequestBuffer = ChatRequest.encode(chatRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.CHATING,
      imuid: parseInt(from),
      lenth: charRequestBuffer.length,
      crc32: 0,
      body: charRequestBuffer
    })
    let sendTextMessageBuffer = ImWebSocket.encode(imWebSocket).finish();
    this.send(sendTextMessageBuffer);
    MessagesController.getInstance().addLocalMessage(msg, () => {
      this.refreshCache()
    });
    if (callback) {
      callback(msg);
    }
  }

  /**
   * 重发送文本消息
   *
   * @param msg
   *
   */
  reSendTextMessage(remsg) {
    let requestId = this.getRequestId();
    console.log(">>>>>>>>> 发送文本消息请求 :" + requestId)
    let msg = {
      sequenceId: "",
      msgType: ConstantType.MsgType.CHAT,
      groupType: remsg.groupType,
      msgSecondType: ConstantType.CharSecondType.CAHT_TEXT,
      msgFrom: remsg.msgFrom,
      msgTo: remsg.msgTo,
      timeStamp: new Date().getTime(),
      sendState: ConstantType.MsgSendState.SENDING,
      chatMsg: remsg.chatMsg,
      unRead: remsg.unRead,
      readStatus: false
    };
    Cache.getInstance().reqMap.set(requestId, msg);
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let chatMsg = ChatMsg.create(remsg.chatMsg)
    let chatRequest = ChatRequest.create({
      imRequest: imRequest,
      msgTo: remsg.msgTo,
      msgSecondType: ConstantType.CharSecondType.CAHT_TEXT,
      groupType: remsg.groupType,
      chatMsg: chatMsg
    })
    let charRequestBuffer = ChatRequest.encode(chatRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.CHATING,
      imuid: remsg.msgFrom,
      lenth: charRequestBuffer.length,
      crc32: 0,
      body: charRequestBuffer
    })
    let sendTextMessageBuffer = ImWebSocket.encode(imWebSocket).finish();
    this.send(sendTextMessageBuffer);
    MessagesController.getInstance().deleteLocalMessage(remsg);
    MessagesController.getInstance().addLocalMessage(msg);
  }

  /**
   * 发送文件消息
   *
   * @param groupType
   * @param from
   * @param to
   * @param file
   * @param isLocal
   * @param callback
   * @param unRead
   */
  sendFileMessage(groupType, from, to, charSecondType, file, isLocal, callback, unRead) {
    let requestId = this.getRequestId();
    let msgId = this.getMessageId();
    console.log(">>>>>>>>> 发送文件消息请求 :" + requestId)
    file = new File([file ], file.name,{type:file.type});
    this.uploadFile(charSecondType, file).then((url) => {
      let chatmsg = {
        msgId: msgId,
        content: url,
        description: file.name,
        remark: file.size + "",
        deviceId: self.deviceId,
        platform: 0,
        atList: ''
      };
      let msg = {
        sequenceId: "",
        msgType: ConstantType.MsgType.CHAT,
        groupType: parseInt(groupType),
        msgSecondType: parseInt(charSecondType),
        msgFrom: from + "",
        msgTo: to + "",
        timeStamp: Long.fromString(new Date().getTime().toString()),
        sendFile: file,
        sendState: ConstantType.MsgSendState.SENDING,
        sendTime: Long.fromString(new Date().getTime().toString()),
        chatMsg: chatmsg,
        unRead: parseInt(unRead),
        readStatus: false
      };
      Cache.getInstance().reqMap.set(requestId, msg);
      let imRequest = ImRequest.create({
        requestId: requestId
      })
      let chatMsg = ChatMsg.create(chatmsg)
      let chatRequest = ChatRequest.create({
        imRequest: imRequest,
        msgTo: to + "",
        msgSecondType: parseInt(charSecondType),
        groupType: parseInt(groupType),
        chatMsg: chatMsg
      })
      let charRequestBuffer = ChatRequest.encode(chatRequest).finish()
      let imWebSocket = ImWebSocket.create({
        type: ConstantType.WebSocketType.request,
        action: ConstantType.ActionType.CHATING,
        imuid: from + "",
        lenth: charRequestBuffer.length,
        crc32: 0,
        body: charRequestBuffer
      })
      let sendTextMessageBuffer = ImWebSocket.encode(imWebSocket).finish()
      this.send(sendTextMessageBuffer);
      // self.addLocalMessage(msg);
      if (callback) {
        callback(msg);
      }
    }, (error) => {
      console.error(error)
      let chatmsg = {
        msgId: msgId,
        content: url,
        description: file.name,
        remark: file.size + "",
        deviceId: self.deviceId,
        platform: 0,
        atList: ''
      };
      let msg = {
        sequenceId: "",
        msgType: ConstantType.MsgType.CHAT,
        groupType: groupType,
        msgSecondType: charSecondType,
        msgFrom: from,
        msgTo: to,
        timeStamp: new Date().getTime(),
        sendFile: file,
        sendState: ConstantType.MsgSendState.FAIL,
        sendTime: new Date().getTime(),
        chatMsg: chatmsg,
        unRead: unRead,
        readStatus: false
      };
      MessagesController.getInstance().addLocalMessage(msg);
    });
  }

  /**
   * 转发文件消息
   *
   * @param groupType
   * @param from
   * @param to
   * @param file
   * @param isLocal
   * @param callback
   * @param unRead
   */
  forwardFileMessage(groupType, from, to, charSecondType, file, isLocal, callback, unRead) {
    let requestId = this.getRequestId();
    let msgId = this.getMessageId();
    console.log(">>>>>>>>> 转发文件消息请求 :" + requestId)
    let self = this;
    let chatmsg = {
      msgId: msgId,
      content: self.buildFileUrl(file.url),
      description: file.name,
      remark: file.size,
      deviceId: self.deviceId,
      platform: 0,
      atList: ''
    };
    let msg = {
      sequenceId: "",
      msgType: ConstantType.MsgType.CHAT,
      groupType: parseInt(groupType),
      msgSecondType: parseInt(charSecondType),
      msgFrom: from + "",
      msgTo: to + "",
      timeStamp: Long.fromString(new Date().getTime().toString()),
      sendFile: file,
      sendState: ConstantType.MsgSendState.SENDING,
      sendTime: Long.fromString(new Date().getTime().toString()),
      chatMsg: chatmsg,
      unRead: parseInt(unRead),
      readStatus: false
    };
    Cache.getInstance().reqMap.set(requestId, msg);
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let chatMsg = ChatMsg.create(chatmsg)
    let chatRequest = ChatRequest.create({
      imRequest: imRequest,
      msgTo: to + "",
      msgSecondType: parseInt(charSecondType),
      groupType: parseInt(groupType),
      chatMsg: chatMsg
    })
    let charRequestBuffer = ChatRequest.encode(chatRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.CHATING,
      imuid: from + "",
      lenth: charRequestBuffer.length,
      crc32: 0,
      body: charRequestBuffer
    })
    let sendTextMessageBuffer = ImWebSocket.encode(imWebSocket).finish()
    self.send(sendTextMessageBuffer);
    if (callback) {
      callback(msg);
    }
  }

  /**
   * 发送操作消息
   *
   * @param messageSeqId 消息标识
   * @param operationType 操作类型
   */
  sendOperationMessage(msgTo, messageSeqId, operationType, groupType) {
    let operationTypeStr = ""
    if (ConstantType.OperationMsgConstant.OPERATION_READ == operationType) {
      operationTypeStr = "消息已读（未读数量-针对消息发送者）"
    } else if (ConstantType.OperationMsgConstant.OPERATION_REVOCATION == operationType) {
      operationTypeStr = "消息撤回"
    } else if (ConstantType.OperationMsgConstant.OPERATION_DELETE == operationType) {
      operationTypeStr = "消息删除"
    } else if (ConstantType.OperationMsgConstant.OPERATION_READ_STATUS == operationType) {
      operationTypeStr = "消息阅读状态（是否已读-针对消息接受者）"
    } else if (ConstantType.OperationMsgConstant.OPERATION_CHECK_STATUS == operationType) {
      operationTypeStr = "消息接收状态（是否已收）"
    }

    console.log(">>>>>>>>> 发送操作消息请求 :" + operationType + " " + "【" + operationTypeStr + "】")

    let requestId = this.getRequestId();
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let operationRequest = OperationRequest.create({
      imRequest: imRequest,
      operationSeqId: messageSeqId,
      operationType: parseInt(operationType)
    });
    let operationRequestBuffer = OperationRequest.encode(operationRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.OPERATING,
      imuid: parseInt(this.account),
      lenth: operationRequestBuffer.length,
      crc32: 0,
      body: operationRequestBuffer
    })
    let sendOperationMessageBuffer = ImWebSocket.encode(imWebSocket).finish()
    this.send(sendOperationMessageBuffer);
    let msg = {
      sequenceId: "",
      msgType: ConstantType.MsgType.OPERATION,
      msgFrom: this.account + "",
      msgTo: msgTo + "",
      groupType: parseInt(groupType),
      msgSecondType: parseInt(operationType),
      operationMsgBase: {
        operationSeqId: messageSeqId
      }
    };
    Cache.getInstance().reqMap.set(requestId, msg);
  }

  /**
   * 从服务器拉取离线消息
   *
   * @param lastSeqId 本地最新消息Id
   */
  pullMessage() {
    console.log('>>>>>>>>> 发送拉取离线消息请求')
    let requestId = this.getRequestId();
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let pullMsgRequest = PullMsgRequest.create({
      imRequest: imRequest,
      lastSeqId: Cache.getInstance().lastSeqId
    })
    let pullMsgRequestBuffer = PullMsgRequest.encode(pullMsgRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.PULLMSG,
      imuid: parseInt(this.account),
      lenth: pullMsgRequestBuffer.length,
      crc32: 0,
      body: pullMsgRequestBuffer
    })
    let pullMessageBuffer = ImWebSocket.encode(imWebSocket).finish()
    this.send(pullMessageBuffer);
  }

  /**
   * 从服务器拉取最近的消息
   *
   * @param limit 最大消息个数
   * @param days  最近天数
   */
  pullRecentlyRequest(limit, days) {
    console.log('>>>>>>>>> 发送从服务器拉取最近的消息请求')
    let requestId = this.getRequestId();
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let pullRecentlyRequest = PullRecentlyRequest.create({
      imRequest: imRequest,
      limit: parseInt(limit),
      days: parseInt(days)
    })
    let pullRecentlyRequestBuffer = PullRecentlyRequest.encode(pullRecentlyRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.RecentlyMsg,
      imuid: parseInt(this.account),
      lenth: pullRecentlyRequestBuffer.length,
      crc32: 0,
      body: pullRecentlyRequestBuffer
    })
    let pullRecentlyBuffer = ImWebSocket.encode(imWebSocket).finish()
    this.send(pullRecentlyBuffer);
  }

  /**
   * 从服务器拉取历史消息
   *
   * @param firstSeqId 起始消息Id
   * @param msgTo
   * @param groupType
   */
  pullHistoryMessage(firstSeqId, msgTo, groupType) {
    console.log('>>>>>>>>> 发送拉取历史消息请求')
    let requestId = this.getRequestId();
    let imRequest = ImRequest.create({
      requestId: requestId
    })
    let pullHistoryRequest = PullHistoryRequest.create({
      imRequest: imRequest,
      firstSeqId: firstSeqId,
      msgTo: msgTo + "",
      groupType: parseInt(groupType)
    })
    let pullHistoryRequestBuffer = PullHistoryRequest.encode(pullHistoryRequest).finish()
    let imWebSocket = ImWebSocket.create({
      type: ConstantType.WebSocketType.request,
      action: ConstantType.ActionType.HISTORYMSG,
      imuid: parseInt(this.account),
      lenth: pullHistoryRequestBuffer.length,
      crc32: 0,
      body: pullHistoryRequestBuffer
    })
    let pullHistoryMessageBuffer = ImWebSocket.encode(imWebSocket).finish()
    this.send(pullHistoryMessageBuffer);
  }

  /**
   * 构建消息atList
   * @param atPersonList
   * @param msg
   */
  buildAtList(atPersonList, isAtAll, msg) {
    if (atPersonList && msg) {
      let atList = new Array();
      let atText = '';
      if (atPersonList) {
        for (let i = 0; i < atPersonList.length; i++) {
          atList.push(atPersonList[i].imUid);
          atText += '@' + atPersonList[i].name + ' ';
        }
        if (isAtAll) {
          atText = '@所有人' + ' ';
        }
      }
      msg.content = atText + ' ' + msg.content;
      msg.atList = atList;
    }
  }

  /**
   * 构建文件消息URL
   * @param atPersonList
   * @param msg
   */
  buildFileUrl(url) {
    return url ? url.substring(0, url.lastIndexOf("?")) : '';
  }

  /**
   * 获取消息标识
   *
   * @returns {number}
   */
  getMessageId() {
    return Long.fromNumber(new Date().getTime() + Math.random() * 10, true);
  }

  /**
   * 获取请求标识
   * @returns {number}
   */
  getRequestId() {
    let requestId = 'req' + new Date().getTime() + Math.random() * 10;
    return requestId;
  }





  /***************************************************************************************  以下是以HTTP协议访问服务器进行的业务操作 ************************************************************************************************/





  /**
   * 获取OSS STS
   */
  getOssSTS() {
    return new Promise((resolve, reject) => {
      openApi.getOssSTS().then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      })
    })
  }

  /**
   * 获取到oss client
   *
   * @returns {Promise<any>}
   */
  getOSSClient() {
    return new Promise((resolve, reject) => {
      this.getOssSTS().then((data) => {
        let client = new OSS({
          region: this.OSS_PATH_REGION,
          accessKeyId: data.AccessKeyId,
          accessKeySecret: data.AccessKeySecret,
          endpoint: data.ALL_OSS_ENDPOINT,
          stsToken: data.SecurityToken,
          bucket: this.OSS_PATH_BUCKET,
          timeout: 60000
        })
        resolve(client);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  /**
   * 上传文件到服务器
   *
   * @param charSecondType 聊天消息二级分类
   * @param file 文件
   * @returns {Promise<any>}
   */
  uploadFile(charSecondType, file) {
    return new Promise((resolve, reject) => {
      this.getOSSClient().then((client) => {
        try {
          let objectName = this.getObjectName(charSecondType, file.name);
          let result = client.put(objectName, file, {
            headers: {
              'Content-Disposition': 'attachment;filename=' + encodeURIComponent(file.name)
            }
          }).then((res) => {
            resolve(res.res.requestUrls[0]);
          }).catch((err) => {
            reject(err);
          });
        } catch (e) {
          reject(err);
        }
      }, (err) => {
        reject(err);
      })
    })
  }

  /**
   * 获取上传文件时的OBJECTNAME
   *
   * @param charSecondType 聊天消息二级分类
   * @param fileName
   * @returns {string}
   */
  getObjectName(charSecondType, fileName) {
    let objectName = this.account;
    switch (charSecondType) {
      case ConstantType.CharSecondType.CAHT_AUDIO:
        objectName += '/audio';
        break;
      case ConstantType.CharSecondType.CAHT_IMAGE:
        objectName += '/image';
        break;
      case ConstantType.CharSecondType.CAHT_VIDEO:
        objectName += '/video';
        break;
      case ConstantType.CharSecondType.CAHT_FILE:
        objectName += '/file';
        break;
      default:
        objectName += '/other';
    }
    // objectName += '/'+new Date().getTime()+'/'+(charSecondType != this.CharSecondType.CAHT_IMAGE ? fileName :new Date().getTime()+this.getSuffixName(fileName) );
    objectName += '/' + UUID.v1() + this.getSuffixName(fileName);
    return objectName;
  }

  /**
   * 获取文件后缀名
   * @param fileName
   */
  getSuffixName(fileName) {
    if (fileName) {
      return fileName.substr(fileName.lastIndexOf('.'), fileName.length);
    } else {
      return null;
    }
  }

  /********************************************************************************* 以下是数据访问模块 ******************************************************************************************/



  /**
   * 心跳
   * @type {{start: IMClient.heartCheckUtil.start, reset: IMClient.heartCheckUtil.reset, stop: IMClient.heartCheckUtil.stop}}
   */
  heartCheckUtil = {
    /**
     * 开始心跳
     * @param heartbeats 心跳频率
     */
    start: (heartbeats) => {
      // this.heartbeats = heartbeats ? heartbeats : 60 * 1000;
      this.heartbeats = 60 * 1000;

      let imWebSocket = ImWebSocket.create({
        type: 0,
        action: 0,
        imuid: 0,
        lenth: 0,
        crc32: 0,
        body: null
      })
      this.heartmsg = ImWebSocket.encode(imWebSocket).finish()
      if (this.conn && this.conn.readyState == 1) {
        console.log(">>>>> 首次发送心跳")
        this.conn.send(this.heartmsg);
      }
      this.heartCheckObj = setInterval(() => {
        if (this.conn && this.conn.readyState == 1) {
          console.log(">>>>> 发送心跳")
          this.conn.send(this.heartmsg);
        }
      }, parseInt(this.heartbeats))
    },

    /**
     * 重置心跳
     * @param heartbeats 心跳频率
     */
    reset: (heartbeats) => {
      console.log("====> 重置心跳发送")
      clearTimeout(this.heartCheckObj)
      this.heartCheckUtil.start(heartbeats)
    },

    /**
     * 停止心跳
     */
    stop: () => {
      console.log("====> 关闭心跳发送")
      if (this.heartCheckObj) {
        clearTimeout(this.heartCheckObj)
      }
    }
  }

  /**
   * 重新连接
   */
  reconnectUtil = {
    start: () => {
      this.reconnectObj = setInterval(() => {
        if (this.conn.readyState == 3) {
          this.reconnectStarting = true
          this.connect()
        }
      }, 2000)
    },

    stop: () => {
      this.reconnectStarting = false
      if (this.reconnectObj) {
        clearTimeout(this.reconnectObj)
        this.reconnectObj = null
      }
    }
  }

















  /* -----------工具方法----------- */
  /**
   * 刷新数据缓存
   *
   */
  refreshCache() {
    let sessionList = Cache.getInstance().sessionList;
    for (let i = 0; i < sessionList.length; i++) {
      const session = sessionList[i];
      MessagesController.getInstance().sortMsgListByTimeStamp(Cache.getInstance().messagesMap.get(session.sessionId + ""));
      Cache.getInstance().sessionList[i].lastMsg = SessionsController.getInstance().getLastSessionMsg(session.sessionId);
    }
    this.onMsg(Cache.getInstance());
    Cache.getInstance().save();
  }

  /**
   * 获取deviceId
   * @returns {*}
   */
  getDeviceId() {
    return MD5(this.account + this.token);
  }

  /**
   * 获取参数并抛出异常
   * @param {Object} obj 源对象
   * @param {String} key 
   * @param {String} errorInfo 异常信息
   */
  getParams(obj, key, errorInfo) {
    if (!obj) {
      throw new Error("源对象为空");
    }
    if (!obj[key] && errorInfo) {
      throw new Error(errorInfo);
    }
    return obj[key];
  }
}
