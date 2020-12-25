import Cache from "../cache"
import ConstantType from "../constant/ConstantType";
import Client from "../client";
import Long from 'long'
import ContactUserController from "./ContactUserController";

/**
 * 会话控制层
 */
export default class SessionsController {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new SessionsController();
    }
    window["jdyImWeb_SessionsController"] = ()=> this.instance;
    return this.instance;
  }

  /**
   * 置顶会话
   * @param {} sessionId 
   */
  sticky(sessionId) {
    let index = this.getExistIndex(sessionId)
    if(index != -1){ 
      let session = Cache.getInstance().sessionList[index];
      session.timeStamp = Long.fromString(new Date().getTime().toString());
      Cache.getInstance().sessionList.splice(index, 1);
      Cache.getInstance().sessionList.splice(0, 0, session)
      Client.getInstance().refreshCache();
    }
  }

  /**
   * 构建会话
   * @param {*} msg 
   */
  buildSessions(msg, isTopping, isCache) {
    if (msg.msgType != ConstantType.MsgType.PASSTHROUGH) {
      let sessionId = this.getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      let index = this.getExistIndex(sessionId);
      let session = {
        sessionId: sessionId,
        msgFrom: msg.groupType == ConstantType.GroupType.PLATFORM ? msg.msgFrom : Client.getInstance().account,
        msgTo: msg.groupType == ConstantType.GroupType.SINGLE ? (msg.msgFrom == Client.getInstance().account ? msg.msgTo : msg.msgFrom) : msg.msgTo,
        groupType: msg.groupType,
        timeStamp: msg.timeStamp,
        state: '',
        loadMore: true,
        name: this.getSessionName(msg.msgFrom, msg.msgTo, msg.groupType),
        lastMsg: this.getLastSessionMsg(sessionId)
      };
      if (index == -1) {
        if (!isCache) {
          Cache.getInstance().sessionList.splice(0, 0, session);
        }
      } else {
        // 如果会话列表中有该会话则将该会话置顶
        if (isTopping && msg.msgType != ConstantType.MsgType.OPERATION) {
          session.state = Cache.getInstance().sessionList[index].state;
          Cache.getInstance().sessionList.splice(index, 1);
          Cache.getInstance().sessionList.splice(0, 0, session)
        }
      }
    }
  }

  /**
   * 新建会话
   * @param {*} msgFrom 发送方imUid
   * @param {*} msgTo 接收方imUid
   * @param {*} groupType 会话类型
   * @param {*} state 会话状态
   */
  createSession(msgFrom, msgTo, groupType, state) {
    let createSession = () => {
      let sessionId = this.getSessionId(msgFrom, msgTo, groupType);
      let index = this.getExistIndex(sessionId)

      let session = {
        sessionId: sessionId,
        msgFrom: Client.getInstance().account,
        msgTo: msgTo,
        groupType: groupType,
        timeStamp: Long.fromString(new Date().getTime().toString()),
        state: state,
        loadMore: false,
        name: this.getSessionName(msgFrom, msgTo, groupType),
        lastMsg: this.getLastSessionMsg(sessionId)
      };
      if (index == -1) {
        Cache.getInstance().sessionList.splice(0, 0, session);
      } else {
        Cache.getInstance().sessionList[index] = session;
      }
    }
    return new Promise((resolve, reject) => {
      if (groupType == ConstantType.GroupType.SINGLE) {
        Promise.all([
          ContactUserController.getInstance().checkOpenAipUserAndBusinessUser(msgFrom),
          ContactUserController.getInstance().checkOpenAipUserAndBusinessUser(msgTo)
        ]).then(res => {
          createSession()
          resolve()
        }).catch(err => {
          console.error(err);
          reject(err);
        })
      } else {
        createSession()
        resolve()
      }
    }).catch(err => {
      console.error(err);
      reject(err);
    })
  }

  /**
   * 更新会话状态
   *
   * @param sessionId
   * @param state
   */
  updateState(sessionId, state) {
    let index = this.getExistIndex(sessionId);
    if (index != -1) {
      Cache.getInstance().sessionList[index].state = state;
    }
  }

  /**
   * 删除会话
   *
   * @param sessionId
   */
  deleteSession(sessionId) {
    let index = this.getExistIndex(sessionId);
    if (index != -1) {
      Cache.getInstance().sessionList.splice(index, 1);
      Client.getInstance().refreshCache();
    }
  }

  /*************************************************************************************** */
  /**
   * 获取会话在会话列表中的位置
   *
   * @param {string} sessionId
   * @returns {number}
   */
  getExistIndex(sessionId) {
    let index = -1;
    for (let i = 0; i < Cache.getInstance().sessionList.length; i++) {
      if (sessionId == Cache.getInstance().sessionList[i].sessionId) {
        index = i;
      }
    }
    return index;
  }

  /**
   * 获取会话标识
   * @param msgFrom
   * @param msgTo
   * @param groupType
   * @returns {string}
   */
  getSessionId(msgFrom, msgTo, groupType) {
    // console.log("")
    let sessionId = '';
    // 工作消息
    if (groupType == ConstantType.GroupType.WORK) {
      sessionId = 'work' + groupType;
    }
    // 群组消息
    else if (groupType == ConstantType.GroupType.GROUP) {
      sessionId = msgTo + '' + groupType;
    }
    // 我是发送方
    else if (msgFrom == Client.getInstance().account) {
      sessionId = msgTo + '' + groupType;
    }
    // 我是接收方
    else if (msgTo == Client.getInstance().account) {
      sessionId = msgFrom + '' + groupType;
    }
    return sessionId;
  }

  /**
   * 获取会话名称
   *
   * @param msgFrom
   * @param msgTo
   * @param groupType
   * @returns {string}
   */
  getSessionName(msgFrom, msgTo, groupType) {
    let sessionName = '';
    // 单聊
    if (groupType == ConstantType.GroupType.SINGLE) {
      let toUser = Cache.getInstance().openAipUserMap.get(parseInt(msgFrom == Client.getInstance().account ? msgTo : msgFrom));
      sessionName = toUser ? toUser.name : '';
    }
    // 群聊
    else if (groupType == ConstantType.GroupType.GROUP) {
      let toGroup = Cache.getInstance().groupMap.get(parseInt(msgTo));
      sessionName = toGroup ? toGroup.groupName : '';
    }
    // 系统消息
    else if (groupType == ConstantType.GroupType.WORK) {
      sessionName = '系统消息';
    }
    // 公众号
    else if (groupType == ConstantType.GroupType.PLATFORM) {
      let toPlatform = Cache.getInstance().publicAccountMap.get(parseInt(msgFrom));
      sessionName = toPlatform ? toPlatform.name : '';
    }
    return sessionName;
  }

  /**
   * 获取会话的最后一条消息(只判断聊天消息、系统消息、工作消息)
   *
   * @param sessionId 会话标识
   */
  getLastSessionMsg(sessionId) {
    let msgRes = {};
    if (sessionId) {
      let messageArray = Cache.getInstance().messagesMap.get(sessionId);
      if (messageArray) {
        for (let i = messageArray.length - 1; i >= 0; i--) {
          let msg = messageArray[i];
          if (!msg.isDelete) {
            if (msg.msgType == ConstantType.MsgType.SYSTEM || msg.msgType == ConstantType.MsgType.CHAT || msg.msgType == ConstantType.MsgType.WORK) {
              msgRes = msg;
              break;
            }
          }
        }
      }
    }
    return msgRes;
  }
}
