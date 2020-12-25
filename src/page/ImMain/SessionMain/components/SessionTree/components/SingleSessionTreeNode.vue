<template>
  <div
    id="SingleSessionTreeNode"
    :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
  >
    <!-- 头像 -->
    <ImHeadPortrait
      :url-list="[userInfo.headPortrait]"
      :width="headPortraitWidth"
      float="left"
      margin="0 0 0 10px"
    />
    <!-- 第一行显示 -->
    <div style="width: 100%; height: 50%;">
      <NodeText
        :text="session.name"
        :fontSize="nameFontSize"
        :max-width="'calc(100% - '+ headPortraitWidth +' - 30px - 36px - '+ (userInfo.businessType?'57px':'8px') +')'"
        color="#333"
        :highlight-str="highlightStr"
        margin="2px 0px 0px 10px;"
      />
      <BusinessType
        v-if="getBusinessUserByOpenApiUser(userInfo).businessType"
        :type="getBusinessUserByOpenApiUser(userInfo).businessType"
        :status="getBusinessUserByOpenApiUser(userInfo).businessTypeCn"
        :height="'calc('+nameFontSize+')'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 3px) 0px 0px 10px;'"
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
        v-if="refresh"
        :isTree="true"
        :msg="session.lastMsg"
        :draftMessage="session.sessionId == sessionId?null:session.draftMessage"
        :max-width="'calc(100% - '+ headPortraitWidth +' - 30px'+ getUnReadNumPx(session.unreadNum) +')'"
        :fontSize="'calc(' + nameFontSize + ' - 2px)'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px) 0px 0px 10px;'"
      />
      <UnReadNum
        v-if="refresh && session.unreadNum > 0 && session.sessionId != $store.state.session.sessionId"
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
import BusinessType from "../../../../../../commonComponents/BusinessType"
import NodeText from "../../../../../../commonComponents/NodeText"
import NodeLastMsg from "../../../../../../commonComponents/NodeLastMsg"
import UnReadNum from "../../../../../../commonComponents/UnReadNum"
import ResizeSessionChange from '../../../../../../Resize/ResizeSessionChange'
import ResizeCacheChange from '../../../../../../Resize/ResizeCacheChange'
import openApiUserUtils from '../../../../../../utils/openApiUserUtils'
import businessUserUtils from '../../../../../../utils/businessUserUtils'

export default {
  components: {
    NodeText,
    UnReadNum,
    NodeLastMsg,
    BusinessType,
    ImHeadPortrait
  },
  mixins: [ResizeSessionChange, ResizeCacheChange],
  props: {
    session: {
      type: Object,
      default: () => { }
    },
    userInfo: {
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
      refresh: true
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    loadDataForSessionChange() { },
    loadDataForCacheChange() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      })
    },
    getUserName() {
      return openApiUserUtils.getNameByUser(this.userInfo);
    },
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
    },
    getBusinessUserByOpenApiUser(openApiUser) {
      return businessUserUtils.getOneByImUid(openApiUserUtils.getImUidByUser(openApiUser));
    }
  }
};
</script>

<style scoped>
#SingleSessionTreeNode {
}
</style>


