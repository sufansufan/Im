<template>
  <div id="BusinessType">
    <img
      v-if="type!=0"
      :src="getUrl()"
      :style="'float:left;height:calc(' + height +');margin:' + margin"
    />
    <NodeText
      :text="getText()"
      :fontSize="'calc(' + height + ' - 2px)'"
      :max-width="maxWidth"
      :margin="textMargin?textMargin:'calc(('+height+' - ('+ height + ' - 6px )) / 2) 0px 0px 2px;'"
    />
  </div>
</template>

<script>
import ConstantType from "../js/sdk/constant/ConstantType"
import NodeText from "./NodeText"

import dateFormatFilter from "../filters/dateFormatFilter.js"
export default {
  components: {
    NodeText
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    isShowTime: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ""
    },
    startDate: {
      type: Number,
      default: null
    },
    endDate: {
      type: Number,
      default: null
    },
    /**节点高度 */
    height: {
      type: String,
      default: '64px'
    },
    margin: {
      type: String,
      default: "0 0 0 10px"
    },
    textMargin: {
      type: String,
      default: ""
    },
    statusStartTime: {
      type: String | Number,
      default: ""
    },
    statusEndTime: {
      type: String | Number,
      default: ""
    },
    maxWidth: {
      type: String,
      default: "56px"
    },
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
        case "Leave_Process":
          return "/static/icon/qingjia_icon.png";
        case "BusinessTravel_Process":
          return "/static/icon/chuchai_icon.png";
        case "WorkOut_Process":
          return "/static/icon/waichu_icon.png";
        case "WorkOvertime_Process":
          return "/static/icon/jiaban_icon.png";
      }
      return url;
    },
    getText() {
      let str = this.status;
      switch (this.type) {
        case "Leave_Process": { str = "请假中"; break; }
        case "BusinessTravel_Process": { str = "出差中"; break; }
        case "WorkOut_Process": { str = "外出中"; break; }
        case "WorkOvertime_Process": { str = "加班中"; break; }
      }
      if (this.statusStartTime && this.statusEndTime && this.isShowTime) {
        str += ' (' + dateFormatFilter.dateFormat(this.statusStartTime) + ' ~ ' + dateFormatFilter.dateFormat(this.statusEndTime) + ')'
      }
      return str;
    }
  }
};
</script>

<style scoped>
#BusinessType {
}
</style>


