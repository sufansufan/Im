import ConstantType from "../js/sdk/constant/ConstantType";
import ElementUI from 'element-ui'
import urlUtils from "./urlUtils";
import groupUtils from "./groupUtils";
import groupUserUtils from "./groupUserUtils";
import openApi from "../js/sdk/api/openApi";
import openApiUserUtils from "./openApiUserUtils";
import Client from "../js/sdk/client";
import IndexedDBClient from "../js/sdk/utils/IndexedDBClient";

export default {
  ng: false,
  /**
   * 构建显示数据
   * @param {*} cache 
   */
  bulidCache(cache) {
    let myInfo = cache.openAipUserMap.get(parseInt(Client.getInstance().account));
    if (!myInfo || myInfo.state == "ng") {
      if (!this.ng) {
        this.ng = true;
        IndexedDBClient.getInstance().delete();
        ElementUI.MessageBox('您已离职，将被强制退出平台！如有误，请联系人力资源部处理！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          parent.app.logoutBs();
        }).catch(() => {
          parent.app.logoutBs();
        });
      }
    } else {
      let allUnreadNum = 0;
      if (cache.sessionList) {
        // 循环session
        let sessionList = cache.sessionList.filter(session => {
          // -----过滤-------------------------------------------------
          if (session.groupType == ConstantType.GroupType.GROUP) {
            let group = groupUtils.getOneByGroupId(session.msgTo);
            let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);
            // 未找到群信息
            if (!group.groupId || groupUserList.length==0 || group.type == ConstantType.GroupTypeConstant.GROUP_CHATROOM) {
              return false;
            }
          }
          // -----过滤-------------------------------------------------
          return true;
        });
        for (let sessionIndex = 0; sessionIndex < sessionList.length; sessionIndex++) {
          const session = sessionList[sessionIndex];
          session.unreadNum = 0;
          // 循环session的messages
          let sessionId = session.sessionId;
          let sessionMessages = cache.messagesMap.get(sessionId);
          if (sessionId && sessionMessages) {
            for (let sessionMessageIndex = 0; sessionMessageIndex < sessionMessages.length; sessionMessageIndex++) {
              const message = sessionMessages[sessionMessageIndex];
              if (
                !message.isDelete && // 未删除
                !message.isRevocation && // 未撤回
                !openApiUserUtils.isMe(message.msgFrom) && // 发送方不是我
                !message.readStatus && // 线上未读
                !message.localUnRead && // 本地未读
                message.msgType != ConstantType.MsgType.SYSTEM // 不是系统消息
              ) {
                session.unreadNum += 1;
                allUnreadNum += 1;
              }
            }
          }
        }
      }
      if (parent && parent.app) {
        parent.app.newMessage(allUnreadNum > 0);
      }
    }
  }
}
