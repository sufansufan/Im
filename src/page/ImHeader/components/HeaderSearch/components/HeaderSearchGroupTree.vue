<template>
  <div id="HeaderSearchGroupTree">
    <HeaderSearchNotInfo v-if="searchInputText && groupList.length==0" text="未查找到 群组" />
    <el-tree v-if="searchInputText && groupList.length>0" :data="groupList">
      <span slot-scope="{ node, data }" style="width:100%;height:100%">
        <GroupNode
          :group-info="data"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
          :highlight-str="searchInputText"
          @imClick="createSession(data)"
        />
      </span>
    </el-tree>
  </div>
</template>

<script>
import HeaderSearchNotInfo from "./HeaderSearchNotInfo"
import GroupNode from "../../../../../commonComponents/GroupNode"
import groupUtils from "../../../../../utils/groupUtils"
import SessionsController from '../../../../../js/sdk/service/SessionsController';
import urlUtils from '../../../../../utils/urlUtils';
import ConstantType from '../../../../../js/sdk/constant/ConstantType';
import businessUserUtils from '../../../../../utils/businessUserUtils';
import openApiUserUtils from '../../../../../utils/openApiUserUtils';

export default {
  components: {
    GroupNode,
    HeaderSearchNotInfo
  },
  props: {
    searchInputText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      groupList: []
    };
  },
  computed: {

  },
  watch: {
    searchInputText(val) {
      let groupList = [];
      let groupMap = groupUtils.getAll();
      if (groupMap) {
        groupMap.forEach((group, groupId) => {
          if (group.groupName.indexOf(val) != -1) {
            groupList.push(group);
          }
        });
        this.groupList = groupList;
      }
    }
  },
  methods: {
    createSession(group) {
      SessionsController.getInstance().createSession(
        openApiUserUtils.getMe().imUid,
        group.groupId + "",
        ConstantType.GroupType.GROUP
      );
      this.$store.dispatch("setSessionId", group.groupId + "1");
      this.$store.dispatch("setHeaderButtonActive", "session");
      this.$store.dispatch("setHeaderSearchVisible", false);
    }
  }
};
</script>

<style scoped>
#HeaderSearchGroupTree {
  height: 100%;
  overflow: auto;
}

/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#HeaderSearchGroupTree >>> .el-tree {
  background: #f5f5f5;
}
/* tree hover事件样式 */
#HeaderSearchGroupTree >>> .el-tree-node__content:hover {
  background-color: #e7e7e7;
}
/* tree 隐藏图标 */
#HeaderSearchGroupTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#HeaderSearchGroupTree >>> .el-tree-node__content {
  height: 64px;
}
</style>


