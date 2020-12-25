import SingletonAxios from "../utils/SingletonAxios";
import Client from "../client";

export default { 

  baseUrl() {
    return Client.getInstance().origin + '/' + Client.getInstance().companyId + "/platform"
    // return Client.getInstance().origin + "/platform"
  },

  /**
   * 查询组织架构
   * @param {string} orgId 
   * @param {*} deep 
   * @param {*} status 
   */
  queryPersonnelOrgTreeForIm(orgId, deep, status) {
    return SingletonAxios.getInstance()({
      url: this.baseUrl() + "/orgstructure/organization/queryPersonnelOrgTreeForIm",
      method: "get",
      params: {
        orgId: orgId,
        deep: deep,
        status: status
      }
    });
  }
}
