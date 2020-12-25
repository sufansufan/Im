import store from "../store";
import Client from "../js/sdk/client";

export default {
  getAll() {
    return store.state.cache.cache.openAipUserMap;
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
    return this.getOneByImUid(id);
  },
  isMe(imUid) {
    if (imUid) {
      let openAipUser = this.getOneByImUid(imUid);
      let me = this.getMe();
      if (openAipUser && me && openAipUser.imUid == me.imUid) {
        return true;
      }
    }
    return false;
  },
  getNameByUser(user) {
    if (user.groupNick) return user.groupNick;
    if (user.nick) return user.nick;
    if (user.userName) return user.userName;
    if (user.name) return user.name;
    if (user.imUid) return user.imUid;
    return "未知人员";
  },
  getImUidByUser(user) {
    if (user) {
      if (user.imUid) return user.imUid;
      if (user.imId) return user.imId;
      if (user.userId) return user.userId;
    }
    return null;
  }
}
