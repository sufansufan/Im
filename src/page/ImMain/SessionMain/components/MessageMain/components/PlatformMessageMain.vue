<template>
  <div id="PlatformMessageMain">
    <div class="header">
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="imHeadPortrait.urlList"
        defaultUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
        errorUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
        width="44px"
        float="left"
        margin="0 0 0 10px"
      />
      <NodeText
        :text="session.name"
        :max-width="'calc(100% - 44px - 30px - 240px - 100px)'"
        color="#333"
        margin="12px 0px 0px 10px;"
      />
    </div>
    <div v-if="isShowMessageView" id="messageView" class="messageView">
      <MessageViewPlatform
        v-for="(message,index) in messageView.messages"
        :key="message.vueKey"
        :message="message"
        :isShowReadStatus="!message.readStatus"
      />
      <div
        style=" position: relative; width: 100%; -webkit-box-sizing: border-box; box-sizing: border-box; float: left; padding: 20px;; "
      ></div>
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
import MessageViewPlatform from "../../../../../../commonComponents/MessageViewPlatform"

import groupUtils from '../../../../../../utils/groupUtils';
import sessionUtils from '../../../../../../utils/sessionUtils';
import messageUtils from '../../../../../../utils/messageUtils';

import ResizeCacheChange from '../../../../../../Resize/ResizeCacheChange';
import ResizeSessionChange from '../../../../../../Resize/ResizeSessionChange';
import publicAccountUtils from '../../../../../../utils/publicAccountUtils'
import MessagesController from '../../../../../../js/sdk/service/MessagesController'

export default {
  components: {
    ImHeadPortrait,
    NodeText,
    ImIconButton,
    GroupType,
    MessageViewPlatform,
    BusinessType
  },
  mixins: [ResizeCacheChange, ResizeSessionChange],
  computed: {

  },
  data() {
    return {
      session: {},
      isShowMessageView: true,
      imHeadPortrait: {
        urlList: [],
        type: "",
        position: ""
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
        if (callback) callback()
      })
    },
    initHeader() {
      let messageFromInfo = publicAccountUtils.getOneByImUid(this.session.msgFrom)
      // 头像岗位
      this.imHeadPortrait.urlList = [messageFromInfo.headPortrait];
    }
  }
};
</script>

<style scoped>
#PlatformMessageMain {
  height: 100%;
}
#PlatformMessageMain .header {
  width: 100%;
  height: 44px;
  padding: calc((53px - 44px) / 2) 0;
  border-bottom: 1px solid #e6eaea;
}
#PlatformMessageMain .messageView {
  width: calc(100% - 3px);
  height: calc(100% - 54px);
  border-bottom: 1px solid #e6eaea;
  overflow: auto;
}
</style>
