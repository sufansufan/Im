import store from "../store";
import urlUtils from "./urlUtils";
import Client from "../js/sdk/client";

export default {
  getAll() {
    return store.state.cache.cache.businessUserMap;
  },
  getOneByImUid(imUid) {
    let id = parseInt(imUid);
    if (this.getAll().has(id)) {
      return this.getAll().get(id);
    }
    return {};
  },
  getMe() {
    let id = parseInt(Client.getInstance().account);
    if (this.getAll().has(id)) {
      return this.getAll().get(id);
    }
    return {};
  },
  isMe(imUid) {
    let id = parseInt(imUid);
    if (this.getAll().has(id)) {
      let businessUser = this.getAll().get(id);
      let me = this.getMe();
      if (me && businessUser.imUid == me.imUid) {
        return true;
      }
    }
    return false;
  },

}
