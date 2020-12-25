<template>
  <div id="GroupNode" @click="imClick">
    <div
      :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
    >
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="getUrlList()"
        :width="headPortraitWidth"
        float="left"
        margin="0 0 0 10px"
      />
      <!-- 第一行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="groupInfo.groupName"
          :fontSize="nameFontSize"
          :max-width="'calc(100% - '+ headPortraitWidth +' - 30px)'"
          color="#333"
          :highlight-str="highlightStr"
          margin="2px 0px 0px 10px;"
        />
      </div>
      <!-- 第二行显示 -->
      <div style="width: 100%;height: 50%;">
        <NodeText
          :text="'('+getGroupUserNum()+'人)'"
          :max-width="'calc(100% - '+ headPortraitWidth +' - 30px - 38px - 10px)'"
          :fontSize="'calc(' + nameFontSize + ' - 2px)'"
          :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px - 2px) 0px 0px 10px;'"
        />
        <GroupType
          :type="groupInfo.type"
          :height="'calc('+nameFontSize+' + 1px)'"
          :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px) 0px 0px 10px;'"
        />
      </div>
    </div>
    <div class="splitLine"></div>
  </div>
</template>

<script>
import ImHeadPortrait from "./ImHeadPortrait"
import NodeText from "./NodeText"
import GroupType from "./GroupType"

import groupUtils from '../utils/groupUtils'
import groupUserUtils from '../utils/groupUserUtils'
export default {
  components: {
    NodeText,
    GroupType,
    ImHeadPortrait
  },
  props: {
    groupInfo: {
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
    getUrlList() {
      return groupUserUtils.getHeadPortraitUrlListByGroupId(this.groupInfo.groupId);
    },
    getGroupUserNum() {
      return groupUserUtils.getOneListSizeByGroupId(this.groupInfo.groupId);
    },
    imClick() {
      this.$emit("imClick", this.groupInfo)
    }
  }
};
</script>

<style scoped>
#GroupNode {
}
#GroupNode .splitLine {
  border-bottom: 1px solid #e6eaea;
  width: calc(100% - 60px);
  float: right;
}
</style>


