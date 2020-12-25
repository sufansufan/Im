import Cookies from "js-cookie";

const readingDetailsDialog = {
  state: {
    isShow: false,
    message: {}
  },
  mutations: {
    OPEN_READING_DETAILS_DIALOG: (state, message) => {
      state.isShow = true;
      state.message = message;
    },
    CLOSE_READING_DETAILS_DIALOG: (state) => {
      state.isShow = false;
      state.message = {};
    }
  },
  actions: {
    openReadingDetailsDialog(context, message) {
      if (message.unRead >= 1) {
        context.commit("OPEN_READING_DETAILS_DIALOG", message);
      }
    },
    closeReadingDetailsDialog(context) {
      context.commit("CLOSE_READING_DETAILS_DIALOG");
    }
  }
};
export default readingDetailsDialog;
