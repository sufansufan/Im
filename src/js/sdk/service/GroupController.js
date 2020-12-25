import Cache from "../cache"
import ConstantType from "../constant/ConstantType";
import openApi from "../api/openApi";
import SessionsController from "./SessionsController";
import Client from "../client";

/**
 * 群组控制层
 */
export default class GroupController {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new GroupController();
    }
    return this.instance;
  }

  /**
   * 同步群组以及群成员
   *
   * @param token
   */
  syncAllFormHttp() {
    console.log("====> 同步群组以及群成员 - http")
    return new Promise((resolve, reject) => {
      openApi.queryGroupByUser().then(res => {
        let groupList = res.data;
        for (let i = 0; i < groupList.length; i++) {
          const group = groupList[i];
          Cache.getInstance().groupMap.set(group.groupId, group);
          Cache.getInstance().groupUserMap.set(group.groupId, group.userList)
        }
        resolve(groupList)
      }).catch(err => {
        console.error(err)
        reject(err);
      })
    });
  }

  /**
   * 创建群
   * @param group
   */
  createGroup(group) {
    if (group) {
      this.syncAllFormHttp().then(() => {
        SessionsController.getInstance().createSession(0, group.groupId, ConstantType.GroupType.GROUP, ConstantType.PassthroughMsgConstant.PASSTHROUGH_CREATE_GROUP);
        Client.getInstance().refreshCache();
      }).catch(err => {
        console.error(err)
      })
    }
  }

}
