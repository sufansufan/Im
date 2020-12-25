import messageUtils from "../../utils/messageUtils";
import SessionsController from "../../js/sdk/service/SessionsController";
import sessionUtils from "../../utils/sessionUtils";
import Client from "../../js/sdk/client";
var EmojiSourcePeople = [
  "\u263a", "\ud83d\ude0a", "\ud83d\ude00", "\ud83d\ude01", "\ud83d\ude02", "\ud83d\ude03",
  "\ud83d\ude04", "\ud83d\ude05", "\ud83d\ude06", "\ud83d\ude07", "\ud83d\ude08", "\ud83d\ude09",
  "\ud83d\ude2f", "\ud83d\ude10", "\ud83d\ude11", "\ud83d\ude15", "\ud83d\ude20", "\ud83d\ude2c",
  "\ud83d\ude21", "\ud83d\ude22", "\ud83d\ude34", "\ud83d\ude2e", "\ud83d\ude23", "\ud83d\ude24",
  "\ud83d\ude25", "\ud83d\ude26", "\ud83d\ude27", "\ud83d\ude28", "\ud83d\ude29", "\ud83d\ude30",
  "\ud83d\ude1f", "\ud83d\ude31", "\ud83d\ude32", "\ud83d\ude33", "\ud83d\ude35", "\ud83d\ude36",
  "\ud83d\ude37", "\ud83d\ude1e", "\ud83d\ude12", "\ud83d\ude0d", "\ud83d\ude1b", "\ud83d\ude1c",
  "\ud83d\ude1d", "\ud83d\ude0b", "\ud83d\ude17", "\ud83d\ude19", "\ud83d\ude18", "\ud83d\ude1a",
  "\ud83d\ude0e", "\ud83d\ude2d", "\ud83d\ude0c", "\ud83d\ude16", "\ud83d\ude14", "\ud83d\ude2a",
  "\ud83d\ude0f", "\ud83d\ude13", "\ud83d\ude2b", "\ud83d\ude4b", "\ud83d\ude4c", "\ud83d\ude4d",
  "\ud83d\ude45", "\ud83d\ude46", "\ud83d\ude47", "\ud83d\ude4e", "\ud83d\ude4f", "\ud83d\ude3a",
  "\ud83d\ude3c", "\ud83d\ude38", "\ud83d\ude39", "\ud83d\ude3b", "\ud83d\ude3d", "\ud83d\ude3f",
  "\ud83d\ude3e", "\ud83d\ude40", "\ud83d\ude48", "\ud83d\ude49", "\ud83d\ude4a", "\ud83d\udca9",
  "\ud83d\udc76", "\ud83d\udc66", "\ud83d\udc67", "\ud83d\udc68", "\ud83d\udc69", "\ud83d\udc74",
  "\ud83d\udc75", "\ud83d\udc8f", "\ud83d\udc91", "\ud83d\udc6a", "\ud83d\udc6b", "\ud83d\udc6c",
  "\ud83d\udc6d", "\ud83d\udc64", "\ud83d\udc65", "\ud83d\udc6e", "\ud83d\udc77", "\ud83d\udc81",
  "\ud83d\udc82", "\ud83d\udc6f", "\ud83d\udc70", "\ud83d\udc78", "\ud83c\udf85", "\ud83d\udc7c",
  "\ud83d\udc71", "\ud83d\udc72", "\ud83d\udc73", "\ud83d\udc83", "\ud83d\udc86", "\ud83d\udc87",
  "\ud83d\udc85", "\ud83d\udc7b", "\ud83d\udc79", "\ud83d\udc7a", "\ud83d\udc7d", "\ud83d\udc7e",
  "\ud83d\udc7f", "\ud83d\udc80", "\ud83d\udcaa", "\ud83d\udc40", "\ud83d\udc42", "\ud83d\udc43",
  "\ud83d\udc63", "\ud83d\udc44", "\ud83d\udc45", "\ud83d\udc8b", "\u2764", "\ud83d\udc99",
  "\ud83d\udc9a", "\ud83d\udc9b", "\ud83d\udc9c", "\ud83d\udc93", "\ud83d\udc94", "\ud83d\udc95",
  "\ud83d\udc96", "\ud83d\udc97", "\ud83d\udc98", "\ud83d\udc9d", "\ud83d\udc9e", "\ud83d\udc9f",
  "\ud83d\udc4d", "\ud83d\udc4e", "\ud83d\udc4c", "\u270a", "\u270c", "\u270b",
  "\ud83d\udc4a", "\u261d", "\ud83d\udc46", "\ud83d\udc47", "\ud83d\udc48", "\ud83d\udc49",
  "\ud83d\udc4b", "\ud83d\udc4f", "\ud83d\udc50"
];

function getDraftMessages() {
  // 替换表情图片为文字
  var preDom = document.getElementById('preId');
  if (preDom) {
    var cNode = preDom.cloneNode(true)
    cNode.childNodes.forEach((item, index, array) => {
      // @
      if (item.className == 'atwho-inserted') {
        item.firstChild.innerText = item.firstChild.innerText + "-" + item.firstChild.getAttribute('userid')
      }
      // 图片
      if (item.nodeName == 'IMG') {
        var spanIMG = document.createElement("span");
        if (item.getAttribute('emojisourcepeoplenum')) {
          spanIMG.innerText = EmojiSourcePeople[item.getAttribute('emojisourcepeoplenum')];
        }
        cNode.replaceChild(spanIMG, item)
      }
      // 换行符
      if (item.nodeName == 'BR') {
        var spanBR = document.createElement("span");
        spanBR.innerText = "\\n";
        cNode.replaceChild(spanBR, item)
      }
    })
    preDom.innerHTML = "";
    return cNode.innerText.replace(/\\n/g, "\n");
  }
  return null;
}
const session = {
  state: {
    sessionId: -1,
    draftMessageMap: new Map(),
    treeContextMenuVisible: false,
    messageContextmenuVisible: false,
    messageContextmenuData: {}
  },
  mutations: {
    SET_SESSION_ID: (state, sessionId) => {
      var oldSessionId = state.sessionId;
      state.sessionId = -1;
      var draftMessage = getDraftMessages();
      if (draftMessage && draftMessage.replace(/[‍‍\s]/g, "") != "") {
        state.draftMessageMap.set(oldSessionId, draftMessage);
        SessionsController.getInstance().sticky(oldSessionId);
      } else {
        state.draftMessageMap.delete(oldSessionId);
      }
      state.sessionId = sessionId;
    },
    DELETE_DRAFT_MESSAGE: (state, sessionId) => {
      state.draftMessageMap.delete(sessionId);
    },
    /** 显隐会话右键菜单 */
    SET_SESSION_TREE_CONTEXT_MENU_VISIBLE: (state, visible) => {
      state.treeContextMenuVisible = visible;
    },
    /** 显隐消息右键菜单 */
    CLOSE_MESSAGE_CONTEXT_MENU_VISIBLE: (state) => {
      state.messageContextmenuVisible = false;
      state.messageContextmenuData = {};
    },
    /** 显隐消息右键菜单 */
    OPEN_MESSAGE_CONTEXT_MENU_VISIBLE: (state, data) => {
      state.messageContextmenuVisible = true;
      state.messageContextmenuData = data;
    },
  },
  actions: {
    /** 设置当前会话ID */
    setSessionId(context, sessionId) {
      document.onclick();
      context.commit("SET_SESSION_ID", sessionId);
    },
    /** 删除草稿信息 */
    deleteDraftMessage(context, sessionId) {
      context.commit("DELETE_DRAFT_MESSAGE", sessionId);
    },
    /** 显隐会话右键菜单 */
    setSessionTreeContextMenuVisible(context, visible) {
      context.commit("SET_SESSION_TREE_CONTEXT_MENU_VISIBLE", visible);
    },
    /** 显隐消息右键菜单 */
    openMessageContextmenuVisible(context, data) {
      context.commit("OPEN_MESSAGE_CONTEXT_MENU_VISIBLE", data);
    },
    /** 显隐消息右键菜单 */
    closeMessageContextmenuVisible(context) {
      context.commit("CLOSE_MESSAGE_CONTEXT_MENU_VISIBLE");
    },
  }
};

export default session;
