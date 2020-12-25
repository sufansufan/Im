<template>
  <div id="HeaderSearchContactUserTree">
    <HeaderSearchNotInfo v-if="searchInputText && contactUserList.length==0" text="未查找到 联系人" />
    <el-tree v-if="searchInputText && contactUserList.length>0" :data="contactUserList">
      <span slot-scope="{ node, data }" style="width:100%;height:100%">
        <UserInfoNode
          :user-info="data"
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
import UserInfoNode from "../../../../../commonComponents/UserInfoNode"
import businessUserUtils from '../../../../../utils/businessUserUtils';
import ConstantType from '../../../../../js/sdk/constant/ConstantType';
import SessionsController from '../../../../../js/sdk/service/SessionsController';
import urlUtils from '../../../../../utils/urlUtils';
import openApiUserUtils from '../../../../../utils/openApiUserUtils';
import Client from '../../../../../js/sdk/client';

export default {
  components: {
    UserInfoNode,
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
      contactUserList: []
    };
  },
  computed: {

  },
  watch: {
    searchInputText(val) {
      let contactUserList = [];
      let businessUserMap = businessUserUtils.getAll();
      if (businessUserMap) {
        for (let businessUserArray of businessUserMap) {
          let imUid = businessUserArray[0];
          let businessUser = businessUserArray[1];
          if (businessUser.userName.indexOf(val) != -1) {
            contactUserList.push(businessUser);
          }
        }
      }
      this.contactUserList = contactUserList;
    }
  },
  created() {

  },
  methods: {
    createSession(userInfo) {
      SessionsController.getInstance().createSession(
        openApiUserUtils.getMe().imUid,
        userInfo.imUid + "",
        ConstantType.GroupType.SINGLE
      ).then(() => {
        Client.getInstance().refreshCache()
        this.$store.dispatch("setSessionId", userInfo.imUid + "0");
        this.$store.dispatch("setHeaderButtonActive", "session");
        this.$store.dispatch("setHeaderSearchVisible", false);
      });
    }
  }
};
</script>

<style scoped>
#HeaderSearchContactUserTree {
  height: 100%;
  overflow: auto;
}

/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#HeaderSearchContactUserTree >>> .el-tree {
  background: #f5f5f5;
}
/* tree hover事件样式 */
#HeaderSearchContactUserTree >>> .el-tree-node__content:hover {
  background-color: #e7e7e7;
}
/* tree 隐藏图标 */
#HeaderSearchContactUserTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#HeaderSearchContactUserTree >>> .el-tree-node__content {
  height: 64px;
  /* border-bottom: 1px solid #e6eaea; */
}
</style>


