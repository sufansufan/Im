<template>
  <div id="UserTag">
    <div
      :class="'text '+(info.unDelete?'unDelete':'')+' '+(isNotShowDelete?'isNotShowDelete':'')"
    >{{info.name}}</div>
    <i v-if="!isNotShowDelete && !info.unDelete" class="el-icon-close" @click="click"></i>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    info: {
      type: Object,
      default: () => { return {} }
    },
    isNotShowDelete: {
      type: Boolean,
      default: false
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
    click() {
      this.$emit("imClose", this.info)
    }
  }
};
</script>

<style scoped>
#UserTag {
  float: left;
  position: relative;
}
#UserTag .text {
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 49px;
  font-size: 12px;
  padding: 6px 22px 6px 8px;
  background-color: #e6e6ea;
  margin: 5px 3px;
  border-radius: 5px;
  border: 1px solid #e6e6ea;
}
#UserTag .unDelete {
  border: 1px dashed #999999;
  background-color: white;
  color: #666666;
  padding: 6px 8px;
}
#UserTag .isNotShowDelete {
  padding: 6px 8px;
}
#UserTag .el-icon-close {
  position: absolute;
  right: 10px;
  top: 13px;
  cursor: pointer;
}
#UserTag .el-icon-close:hover {
  border-radius: 14px;
  background-color: white;
}
</style>


