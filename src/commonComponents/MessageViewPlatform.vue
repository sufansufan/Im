<template>
  <div
    :id="getId()"
    class="MessageViewPlatform"
    :style="msgFromIsMe?'padding: 5px 5px 18px 5px;':''"
  >
    <!-- 删除 -->
    <div v-if="message.isDelete" class="systemMessage"></div>
    <!-- 时间戳 -->
    <div
      v-else-if="message.isTimeStamp"
      class="systemMessage"
    >{{message.time | dateFormatTimeStamp}}</div>
    <!-- 系统消息 -->
    <div
      v-else-if="message.msgType == ConstantType.MsgType.SYSTEM"
      class="systemMessage"
    >{{message.systemMsg.content}}</div>
    <!-- 聊天消息 -->
    <div v-else-if="message.msgType == ConstantType.MsgType.CHAT">
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="[msgFromInfo.headPortrait]"
        defaultUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
        errorUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
        width="40px"
        :float="'left'"
        :margin="'0 0 0 10px'"
      />
      <div class="textMessage" :style="'float:left;margin: 0px 0 0 10px;'">
        <el-card shadow="hover" :body-style="'padding: 5px;'">
          <img
            v-if="isShowReadStatus"
            src="/static/icon/9.png"
            style=" float: right; width: 10px; height: 10px; margin-top: 9px; margin-right: 5px;margin-left: 10px; "
          />
          <div style="margin:0;width:440px;">
            <div style="padding:5px;word-wrap: break-word;">{{ contentData.content }}</div>
            <div style=" border: 0.5px solid #e7e7e7; " />
            <div style="padding: 5px;height: 15px;">
              <span
                style=" float: left; color: #c5c5c5; font-size: 12px; "
              >类型：{{ contentData.title }}</span>
              <a
                @click="openNotity(message)"
                href="javascript:void(0);"
                style="float: right;text-decoration:none;color:#0a4c8a"
              >查看详情 ></a>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import publicAccountUtils from '../utils/publicAccountUtils'
import ConstantType from '../js/sdk/constant/ConstantType';

import ImHeadPortrait from '../commonComponents/ImHeadPortrait';
import NodeText from '../commonComponents/NodeText';
import messageUtils from '../utils/messageUtils';
import Client from '../js/sdk/client';

export default {
  components: {
    ImHeadPortrait,
    NodeText
  },
  props: {
    message: {
      type: Object,
      default: () => { }
    },
    isShowReadStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentData: {},
      msgFromInfo: {},
      msgToInfo: {},
      msgFromIsMe: false,

      ConstantType: ConstantType,
      messageUtils: messageUtils
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.msgFromInfo = publicAccountUtils.getOneByImUid(this.message.msgFrom);
    if (this.message.msgType == ConstantType.MsgType.CHAT) {
      this.contentData = this.getContentJson(this.message.chatMsg.content)
    }
  },
  methods: {
    getContentJson(content) {
      let contentJson = JSON.parse(content);
      let data = {};
      if (contentJson.type) {
        switch (contentJson.type) {
          case "company_01": {
            data.title = JSON.parse(contentJson.data).targetTypeName;
            data.content = JSON.parse(contentJson.data).content;
            break;
          }
          case "company_02": {
            data.title = JSON.parse(contentJson.data).targetTypeName;
            data.content = JSON.parse(contentJson.data).content;
            break;
          }
          case "company_03": {
            break;
          }
        }
      } else {
        data.title = JSON.parse(contentJson.data).type;
        data.content = JSON.parse(contentJson.data).content;
      }
      return data;
    },
    openNotity(item) {
      let content = item.chatMsg.content;
      let contentJson = JSON.parse(content);
      if (contentJson.type) {
        let dataJson = JSON.parse(contentJson.data);
        switch (contentJson.type) {
          case "company_01": {
            parent.app.openNotity(
              dataJson.id,
              dataJson.targetType,
              dataJson.targetParams
            );
            break;
          }
          case "company_02": {
            parent.app.openWork(
              dataJson.id,
              dataJson.type,
              dataJson.targetParams
            );
            break;
          }
          case "company_03": {
            parent.app.openWork();
            break;
          }
        }
        Client.getInstance().sendOperationMessage(
          this.message.msgFrom,
          item.sequenceId,
          ConstantType.OperationMsgConstant.OPERATION_READ,
          ConstantType.GroupType.PLATFORM
        );
        parent.app.imWindowVisible = false;
      }
    },
    getId() {
      let message = this.message;
      let str = 'MessageViewGroup'
      str += '_' + (message.readStatus ? 'true' : 'false')
      str += '_' + (message.msgTo ? message.msgTo : '');
      str += '_' + (message.sequenceId ? message.sequenceId.toString() : '');
      str += '_' + (message.groupType ? message.groupType : 0)
      return str;
    },
  }
};
</script>

<style scoped>
.MessageViewPlatform {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  float: left;
  padding: 5px;
}

.MessageViewPlatform .systemMessage {
  text-align: center;
  font-size: 10px;
  color: #999999;
}

.MessageViewPlatform .timeView {
  color: #9e9e9e;
  font-size: 12px;
  visibility: hidden;
}
.MessageViewPlatform:hover .timeView {
  visibility: inherit;
}

.MessageViewPlatform .nameText {
  width: calc(100% - 40px - 10px);
  height: 50%;
  float: left;
}
.MessageViewPlatform .textMessage {
  font-size: 14px;
}
.MessageViewPlatform .sending {
  font-size: 12px;
  float: right;
  margin: 10px 5px 0 0;
}
</style>


