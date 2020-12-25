import ConstantType from "../js/sdk/constant/ConstantType";
import sessionUtils from "./sessionUtils";
import store from "../store";
import groupUtils from "./groupUtils";
import openApiUserUtils from "./openApiUserUtils";
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
export default {
  /**
   * 获取所有消息
   */
  getAll() {
    return store.state.cache.cache.messagesMap
  },
  /**
   * 根据sessionId获取会话信息
   * @param {} sessionId 
   */
  getOneBySessionId(sessionId) {
    let messagesRes = [];
    let messagesMap = this.getAll();
    if (sessionId && messagesMap) {
      let session = sessionUtils.getOneBySessionId(sessionId);
      let messages = messagesMap.get(sessionId + '');
      let groupInfo = groupUtils.getOneByGroupId(session.msgTo);
      if (messages) {
        var lastTime = 0;
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          message.localUnRead = true;
          if (!message.isDelete && (parseInt(message.timeStamp.toString()) - lastTime) > 1000 * 60 * 5) {
            lastTime = parseInt(message.timeStamp.toString());
            messagesRes.push({
              isTimeStamp: true,
              vueKey: this.uuid(),
              time: message.timeStamp
            });
          }
          this.buildSystemMsg(message, groupInfo);
          if (message.sequenceId) {
            message.vueKey = message.sequenceId.toString()+"_" + message.isRevocation;
          } else {
            message.vueKey = this.uuid();
          }
          messagesRes.push(message);
        }
      }
    }
    return messagesRes;
  },
  buildSystemMsg(msg, groupInfo) {
    if (msg.msgType == ConstantType.MsgType.SYSTEM && groupInfo.type != ConstantType.GroupTypeConstant.Group_COMMON) {
      let content = "";
      let operatedText = msg.systemMsg.operatedText;
      let isHaveMe = msg.systemMsg.isHaveMe;
      switch (msg.msgSecondType) {
        case ConstantType.SystemMsgType.SYSTEM_CREATE_GROUP: {
          content = "欢迎加入 " + groupInfo.groupName + " " + groupUtils.formatGroupType(groupInfo.type);
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_JOIN_GROUP: {
          if (isHaveMe) {
            content = "欢迎加入 " + groupInfo.groupName + " " + groupUtils.formatGroupType(groupInfo.type);
          } else {
            content = "欢迎 " + operatedText + " 加入 " + groupInfo.groupName + " " + groupUtils.formatGroupType(groupInfo.type);
          }
          break;
        }
        case ConstantType.SystemMsgType.SYSTEM_REMOVE_GROUP: {
          content = operatedText + ' 被移出这个群';
          break;
        }
      }
      msg.systemMsg.content = content;
    }
  },
  /**
   * LongToString
   */
  longToString(long) {
    if (long) return long.toString();
    return null;
  },

  /**
   * LongToInt
   */
  longToInt(long) {
    if (long) return parseInt(long.toString());
    return null;
  },
  /**
   * 格式化消息
   * @param {} msgBean MsgBean
   */
  formatChatMessage(msgBean, isTree, isDraft) {
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
          (isTree ? 'style=" width: 13px; height: 13px;position: relative; top: 2px;"' : 'style=" width: 20px; height: 20px;position: relative; top: 4px;"') +
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
  },
  /**
   * 是否有人"@"我
   * @param {*} iconUrl 
   */
  isHaveAtMe(msgBean) {
    // 有atList 且 未读
    if (msgBean && msgBean.chatMsg && msgBean.chatMsg.atList && !msgBean.readStatus) {
      // at所有人
      var atRe = /@所有人+\u200D;?/ig;
      var atReMatches = msgBean.chatMsg.content.match(atRe) || [];
      if (atReMatches.length > 0 && !openApiUserUtils.isMe(msgBean.msgFrom)) return true;
      // at我
      for (let i = 0; i < msgBean.chatMsg.atList.length; i++) {
        const imUid = msgBean.chatMsg.atList[i];
        if (openApiUserUtils.isMe(imUid)) return true;
      }
    }
    return false;
  },
  uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
}
