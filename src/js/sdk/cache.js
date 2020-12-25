import ContactUserController from "./service/ContactUserController"
import GroupController from "./service/GroupController"
import Long from 'long'
import utils from "./utils/utils";
import IndexedDBClient from "./utils/IndexedDBClient";
import Client from "./client";

/**
 * 数据缓存对象
 */
export default class Cache {

  constructor() {
    /********************************* */
    /** 联系人信息 ************************ */
    /********************************* */
    /**平台联系人列表 */
    this.businessUserMap = new Map();
    /**平台联系人列表版本 */
    this.businessUserListVersion = -1;
    /**公众号列表 */
    this.publicAccountMap = new Map();
    /**openAipUserList */
    this.openAipUserMap = new Map();
    /********************************* */
    /** 群信息 ************************ */
    /********************************* */
    /**群列表 */
    this.groupMap = new Map(); // 群列表
    /**群成员列表 */
    this.groupUserMap = new Map(); // 群成员列表
    /********************************* */
    /** 会话和消息 ************************ */
    /********************************* */
    /**会话列表 */
    this.sessionList = []; // 会话列表
    /**会话消息列表 */
    this.messagesMap = new Map(); // 会话消息列表
    /**透传消息列表 */
    this.passThroughMsgMap = new Map(); // 透传消息列表
    /**请求列表 */
    this.reqMap = new Map() // 请求列表
    /**最后一条消息id */
    this.lastSeqId = new Long(0, 0, true);
  }

  static getInstance() {
    if (!this.instance) {
      console.log("====> 初始化缓存对象")
      this.instance = new Cache();
    }
    window["jdyImWeb_Cache"] = ()=> this.instance;
    return this.instance;
  }

  /**
   * 初始化缓存数据
   */
  init() {
    console.log("--------> 构建缓存数据 <--------")
    return new Promise((resolve, reject) => {
      IndexedDBClient.getInstance().getAll(
        "Cache",
        res => {
          if (res && res.length > 0) {
            ContactUserController.getInstance().syncAllFromHttp().then(() => {
              for (let i = 0; i < res.length; i++) {
                const cacheData = res[i];
                switch (cacheData[0]) {
                  // this.businessUserMap = new Map();
                  case "businessUserMap": {
                    Cache.getInstance().businessUserMap = new Map(cacheData[1])
                    break;
                  }
                  // this.businessUserListVersion = -1;
                  case "businessUserListVersion": {
                    Cache.getInstance().businessUserListVersion = cacheData[1]
                    break;
                  }
                  // this.publicAccountMap = new Map();
                  case "publicAccountMap": {
                    Cache.getInstance().publicAccountMap = new Map(cacheData[1])
                    break;
                  }
                  // this.openAipUserMap = new Map();
                  case "openAipUserMap": {
                    Cache.getInstance().openAipUserMap = new Map(cacheData[1])
                    break;
                  }
                  // this.groupMap = new Map(); // 群列表
                  case "groupMap": {
                    Cache.getInstance().groupMap = new Map(cacheData[1])
                    break;
                  }
                  // this.groupUserMap = new Map(); // 群成员列表
                  case "groupUserMap": {
                    Cache.getInstance().groupUserMap = new Map(cacheData[1])
                    break;
                  }
                  // this.sessionList = []; // 会话列表
                  case "sessionList": {
                    Cache.getInstance().sessionList = this.buildSessions(cacheData[1]);
                    break;
                  }
                  // this.messagesMap = new Map(); // 会话消息列表
                  case "messagesMap": {
                    Cache.getInstance().messagesMap = this.buildMessages(cacheData[1]);
                    break;
                  }
                  // this.passThroughMsgs = new Map(); // 透传消息列表
                  // case "passThroughMsgs": {
                  //   Cache.getInstance().passThroughMsgs = this.buildReqMap(cacheData[1]);
                  //   break;
                  // }
                  // this.reqMap = new Map() // 请求列表
                  case "reqMap": {
                    Cache.getInstance().reqMap = this.buildReqMap(cacheData[1]);
                    break;
                  }
                  // this.lastSeqId = new Long(0, 0, true);
                  case "lastSeqId": {
                    Cache.getInstance().lastSeqId = Long.fromValue(cacheData[1])
                    break;
                  }
                }
              }
              resolve("cache")
            }).catch(err => {
              console.log(err)
            })
          } else {
            Promise.all([
              ContactUserController.getInstance().syncAllFromHttp(),
              GroupController.getInstance().syncAllFormHttp(),
            ]).then(res => {
              Client.getInstance().pullRecentlyRequest(20, 7);
              resolve("pullRecently");
            }).catch(err => {
              reject(err)
            })
          }
        },
        err => {
          reject();
        }
      );
    })
  }

  save() {
    if (!this.saveDebounce) {
      function save() {
        let dbDataArray = [{
          storeName: "Cache",
          data: [
            // this.businessUserMap = new Map();
            {
              key: "businessUserMap",
              value: ["businessUserMap", [...Cache.getInstance().businessUserMap]]
            },
            // this.businessUserListVersion = -1;
            {
              key: "businessUserListVersion",
              value: ["businessUserListVersion", Cache.getInstance().businessUserListVersion]
            },
            // this.publicAccountMap = new Map();
            {
              key: "publicAccountMap",
              value: ["publicAccountMap", [...Cache.getInstance().publicAccountMap]]
            },
            // this.openAipUserMap = new Map();
            {
              key: "openAipUserMap",
              value: ["openAipUserMap", [...Cache.getInstance().openAipUserMap]]
            },
            // this.groupMap = new Map(); // 群列表
            {
              key: "groupMap",
              value: ["groupMap", [...Cache.getInstance().groupMap]]
            },
            // this.groupUserMap = new Map();
            {
              key: "groupUserMap",
              value: ["groupUserMap", [...Cache.getInstance().groupUserMap]]
            },
            // this.sessionList = [];
            {
              key: "sessionList",
              value: ["sessionList", Cache.getInstance().sessionList]
            },
            // this.messagesMap = new Map();
            {
              key: "messagesMap",
              value: ["messagesMap", [...Cache.getInstance().messagesMap]]
            },
            // this.passThroughMsgs = new Map();
            // {
            //   key: "passThroughMsgs",
            //   value: ["passThroughMsgs", [...Cache.getInstance().passThroughMsgs]]
            // },
            // this.reqMap = new Map()
            {
              key: "reqMap",
              value: ["reqMap", [...Cache.getInstance().reqMap]]
            },
            // this.lastSeqId = new Long(0, 0, true);
            {
              key: "lastSeqId",
              value: ["lastSeqId", Cache.getInstance().lastSeqId]
            },
          ]
        }]
        IndexedDBClient.getInstance().save(dbDataArray)
      }
      this.saveDebounce = utils.debounce(save, 100)
    }
    return this.saveDebounce();
  }

  buildMessages(messageArrayMap) {
    let messageMap = new Map(messageArrayMap);
    for (let item of messageMap) {
      let key = item[0];
      let msgs = item[1];
      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        // 转换long型数据
        if (msg.sequenceId) {
          msgs[i].sequenceId = Long.fromValue(msg.sequenceId)
        }
        if (msg.timeStamp) {
          msgs[i].timeStamp = Long.fromValue(msg.timeStamp)
        }
        if (msg.chatMsg && msg.chatMsg.msgId) {
          msgs[i].chatMsg.msgId = Long.fromValue(msg.chatMsg.msgId)
        }
        // 转换值未数字0的字段
        if (!msg.groupType) {
          msgs[i].groupType = 0;
        }
        if (!msg.msgType) {
          msgs[i].msgType = 0;
        }
        if (!msg.msgSecondType) {
          msgs[i].msgSecondType = 0;
        }
      }
      messageMap.set(key, msgs);
    }
    return messageMap;
  }

  buildReqMap(reqArrayMap) {
    let reqMap = new Map(reqArrayMap);
    for (let item of reqMap) {
      let key = item[0];
      let msg = item[1];
      if (msg.sequenceId) {
        msg.sequenceId = Long.fromValue(msg.sequenceId)
      }
      if (msg.timeStamp) {
        msg.timeStamp = Long.fromValue(msg.timeStamp)
      }
      if (msg.chatMsg && msg.chatMsg.msgId) {
        msg.chatMsg.msgId = Long.fromValue(msg.chatMsg.msgId)
      }
      if (!msg.groupType) {
        msg.groupType = 0;
      }
      if (!msg.msgType) {
        msg.timeStamp = 0;
      }
      if (!msg.msgSecondType) {
        msg.msgSecondType = 0;
      }
      reqMap.set(key, msg);
    }
    return reqMap;
  }

  buildSessions(sessions) {
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      if (session.lastMsg) {
        if (session.lastMsg.sequenceId) {
          sessions[i].lastMsg.sequenceId = Long.fromValue(session.lastMsg.sequenceId)
        }
        if (session.lastMsg.timeStamp) {
          sessions[i].lastMsg.timeStamp = Long.fromValue(session.lastMsg.timeStamp)
        }
        if (session.lastMsg.chatMsg && session.lastMsg.chatMsg.msgId) {
          sessions[i].lastMsg.chatMsg.msgId = Long.fromValue(session.lastMsg.chatMsg.msgId)
        }

        if (!session.lastMsg.groupType) {
          sessions[i].lastMsg.groupType = 0;
        }
        if (!session.lastMsg.msgType) {
          sessions[i].lastMsg.msgType = 0;
        }
        if (!session.lastMsg.msgSecondType) {
          sessions[i].lastMsg.msgSecondType = 0;
        }
      }
      if (session.timeStamp) {
        sessions[i].timeStamp = Long.fromValue(session.timeStamp)
      }
    }
    return sessions;
  }

}
