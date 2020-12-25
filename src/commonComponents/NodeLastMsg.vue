<template>
  <span
    id="NodeText"
    :style="'float:'+float+';maxWidth:'+maxWidth+';margin:'+margin+';fontSize:'+fontSize+';color:'+color"
    v-html="formatLastMsg()"
  ></span>
</template>

<script>
import urlUtils from '../utils/urlUtils';
import openApiUserUtils from '../utils/openApiUserUtils';
import messageUtils from '../utils/messageUtils';
import ConstantType from '../js/sdk/constant/ConstantType';

export default {
  props: {
    msg: {
      type: Object,
      default: () => { }
    },
    draftMessage: {
      type: Object,
      default: () => { }
    },
    isTree: {
      type: Boolean,
      default: false
    },
    highlightStr: {
      type: String,
      default: ""
    },
    float: {
      type: String,
      default: "left"
    },
    maxWidth: {
      type: String,
      default: "56px"
    },
    margin: {
      type: String,
      default: "0 0 0 10px"
    },
    fontSize: {
      type: String,
      default: "14px"
    },
    color: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    formatLastMsg() {
      // ---渲染草稿-----------------------------------------------------------
      if (this.draftMessage) {
        return '<div style="color:red;display: inline;position: relative;top: -1px;">[草稿] </div>' + messageUtils.formatChatMessage(this.draftMessage, this.isTree);
      }
      // ---渲染消息-----------------------------------------------------------
      if (this.msg) {
        let groupType = this.msg.groupType;
        let msgType = this.msg.msgType;
        let msgSecondType = this.msg.msgSecondType;
        // 单聊
        if (groupType == ConstantType.GroupType.SINGLE) {
          let msgFromInfo = openApiUserUtils.getOneByImUid(this.msg.msgFrom);
          let msgToInfo = openApiUserUtils.getOneByImUid(this.msg.msgTo);
          let msgFromIsMe = openApiUserUtils.isMe(this.msg.msgFrom)
          if (msgType == ConstantType.MsgType.CHAT) {
            // 撤回消息
            if (this.msg.isRevocation) {
              let str = msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + "撤回了一条消息";
            }
            // 文本消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_TEXT) {
              let str = msgFromIsMe ? (this.msg.unRead == 1 ? "[未读]" : "[已读]") : ""
              return str + messageUtils.formatChatMessage(this.msg, this.isTree);
            }
            // 文件消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_FILE) {
              let str = msgFromIsMe ? (this.msg.unRead == 1 ? "[未查收]" : "[已查收]") : ""
              return str + "[文件]" + this.msg.chatMsg.description;
            }
            // 图片消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE) {
              let str = msgFromIsMe ? (this.msg.unRead == 1 ? "[未读]" : "[已读]") : ""
              return str + "[图片]";
            }
            // 语音消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_AUDIO) {
              let str = msgFromIsMe ? (this.msg.unRead == 1 ? "[未读]" : "[已读]") : ""
              return str + "[语音]";
            }
          }
          // 系统消息
          else if (msgType == ConstantType.MsgType.SYSTEM) {
            return this.msg.systemMsg.content
          }
        }
        // 群聊
        else if (groupType == ConstantType.GroupType.GROUP) {
          let msgFromInfo = openApiUserUtils.getOneByImUid(this.msg.msgFrom);
          let msgToInfo = openApiUserUtils.getOneByImUid(this.msg.msgTo);
          let msgFromIsMe = openApiUserUtils.isMe(this.msg.msgFrom)
          if (msgType == ConstantType.MsgType.CHAT) {
            // 撤回消息
            if (this.msg.isRevocation) {
              let str = msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + "撤回了一条消息";
            }
            // 文本消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_TEXT) {
              let str = messageUtils.isHaveAtMe(this.msg) && !msgFromIsMe ? "<span style='color:red'>有人@我：</span>" : ""
              str += msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + ":" + messageUtils.formatChatMessage(this.msg, this.isTree);
            }
            // 文件消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_FILE) {
              let str = msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + ":[文件]" + this.msg.chatMsg.description;
            }
            // 图片消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE) {
              let str = msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + ":[图片]";
            }
            // 语音消息
            else if (msgSecondType == ConstantType.CharSecondType.CAHT_AUDIO) {
              let str = msgFromIsMe ? "你" : openApiUserUtils.getNameByUser(msgFromInfo)
              return str + ":[语音]";
            }
          }
          // 系统消息
          else if (msgType == ConstantType.MsgType.SYSTEM) {
            return this.msg.systemMsg.content
          }
        }
        // 公众号
        else if (groupType == ConstantType.GroupType.PLATFORM) {
          if (msgSecondType == ConstantType.CharSecondType.CAHT_CUSTOMIZE) {
            let contentJson = JSON.parse(this.msg.chatMsg.content);
            if (contentJson.type) {
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
    }
  }
};
</script>

<style scoped>
#NodeText {
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>


