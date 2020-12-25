const headerStore = {
  state: {
    headerButtonActive: "session",
    headerLinkStatus: "0",
    headerSearchVisible: false
  },
  mutations: {
    SET_HEADER_BUTTON_ACTIVE: (state, activeCode) => {
      state.headerButtonActive = activeCode;
    },
    SET_HEADER_LINK_STATUS: (state, linkStatus) => {
      state.headerLinkStatus = linkStatus;
    },
    SET_HEADER_SEARCH_VISIBLE: (state, searchVisible) => {
      state.headerSearchVisible = searchVisible;
    }
  },
  actions: {
    setHeaderButtonActive(context, activeCode) {
      context.commit("SET_HEADER_BUTTON_ACTIVE", activeCode);
    },
    setHeaderLinkStatus(context, linkStatus) {
      context.commit("SET_HEADER_LINK_STATUS", linkStatus);
    },
    setHeaderSearchVisible(context, searchVisible) {
      context.commit("SET_HEADER_SEARCH_VISIBLE", searchVisible);
    }
  }
};

export default headerStore;
