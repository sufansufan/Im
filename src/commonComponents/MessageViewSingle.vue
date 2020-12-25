<template>
  <div
    :id="getId()"
    class="MessageViewSingle"
    :style="msgFromIsMe&&!message.isRevocation?'padding: 5px 5px 18px 5px;':''"
  >
    <!-- 删除 -->
    <div v-if="message.isDelete" class="systemMessage"></div>
    <!-- 撤回 -->
    <div v-else-if="message.isRevocation" class="systemMessage">{{getRevocationText()}}</div>
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
        :imUid="msgFromInfo.imUid"
        width="40px"
        :float="msgFromIsMe?'right':'left'"
        :margin="msgFromIsMe?'0 10 0 0':'0 0 0 10px'"
      />
      <div
        class="textMessage"
        :style="msgFromIsMe?'float:right;margin: 0 10px 0 0;':'float:left;margin: 0px 0 0 10px;'"
        @contextmenu.prevent="messageContextmenu"
      >
        <el-card
          shadow="hover"
          :body-style="'padding: 0px;'+(msgFromIsMe?'background-color: #bbdeff;':'')"
        >
          <!-- 文字消息 -->
          <div
            v-if="message.msgSecondType == ConstantType.CharSecondType.CAHT_TEXT"
            v-html="messageUtils.formatChatMessage(message)"
            style="padding:5px 8px;margin:0;max-width:400px;white-space: pre-wrap; word-wrap: break-word;line-height: 25px;"
          ></div>
          <!-- 图片消息 -->
          <div v-else-if="message.msgSecondType == ConstantType.CharSecondType.CAHT_IMAGE">
            <img
              v-show="imgStatus == 'success'"
              v-if="imgStatus != 'error'"
              :src="message.chatMsg.content"
              style="width: 150px; height: 150px;background-color: #ffffff;float: left;object-fit: contain;"
              preview="0"
              @load="imgLoad"
              @error="imError"
            />
            <div
              v-if="imgStatus == 'error'"
              style="width: 150px; height: 150px;background-color: #ffffff;float: left;"
            >
              <div slot="error" style="background-color: rgb(230, 234, 234);padding: 39px 40px;">
                <img src="/static/icon/img.png" style=" padding: 0 10px; " />
                <i
                  class="el-alert__icon el-icon-error"
                  style="font-size: 16px; width: 16px; color: #fa5151; position: absolute; margin-top: 38px; margin-left: -18px; background-color: #e6eaea; border-radius: 100px; "
                ></i>
                <div style="color:#666;margin-top: 2px; ">图片已失效</div>
              </div>
            </div>
            <div
              v-if="imgStatus != 'success' && imgStatus != 'error'"
              style="width: 150px; height: 150px;background-color: #ffffff;float: left;"
            >
              <div
                slot="placeholder"
                style="background-color: rgb(230, 234, 234);padding: 66px 18px;"
              >
                <i class="el-icon-loading"></i> 正在加载图片...
              </div>
            </div>
            <!-- <el-image
              style="width: 150px; height: 150px;background-color: #ffffff;float: left;"
              :src="message.chatMsg.content"
              fit="contain"
              :preview-src-list="[message.chatMsg.content]"
            >
              <div slot="error" style="background-color: rgb(230, 234, 234);padding: 39px 40px;">
                <img src="/static/icon/img.png" style=" padding: 0 10px; " />
                <i
                  class="el-alert__icon el-icon-error"
                  style="font-size: 16px; width: 16px; color: #fa5151; position: absolute; margin-top: 38px; margin-left: -18px; background-color: #e6eaea; border-radius: 100px; "
                ></i>
                <div style="color:#666;margin-top: 2px; ">图片已失效</div>
              </div>
              <div
                slot="placeholder"
                style="background-color: rgb(230, 234, 234);padding: 66px 18px;"
              >
                <i class="el-icon-loading"></i> 正在加载图片...
              </div>
            </el-image>-->
          </div>
          <!-- 文件消息 -->
          <div v-else-if="message.msgSecondType == ConstantType.CharSecondType.CAHT_FILE">
            <div
              :style="'padding: 10px 10px 10px 15px; float: left;'"
            >
              <img
                style="float: left;width: 41px;height: 51px;"
                :src="getFileImgSrc()"
              />
              <div
                style="margin-top: 7px;height: 22px;max-width: 335px;min-width: 100px;overflow: hidden;padding-left: 10px;white-space: nowrap;text-overflow: ellipsis;"
              >
                <a
                  href="javascript:void(0);"
                  style="text-decoration:none;"
                  @click="download(message)"
                >{{ message.chatMsg.description }}</a>
              </div>
              <NodeText
                :text="getFileSize()"
                fontSize="12px"
                max-width="335px"
                margin="0px 0px 0px 10px;"
              />
            </div>
          </div>
          <!-- 语音消息 -->
          <div v-else-if="message.msgSecondType == ConstantType.CharSecondType.CAHT_AUDIO">
            <div style="padding: 10px; float: left;">[语音]暂不支持播放，请到手机端查看</div>
          </div>
          <!-- 视频消息 -->
          <div v-else-if="message.msgSecondType == ConstantType.CharSecondType.CAHT_VIDEO">
            <div style="padding: 10px; float: left;">[视频]暂不支持播放，请到手机端查看</div>
          </div>
        </el-card>
        <div
          v-if="!message.sendState && msgFromIsMe"
          :style="'font-size: 12px; position: absolute; right: 55px;padding-top: 3px;color: '+ (message.unRead >= 1?'rgb(33, 134, 230)':'#999999')"
        >{{getReadStatus(message)}}</div>
      </div>
      <!-- 发送中 -->
      <span
        v-if="message.sendState && message.sendState == ConstantType.MsgSendState.SENDING"
        class="sending"
      >
        <i class="el-alert__icon el-icon-loading"></i>
      </span>
      <!-- 发送失败 -->
      <span
        v-if="message.sendState && message.sendState == ConstantType.MsgSendState.FAIL"
        class="sending"
        style=" color: red;cursor: pointer; "
      >
        <i class="el-alert__icon el-icon-warning"></i>
      </span>
    </div>
  </div>
</template>

<script>
import openApiUserUtils from '../utils/openApiUserUtils'
import ConstantType from '../js/sdk/constant/ConstantType';

import ImHeadPortrait from '../commonComponents/ImHeadPortrait';
import NodeText from '../commonComponents/NodeText';
import messageUtils from '../utils/messageUtils';

export default {
  components: {
    ImHeadPortrait,
    NodeText,
  },
  props: {
    message: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      unReadSIDList: [],
      setReadStatusTimeout: "",
      sendReadOperationSIDList: [],

      msgFromInfo: {},
      msgToInfo: {},
      msgFromIsMe: false,
      msgToIsMe: false,

      imgStatus: "",

      openApiUserUtils: openApiUserUtils,
      ConstantType: ConstantType,
      messageUtils: messageUtils
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    this.msgFromInfo = openApiUserUtils.getOneByImUid(this.message.msgFrom);
    this.msgToInfo = openApiUserUtils.getOneByImUid(this.message.msgTo);
    this.msgFromIsMe = openApiUserUtils.isMe(this.message.msgFrom);
    this.msgToIsMe = openApiUserUtils.isMe(this.message.msgTo);
  },
  methods: {
    getRevocationText() {
      let str = " 撤回了一条消息"
      if (this.msgFromIsMe) {
        str = "你" + str;
      } else {
        str = openApiUserUtils.getNameByUser(this.msgFromInfo) + str;
      }
      return str;
    },
    download(msg) {
      var a = document.createElement("a");
      a.setAttribute("href", msg.chatMsg.content);
      a.setAttribute("download", msg.chatMsg.description);
      a.click();
      this.unReadSIDList.push(msg.sequenceId);
    },
    getReadStatus(message) {
      if (!message.sendState && !this.msgToIsMe) {
        switch (message.msgSecondType) {
          case ConstantType.CharSecondType.CAHT_TEXT:
            return message.unRead >= 1 ? ("未读") : ("已读")
            break;
          case ConstantType.CharSecondType.CAHT_AUDIO:
            return message.unRead >= 1 ? ("未读") : ("已读")
            break;
          case ConstantType.CharSecondType.CAHT_IMAGE:
            return message.unRead >= 1 ? ("未读") : ("已读")
            break;
          case ConstantType.CharSecondType.CAHT_VIDEO:
            return message.unRead >= 1 ? ("未读") : ("已读")
            break;
          case ConstantType.CharSecondType.CAHT_FILE:
            return message.unRead >= 1 ? ("未查收") : ("已查收")
            break;
        }
      } else {
        return ""
      }
    },
    getFileImgSrc() {
      let fileNameSplitArray = this.message.chatMsg.description.split(".");
      let fileType = fileNameSplitArray[fileNameSplitArray.length - 1];
      switch (fileType.toLowerCase()) {
        case "xls":
        case "xlsx":
          return "/static/fileIcon/excel.png"
        case "pptx":
        case "ppt":
          return "/static/fileIcon/ppt.png"
        case "zip":
        case "rar":
          return "/static/fileIcon/rar.png"
        case "txt":
          return "/static/fileIcon/txt.png"
        case "docx":
        case "doc":
          return "/static/fileIcon/word.png"
      }
      return "/static/fileIcon/other.png"
    },
    getFileSize() {
      let size = this.message.chatMsg.remark;
      if (size < 1024) {
        return Math.round(size) + 'B'
      } else if (1024 * 1024 > size && size >= 1024) {
        return Math.round(size / 1024) + 'KB'
      } else if (1024 * 1024 * 1024 > size && size >= 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + 'MB'
      } else if (1024 * 1024 * 1024 * 1024 > size && size >= 1024 * 1024 * 1024) {
        return Math.round(size / 1024 / 1024 / 1024) + 'GB'
      }
    },
    getId() {
      let message = this.message;
      let str = 'MessageViewSingle'
      str += '_' + (message.readStatus ? 'true' : 'false')
      str += '_' + (message.msgTo ? message.msgTo : '');
      str += '_' + (message.sequenceId ? message.sequenceId.toString() : '');
      str += '_' + (message.groupType ? message.groupType : 0)
      return str;
    },
    // 右键菜单
    messageContextmenu() {
      var event = window.event;
      let left = event.clientX;
      let top = event.clientY;
      this.$store.dispatch("openMessageContextmenuVisible", { data: this.message, left: left, top: top });
    },
    imgLoad() {
      this.imgStatus = "success"
    },
    imError() {
      this.imgStatus = "error"
    }
  }
};
</script>

<style scoped>
.MessageViewSingle {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  float: left;
  padding: 5px;
}

.MessageViewSingle .systemMessage {
  text-align: center;
  font-size: 10px;
  color: #999999;
}

.MessageViewSingle .timeView {
  color: #9e9e9e;
  font-size: 12px;
  visibility: hidden;
}
.MessageViewSingle:hover .timeView {
  visibility: inherit;
}

.MessageViewSingle .nameText {
  width: calc(100% - 40px - 10px);
  height: 50%;
  float: left;
}
.MessageViewSingle .textMessage {
  font-size: 14px;
}
.MessageViewSingle .sending {
  font-size: 12px;
  float: right;
  margin: 10px 5px 0 0;
}
</style>
