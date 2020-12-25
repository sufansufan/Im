<template>
  <div id="SingleMessageMain">
    <div class="header">
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="imHeadPortrait.urlList"
        width="44px"
        float="left"
        margin="0 0 0 10px"
      />
      <!-- 按钮 -->
      <!-- <ImIconButton name="设置" url="/static/icon/shezhi_02.png" margin="6px 8px 0 8px" /> -->
      <!-- 第一行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="session.name"
          :max-width="'calc(100% - 44px - 30px - 240px - 100px)'"
          color="#333"
          margin="2px 0px 0px 10px;"
        />
        <BusinessType
          v-if="imHeadPortrait.businessType"
          :type="imHeadPortrait.businessType"
          :status="imHeadPortrait.businessTypeCn"
          :isShowTime="true"
          :statusStartTime="imHeadPortrait.statusStartTime"
          :statusEndTime="imHeadPortrait.statusEndTime"
          :height="'calc(13px)'"
          margin="6px 0px 0px 10px;"
          max-width="100%"
          textMargin="3px 0px 0px 5px"
        />
      </div>
      <!-- 第二行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="imHeadPortrait.position"
          :max-width="'calc(100% - 44px - 30px - 38px - 10px - 48px)'"
          :fontSize="'calc(14px - 2px)'"
          :margin="'calc((44px / 2) - 14px - 4px - 2px) 0px 0px 10px;'"
        />
      </div>
    </div>
    <div id="messageView" class="messageView">
      <MessageViewSingle
        v-for="(message,index) in messageView.messages"
        :key="message.vueKey"
        :message="message"
        v-if="!message.isDelete"
      />
      <div
        style=" position: relative; width: 100%; -webkit-box-sizing: border-box; box-sizing: border-box; float: left; padding: 10px;; "
      ></div>
    </div>
    <div class="send">
      <SendMessage />
    </div>
  </div>
</template>

<script>
import ImHeadPortrait from "../../../../../../commonComponents/ImHeadPortrait"
import ImIconButton from "../../../../../../commonComponents/ImIconButton"
import NodeText from "../../../../../../commonComponents/NodeText"
import GroupType from "../../../../../../commonComponents/GroupType"
import MessageViewSingle from "../../../../../../commonComponents/MessageViewSingle"
import BusinessType from "../../../../../../commonComponents/BusinessType"
import SendMessage from "../../../../../../commonComponents/SendMessage"

import groupUtils from '../../../../../../utils/groupUtils';
import sessionUtils from '../../../../../../utils/sessionUtils';
import messageUtils from '../../../../../../utils/messageUtils';

import ResizeCacheChange from '../../../../../../Resize/ResizeCacheChange';
import ResizeSessionChange from '../../../../../../Resize/ResizeSessionChange';
import MessagesController from '../../../../../../js/sdk/service/MessagesController'
import openApiUserUtils from '../../../../../../utils/openApiUserUtils'
import businessUserUtils from '../../../../../../utils/businessUserUtils'

export default {
  components: {
    ImHeadPortrait,
    NodeText,
    ImIconButton,
    GroupType,
    MessageViewSingle,
    BusinessType,
    SendMessage
  },
  mixins: [ResizeCacheChange, ResizeSessionChange],
  computed: {

  },
  data() {
    return {
      session: {},
      imHeadPortrait: {
        urlList: [],
        type: "",
        position: ""
      },
      messageView: {
        messages: [],
        scroll: {
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0,
        }
      }
    };
  },
  methods: {
    loadDataForCacheChange() {
      this.loadData(this.setScrollByCacheChange);
    },
    loadDataForSessionChange() {
      MessagesController.getInstance().setLocalUnReadBySessionId(this.sessionId);
      this.loadData(this.setScrollBySessionChange);
    },
    loadData(callback) {
      this.session = sessionUtils.getOneBySessionId(this.sessionId);
      this.initHeader();
      this.messageView.messages = messageUtils.getOneBySessionId(this.sessionId)
      this.$nextTick(() => {
        if (callback) callback();
      })
    },
    initHeader() {
      let openApiUser = openApiUserUtils.getOneByImUid(this.session.msgTo)
      let businessUser = businessUserUtils.getOneByImUid(this.session.msgTo)
      // 头像岗位
      this.imHeadPortrait.urlList = [openApiUser.headPortrait];
      this.imHeadPortrait.position = businessUser.position;
      //考勤状态
      this.imHeadPortrait.businessType = businessUser.businessType;
      this.imHeadPortrait.businessTypeCn = businessUser.businessTypeCn;
      this.imHeadPortrait.statusStartTime = businessUser.statusStartTime;
      this.imHeadPortrait.statusEndTime = businessUser.statusEndTime;
    }
  }
};
</script>

<style scoped>
#SingleMessageMain {
  height: 100%;
}
#SingleMessageMain .header {
  width: 100%;
  height: 44px;
  padding: calc((53px - 44px) / 2) 0;
  border-bottom: 1px solid #e6eaea;
}
#SingleMessageMain .messageView {
  width: calc(100% - 3px);
  height: 60%;
  border-bottom: 1px solid #e6eaea;
  overflow: auto;
}
#SingleMessageMain .send {
  width: 100%;
  height: calc(40% - 54px);
  background-color: white;
}
</style>
