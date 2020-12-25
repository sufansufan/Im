const officeGroupSettingDrawer = {
  state: {
    isShow: false
  },
  mutations: {
    OPEN_OFFICE_GROUP_SETTING_DRAWER: (state) => {
      state.isShow = true;
    },
    CLOSE_OFFICE_GROUP_SETTING_DRAWER: (state) => {
      state.isShow = false;
    }
  },
  actions: {
    openOfficeGroupSettingDrawer(context) {
      context.commit("OPEN_OFFICE_GROUP_SETTING_DRAWER");
    },
    closeOfficeGroupSettingDrawer(context) {
      context.commit("CLOSE_OFFICE_GROUP_SETTING_DRAWER");
    }
  }
};
export default officeGroupSettingDrawer;
