export default {
  computed: {
    sessionId() {
      return this.$store.state.session.sessionId;
    }
  },
  watch: {
    sessionId(val, oldVal) {
      this.loadDataForSessionChange();
    }
  },
  created() {
    this.loadDataForSessionChange();
  },
  methods: {
    loadDataForSessionChange() {
      throw new Error('未检测到loadDataForSessionChange方法，请添加loadDataForSessionChange方法')
    },
    setScrollBySessionChange() {
      let messageViewDom = document.getElementById("messageView")
      messageViewDom.scrollTop = messageViewDom.scrollHeight - messageViewDom.clientHeight;
    }
  }
};
