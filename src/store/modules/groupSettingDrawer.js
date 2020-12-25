const groupSettingDrawer = {
  state: {
    isShow: false
  },
  mutations: {
    OPEN_GROUP_SETTING_DRAWER: (state) => {
      state.isShow = true;
    },
    CLOSE_GROUP_SETTING_DRAWER: (state) => {
      state.isShow = false;
    }
  },
  actions: {
    openGroupSettingDrawer(context) {
      context.commit("OPEN_GROUP_SETTING_DRAWER");
    },
    closeGroupSettingDrawer(context) {
      context.commit("CLOSE_GROUP_SETTING_DRAWER");
    }
  }
};
export default groupSettingDrawer;
