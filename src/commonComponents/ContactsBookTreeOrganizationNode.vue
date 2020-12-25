<template>
  <div
    id="ContactsBookTreeOrganizationNode"
    :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
  >
    <!-- 头像 -->
    <ImHeadPortrait
      :url-list="[organization.icon?organization.icon:'/static/icon/logo.icon.jpg']"
      defaultUrl="/static/icon/logo.icon.jpg"
      errorUrl="/static/icon/logo.icon.jpg"
      :width="headPortraitWidth"
      float="left"
      margin="0 0 0 10px"
    />
    <!-- 第一行显示 -->
    <div style="width: 100%; padding: 9px 0px;">
      <NodeText
        :text="organization.orgName"
        :fontSize="nameFontSize"
        :max-width="'calc(100% - '+ headPortraitWidth + ' - 30px - '+(isAddressBook?'50px':'0px')+')'"
        color="#333"
        :highlight-str="highlightStr"
        margin="2px 0px 0px 10px;"
      />
      <el-button
        v-if="isAddressBook && !organization.imGroupId && organization.createGroup"
        size="mini"
        plain
        @click="openCreateOfficeGroupDialog"
      >群组</el-button>
    </div>
  </div>
</template>

<script>
import ImHeadPortrait from "./ImHeadPortrait"
import NodeText from "./NodeText"
import platformOrganizationApi from '../js/sdk/api/platformOrganizationApi'
export default {
  components: {
    NodeText,
    ImHeadPortrait
  },
  props: {
    organization: {
      type: Object,
      default: () => { return {} }
    },
    /**节点高度 */
    height: {
      type: String,
      default: '64px'
    },
    isAddressBook: {
      type: Boolean,
      default: false
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
    openCreateOfficeGroupDialog() {
      event.stopPropagation();
      this.$store.dispatch("openCreateOfficeGroupDialog", this.organization.id)
    }
  }
};
</script>

<style scoped>
#ContactsBookTreeOrganizationNode {
}
#ContactsBookTreeOrganizationNode >>> .el-button {
  float: right;
  padding: 4px 8px;
  margin-right: 10px;
  margin-top: 1px;
  border-color: #0b4d8a !important;
  color: #0b4d8a;
}
#ContactsBookTreeOrganizationNode >>> .el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: white !important;
  background-color: #0b4d8a;
}
</style>


