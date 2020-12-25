const createGroupUserDialog = {
  state: {
    isShow: false,
  },
  mutations: {
    OPEN_CREATE_GROUP_USER_DRAWER: (state) => {
      state.isShow = true;
    },
    CLOSE_CREATE_GROUP_USER_DRAWER: (state) => {
      state.isShow = false;
    }
  },
  actions: {
    openCreateGroupUserDialog(context) {
      context.commit("OPEN_CREATE_GROUP_USER_DRAWER");
    },
    closeCreateGroupUserDialog(context) {
      context.commit("CLOSE_CREATE_GROUP_USER_DRAWER");
    }
  }
};
export default createGroupUserDialog;
