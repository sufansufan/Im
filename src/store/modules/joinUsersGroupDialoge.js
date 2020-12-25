const joinUsersGroupDialoge = {
  state: {
    isShow: false,
  },
  mutations: {
    OPEN_JOIN_USERS_GROUP_DIALOGE: (state) => {
      state.isShow = true;
    },
    CLOSE_JOIN_USERS_GROUP_DIALOGE: (state) => {
      state.isShow = false;
    }
  },
  actions: {
    openJoinUsersGroupDialoge(context) {
      context.commit("OPEN_JOIN_USERS_GROUP_DIALOGE");
    },
    closeJoinUsersGroupDialoge(context) {
      context.commit("CLOSE_JOIN_USERS_GROUP_DIALOGE");
    }
  }
};
export default joinUsersGroupDialoge;
