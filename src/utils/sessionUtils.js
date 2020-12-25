import store from "../store";
import groupUtils from "./groupUtils";
import ConstantType from "../js/sdk/constant/ConstantType";
import SessionsController from "../js/sdk/service/SessionsController";
import GroupController from "../js/sdk/service/GroupController";
import ElementUi from "element-ui";
import groupUserUtils from "./groupUserUtils";
import openApiUserUtils from "./openApiUserUtils";
import Cache from "../js/sdk/cache";


export default {
  getAll() {
    let sessionList = store.state.cache.cache.sessionList;
    let draftMessageMap = store.state.session.draftMessageMap;
    let sessionsRes = sessionList.filter(session => {
      // -----过滤-------------------------------------------------
      // 过滤群聊会话
      if (session.groupType == ConstantType.GroupType.GROUP) {
        let group = groupUtils.getOneByGroupId(session.msgTo);
        let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);
        // 未找到群信息或群成员信息
        if (!group.groupId || groupUserList.length == 0 || group.type == ConstantType.GroupTypeConstant.GROUP_CHATROOM) {
          return false;
        }
      }
      if (!session.sessionId) {
        return false;
      }
      // -----过滤-------------------------------------------------

      // -----构建草稿-------------------------------------------------
      // 获取草稿信息
      let draftMessage = draftMessageMap.get(session.sessionId);
      if (draftMessage) {
        session.draftMessage = {
          chatMsg: {
            content: draftMessage
          }
        };
      } else {
        session.draftMessage = null;
      }
      // -----构建草稿-------------------------------------------------
      return true;
    });
    return sessionsRes;
  },
  getOneBySessionId(sessionId) {
    let sessionList = store.state.cache.cache.sessionList;
    for (let i = 0; i < sessionList.length; i++) {
      const session = sessionList[i];
      if (session.sessionId == sessionId) {
        return session;
      }
    }
    return null;
  },
  groupDissMissId: "",
  groupKickoutId: "",
  /**
   * 检测当前会话是否（是群 且 已被踢出或解散或新建群）
   * @param {*} type 
   */
  detectSession(session) {
    if (session) {
      var myImUid = openApiUserUtils.getMe().imUid;
      if (session.groupType == ConstantType.GroupType.GROUP) {
        if (session.state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_DISSMISS) {
          if (groupUtils.isOwner(myImUid, session.msgTo)) {
            console.log("检测到自己解散的群");
            store.dispatch("setSessionId", -1);
            store.dispatch("closeGroupSettingDrawer");
            store.dispatch("closeOfficeGroupSettingDrawer");
            Cache.getInstance().groupMap.delete(parseInt(session.msgTo));
            Cache.getInstance().groupUserMap.delete(parseInt(session.msgTo));
            SessionsController.getInstance().deleteSession(session.sessionId);
          } else {
            console.log("检测到该群已解散");
            if (this.groupDissMissId != session.sessionId) {
              this.groupDissMissId = session.sessionId;
              ElementUi.MessageBox('该群已解散', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              }).then(() => {
                // 弹窗
                store.dispatch("setSessionId", -1);
                store.dispatch("closeGroupSettingDrawer");
                store.dispatch("closeOfficeGroupSettingDrawer");
                Cache.getInstance().groupMap.delete(parseInt(session.msgTo));
                Cache.getInstance().groupUserMap.delete(parseInt(session.msgTo));
                SessionsController.getInstance().deleteSession(session.sessionId);
              });
            }
          }
          return true;
        } else if (session.state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_KICKOUT) {
          // 弹窗
          console.log("检测到已被踢出");
          if (this.groupKickoutId != session.sessionId) {
            this.groupKickoutId = session.sessionId;
            ElementUi.MessageBox('已被移出该群', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              // 弹窗
              store.dispatch("setSessionId", -1);
              store.dispatch("closeGroupSettingDrawer");
              store.dispatch("closeOfficeGroupSettingDrawer");
              Cache.getInstance().groupMap.delete(parseInt(session.msgTo));
              Cache.getInstance().groupUserMap.delete(parseInt(session.msgTo));
              SessionsController.getInstance().deleteSession(session.sessionId);
            });
          }
          return true;
        } else if (session.state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_LOGOUT) {
          console.log("检测到主动退出群");
          store.dispatch("setSessionId", -1);
          store.dispatch("closeGroupSettingDrawer");
          store.dispatch("closeOfficeGroupSettingDrawer");
          Cache.getInstance().groupMap.delete(parseInt(session.msgTo));
          Cache.getInstance().groupUserMap.delete(parseInt(session.msgTo));
          SessionsController.getInstance().deleteSession(session.sessionId);
          return true;
        }
      }
    }
    return false;
  }

}
