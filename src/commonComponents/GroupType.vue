<template>
  <img
    v-if="type!=0"
    id="GroupType"
    :src="getUrl()"
    :style="'height:calc(' + height +');margin:' + margin"
  />
</template>

<script>
import ConstantType from "../js/sdk/constant/ConstantType"

export default {
  components: {

  },
  props: {
    type: {
      type: String | Number,
      default: ""
    },
    /**节点高度 */
    height: {
      type: String,
      default: '64px'
    },
    margin: {
      type: String,
      default: "0 0 0 10px"
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
    getUrl() {
      let url = "";
      switch (this.type) {
        case ConstantType.GroupTypeConstant.Group_MAIN_COMPANY:
          return "/static/icon/zongbu_icon.png";
        case ConstantType.GroupTypeConstant.Group_BRANCH_COMPANY:
          return "/static/icon/fengongsi_icon.png";
        case ConstantType.GroupTypeConstant.Group_PROJECTDEPARTMENT:
          return "/static/icon/xiangmubu_icon.png";
        case ConstantType.GroupTypeConstant.Group_COMPANY:
          return "/static/icon/bumen_icon.png";
        case ConstantType.GroupTypeConstant.Group_PROJECT:
          return "/static/icon/xiangmu_icon.png";
      }
      return url;
    }
  }
};
</script>

<style scoped>
#GroupType {
}
</style>


