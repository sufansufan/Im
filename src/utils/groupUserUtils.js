import store from "../store";
import groupUtils from "./groupUtils";
import openApiUserUtils from "./openApiUserUtils";
export default {
  getAll() {
    return store.state.cache.cache.groupUserMap;
  },
  getOneListByGroupId(groupId) {
    let id = parseInt(groupId);
    if (this.getAll().has(id)) {
      return this.getAll().get(id)
    }
    return []
  },
  getOneListSizeByGroupId(groupId) {
    return this.getOneListByGroupId(groupId).length;
  },
  getHeadPortraitUrlListByGroupId(groupId) {
    let headPortraitUrlList = [];
    if (groupId) {
      let group = groupUtils.getOneByGroupId(groupId);
      let groupUserList = this.getOneListByGroupId(groupId);
      for (let i = 0; i < groupUserList.length; i++) {
        const groupUser = groupUserList[i];
        if (groupUser.userId == group.owner) {
          headPortraitUrlList.unshift(groupUser.headPortrait);
        } else {
          headPortraitUrlList.push(groupUser.headPortrait);
        }
      }
    }
    return headPortraitUrlList;
  },
}
