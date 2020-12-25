<template>
  <div
    id="ContactsBookTreeMyGroupNode"
    :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
  >
    <!-- 头像 -->
    <ImHeadPortrait
      :url-list="['/static/icon/02应用图标—icon/qunzu_icon.png']"
      defaultUrl="/static/icon/02应用图标—icon/qunzu_icon.png"
      errorUrl="/static/icon/02应用图标—icon/qunzu_icon.png"
      :width="headPortraitWidth"
      float="left"
      margin="0 0 0 10px"
    />
    <!-- 第一行显示 -->
    <div style="width: 100%; height: 50%;">
      <NodeText
        text="我的群组"
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
        :text="groupUtils.getAll().size+'个'"
        :max-width="'calc(100% - '+ headPortraitWidth +' - 30px)'"
        :fontSize="'calc(' + nameFontSize + ' - 2px)'"
        :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px - 2px) 0px 0px 10px;'"
      />
    </div>
  </div>
</template>

<script>
import ImHeadPortrait from "./ImHeadPortrait"
import NodeText from "./NodeText"
import groupUtils from '../utils/groupUtils'
export default {
  components: {
    NodeText,
    ImHeadPortrait
  },
  props: {
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
      groupUtils: groupUtils
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {

  }
};
</script>

<style scoped>
#ContactsBookTreeMyGroupNode {
}
</style>


