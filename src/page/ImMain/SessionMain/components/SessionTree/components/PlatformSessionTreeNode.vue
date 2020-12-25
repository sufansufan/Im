<template>
  <div
    id="SingleSessionTreeNode"
    :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
  >
    <!-- 头像 -->
    <ImHeadPortrait
      :url-list="[platformInfo.headPortrait]"
      defaultUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
      errorUrl="/static/icon/02应用图标—icon/xitongxiaoxi_icon.png"
      :width="headPortraitWidth"
      float="left"
      margin="0 0 0 10px"
    />
    <!-- 第一行显示 -->
    <div style="width: 100%; height: 50%;">
      <NodeText
        :text="platformInfo.name"
        :fontSize="nameFontSize"
        :max-width="'calc(100% - '+ headPortraitWidth +' - 30px - 36px - 8px)'"
        color="#333"
        margin="2px 0px 0px 10px;"
      />
      <NodeText
        :text="session.timeStamp | dateFormatTree"
        float="right"
        :fontSize="'calc(' + nameFontSize + ' - 2px)'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px - 1px) 10px 0px 10px;'"
      />
    </div>
    <!-- 第二行显示 -->
    <div style="width: 100%;height: 50%;">
      <NodeLastMsg
        :isTree="true"
        :msg="session.lastMsg"
        :max-width="'calc(100% - '+ headPortraitWidth +' - 30px'+ getUnReadNumPx(session.unreadNum) +')'"
        :fontSize="'calc(' + nameFontSize + ' - 2px)'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px) 0px 0px 10px;'"
      />
      <UnReadNum
        v-if="session.unreadNum > 0 && session.sessionId != $store.state.session.sessionId"
        :num="session.unreadNum"
        float="right"
        :fontSize="'calc(' + nameFontSize + ' - 2px)'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 3px) 7px 0px 10px;'"
      />
    </div>
  </div>
</template>

<script>

import ImHeadPortrait from "../../../../../../commonComponents/ImHeadPortrait"
import NodeText from "../../../../../../commonComponents/NodeText"
import NodeLastMsg from "../../../../../../commonComponents/NodeLastMsg"
import UnReadNum from "../../../../../../commonComponents/UnReadNum"

export default {
  components: {
    NodeText,
    UnReadNum,
    NodeLastMsg,
    ImHeadPortrait
  },
  props: {
    session: {
      type: Object,
      default: () => { }
    },
    platformInfo: {
      type: Object,
      default: () => { }
    },
    /**节点高度 */
    height: {
      type: String,
      default: '64px'
    },
    /**节点宽度 */
    width: {
      type: String,
      default: '100%'
    },
    /**头像宽度 */
    headPortraitWidth: {
      type: String,
      default: '44px'
    },
    /**名字大小 */
    nameFontSize: {
      type: String,
      default: '14px'
    },
    /**高亮字体 */
    highlightStr: {
      type: String,
      default: ''
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
    getUnReadNumPx(unreadNum) {
      if (unreadNum) {
        if (unreadNum <= 9) {
          return ' - 30px'
        } else if (9 < unreadNum && unreadNum <= 99) {
          return ' - 35px'
        } else if (99 < unreadNum) {
          return ' - 40px'
        }
      }
      return ' - 0px'
    }
  }
};
</script>

<style scoped>
#SingleSessionTreeNode {
}
</style>


