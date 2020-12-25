<template>
  <div id="HeaderLinkStatus">
    <span v-if="linkStatus == 0" style="color: #9E9E9E;">正在连接服务器...</span>
    <span v-if="linkStatus == -1" style="color: #fa5151;">已断开连接,正在尝试重新连接...</span>
  </div>
</template>

<script>

export default {
  data() {
    return {

    };
  },
  computed: {
    linkStatus() {
      return this.$store.state.headerStore.headerLinkStatus;
    }
  },
  methods: {

  }
};
</script>

<style scoped>
#HeaderLinkStatus {
  float: left;
  padding-top: 13px;
  padding-left: 10px;
}
</style>
