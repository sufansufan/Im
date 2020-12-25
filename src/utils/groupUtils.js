import store from "../store";
import ConstantType from "../js/sdk/constant/ConstantType";
export default {
  getAll() {
    let newMap = new Map();
    let groupMap = store.state.cache.cache.groupMap;
    for(let item of  groupMap) {
      if(item[1].type != ConstantType.GroupTypeConstant.GROUP_CHATROOM){
        newMap.set(item[0],item[1])
      }
    }
    return newMap;
  },
  getOneByGroupId(groupId) {
    let id = parseInt(groupId)
    if (this.getAll().has(id)) {
      return this.getAll().get(id)
    }
    return {}
  },
  getNameByGroup(group) {
    if (group.groupName) return group.groupName;
    return "";
  },
  isOwner(imUid, groupId) {
    var group = this.getOneByGroupId(groupId)
    if (group && imUid && imUid == group.owner) {
      return true;
    }
    return false;
  },
  formatGroupType(groupType) {
    switch (groupType) {
      case ConstantType.GroupTypeConstant.Group_MAIN_COMPANY:
        return "总部";
      case ConstantType.GroupTypeConstant.Group_BRANCH_COMPANY:
        return "分公司";
      case ConstantType.GroupTypeConstant.Group_PROJECTDEPARTMENT:
        return "项目部";
      case ConstantType.GroupTypeConstant.Group_COMPANY:
        return "部门";
      case ConstantType.GroupTypeConstant.Group_PROJECT:
        return "项目";
    }
    return "";
  }
}
