const forwardDialoge = {
  state: {
    isShow: false,
    msg: {}
  },
  mutations: {
    OPEN_FORWARD_DIALOGE: (state, msg) => {
      state.isShow = true;
      state.msg = msg;
    },
    CLOSE_FORWARD_DIALOGE: (state) => {
      state.isShow = false;
      state.msg = {};
    }
  },
  actions: {
    openForwardDialoge(context, msg) {
      context.commit("OPEN_FORWARD_DIALOGE", msg);
    },
    closeForwardDialoge(context) {
      context.commit("CLOSE_FORWARD_DIALOGE");
    }
  }
};
export default forwardDialoge;
