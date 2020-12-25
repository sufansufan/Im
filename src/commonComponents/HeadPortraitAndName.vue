<template>
  <div id="HeadPortraitAndName" :style="'padding:'+padding">
    <img v-if="isOwner" class="owner" src="/static/icon/qunzhu_icon.png" />
    <img v-if="isAdmin" class="admin" src="/static/icon/guanliyuan_icon.png" />
    <i v-if="isDelete" @click="imDeleteClick" class="el-icon-close delete" />
    <ImHeadPortrait :url-list="[userInfo.headPortrait]" width="36px" margin="3px 7px" />
    <div class="name">{{getUserName()}}</div>
  </div>
</template>

<script>
import NodeText from "../commonComponents/NodeText"
import ImHeadPortrait from "../commonComponents/ImHeadPortrait"
import openApiUserUtils from '../utils/openApiUserUtils'
export default {
  components: {
    NodeText,
    ImHeadPortrait
  },
  props: {
    userInfo: {
      type: Object,
      default: () => { return {} }
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: "4px 8px;"
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
    imDeleteClick() {
      this.$emit("imDeleteClick", this.userInfo)
    }
  }
};
</script>

<style scoped>
#HeadPortraitAndName {
  width: 50px;
  float: left;
  position: relative;
}
#HeadPortraitAndName:hover .delete {
  display: inline;
}
#HeadPortraitAndName .name {
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}
#HeadPortraitAndName .owner {
  width: 25px;
  height: 13px;
  position: absolute;
  z-index: 2;
  margin-left: 30px;
}
#HeadPortraitAndName .admin {
  width: 33px;
  height: 13px;
  position: absolute;
  z-index: 1;
  margin-left: 26px;
}
#HeadPortraitAndName .delete {
  position: absolute;
  z-index: 1;
  margin-top: -3px;
  margin-left: 34px;
  border: 1px solid #676767;
  border-radius: 100px;
  background-color: white;
  cursor: pointer;
  display: none;
  height: 14px;
  color: red;
}
#HeadPortraitAndName .delete:hover {
  border: 1px solid #0a4c8b;
}
</style>


