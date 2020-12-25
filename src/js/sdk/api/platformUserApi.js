import SingletonAxios from "../utils/SingletonAxios";
import Client from "../client";
import ConstantType from "../constant/ConstantType";

export default { 

  baseUrl() {
    return Client.getInstance().origin + '/' + Client.getInstance().companyId + "/platform"
    // return Client.getInstance().origin + "/platform"
  },

  /**
   * 根据imUid获取人员信息
   * @param {string|number} imUid 
   */
  getByImUid(imUid) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/user/getByImUid",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formData: {
          imUid: imUid
        }
      }
    });
  },

  /**
   * 获取所在公司全部人员信息
   */
  getByCompany() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/user/getByCompany",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token,
        formdata: {
          imUid: Client.getInstance().account
        }
      }
    });
  },

  /**
   * 所有公众号信息
   */
  getByPublicAccount() {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/publicaccount/getList",
      method: "post",
      data: {
        os: ConstantType.ClientType.WEB,
        token: Client.getInstance().token
      }
    });
  },

  /**
   * 获取群成员信息
   * @param {string|number} groupId 
   */
  getByGroup(groupId) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/user/getByGroup",
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



}
