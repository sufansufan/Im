<template>
  <div id="GroupMessageMain">
    <div class="header">
      <ImHeadPortrait
        :url-list="imHeadPortrait.urlList"
        width="44px"
        float="left"
        margin="0 0 0 10px"
      />
      <ImIconButton
        name="设置"
        url="/static/icon/qunshezhi_icon.png"
        margin="6px 8px 0 8px"
        @imClick="openSettingDrawer"
      />
      <!-- 第一行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="session.name"
          :max-width="'calc(100% - 44px - 30px - 64px - 100px - 48px)'"
          color="#333"
          margin="2px 0px 0px 10px;"
        />
        <NodeText
          :text="'('+imHeadPortrait.urlList.length+'人)'"
          margin="2px 0px 0px 10px;"
          maxWidth="65px"
        />
        <GroupType
          :type="imHeadPortrait.type"
          :height="'calc(15px)'"
          :margin="'calc((44px / 2) - 14px - 4px) 0px 0px 10px;'"
        />
      </div>
      <!-- 第二行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="imHeadPortrait.companyName"
          :max-width="'calc(100% - 44px - 30px - 38px - 10px - 48px)'"
          :fontSize="'calc(14px - 2px)'"
          :margin="'calc((44px / 2) - 14px - 4px - 2px) 0px 0px 10px;'"
        />
      </div>
    </div>
    <div id="messageView" class="messageView">
      <MessageViewGroup
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
import MessageViewGroup from "../../../../../../commonComponents/MessageViewGroup"
import SendMessage from "../../../../../../commonComponents/SendMessage"

import groupUtils from '../../../../../../utils/groupUtils';
import sessionUtils from '../../../../../../utils/sessionUtils';
import messageUtils from '../../../../../../utils/messageUtils';

import ResizeCacheChange from '../../../../../../Resize/ResizeCacheChange';
import ResizeSessionChange from '../../../../../../Resize/ResizeSessionChange';
import MessagesController from '../../../../../../js/sdk/service/MessagesController'
import ConstantType from '../../../../../../js/sdk/constant/ConstantType'
import groupUserUtils from '../../../../../../utils/groupUserUtils'

export default {
  components: {
    ImHeadPortrait,
    NodeText,
    ImIconButton,
    GroupType,
    MessageViewGroup,
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
        type: ""
      },
      messageView: {
        messages: []
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
      this.imHeadPortrait.urlList = groupUserUtils.getHeadPortraitUrlListByGroupId(this.session.msgTo);
      this.imHeadPortrait.type = groupUtils.getOneByGroupId(this.session.msgTo).type;
      this.imHeadPortrait.companyName = groupUtils.getOneByGroupId(this.session.msgTo).companyName;
    },
    openSettingDrawer() {
      if (this.imHeadPortrait.type == ConstantType.GroupTypeConstant.Group_COMMON) {
        this.$store.dispatch('openGroupSettingDrawer')
      } else {
        this.$store.dispatch('openOfficeGroupSettingDrawer')
      }
    }
  }
};
</script>

<style scoped>
#GroupMessageMain {
  height: 100%;
}
#GroupMessageMain .header {
  width: 100%;
  height: 44px;
  padding: calc((53px - 44px) / 2) 0;
  border-bottom: 1px solid #e6eaea;
}
#GroupMessageMain .messageView {
  width: calc(100% - 3px);
  height: 60%;
  border-bottom: 1px solid #e6eaea;
  overflow: auto;
}
#GroupMessageMain .send {
  width: 100%;
  height: calc(40% - 54px);
  background-color: white;
}
</style>
