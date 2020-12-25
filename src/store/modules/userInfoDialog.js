import Cookies from "js-cookie";

const userInfoDialog = {
  state: {
    isShow: false,
    imUid: ""
  },
  mutations: {
    OPEN_USER_INFO_DIALOG: (state, imUid) => {
      state.isShow = true;
      state.imUid = imUid;
    },
    CLOSE_USER_INFO_DIALOG: (state) => {
      state.isShow = false;
      state.imUid = "";
    }
  },
  actions: {
    openUserInfoDialog(context, imUid) {
      context.commit("OPEN_USER_INFO_DIALOG", imUid);
    },
    closeUserInfoDialog(context) {
      context.commit("CLOSE_USER_INFO_DIALOG");
    }
  }
};
export default userInfoDialog;
