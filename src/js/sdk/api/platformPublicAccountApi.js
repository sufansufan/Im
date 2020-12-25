import SingletonAxios from "../utils/SingletonAxios";
import ConstantType from "../constant/ConstantType";
import Client from "../client";

export default {

  baseUrl() {
    return Client.getInstance().origin + '/' + Client.getInstance().companyId + "/platform"
    // return Client.getInstance().origin + "/platform"
  },

  /**
   * 查询公众号信息
   * @param {string} groupName 群名称
   * @param {Array<string>} imIds 群成员imUid集合
   * @param {number} type 群类型
   */
  findById(id) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/hermes/publicaccount/findById",
      method: "get",
      params: {
        // os: ConstantType.ClientType.WEB,
        // token: Client.getInstance().token,
        // formData: {
        id: id
        // }
      }
    });
  }
}
