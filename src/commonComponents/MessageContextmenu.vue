<template>
  <ul
    id="MessageContextmenu"
    v-show="messageContextmenuVisible"
    :style="{left:messageContextmenuData.left+'px',top:messageContextmenuData.top+'px'}"
  >
    <li
      v-if="isForward"
      @click="$store.dispatch('openForwardDialoge',$store.state.session.messageContextmenuData.data)"
    >转发</li>
    <li v-if="isShowCopy" @click="copy">复制</li>
    <li @click="sendOperationMessage(ConstantType.OperationMsgConstant.OPERATION_DELETE)">删除</li>
    <li
      v-if="isRevocation"
      @click="sendOperationMessage(ConstantType.OperationMsgConstant.OPERATION_REVOCATION)"
    >撤回</li>
    <li v-if="isSave" @click="save">下载</li>
  </ul>
</template>

<script>
import Client from '../js/sdk/client';
import messageUtils from '../utils/messageUtils';
import ConstantType from '../js/sdk/constant/ConstantType';
import openApiUserUtils from '../utils/openApiUserUtils';

export default {
  props: {

  },
  data() {
    return {
      ConstantType: ConstantType,
      isRevocation: false,
      isShowCopy: false,
      isSave: false,
      isForward: false
    };
  },
  computed: {
    messageContextmenuVisible() {
      return this.$store.state.session.messageContextmenuVisible;
    },
    messageContextmenuData() {
      return this.$store.state.session.messageContextmenuData;
    },
  },
  watch: {
    messageContextmenuVisible(val) {
      this.filterContextmenu()
    },
    messageContextmenuData() {
      this.filterContextmenu()
    }
  },
  methods: {
    filterContextmenu() {
      if (this.messageContextmenuVisible) {
        let msg = this.messageContextmenuData.data;
        this.isRevocation =
          (openApiUserUtils.isMe(msg.msgFrom)) &&
          (msg.sendState != 3) &&
          (((new Date()).getTime() - messageUtils.longToInt(msg.timeStamp)) <= 180000)
        this.isShowCopy = ((msg.msgType == ConstantType.MsgType.CHAT) && (msg.msgSecondType == ConstantType.CharSecondType.CAHT_TEXT))
        this.isSave = ((msg.msgType == ConstantType.MsgType.CHAT) && (msg.msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE || msg.msgSecondType == ConstantType.CharSecondType.CAHT_FILE))
        this.isForward = ((msg.msgType == ConstantType.MsgType.CHAT) && (msg.msgSecondType == ConstantType.CharSecondType.CAHT_TEXT || msg.msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE || msg.msgSecondType == ConstantType.CharSecondType.CAHT_FILE))
      }
    },
    copy() {
      this.$copyText(this.messageContextmenuData.data.chatMsg.content).then((e) => {
        this.$message({
          showClose: true,
          type: "success",
          message: "已将消息内容复制到剪切板"
        });
      }, (e) => {
        this.$message({
          showClose: true,
          type: "warning",
          message: "复制失败"
        });
      })
    },
    // 撤回及删除方法
    sendOperationMessage(operationType) {
      this.revocationOrDeleteSequenceId = messageUtils.longToString(
        this.messageContextmenuData.data.sequenceId
      );
      Client.getInstance().sendOperationMessage(
        this.messageContextmenuData.data.msgTo,
        this.messageContextmenuData.data.sequenceId,
        operationType,
        this.messageContextmenuData.data.groupType
      );
    },
    save() {
      let str = this.messageContextmenuData.data.chatMsg.content;
      let name = this.messageContextmenuData.data.chatMsg.description;
      let alink = document.createElement("a");
      alink.href = str;
      alink.download = name;
      alink.click();
    }
  }
};
</script>

<style scoped>
#MessageContextmenu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
#MessageContextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
#MessageContextmenu li:hover {
  background: #eee;
}
</style>
