import SingletonAxios from "../utils/SingletonAxios";
import Client from "../client";
import ConstantType from "../constant/ConstantType";


export default {

  baseUrl() {
    return Client.getInstance().openApiUrl
  },

  /**
   * 获取用户所在所有群组及群成员
   */
  queryGroupByUser() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/group/queryGroupByUser",
      method: "get",
      params: {
        imUid: Client.getInstance().account,
        groupName: ""
      }
    })
  },

  /**
   * 获取群成员信息
   * @param {string} groupId 
   */
  queryUserGroupByGroup(groupId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/group/queryUserGroupByGroup",
      method: "get",
      params: {
        groupId: groupId
      }
    });
  },

  /**
   * 获取消息已读详情
   * @param {Long} sequenceId 
   */
  getReadState(sequenceId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/chat/getReadState/" + sequenceId.toString(),
      method: "get"
    });
  },

  /**
   * 查询所有联系人
   */
  findAllUserByCurUser() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/user/findAllUserByCurUser",
      method: "get"
    });
  },

  /**
   * 根据Id查询用户信息
   * @param {Number} imUid 
   */
  findUserById(imUid) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/user/findById",
      method: "get",
      params: {
        imUid: imUid
      }
    });
  },
  /**
   * 根据Id查询用户信息
   * @param {Number} imUid 
   */
  getPublicAccountAll() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/publicaccount/getList",
      method: "post",
      data: {}
    });
  },

  /**
   * 获取OSS STS
   */
  getOssSTS() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/user/getOssSTS",
      method: "get"
    });
  },
  /**
   * 获取转译后的群名称
   */
  getEscapeGroupName(groupName) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/im/group/getEscapeGroupName",
      method: "get",
      params: {
        groupName: groupName
      }
    });
  }

}
