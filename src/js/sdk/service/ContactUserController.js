import Cache from "../cache"
import platformUserApi from "../api/platformUserApi";
import ConstantType from "../constant/ConstantType";
import Client from "../client";
import openApi from "../api/openApi";
/**
 * 联系人控制层
 */
export default class ContactUserController {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ContactUserController();
    }
    return this.instance;
  }

  /**
   * 同步联系人信息
   */
  syncAllFromHttp() {
    return new Promise((resolve, reject) => {
      Promise.all([
        openApi.findAllUserByCurUser(),
        platformUserApi.getByCompany(),
        openApi.getPublicAccountAll(),
        this.syncOneFromHttp(Client.getInstance().account)
      ]).then(res => {
        let openAipUserList = res[0].data;
        for (let i = 0; i < openAipUserList.length; i++) {
          const openAipUser = openAipUserList[i];
          Cache.getInstance().openAipUserMap.set(openAipUser.imUid, openAipUser);
        }
        let businessUserList = res[1].data;
        for (let i = 0; i < businessUserList.length; i++) {
          const businessUser = businessUserList[i];
          Cache.getInstance().businessUserMap.set(businessUser.imUid, businessUser)
        }
        let publicAccountList = res[2].data;
        for (let i = 0; i < publicAccountList.length; i++) {
          const publicAccount = publicAccountList[i];
          Cache.getInstance().publicAccountMap.set(publicAccount.imUid, publicAccount)
        }
        resolve();
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    });
  }


  /**
   * 同步联系人信息
   * @param {*} msgList 
   */
  syncContactUserByMsgList(msgList) {
    return new Promise((resolve, reject) => {
      // -------------------------------------------
      // -------------存储检测到的所有imUid
      // -------------------------------------------
      let businessUserImUidSet = new Set();
      let publicAccountImUidSet = new Set();
      if (msgList) {
        for (let i = 0; i < msgList.length; i++) {
          let msgFrom = msgList[i].msgFrom;
          let msgTo = msgList[i].msgTo;
          let groupType = msgList[i].groupType;
          let systemMsg = msgList[i].systemMsg;
          switch (groupType) {
            case ConstantType.GroupType.SINGLE: {
              if (msgTo) {
                businessUserImUidSet.add(msgTo);
              }
              if (msgFrom) {
                businessUserImUidSet.add(msgFrom);
              }
              break;
            }
            case ConstantType.GroupType.PLATFORM: {
              if (msgFrom) {
                publicAccountImUidSet.add(msgFrom);
              }
              break;
            }
            case ConstantType.GroupType.GROUP: {
              if (msgFrom) {
                businessUserImUidSet.add(msgFrom);
              }
              break;
            }
          }
          // 系统消息（存储操作人和被操作人）
          if (systemMsg) {
            businessUserImUidSet.add(systemMsg.userA);
            for (let i = 0; i < systemMsg.userB.length; i++) {
              if (systemMsg.userB[i]) {
                businessUserImUidSet.add(systemMsg.userB[i]);
              }
            }
          }
        }
      }
      // -------------------------------------------
      // -------------根据imUid构建请求列表
      // -------------------------------------------
      let promiseArr = [];
      if (businessUserImUidSet.size > 0) {
        for (let imUid of businessUserImUidSet) {
          promiseArr.push(this.checkOpenAipUserAndBusinessUser(imUid));
        }
      }
      if (publicAccountImUidSet.size > 0) {
        for (let imUid of publicAccountImUidSet) {
          promiseArr.push(this.checkPublicAccount(imUid));
        }
      }
      // -------------------------------------------
      // -------------发送请求
      // -------------------------------------------
      if (promiseArr.length > 0) {
        Promise.all(promiseArr)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      } else {
        resolve([]);
      }
    });
  }
  /**
   * 同步联系人信息
   * @param {*} imUid
   */
  syncOneFromHttp(imUid) {
    return new Promise((resolve, reject) => {
      if (imUid) {
        Promise.all([
          openApi.findUserById(imUid),
          platformUserApi.getByImUid(imUid)
        ]).then(res => {
          let openAipUser = res[0].data;
          let businessUser = res[1].data;
          if (openAipUser) {
            Cache.getInstance().openAipUserMap.set(parseInt(openAipUser.imUid), openAipUser);
          }
          if (businessUser) {
            Cache.getInstance().businessUserMap.set(parseInt(businessUser.imUid), businessUser);
          }
          resolve(res)
        }).catch(err => {
          console.error(err);
          reject(err);
        })
      } else {
        console.error("imUid不能为空");
        reject(err);
      }
    })
  }

  /**
   * 检测联系人是否在本地存在，如果不存在则从服务器查询
   * @param {*} imUid
   */
  checkOpenAipUserAndBusinessUser(imUid) {
    return new Promise((resolve, reject) => {
      if (imUid) {
        let openAipUserFromCache = Cache.getInstance().openAipUserMap.get(parseInt(imUid));
        let businessUserFromCache = Cache.getInstance().businessUserMap.get(parseInt(imUid));
        if (!openAipUserFromCache || !businessUserFromCache) {
          Promise.all([
            openApi.findUserById(imUid),
            platformUserApi.getByImUid(imUid)
          ]).then(res => {
            let openAipUser = res[0].data;
            let businessUser = res[1].data;
            if (openAipUser) {
              Cache.getInstance().openAipUserMap.set(parseInt(openAipUser.imUid), openAipUser);
            }
            if (businessUser) {
              Cache.getInstance().businessUserMap.set(parseInt(businessUser.imUid), businessUser);
            }
            resolve(res)
          }).catch(err => {
            console.error(err);
            reject(err);
          })
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  }
  /**
   * 检测公众号信息是否本地存在
   * @param {*} imUid
   */
  checkPublicAccount(imUid) {
    return new Promise((resolve, reject) => {
      if (imUid) {
        let publicAccountFromCache = Cache.getInstance().publicAccountMap.get(parseInt(imUid));
        if (!publicAccountFromCache) {
          openApi.getPublicAccountAll().then(res => {
            let publicAccountList = res.data;
            for (let i = 0; i < publicAccountList.length; i++) {
              const publicAccount = publicAccountList[i];
              Cache.getInstance().publicAccountMap.set(parseInt(publicAccount.imUid), publicAccount)
            }
            resolve(res)
          }).catch(err => {
            console.error(err);
            reject(err);
          })
        }
      }
      resolve();
    })
  }
}
