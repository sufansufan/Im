import Cache from "../cache"
import Client from "../client"
import SessionsController from "./SessionsController";
import ConstantType from "../constant/ConstantType";
import ContactUserController from "./ContactUserController";
import GroupUserController from "./GroupUserController";
import GroupController from "./GroupController";
import Long from 'long'

/**
 * 消息控制层
 */
export default class MessagesController {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new MessagesController();
    }
    return this.instance;
  }

  /********************************************************************************************************************* */
  /***********分发处理消息集合********************************************************************************************************** */
  /********************************************************************************************************************* */

  /**
   * 分发处理消息集合
   *
   * @param msgList
   */
  dispatchMessage(msgList, isTopping, callback) {
    if (msgList) {
      ContactUserController.getInstance().syncContactUserByMsgList(msgList).then(() => {
        for (let i = 0; i < msgList.length; i++) {
          const msg = msgList[i];
          if (msg.groupType == ConstantType.GroupType.WORK) {
            continue;
          }
          //   /**文本消息 */
          //   CHAT: 0,
          this.buildChatMsg(msg);
          //   /**操作消息 */
          //   OPERATION: 1,
          this.buildOperationMsg(msg);
          //   /**系统消息 */
          //   SYSTEM: 2,
          this.buildSystemMsg(msg);
          //   /**透传消息 */
          //   PASSTHROUGH: 3,
          this.buildPassThroughMsg(msg);
          //   /**工作消息 */
          //   WORK: 4
          //   /**公众号 */
          //   platform: 5
          SessionsController.getInstance().buildSessions(msg, isTopping);
        }
        if (callback) {
          callback();
        }
      })
    }
  }

  /**
   * 构建文本消息
   * @param {*} msg 
   */
  buildChatMsg(msg) {
    if (msg.msgType == ConstantType.MsgType.CHAT) {
      console.log("[文本消息]")
      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      if (!Cache.getInstance().messagesMap.has(sessionId)) {
        let messageArray = new Array();
        messageArray.push(msg);
        Cache.getInstance().messagesMap.set(sessionId, messageArray);

      } else {
        let messageArray = Cache.getInstance().messagesMap.get(sessionId);
        let isNewMsg = true;
        for (let i = 0; i < messageArray.length; i++) {
          const msgFromCache = messageArray[i];
          if (msg.msgType == ConstantType.MsgType.CHAT && msgFromCache.msgType == ConstantType.MsgType.CHAT) {
            if (msg.chatMsg && msgFromCache.chatMsg) {
              if (msgFromCache.chatMsg.msgId.equals(msg.chatMsg.msgId) && msgFromCache.chatMsg.deviceId == msg.chatMsg.deviceId) {
                Cache.getInstance().messagesMap.get(sessionId)[i] = msg;
                isNewMsg = false;
                break;
              }
            }
          }
        }
        if (isNewMsg) {
          Cache.getInstance().messagesMap.get(sessionId).push(msg);
        }
      }
    }
  }

  /**
   * 操作消息
   * @param {*} msg 
   */
  buildOperationMsg(msg) {
    if (msg.msgType == ConstantType.MsgType.OPERATION) {
      console.log("[操作消息]")
      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      if (Cache.getInstance().messagesMap.has(sessionId)) {
        let messageArray = Cache.getInstance().messagesMap.get(sessionId);
        for (let i = messageArray.length - 1; i >= 0; i--) {
          const cacheMsg = messageArray[i];
          if (cacheMsg.sequenceId && cacheMsg.sequenceId.equals(msg.operationMsgBase.operationSeqId)) {
            switch (msg.msgSecondType) {
              case ConstantType.OperationMsgConstant.OPERATION_READ: {
                Cache.getInstance().messagesMap.get(sessionId)[i].unRead = msg.unRead;
                break;
              }
              case ConstantType.OperationMsgConstant.OPERATION_DELETE: {
                Cache.getInstance().messagesMap.get(sessionId)[i].isDelete = true;
                let sessionIndex = SessionsController.getInstance().getExistIndex(sessionId);
                Cache.getInstance().sessionList[sessionIndex].lastMsg = SessionsController.getInstance().getLastSessionMsg(sessionId);
                break;
              }
              case ConstantType.OperationMsgConstant.OPERATION_REVOCATION: {
                Cache.getInstance().messagesMap.get(sessionId)[i].isRevocation = true;
                let sessionIndex = SessionsController.getInstance().getExistIndex(sessionId);
                Cache.getInstance().sessionList[sessionIndex].lastMsg = SessionsController.getInstance().getLastSessionMsg(sessionId);
                Client.getInstance().refreshCache()
                break;
              }
              case ConstantType.OperationMsgConstant.OPERATION_READ_STATUS: {
                Cache.getInstance().messagesMap.get(sessionId)[i].readStatus = msg.readStatus;
                break;
              }
              case ConstantType.OperationMsgConstant.OPERATION_CHECK_STATUS: {
                Cache.getInstance().messagesMap.get(sessionId)[i].checkStatus = msg.checkStatus;
                break;
              }
            }
            break;
          }
        }
      }
    }
  }

  /**
   * 系统消息
   * @param {*} msg 
   */
  buildSystemMsg(msg) {
    if (msg.msgType == ConstantType.MsgType.SYSTEM) {
      console.log("[系统消息]")
      let content = '';
      let operatorName = "";
      let operatedText = "";
      let isHaveMe = false;
      // -- 操作人
      let operator = Cache.getInstance().openAipUserMap.get(parseInt(msg.systemMsg.userA));
      if (operator) {
        operatorName = operator.name;
      }
      if (msg.systemMsg.userA == Client.getInstance().account) {
        operatorName = '你';
      }
      switch (msg.msgSecondType) {
        case ConstantType.SystemMsgType.SYSTEM_CREATE_GROUP: {
          content = operatorName + ' 创建了群';
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_DISSMISS_GROUP: {
          content = operatorName + ' 已解散该群';
          SessionsController.getInstance().updateState(sessionId, ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_DISSMISS);
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_JOIN_GROUP: {
          console.log("【添加群成员】");
          GroupUserController.getInstance().syncAllByGroupIdFromHttp(msg.msgTo).then(() => {
            Client.getInstance().refreshCache();
          });
          for (let i = 0; i < msg.systemMsg.userB.length; i++) {
            let imUid = msg.systemMsg.userB[i];
            if (imUid == Client.getInstance().account) {
              isHaveMe = true;
              break;
            }
          }
          if (isHaveMe) {
            content = '你 被 ' + operatorName + ' 加入该群聊';
          } else {
            for (let i = 0; i < msg.systemMsg.userB.length; i++) {
              let imUid = msg.systemMsg.userB[i];
              let user = Cache.getInstance().openAipUserMap.get(parseInt(imUid));
              if (user) {
                operatedText += user.name + ',';
              }
            }
            operatedText = operatedText.substr(0, operatedText.lastIndexOf(','));
            content = operatorName + " 将 " + operatedText + ' 加入该群聊';
          }
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_REMOVE_GROUP: {
          for (let i = 0; i < msg.systemMsg.userB.length; i++) {
            let imUid = msg.systemMsg.userB[i];
            if (imUid == Client.getInstance().account) {
              isHaveMe = true;
              break;
            }
          }
          if (isHaveMe) {
            content = '你 已被 ' + operatorName + ' 移出该群聊';
          } else {
            console.log("【群删除成员】");
            GroupUserController.getInstance().syncAllByGroupIdFromHttp(msg.msgTo).then(() => {
              Client.getInstance().refreshCache();
            });
            for (let i = 0; i < msg.systemMsg.userB.length; i++) {
              let imUid = msg.systemMsg.userB[i];
              let user = Cache.getInstance().openAipUserMap.get(parseInt(imUid));
              if (user) {
                operatedText += user.name + ',';
              }
            }
            operatedText = operatedText.substr(0, operatedText.lastIndexOf(','));
            content = operatorName + " 将 " + operatedText + ' 移出该群聊';
          }
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_EXIT_GROUP: {
          content = operatorName + '已退出该群聊';
          break;
        }
      }
      msg.systemMsg.content = content;
      msg.systemMsg.operatorName = operatorName;
      msg.systemMsg.operatedText = operatedText;
      msg.systemMsg.isHaveMe = isHaveMe;

      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      // 没有会话
      if (!Cache.getInstance().messagesMap.has(sessionId)) {
        let messageArray = new Array();
        messageArray.push(msg);
        Cache.getInstance().messagesMap.set(sessionId, messageArray);
      }
      // 有会话
      else {
        let messageArray = Cache.getInstance().messagesMap.get(sessionId);
        let isNewMsg = true;
        for (let i = 0; i < messageArray.length; i++) {
          let cacheMsg = messageArray[i];
          // 已有消息
          if (cacheMsg.sequenceId && cacheMsg.sequenceId.equals(msg.sequenceId)) {
            Cache.getInstance().messagesMap.get(sessionId)[i] = msg;
            isNewMsg = false;
            break;
          }
        }
        // 没有消息
        if (isNewMsg) {
          Cache.getInstance().messagesMap.get(sessionId).push(msg);
        }
      }
    }
  }

  /**
   * 透传消息
   * @param {*} msg 
   */
  buildPassThroughMsg(msg) {
    if (msg.msgType == ConstantType.MsgType.PASSTHROUGH) {
      console.log("[透传消息]")
      // 是否最新消息
      let isNewMsg = true;
      let passThroughMsgFromCache = Cache.getInstance().passThroughMsgMap.get(msg.sequenceId.toString());
      if (passThroughMsgFromCache) {
        isNewMsg = false;
      }
      // 是最新消息
      if (isNewMsg) {
        Cache.getInstance().passThroughMsgMap.set(msg.sequenceId.toString(), msg);
        if (msg.passthroughMsg) {
          let passThroughMsg = JSON.parse(msg.passthroughMsg);
          let sessionId = SessionsController.getInstance().getSessionId(null, passThroughMsg.groupId, ConstantType.GroupType.GROUP);
          switch (msg.msgSecondType) {
            // 自定义透传
            case ConstantType.PassthroughMsgConstant.PASSTHROUGH_CUSTOMIZE: {
              console.log("【自定义透传】")
              switch (passThroughMsg.type) {
                case ConstantType.PassthroughCustomizeType.ORGANIZATION_EMPLOYEE_CHANGE:
                  console.log("【组织人员变更】")
                  console.log(Cache.getInstance().businessUserListVersion);
                  let version = passThroughMsg.data ? JSON.parse(passThroughMsg.data).version : passThroughMsg.version
                  if (Cache.getInstance().businessUserListVersion < version) {
                    ContactUserController.getInstance().syncAllFromHttp().then(() => {
                      Cache.getInstance().businessUserListVersion = version;
                      Client.getInstance().refreshCache();
                    }).catch(err => {
                      console.log(err)
                    });
                  }
                  break;

              }
              break;
            }
            // 创建群
            case ConstantType.PassthroughMsgConstant.PASSTHROUGH_CREATE_GROUP: {
              console.log("【创建群】")
              GroupController.getInstance().createGroup(passThroughMsg);
              break;
            }
            // 群解散
            case ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_DISSMISS: {
              console.log("【群解散】")
              SessionsController.getInstance().updateState(sessionId, ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_DISSMISS);
              Client.getInstance().refreshCache();
              break;
            }
            // 被踢出群
            case ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_KICKOUT: {
              console.log("【被踢出群】")
              SessionsController.getInstance().updateState(sessionId, ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_KICKOUT);
              Client.getInstance().refreshCache();
              break;
            }
            // 退出群
            case ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_LOGOUT: {
              console.log("【退出群】")
              SessionsController.getInstance().updateState(sessionId, ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_LOGOUT);
              Client.getInstance().refreshCache();
              break;
            }
          }
        }
      }
    }
  }
  /**工作消息 */
  buildWorkMsg(msg) {

  }
  /********************************************************************************************************************* */
  /*******修改消息状态************************************************************************************************************** */
  /********************************************************************************************************************* */

  /**
   * 修改消息状态
   */
  checkLocalMsgStatus() {
    Cache.getInstance().reqMap.forEach((value, key) => {
      if (value) {
        value.sendState = ConstantType.MsgSendState.FAIL;
        this.updateLocalMessage(ConstantType.ActionType.CHATING, value);
        Cache.getInstance().reqMap.delete(key);
      }
    })
  }

  /**
   * 更新本地消息对象
   * @param actionType
   * @param msg
   */
  updateLocalMessage(actionType, msg) {
    if (msg) {
      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      let messageArray = Cache.getInstance().messagesMap.get(sessionId);
      if (messageArray) {
        switch (actionType) {
          case ConstantType.ActionType.CHATING: {
            for (let i = 0; i < messageArray.length; i++) {
              let msgFromCache = messageArray[i];
              if (msgFromCache.chatMsg && msg.chatMsg && msg.chatMsg.msgId.equals(msgFromCache.chatMsg.msgId)) {
                Cache.getInstance().messagesMap.get(sessionId)[i].sendState = msg.sendState;
                break;
              }
            }
            break;
          }
          case ConstantType.ActionType.OPERATING: {
            let operationMsgId = msg.operationMsgBase.operationSeqId;
            if (!Long.isLong(operationMsgId)) {
              operationMsgId = Long.fromString(operationMsgId);
            }
            for (let i = messageArray.length - 1; i >= 0; i--) {
              let msgFromCache = messageArray[i];
              if (operationMsgId && operationMsgId.equals(msgFromCache.sequenceId)) {
                switch (msg.msgSecondType) {
                  case ConstantType.OperationMsgConstant.OPERATION_READ:
                    Cache.getInstance().messagesMap.get(sessionId)[i].readStatus = true;
                    break;
                  case ConstantType.OperationMsgConstant.OPERATION_REVOCATION:
                    Cache.getInstance().messagesMap.get(sessionId)[i].isRevocation = true;
                    break;
                  case ConstantType.OperationMsgConstant.OPERATION_DELETE:
                    Cache.getInstance().messagesMap.get(sessionId)[i].isDelete = true;
                    let sessionIndex = SessionsController.getInstance().getExistIndex(sessionId);
                    Cache.getInstance().sessionList[sessionIndex].lastMsg = SessionsController.getInstance().getLastSessionMsg(sessionId);
                    break;
                  case ConstantType.OperationMsgConstant.OPERATION_READ_STATUS:
                    Cache.getInstance().messagesMap.get(sessionId)[i].readStatus = true;

                    break;
                  case ConstantType.OperationMsgConstant.OPERATION_CHECK_STATUS:
                    Cache.getInstance().messagesMap.get(sessionId)[i].checkStatus = true;
                    break;
                }
              }
            }
            break;
          }
        }
      }
    }
  }

  /********************************************************************************************************************* */
  /********************************************************************************************************************* */
  /********************************************************************************************************************* */

  // /**
  //  * 构建工作消息集合
  //  *
  //  * @param msg
  //  */
  // buildWorkMsgs(msg) {
  //   // console.log("")
  //   let sequenceId = msg.sequenceId;
  //   let msgType = msg.msgType;
  //   let msgSecondType = msg.msgSecondType;
  //   let msgFrom = msg.msgFrom;
  //   let msgTo = msg.msgTo;
  //   let groupType = msg.groupType;
  //   let timeStamp = msg.timeStamp;
  //   let chatMsg = msg.chatMsg;
  //   let operationMsgBase = msg.operationMsgBase;
  //   let systemMsg = msg.systemMsg;
  //   let unRead = msg.unRead;
  //   let readStatus = msg.readStatus;
  //   let isDelete = msg.isDelete;
  //   let isRevocation = msg.isRevocation;
  //   let passthroughMsg = msg.passthroughMsg;
  //   let WorkMsg = msg.WorkMsg;

  //   if (msgType == ConstantType.MsgType.WORK && msgSecondType == ConstantType.WorkSecondType.SYSTEM) {
  //     msg.workMsg = JSON.parse(msg.WorkMsg);
  //     let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
  //     if (!Cache.getInstance().messages.has(sessionId)) {
  //       let arr = new Array();
  //       arr.push(msg);
  //       Cache.getInstance().messages.set(sessionId, arr);
  //     } else {
  //       let arr = Cache.getInstance().messages.get(sessionId);
  //       let flag = false;
  //       for (let i = 0; i < arr.length; i++) {
  //         if (sequenceId.equals(arr[i].sequenceId)) {
  //           flag = true;
  //         }
  //       }
  //       if (!flag) {
  //         arr.push(msg);
  //         Cache.getInstance().messages.set(sessionId, arr);
  //       }
  //     }
  //   }
  // }

  /**
   * 处理历史消息集合
   *
   * @param msgList
   */
  dispatchHistoryMessage(msgList, sessionId, callback) {
    if (msgList) {
      ContactUserController.getInstance().syncContactUserByMsgList(msgList).then(() => {
        for (let i = msgList.length - 1; i >= 0; i--) {
          let msg = msgList[i];
          msg.localUnRead = true;
          if (Cache.getInstance().messagesMap.has(sessionId)) {
            let msgList = Cache.getInstance().messagesMap.get(sessionId);
            let isUnNewMsg = true;
            for (let i = 0; i < msgList.length; i++) {
              const msgFromCache = msgList[i];
              if (msgFromCache.sequenceId.toString() == msg.sequenceId.toString()) {
                Cache.getInstance().messagesMap.get(sessionId)[i] = msg;
                isUnNewMsg = false;
                break
              }
            }
            if (isUnNewMsg) {
              Cache.getInstance().messagesMap.get(sessionId).splice(0, 0, msg);
            }
          }else{
            Cache.getInstance().messagesMap.set(sessionId,[msg]);
          }
          this.buildSystemMsg(msg);
        }
        if (callback) {
          callback();
        }
      })
    }
  }

  /**
   * 消息列表排序
   *
   * @param msgList
   */
  sortMsgList(msgList) {
    // console.log("")
    if (msgList) {
      for (let i = 0; i < msgList.length - 1; i++) {
        for (let j = 0; j < msgList.length - 1 - i; j++) {
          if (msgList[j].sequenceId.gt(msgList[j + 1].sequenceId)) {
            let temp = msgList[j];
            msgList[j] = msgList[j + 1];
            msgList[j + 1] = temp;
          }
        }
      }
    }
  }

  /**
   * 
   * @param {*} msg 
   * @param {*} callback 
   */
  sortMsgListByTimeStamp(msgList) {
    if (msgList) {
      for (let i = 0; i < msgList.length - 1; i++) {
        for (let j = 0; j < msgList.length - 1 - i; j++) {
          if (msgList[j].timeStamp.gt(msgList[j + 1].timeStamp)) {
            let temp = msgList[j];
            msgList[j] = msgList[j + 1];
            msgList[j + 1] = temp;
          }
        }
      }
    }
  }
  /**
   * 在会话消息列表中加入一条消息
   * @param msg
   */
  addLocalMessage(msg, callback) {
    // console.log("")
    if (msg) {
      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      if (!Cache.getInstance().messagesMap.has(sessionId)) {
        let arr = new Array();
        arr.push(msg);
        Cache.getInstance().messagesMap.set(sessionId, arr);
      } else {
        Cache.getInstance().messagesMap.get(sessionId).push(msg);
      }
      if (callback) {
        callback()
      }
    }
  }

  /**
   * 在会话消息列表中删除一条消息
   * @param msg
   */
  deleteLocalMessage(msg, callback) {
    // console.log("")
    if (msg) {
      let sessionId = SessionsController.getInstance().getSessionId(msg.msgFrom, msg.msgTo, msg.groupType);
      if (Cache.getInstance().messagesMap.has(sessionId)) {
        let arr = Cache.getInstance().messagesMap.get(sessionId);
        for (let i = 0; i < arr.length; i++) {
          if (msg.chatMsg.msgId.equals(arr[i].chatMsg.msgId)) {
            arr.splice(i, 1);
            break;
          }
        }
        Cache.getInstance().messagesMap.set(sessionId, arr);
        if (callback) {
          callback()
        }
      }
    }
  }
  /**
   * 设置当前会话所有消息为已读
   * @param {} sessionId 
   */
  setLocalUnReadBySessionId(sessionId) {
    let messageList = Cache.getInstance().messagesMap.get(sessionId + "")
    if (messageList) {
      for (let i = 0; i < messageList.length; i++) {
        const message = messageList[i];
        message.localUnRead = true;
      }
      Cache.getInstance().messagesMap.set(sessionId + "", messageList)
      Client.getInstance().refreshCache();
    }
  }





}
