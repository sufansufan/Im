import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import cache from "./modules/cache"
import headerStore from "./modules/headerStore"
import session from "./modules/session"
import userInfoDialog from "./modules/userInfoDialog"
import readingDetailsDialog from "./modules/readingDetailsDialog"
import groupSettingDrawer from "./modules/groupSettingDrawer"
import officeGroupSettingDrawer from "./modules/officeGroupSettingDrawer"
import createGroupUserDialog from "./modules/createGroupUserDialog"
import joinUsersGroupDialoge from "./modules/joinUsersGroupDialoge"
import forwardDialoge from "./modules/forwardDialoge"
import createOfficeGroupDialog from "./modules/createOfficeGroupDialog"

const store = new Vuex.Store({
  modules: {
    cache,
    headerStore,
    session,
    userInfoDialog,
    readingDetailsDialog,
    groupSettingDrawer,
    createGroupUserDialog,
    officeGroupSettingDrawer,
    joinUsersGroupDialoge,
    forwardDialoge,
    createOfficeGroupDialog
  }
});

export default store;
