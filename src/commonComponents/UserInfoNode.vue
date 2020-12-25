<template>
  <div id="UserInfoNode" @click="imClick">
    <div
      :style="'padding:calc(('+ height +' - '+ headPortraitWidth +') / 2) 0;width:'+ width +';height:calc('+ height +' - ('+ height +' - '+ headPortraitWidth +'))'"
    >
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="[userInfo.headPortrait]"
        :width="headPortraitWidth"
        float="left"
        :margin="imHeadPortraitMargin"
      />
      <!-- 第一行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="getUserName()"
          :fontSize="nameFontSize"
          :max-width="'calc(100% - '+ headPortraitWidth +' - 30px - '+ (getBusinessUserByOpenApiUser(userInfo).businessType?(businessTypeIsShowTime?'300px':'60px'):'0px') +')'"
          color="#333"
          :highlight-str="highlightStr"
          margin="2px 0px 0px 10px;"
        />
        <BusinessType
          v-if="getBusinessUserByOpenApiUser(userInfo).businessType && businessTypeIsShow"
          :type="getBusinessUserByOpenApiUser(userInfo).businessType"
          :status="getBusinessUserByOpenApiUser(userInfo).businessTypeCn"
          :isShowTime="businessTypeIsShowTime"
          :max-width="businessTypeIsShowTime?'100%':'56px'"
          :statusStartTime="getBusinessUserByOpenApiUser(userInfo).statusStartTime"
          :statusEndTime="getBusinessUserByOpenApiUser(userInfo).statusEndTime"
          :height="'calc('+nameFontSize+')'"
          :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 3px) 0px 0px 10px;'"
        />
      </div>
      <!-- 第二行显示 -->
      <div style="width: 100%;height: 50%;">
        <NodeText
          :text="getBusinessUserByOpenApiUser(userInfo).position"
          :max-width="'calc(100% - '+ headPortraitWidth +' - 30px)'"
          :fontSize="'calc(' + nameFontSize + ' - 2px)'"
          :margin="'calc(('+ headPortraitWidth +' / 2) - '+ nameFontSize +' - 4px - 2px) 0px 0px 10px;'"
        />
      </div>
    </div>
    <div class="splitLine" v-if="isShowSplitLine"></div>
  </div>
</template>

<script>
import openApiUserUtils from "../utils/openApiUserUtils"
import ImHeadPortrait from "./ImHeadPortrait"
import BusinessType from "./BusinessType"
import NodeText from "./NodeText"
import businessUserUtils from '../utils/businessUserUtils'
export default {
  components: {
    NodeText,
    BusinessType,
    ImHeadPortrait
  },
  props: {
    isShowSplitLine: {
      type: Boolean,
      default: true
    },
    imHeadPortraitMargin: {
      type: String,
      default: '0 0 0 10px'
    },
    businessTypeIsShow: {
      type: Boolean,
      default: true
    },
    businessTypeIsShowTime: {
      type: Boolean,
      default: false
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
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    getUserName() {
      return openApiUserUtils.getNameByUser(this.userInfo);
    },
    imClick() {
      this.$emit("imClick", this.userInfo)
    },
    getBusinessUserByOpenApiUser(openApiUser) {
      return businessUserUtils.getOneByImUid(openApiUserUtils.getImUidByUser(openApiUser));
    }
  }
};
</script>

<style scoped>
#UserInfoNode {
}
#UserInfoNode .splitLine {
  border-bottom: 1px solid #e6eaea;
  width: calc(100% - 60px);
  float: right;
}
</style>


