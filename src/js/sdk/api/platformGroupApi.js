import SingletonAxios from "../utils/SingletonAxios";
import ConstantType from "../constant/ConstantType";
import Client from "../client";

export default {

  baseUrl() {
    return Client.getInstance().origin + '/' + Client.getInstance().companyId + "/platform"
    // return Client.getInstance().origin + "/platform"
  },

  /**
   * 创建群
   * @param {string} groupName 群名称
   * @param {Array<string>} imIds 群成员imUid集合
   * @param {number} type 群类型
   */
  createGroup(groupName, imIds, type) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/createGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupName: groupName,
          imIds: imIds,
          type: type,
          settings: ""
        }
      }
    });
  },

  /**
   * 创建官方群
   * @param {string} orgId 组织节点Id
   * @param {string} groupName 群名称
   * @param {number} groupType 群类型
   * @param {boolean} filiale 是否包含分公司
   * @param {boolean} prodepart 是否包含项目部
   * @param {boolean} parttime 是否包含兼职人员
   */
  createOfficialGroup(orgId, groupName, groupType, filiale, prodepart, parttime) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/createOfficialGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          orgId: orgId,
          groupName: groupName,
          groupType: groupType,
          settings: {
            filiale: filiale ? filiale : false,
            prodepart: prodepart ? prodepart : false,
            parttime: parttime ? parttime : false
          }
        }
      }
    });
  },

  /**
   * 解散群
   * @param {string} groupId 群Id
   */
  dissolveGroup(groupId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/dissolveGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId
        }
      }
    });
  },

  /**
   * 群内批量拉人
   * @param {string} groupId 
   * @param {Array<string>} imIds 
   */
  joinUsersGroup(groupId, imIds) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/joinUsersGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId,
          imIds: imIds
        }
      }
    });
  },

  /**
   * 群内批量移除人员
   * @param {string} groupId 
   * @param {string} imIds 
   */
  removeUsersGroup(groupId, imIds) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/removeUsersGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId,
          imIds: imIds
        }
      }
    });
  },

  /**
   * 退群
   * @param {string} groupId 
   */
  exitGroup(groupId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/exitGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId
        }
      }
    });
  },

  /**
   * 修改群名
   * @param {string} groupId 
   * @param {string} groupName 
   */
  editGroupName(groupId, groupName) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/editGroupName",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId,
          groupName: groupName
        }
      }
    });
  },

  /**
   * 获取群信息
   * @param {string} groupId 
   */
  findGroup(groupId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/group/findGroup",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          groupId: groupId
        }
      }
    });
  }
}
