import Vue from 'vue'
import store from "../../store";
import {
  MessageBox
} from "element-ui";

import ConstantType from "../../js/sdk/constant/ConstantType"
import Client from '../sdk/client';
import MessagesController from '../sdk/service/MessagesController';
import SessionsController from '../sdk/service/SessionsController';
import ContactUserController from '../sdk/service/ContactUserController';
import Cache from '../sdk/cache';
import GroupController from '../sdk/service/GroupController';

var EmojiSourcePeople = {
  "☺": 0,
  "😊": 1,
  "😀": 2,
  "😁": 3,
  "😂": 4,
  "😃": 5,
  "😄": 6,
  "😅": 7,
  "😆": 8,
  "😇": 9,
  "😈": 10,
  "😉": 11,
  "😯": 12,
  "😐": 13,
  "😑": 14,
  "😕": 15,
  "😠": 16,
  "😬": 17,
  "😡": 18,
  "😢": 19,
  "😴": 20,
  "😮": 21,
  "😣": 22,
  "😤": 23,
  "😥": 24,
  "😦": 25,
  "😧": 26,
  "😨": 27,
  "😩": 28,
  "😰": 29,
  "😟": 30,
  "😱": 31,
  "😲": 32,
  "😳": 33,
  "😵": 34,
  "😶": 35,
  "😷": 36,
  "😞": 37,
  "😒": 38,
  "😍": 39,
  "😛": 40,
  "😜": 41,
  "😝": 42,
  "😋": 43,
  "😗": 44,
  "😙": 45,
  "😘": 46,
  "😚": 47,
  "😎": 48,
  "😭": 49,
  "😌": 50,
  "😖": 51,
  "😔": 52,
  "😪": 53,
  "😏": 54,
  "😓": 55,
  "😫": 56,
  "🙋": 57,
  "🙌": 58,
  "🙍": 59,
  "🙅": 60,
  "🙆": 61,
  "🙇": 62,
  "🙎": 63,
  "🙏": 64,
  "😺": 65,
  "😼": 66,
  "😸": 67,
  "😹": 68,
  "😻": 69,
  "😽": 70,
  "😿": 71,
  "😾": 72,
  "🙀": 73,
  "🙈": 74,
  "🙉": 75,
  "🙊": 76,
  "💩": 77,
  "👶": 78,
  "👦": 79,
  "👧": 80,
  "👨": 81,
  "👩": 82,
  "👴": 83,
  "👵": 84,
  "💏": 85,
  "💑": 86,
  "👪": 87,
  "👫": 88,
  "👬": 89,
  "👭": 90,
  "👤": 91,
  "👥": 92,
  "👮": 93,
  "👷": 94,
  "💁": 95,
  "💂": 96,
  "👯": 97,
  "👰": 98,
  "👸": 99,
  "🎅": 100,
  "👼": 101,
  "👱": 102,
  "👲": 103,
  "👳": 104,
  "💃": 105,
  "💆": 106,
  "💇": 107,
  "💅": 108,
  "👻": 109,
  "👹": 110,
  "👺": 111,
  "👽": 112,
  "👾": 113,
  "👿": 114,
  "💀": 115,
  "💪": 116,
  "👀": 117,
  "👂": 118,
  "👃": 119,
  "👣": 120,
  "👄": 121,
  "👅": 122,
  "💋": 123,
  "❤": 124,
  "💙": 125,
  "💚": 126,
  "💛": 127,
  "💜": 128,
  "💓": 129,
  "💔": 130,
  "💕": 131,
  "💖": 132,
  "💗": 133,
  "💘": 134,
  "💝": 135,
  "💞": 136,
  "💟": 137,
  "👍": 138,
  "👎": 139,
  "👌": 140,
  "✊": 141,
  "✌": 142,
  "✋": 143,
  "👊": 144,
  "☝": 145,
  "👆": 146,
  "👇": 147,
  "👈": 148,
  "👉": 149,
  "👋": 150,
  "👏": 151,
  "👐": 152
}

/**
 * 获取SDK对象
 */
export function getSDK() {
  return Vue.prototype.SDK;
}

// ***********************
// ********* 其他格式化方法
// ***********************

/**
 * 转换组织架构头像地址
 * @param {*} iconUrl 
 */
export function orgImgUrlFormat(org) {
  if (org.icon) {
    return org.icon;
  } else if (org.headPortrait) {
    return org.headPortrait;
  } else {
    if (org.type == "personnel") {
      return "/static/icon/02应用图标—icon/tu00.png"
    } else {
      return "/static/icon/companyLogo.png"
    }
  }
}

/**
 * 转换发送的消息中的特殊字符
 * @param {*} iconUrl 
 */
export function sendMsgFormat(str) {
  let msg = "";
  // 转换html空格
  msg += str.replace(new RegExp("&nbsp;", "gm"), ' ')
  return msg;
}
/**
 * 是否有人"@"我
 * @param {*} iconUrl 
 */
export function isHaveAtMe(msgBean) {
  // 有atList 且 未读
  if (msgBean && msgBean.chatMsg && msgBean.chatMsg.atList && !msgBean.readStatus) {
    // at所有人
    var atRe = /@所有人+\u200D;?/ig;
    var atReMatches = msgBean.chatMsg.content.match(atRe) || [];
    if (atReMatches.length > 0 && !isMe(msgBean.msgFrom)) return true;
    // at我
    for (let i = 0; i < msgBean.chatMsg.atList.length; i++) {
      const imUid = msgBean.chatMsg.atList[i];
      if (isMe(imUid)) return true;
    }
  }
  return false;
}

/**
 * 格式化消息
 * @param {} msgBean MsgBean
 * @param {} isTree 是否是树
 */
export function formatChatMessage(msgBean, isTree, isDraft) {
  // 替换表情字符
  var massageStr = "";
  if (msgBean.chatMsg && msgBean.chatMsg.content) {
    massageStr = msgBean.chatMsg.content;
    // 超链接
    if (!isTree) {
      var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      massageStr = massageStr.replace(reg, "<a class='msgA' href='$1$2' style='color: #03a9f4;' target='_blank'>$1$2</a>");
    }
    // 表情符
    var re = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    var matches = massageStr.match(re) || [];
    for (var j = 0, len = matches.length; j < len; ++j) {
      massageStr = massageStr.replace(
        matches[j],
        '<img src="../../static/img-apple-64/' +
        matches[j].codePointAt(0).toString(16) +
        '.png" class="emojiImg" emojisourcepeoplenum="' + EmojiSourcePeople[matches[j]] + '" ' +
        (isTree ? 'style=" width: 13px; height: 13px;position: relative; top: 2px;"' : "") +
        '>'
      );
    }
    // 匹配at文字
    if (isDraft) {
      var atRe = /@[^\s]+\u200D;?/ig;
      var atReMatches = massageStr.match(atRe) || [];
      for (var j = 0, len = atReMatches.length; j < len; ++j) {
        var atWhoArray = atReMatches[j].split("-");
        var userName = atWhoArray[0];
        var userId = atWhoArray[1];
        massageStr = massageStr.replace(
          atReMatches[j],
          '<span class="atwho-inserted" data-atwho-at-query="@"><span style="font-weight:bold;" userid="' + userId + '">' + userName + '</span></span>&zwj;'
        );
      }
    } else {
      var atRe = /@[^\s]+\u200D;?/ig;
      var atReMatches = massageStr.match(atRe) || [];
      for (var j = 0, len = atReMatches.length; j < len; ++j) {
        massageStr = massageStr.replace(
          atReMatches[j],
          // '<span style=" color: #00b0ff; ">' + atReMatches[j] + '</span>'
          '<span>' + atReMatches[j] + '</span>'
        );
      }
    }

  }
  return massageStr;
}


/**
 * 格式化会话最后一条消息
 * @param {*} session
 */
export function formatLastMessage(session) {
  let groupType = session.groupType;
  let sessionId = session.sessionId;
  let storeSessionId = store.state.session.sessionId;
  // 是草稿 且 不处于当前会话
  if (session.draftMessage && sessionId != storeSessionId) return '<div style="color:red;display: inline;position: relative;top: -1px;">[草稿] </div>' + formatChatMessage(session.draftMessage, true, true);
  else if (isSingle(groupType) && session.lastMsg) {
    let lastMsg = session.lastMsg; // 消息体
    let msgType = lastMsg.msgType; // 第一类型
    let msgSecondType = lastMsg.msgSecondType; // 第二类型
    let msgFrom = lastMsg.msgFrom; // 发送人

    if (session.lastMsg.isRevocation) return (isMe(msgFrom) ? "你" : getUserName(getContackUser(msgFrom))) + "撤回了一条消息";
    else if (isCharSecondTypeText(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead == 1 ? "[未读]" : "[已读]") : "") + formatChatMessage(lastMsg, true);
    else if (isCharSecondTypeFile(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead == 1 ? "[未查收]" : "[已查收]") : "") + "[文件]" + lastMsg.chatMsg.description;
    else if (isCharSecondTypeImage(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead == 1 ? "[未读]" : "[已读]") : "") + "[图片]";
    else if (isCharSecondTypeAudio(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead == 1 ? "[未读]" : "[已读]") : "") + "[语音]";

  } else if (isGroup(groupType) && session.lastMsg) {
    let lastMsg = session.lastMsg; // 消息体
    let msgType = lastMsg.msgType; // 第一类型
    let msgSecondType = lastMsg.msgSecondType; // 第二类型
    let msgFrom = lastMsg.msgFrom; // 发送人
    let userList = getGroupUsers(session.msgTo); // 群成员

    // if (session.lastMsg.isRevocation) return (isMe(msgFrom) ? "你" : getUserName(getContackUser(msgFrom))) + "撤回了一条消息";
    // else if (isMsgTypeSystem(msgType)) return lastMsg.systemMsg.content;
    // else if (isCharSecondTypeText(msgSecondType)) return (isHaveAtMe(lastMsg) ? "<span style='color:red'>有人@我：</span>" : "") + (isMe(msgFrom) ? (lastMsg.unRead >= 1 ? ((lastMsg.unRead == userList.length - 1) ? ("[未读" + lastMsg.unRead + "人]") : ("[已读" + (userList.length - 1 - lastMsg.unRead) + "人][未读" + lastMsg.unRead + "人]")) : "[全部已读]") : (getUserName(getContackUser(msgFrom)) + ":")) + formatChatMessage(lastMsg, true);
    // else if (isCharSecondTypeFile(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead >= 1 ? ((lastMsg.unRead == userList.length - 1) ? ("[未查收" + lastMsg.unRead + "人]") : ("[已查收" + (userList.length - 1 - lastMsg.unRead) + "人][未查收" + lastMsg.unRead + "人]")) : "[全部已查收]") : (getUserName(getContackUser(msgFrom)) + ":")) + "[文件]" + lastMsg.chatMsg.description;
    // else if (isCharSecondTypeImage(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead >= 1 ? ((lastMsg.unRead == userList.length - 1) ? ("[未读" + lastMsg.unRead + "人]") : ("[已读" + (userList.length - 1 - lastMsg.unRead) + "人][未读" + lastMsg.unRead + "人]")) : "[全部已读]") : (getUserName(getContackUser(msgFrom)) + ":")) + "[图片]";
    // else if (isCharSecondTypeAudio(msgSecondType)) return (isMe(msgFrom) ? (lastMsg.unRead >= 1 ? ((lastMsg.unRead == userList.length - 1) ? ("[未读" + lastMsg.unRead + "人]") : ("[已读" + (userList.length - 1 - lastMsg.unRead) + "人][未读" + lastMsg.unRead + "人]")) : "[全部已读]") : (getUserName(getContackUser(msgFrom)) + ":")) + "[语音]";
    if (session.lastMsg.isRevocation) return (isMe(msgFrom) ? "你" : getUserName(getContackUser(msgFrom))) + "撤回了一条消息";
    else if (isMsgTypeSystem(msgType)) return lastMsg.systemMsg.content;
    else if (isCharSecondTypeText(msgSecondType)) return (isHaveAtMe(lastMsg) ? "<span style='color:red'>有人@我：</span>" : "") + (isMe(msgFrom) ? "" : (getUserName(getContackUser(msgFrom)) + ":")) + formatChatMessage(lastMsg, true);
    else if (isCharSecondTypeFile(msgSecondType)) return (isMe(msgFrom) ? "" : (getUserName(getContackUser(msgFrom)) + ":")) + "[文件]" + lastMsg.chatMsg.description;
    else if (isCharSecondTypeImage(msgSecondType)) return (isMe(msgFrom) ? "" : (getUserName(getContackUser(msgFrom)) + ":")) + "[图片]";
    else if (isCharSecondTypeAudio(msgSecondType)) return (isMe(msgFrom) ? "" : (getUserName(getContackUser(msgFrom)) + ":")) + "[语音]";

  } else if (groupType == ConstantType.GroupType.PLATFORM  && session.lastMsg) {
    let lastMsg = session.lastMsg; // 消息体
    let msgType = lastMsg.msgType; // 第一类型
    let msgSecondType = lastMsg.msgSecondType; // 第二类型

    if (msgSecondType == ConstantType.CharSecondType.CAHT_CUSTOMIZE) {
      let contentJson = JSON.parse(lastMsg.chatMsg.content);
      if(contentJson.type){
        let contentData = JSON.parse(contentJson.data);
        switch (contentJson.type) {
          case "company_01": {
            return contentData.content;
          }
          case "company_02": {
            return contentData.content;
          }
          case "company_03": {
            return contentData.content;
          }
        }
      }
    }
  }
}

/**
 * 是否-系统消息
 */
export function isWorkSecondTypeSystem(msgSecondType) {
  if (msgSecondType == ConstantType.WorkSecondType.SYSTEM) {
    return true;
  }
  return false;
}


/**
 * 图片加载结束跳到最低部
 */
export function imgOnloadJumpEnd() {
  setTimeout(function () {
    var msg_end = document.getElementById("msg_end");
    msg_end.scrollIntoView();
  }, 200);
}

/**
 * 获取URL参数
 * @param {*} name 
 */
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 构建群聊头像
 * @param {*} session 
 * @param {*} group 
 */
export function groupUserListImg(session, group) {

  var groupId = session ? session.msgTo : group.groupId
  var groupUsers = getGroupUsers(groupId);
  // 判断当前群主是否不在本群或者没有群主
  var isNotHaveOwner = true;
  if (isHaveOwner(groupId)) {
    for (let i = 0; i < groupUsers.length; i++) {
      const user = groupUsers[i];
      let userId = getImUID(user);
      if (isOwner(userId, groupId)) isNotHaveOwner = false;
    }
  }
  if (!groupUsers) groupUsers = [];
  if (groupUsers.length == 1) {
    var ownerHtml = null;
    let user = groupUsers[0];
    let userId = getImUID(user);
    const userInfo = getContackUser(userId);
    let headPortrait = userInfo.headPortrait;
    ownerHtml = '<img src="' + headPortrait + '" style="float: left; width: 40px; height: 40px;">'
    return ownerHtml;
  }
  if (groupUsers.length == 2) {
    var ownerHtml = null;
    var oneUserHtml = null;
    for (let i = 0; i < groupUsers.length; i++) {
      let user = groupUsers[i];
      let userId = getImUID(user);
      const userInfo = getContackUser(userId);
      let headPortrait = userInfo.headPortrait;
      if ((isNotHaveOwner && !ownerHtml) || isOwner(userId, groupId)) {
        ownerHtml = '<img src="' + headPortrait + '" style="width: 50%;height: 100%;object-fit: cover;border-radius: 5px 0 0 5px;">'
      } else {
        if (!oneUserHtml) oneUserHtml = '<img src="' + headPortrait + '" style="width: 50%;height: 100%;object-fit: cover;border-radius: 0 5px 5px 0;">';
      }
    }
    return ownerHtml + oneUserHtml;
  }
  if (groupUsers.length == 3) {
    var ownerHtml = null;
    var oneUserHtml = null;
    var twoUserHtml = null;
    for (let i = 0; i < groupUsers.length; i++) {
      let user = groupUsers[i];
      let userId = getImUID(user);
      const userInfo = getContackUser(userId);
      let headPortrait = userInfo.headPortrait;
      if ((isNotHaveOwner && !ownerHtml) || isOwner(userId, groupId)) ownerHtml = '<img src="' + headPortrait + '" style="border-radius: 5px 0px 0px 5px;width: 50%;height: 100%;object-fit: cover;">'
      else if (!oneUserHtml) oneUserHtml = '<img src="' + headPortrait + '" style="border-top-right-radius: 5px;width: 20px;height: 20px;position: absolute;">';
      else if (!twoUserHtml) twoUserHtml = '<img src="' + headPortrait + '" style="border-bottom-right-radius: 5px;width: 20px;height: 20px;">';
    }
    return ownerHtml + oneUserHtml + twoUserHtml;
  }
  if (groupUsers.length >= 4 && groupUsers.length < 9) {
    var ownerHtml = null;
    var oneUserHtml = null;
    var twoUserHtml = null;
    var threeUserHtml = null;
    for (let i = 0; i < groupUsers.length; i++) {
      let user = groupUsers[i];
      let userId = getImUID(user);
      const userInfo = getContackUser(userId);
      let headPortrait = userInfo.headPortrait;
      if ((isNotHaveOwner && !ownerHtml) || isOwner(userId, groupId)) ownerHtml = '<img src="' + headPortrait + '" style="border-top-left-radius: 5px;float: left;width: 20px; height: 20px;">'
      else if (!oneUserHtml) oneUserHtml = '<img src="' + headPortrait + '" style="border-top-right-radius: 5px;float: left;width: 20px; height: 20px;">';
      else if (!twoUserHtml) twoUserHtml = '<img src="' + headPortrait + '" style="border-bottom-left-radius: 5px;float: left;width: 20px; height: 20px;">';
      else if (!threeUserHtml) threeUserHtml = '<img src="' + headPortrait + '" style="border-bottom-right-radius: 5px;float: left;width: 20px; height: 20px;">';
      else if (oneUserHtml && ownerHtml && twoUserHtml && threeUserHtml) break;
    }
    return ownerHtml + oneUserHtml + twoUserHtml + threeUserHtml;
  }
  if (groupUsers.length >= 9) {
    let html = "";
    let userNum = 0;
    let ownerNum = 0;
    for (let i = 0; i < groupUsers.length; i++) {
      let user = groupUsers[i];
      let userId = getImUID(user);
      const userInfo = getContackUser(userId);
      let headPortrait = userInfo.headPortrait;
      if (ownerNum == 1 && userNum == 8) break;
      else if ((isNotHaveOwner && ownerNum == 0) || isOwner(userId, groupId)) {
        html = '<img src="' + headPortrait + '" style="border-top-left-radius: 5px;float: left;width: 12px;height: 12px;border: 0.5px solid transparent;">' + html;
        ownerNum = 1;
      } else if (userNum < 8) {
        let borderRadius = ""
        if (userNum == 2) borderRadius = 'border-top-right-radius: 5px;';
        else if (userNum == 6) borderRadius = 'border-bottom-left-radius: 5px;';
        else if (userNum == 8) borderRadius = 'border-bottom-right-radius: 5px;';
        html = html + '<img src="' + headPortrait + '" style="' + borderRadius + 'float: left;width: 12px;height: 12px;border: 0.5px solid transparent;">';
        userNum += 1;
      }
    }
    return html;
  }
}

// ***********************
// ********* 联系人
// ***********************
/**
 * 获取联系人信息
 * @param imUid
 * @returns {*}
 */
export function getContackUser(imUid) {
  let contackUser = {}
  if (imUid) {
    let contactUserList = Cache.getInstance().contactUserList;
    for (let i = 0; i < contactUserList.length; i++) {
      if (contactUserList[i].imUid == imUid) {
        contackUser = contactUserList[i];
        if (!contackUser.headPortrait) {
          contackUser.headPortrait = "/static/icon/02应用图标—icon/tu00.png"
        }
        break;
      }
    }
  }
  return contackUser;
}

/**
 * 获取当前账户信息
 */
export function getMyUserInfo() {
  var userInfo = store.state.sdkCache.userInfo;
  var userImID = userInfo.account;
  return getContackUser(userImID);
}

// ***********************
// ********* 群组
// ***********************
/**
 * 获取群信息
 *
 * @param groupId
 * @returns {*}
 */
export function getGroup(groupId) {
  let group = null;
  let groupList = Cache.getInstance().groupList;
  if (groupId) {
    for (let i = 0; i < groupList.length; i++) {
      if (groupId == groupList[i].groupId) {
        group = groupList[i];
        break;
      }
    }
  }
  return group;
}

/**
 * 获取群成员
 *
 * @param groupId
 * @returns {*}
 */
export function getGroupUsers(groupId) {
  let groupUserList = Cache.getInstance().groupUserList;
  let groupUsers = groupUserList.get(parseInt(groupId));
  return groupUsers;
}

// ***********************
// ********* 会话
// ***********************

/**
 * 获取会话信息
 * @param {*} sessionId 
 */
export function getSession(sessionId) {
  var sessionRes = null;
  var sessions = Cache.getInstance().sessions;
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (session.sessionId == sessionId) {
      sessionRes = session;
      break;
    };
  }
  return sessionRes;
}
/**
 * 获取会话消息
 * @param {*} sessionId 
 */
export function getMessage(sessionId) {
  var messages = Cache.getInstance().messages;
  var messageRes = messages.get(sessionId);
  return messageRes;
}

/**
 * 判断会话是否为普通群
 * @param {*} groupId 
 */
export function isGroupCommon(groupId) {
  let group = getGroup(groupId);
  if (group) {
    let type = group.type;
    if (type != ConstantType.GroupTypeConstant.Group_COMMON) {
      return true;
    }
  }
  return false;
}

/**
 * 判断会话是否为群组
 * @param {*} groupType 
 */
export function isGroup(groupType) {
  if (groupType == ConstantType.GroupType.GROUP) {
    return true;
  }
  return false;
}

/**
 * 判断会话是否为单聊
 * @param {*} groupType 
 */
export function isSingle(groupType) {
  if (groupType == ConstantType.GroupType.SINGLE) {
    return true;
  }
  return false;
}

/**
 * 判断会话是否为工作消息
 * @param {*} groupType 
 */
export function isWork(groupType) {
  if (groupType == ConstantType.GroupType.WORK) {
    return true;
  }
  return false;
}

/**
 * 格式化类型
 * @param {*} groupId 
 */
export function formatGroupType(groupId, groupType) {
  let type = "";
  if (groupId) {
    let group = getGroup(groupId);
    if (group) type = group.type;
  }
  if (groupType) {
    type = groupType;
  }
  switch (type) {
    case ConstantType.GroupTypeConstant.Group_MAIN_COMPANY:
      return "公司";
    case ConstantType.GroupTypeConstant.Group_BRANCH_COMPANY:
      return "分公司";
    case ConstantType.GroupTypeConstant.Group_PROJECTDEPARTMENT:
      return "项目部";
    case ConstantType.GroupTypeConstant.Group_COMPANY:
      return "部门";
    case ConstantType.GroupTypeConstant.Group_PROJECT:
      return "项目";
  }
  return "";
}
/**
 * 格式化类型
 * @param {*} groupId 
 */
export function getGroupTypeStyle(groupId, groupType) {
  let type = "";
  if (groupId) {
    let group = getGroup(groupId);
    if (group) type = group.type;
  }
  if (groupType) {
    type = groupType;
  }
  switch (type) {
    case ConstantType.GroupTypeConstant.Group_MAIN_COMPANY:
      // return "公司";
      return "border: 1px solid #00e54b3f; color: #00e54b; background-color: #00e54b19";
    case ConstantType.GroupTypeConstant.Group_BRANCH_COMPANY:
      // return "分公司";
      return "border: 1px solid #0072ff3f; color: #0072ff; background-color: #0072ff19";
    case ConstantType.GroupTypeConstant.Group_PROJECTDEPARTMENT:
      // return "项目部";
      return "border: 1px solid #ff90003f; color: #ff9000; background-color: #ff900019";
    case ConstantType.GroupTypeConstant.Group_COMPANY:
      // return "部门";
      return "border: 1px solid #d200ff3f; color: #d200ff; background-color: #d200ff19";
    case ConstantType.GroupTypeConstant.Group_PROJECT:
      // return "项目";
      return "border: 1px solid #005aff3f; color: #005aff; background-color: #005aff19";
  }
  return "";
}

/**
 * 是否为解散群
 * @param {*} state 
 */
export function isGroupPassthroughDissMiss(state) {
  if (state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_DISSMISS) {
    return true;
  }
  return false;
}
/**
 * 是否为新建群
 * @param {*} state
 */
export function isGroupPassthroughGroup(state) {
  if (state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_CREATE_GROUP) {
    return true;
  }
  return false;
}
/**
 * 是否为被踢出群
 * @param {*} state 
 */
export function isGroupPassthroughDissKickout(state) {
  if (state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_KICKOUT) {
    return true;
  }
  return false;
}
/**
 * 是否退出群
 * @param {*} state 
 */
export function isGroupPassthroughGroupLogout(state) {
  if (state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_GROUP_LOGOUT) {
    return true;
  }
  return false;
}
/**
 * 是否群主
 * @param {*} imId 
 */
export function isOwner(imId, groupId) {
  var group = getGroup(groupId);
  if (group && imId && imId == group.owner) {
    return true;
  }
  return false;
}

/**
 * 是否有群主
 * @param {*} imId 
 */
export function isHaveOwner(groupId) {
  var group = getGroup(groupId);
  if (group && group.owner) {
    return true;
  }
  return false;
}

/**
 * 检测当前会话是否（是群 且 已被踢出或解散或新建群）
 * @param {*} type 
 */
export function detectSession(session) {
  if (session) {
    var myUserInfo = getMyUserInfo();
    if (isGroup(session.groupType)) {
      if (isGroupPassthroughDissMiss(session.state)) {
        if (isOwner(getImUID(myUserInfo), session.msgTo)) {
          console.log("检测到自己解散的群");
          store.dispatch("setSessionId", -1);
          store.dispatch("closeSettingManySession");
          store.dispatch("closeSettingOfficialGroup");
          SessionsController.getInstance().deleteSession(session.sessionId);
          GroupController.getInstance().deleteOne(session.msgTo);
        } else {
          console.log("检测到该群已解散");
          MessageBox('该群已解散', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            // 弹窗
            store.dispatch("setSessionId", -1);
            store.dispatch("closeSettingManySession");
            store.dispatch("closeSettingOfficialGroup");
            SessionsController.getInstance().deleteSession(session.sessionId);
            GroupController.getInstance().deleteOne(session.msgTo);
          });
        }
        return true;
      } else if (isGroupPassthroughDissKickout(session.state)) {
        // 弹窗
        console.log("检测到已被踢出");
        MessageBox('已被移出该群', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          // 弹窗
          store.dispatch("setSessionId", -1);
          store.dispatch("closeSettingManySession");
          store.dispatch("closeSettingOfficialGroup");
          SessionsController.getInstance().deleteSession(session.sessionId);
          GroupController.getInstance().deleteOne(session.msgTo);
        });
        return true;
      } else if (isGroupPassthroughGroupLogout(session.state)) {
        console.log("检测到主动退出群");
        store.dispatch("setSessionId", -1);
        store.dispatch("closeSettingManySession");
        store.dispatch("closeSettingOfficialGroup");
        SessionsController.getInstance().deleteSession(session.sessionId);
        GroupController.getInstance().deleteOne(session.msgTo);
        return true;
      }
    }
  }
  return false;
}

/**
 * 检测文件类型
 * @param {*} file 
 */
export function detectFileType(file) {
  let patt = '';
  var charSecondType = 5;
  //-- 图片
  patt = /\.(svg|ico|gif|jpg|jpeg|png)$/;
  if (patt.test(file.name.toLowerCase())) {
    charSecondType = 3;
  }
  // //-- 视频
  // patt = /\.(mp4)$/;
  // if (patt.test(file.name.toLowerCase())) {
  //   charSecondType = 4; // 视频
  // }
  return charSecondType;
}

/**
 * 是否可撤回
 * @param {} msgBean 
 */
export function isRevocation(msgBean) {
  if (
    msgBean &&
    isMe(msgBean.msgFrom) &&
    msgBean.sendState != 3 // 发送失败
    &&
    ((new Date()).getTime() - longToInt(msgBean.timeStamp)) <= 180000
  ) {
    return true;
  }
  return false;
}

/**
 * 是否有SequenceId
 * @param {} msgBean 
 */
export function isHaveSequenceId(msgBean) {
  if (msgBean.sequenceId && msgBean.sequenceId != "") {
    return true;
  }
  return false;
}


/**
 * 是否-聊天信息
 */
export function isMsgTypeChat(msgType) {
  if (msgType == ConstantType.MsgType.CHAT) {
    return true;
  }
  return false;
}
/**
 * 是否-文本消息
 */
export function isCharSecondTypeText(msgSecondType) {
  if (msgSecondType == ConstantType.CharSecondType.CAHT_TEXT) {
    return true;
  }
  return false;
}
/**
 * 是否-语音消息
 */
export function isCharSecondTypeAudio(msgSecondType) {
  if (msgSecondType == ConstantType.CharSecondType.CAHT_AUDIO) {
    return true;
  }
  return false;
}
/**
 * 是否-图片消息
 */
export function isCharSecondTypeImage(msgSecondType) {
  if (msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE) {
    return true;
  }
  return false;
}
/**
 * 是否-视频消息
 */
export function isCharSecondTypeVideo(msgSecondType) {
  if (msgSecondType == ConstantType.CharSecondType.CAHT_VIDEO) {
    return true;
  }
  return false;
}
/**
 * 是否-文件消息
 */
export function isCharSecondTypeFile(msgSecondType) {
  if (msgSecondType == ConstantType.CharSecondType.CAHT_FILE) {
    return true;
  }
  return false;
}

/**
 * 是否-操作消息
 */
export function isMsgTypeOperation(msgType) {
  if (msgType == ConstantType.MsgType.OPERATION) {
    return true;
  }
  return false;
}
/**
 * 是否-系统消息
 */
export function isMsgTypeSystem(msgType) {
  if (msgType == ConstantType.MsgType.SYSTEM) {
    return true;
  }
  return false;
}
/**
 * 是否-透传消息
 */
export function isMsgTypePassthrough(msgType) {
  if (msgType == ConstantType.MsgType.PASSTHROUGH) {
    return true;
  }
  return false;
}
/**
 * 是否-工作消息
 */
export function isMsgTypeWork(msgType) {
  if (msgType == ConstantType.MsgType.WORK) {
    return true;
  }
  return false;
}

/**
 * 是否-是我自己
 */
export function isMe(imId) {
  var myuserInfo = getMyUserInfo();
  if (myuserInfo && getImUID(myuserInfo) == imId) {
    return true;
  }
  return false;
}

/**
 * 添加时间戳
 */
export function addTimeStamp(messages) {
  var newMessage = [];
  if (messages) {
    var lastTime = 0;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (!message.isDelete && (isMsgTypeSystem(message.msgType) || isMsgTypeChat(message.msgType)) && (longToInt(message.timeStamp) - lastTime) > 1000 * 60 * 5) {
        lastTime = longToInt(message.timeStamp);
        newMessage.push({
          msgType: ConstantType.MsgType.CHAT,
          isTimeStamp: true,
          time: message.timeStamp
        });
      }
      newMessage.push(message);
    }
  }
  return newMessage;
}

/**
 * LongToString
 */
export function longToString(long) {
  if (long) return long.toString();
  return null;
}

/**
 * LongToInt
 */
export function longToInt(long) {
  if (long) return parseInt(long.toString());
  return null;
}

/**
 * 获取当前节点下的所有人员
 */
export function getOrgUserList(orgList, orgData, isHaveSubCompany, isHaveProjectDepartment) {
  // 是人
  if (getImUID(orgData) && !orgData.children) {
    orgList.push(orgData);
  }
  // 不是人且有子节点
  else if (!getImUID(orgData) && orgData.children) {
    // 循环子节点
    for (let i = 0; i < orgData.children.length; i++) {
      const children = orgData.children[i];
      // 是否分公司
      let isSubCompany = children.orgType == "SubCompany";
      if (isSubCompany && !isHaveSubCompany) {
        continue;
      }
      // 是否项目部
      let isProjectDepartment = children.orgType == "ProjectDepartment";
      if (isProjectDepartment && !isHaveProjectDepartment) {
        continue;
      }
      // 
      else {
        getOrgUserList(orgList, children, isHaveSubCompany);
      }
    }
  }
}
/*
 * 加粗字符串的特定字符
 */
export function formatStrToHtml(str, searchStr) {
  return str.replace(new RegExp(searchStr, "gm"), '<span style="color: rgb(10, 67, 121);font-weight: bolder;">' + searchStr + '</span>')
}

/**
 * 获取用户名称
 */
export function getUserName(user) {
  if (user.name) return user.name;
  if (user.userName) return user.userName;
  if (user.groupNick) return user.groupNick;
  if (user.nick) return user.nick;
  return null;
}
/**
 * 获取用户imUID
 */
export function getImUID(user) {
  if (user) {
    if (user.imUid) return user.imUid;
    if (user.imId) return user.imId;
    if (user.userId) return user.userId;
  }
  return null;
}
