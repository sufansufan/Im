const createOfficeGroupDialog = {
  state: {
    isShow: false,
    id: "",
    successOrgId: "",
    successGroupId: ""
  },
  mutations: {
    OPEN_CREATE_OFFICE_GROUP_DRAWER: (state, id) => {
      state.isShow = true;
      state.id = id;
    },
    CLOSE_CREATE_OFFICE_GROUP_DRAWER: (state) => {
      state.isShow = false;
      state.id = "";
    },
    SET_CREATE_OFFICE_GROUP_DRAWER_SUCCESS_ID: (state, data) => {
      state.successOrgId = data.orgId;
      state.successGroupId = data.groupId;
    }
  },
  actions: {
    openCreateOfficeGroupDialog(context, id) {
      context.commit("OPEN_CREATE_OFFICE_GROUP_DRAWER", id);
    },
    setCreateOfficeGroupDialogSuccessId(context, data) {
      context.commit("SET_CREATE_OFFICE_GROUP_DRAWER_SUCCESS_ID", data);
    },
    closeCreateOfficeGroupDialog(context) {
      context.commit("CLOSE_CREATE_OFFICE_GROUP_DRAWER");
    }
  }
};
export default createOfficeGroupDialog;
