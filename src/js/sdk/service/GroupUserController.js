import Cache from "../cache"
import platformGroupApi from "../api/platformGroupApi";
import openApi from "../api/openApi";

/**
 * 群组成员控制层
 */
export default class GroupUserController {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new GroupUserController();
    }
    return this.instance;
  }

  /**
   * 同步群成员 - http
   * @param {*} groupId 
   */
  syncAllByGroupIdFromHttp(groupId) {
    groupId = parseInt(groupId);
    console.log("====> 同步群成员")
    return new Promise((resolve, reject) => {
      openApi.queryUserGroupByGroup(groupId).then(res => {
        let groupUserListFromHttp = res.data;
        Cache.getInstance().groupUserMap.set(groupId, groupUserListFromHttp);
        resolve(groupUserListFromHttp);
      }).catch(err => {
        console.error(err);
        reject(err);
      })
    });
  }

  /**
   * 邀请加入群
   * @param {Array<string>} userIds 
   * @param {string} groupId 
   */
  inviteJoinGroup(groupId, imUidList) {
    return new Promise((resolve, reject) => {
      platformGroupApi.joinUsersGroup(groupId, imUidList).then(() => {
        this.syncAllByGroupIdFromHttp(groupId).then(groupUserListFromHttp => {
          resolve(groupUserListFromHttp);
        });
      }).catch(err => {
        console.error(err)
        reject(err);
      })
    });
  }

  /**
   * 踢出群
   * @param {*} groupId 
   * @param {*} imUidList 
   */
  kickOutGroup(groupId, imUidList) {
    return new Promise((resolve, reject) => {
      platformGroupApi.removeUsersGroup(groupId, imUidList).then(() => {
        this.syncAllByGroupIdFromHttp(groupId).then(groupUserListFromHttp => {
          resolve(groupUserListFromHttp);
        });
      }).catch(err => {
        console.error(err)
        reject(err);
      });
    });
  }

  /**
   * 退出群
   * @param {*} groupId 
   */
  logoutGroup(groupId) {
    return new Promise((resolve, reject) => {
      platformGroupApi.exitGroup(groupId).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err)
        reject(err);
      })
    });
  }

  /**
   * 解散群
   * @param {*} groupId 
   */
  dissolveGroup(groupId) {
    return new Promise((resolve, reject) => {
      platformGroupApi.dissolveGroup(groupId).then(res => {
        resolve(res);
      }).catch(err => {
        console.error(err)
        reject(err);
      })
    })
  }
}
