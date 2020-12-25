<template>
  <div>
    <el-dialog
      id="JoinUsersGroupDialoge"
      :visible.sync="isShow"
      width="582px"
      top="70px"
      @open="open"
      @closed="closed"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <el-card class="box-card" body-style="padding:0;height:460px" v-loading="loading">
        <div class="header">
          <div class="headerText">添加群成员</div>
        </div>
        <div class="leftBox">
          <div class="userTagBox">
            <UserTag
              v-for="(userTagInfo,index) in userTagList"
              :key="index"
              :info="userTagInfo"
              :unDelete="userTagInfo.unDelete"
              @imClose="userTagClose"
            />
            <SearchContactUserInput
              :defaultCheckedKeys="defaultOrganizationTreeCheckedKeys"
              :unCheckKeyMap="unOrganizationTreeCheckKeyMap"
              @handleSelect="searchContactUserInputHandleSelect"
            />
          </div>
        </div>
        <div class="rightBox">
          <ContactsBookTree
            v-show="active == 'ContactsBookTree'"
            :contactsBookTreeNode="['organization']"
            @imClick="contactsBookTreeClick"
          />
          <OrganizationTree
            v-if="active == 'organization'"
            :isAllDisable="isAllDisable"
            :defaultCheckedKeys="defaultOrganizationTreeCheckedKeys"
            :unOrganizationTreeCheckKeyMap="unOrganizationTreeCheckKeyMap"
            @headerClick="active = 'ContactsBookTree'"
            @imCheck="organizationTreeCheck"
          />
        </div>
        <div class="leftButton">
          <el-button
            style="float: right; margin-right: 12px; margin-top: 10px; padding: 10px 15px; font-size: 12px;"
            type="primary"
            size="medium"
            :disabled="userTagList.length < 1 || ((1000 - groupUserListSize )<userTagList.length)"
            @click="inviteJoinGroup"
          >确定 ({{userTagList.length}}/{{1000 - groupUserListSize}})</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import UserTag from "../../commonComponents/UserTag"
import ContactsBookTree from "../../commonComponents/ContactsBookTree"
import OrganizationTree from "../../commonComponents/OrganizationTree"
import SearchContactUserInput from "../../commonComponents/SearchContactUserInput"
import openApiUserUtils from '../../utils/openApiUserUtils';
import ConstantType from '../../js/sdk/constant/ConstantType';
import businessUserUtils from '../../utils/businessUserUtils';
import SessionsController from '../../js/sdk/service/SessionsController';
import GroupController from '../../js/sdk/service/GroupController';
import platformGroupApi from '../../js/sdk/api/platformGroupApi';
import ContactUserController from '../../js/sdk/service/ContactUserController'
import sessionUtils from '../../utils/sessionUtils'
import groupUserUtils from '../../utils/groupUserUtils'
import GroupUserController from '../../js/sdk/service/GroupUserController'

export default {
  components: {
    UserTag,
    ContactsBookTree,
    OrganizationTree,
    SearchContactUserInput
  },
  data() {
    return {
      loading: false,
      active: 'ContactsBookTree',
      userTagList: [],
      defaultOrganizationTreeCheckedKeys: [],
      unOrganizationTreeCheckKeyMap: new Map(),
      groupUserListSize: 0,
      session: {},
      isAllDisable: false
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.joinUsersGroupDialoge.isShow;
      },
      set() {
        this.$store.dispatch("closeJoinUsersGroupDialoge");
      }
    }
  },
  watch: {
  },
  methods: {
    loadData() {
      let myInfo = openApiUserUtils.getMe()
      let defaultOrganizationTreeCheckedKeys = [];
      let unOrganizationTreeCheckKeyMap = new Map();

      defaultOrganizationTreeCheckedKeys.push(myInfo.imUid)
      unOrganizationTreeCheckKeyMap.set(myInfo.imUid, myInfo.imUid)
      let sessionId = this.$store.state.session.sessionId;
      let session = sessionUtils.getOneBySessionId(sessionId);
      this.session = session;
      let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);
      this.groupUserListSize = groupUserList.length;
      for (let i = 0; i < groupUserList.length; i++) {
        const groupUser = groupUserList[i];
        defaultOrganizationTreeCheckedKeys.push(groupUser.userId)
        unOrganizationTreeCheckKeyMap.set(groupUser.userId, groupUser.userId)
      }
      this.defaultOrganizationTreeCheckedKeys = defaultOrganizationTreeCheckedKeys;
      this.unOrganizationTreeCheckKeyMap = unOrganizationTreeCheckKeyMap;
    },
    open() {
      this.loadData();
    },
    closed() {
      this.$store.dispatch("closeJoinUsersGroupDialoge");
      this.$nextTick(() => {
        Object.assign(this.$data, {
          loading: false,
          active: 'ContactsBookTree',
          userTagList: [],
          defaultOrganizationTreeCheckedKeys: [],
          unOrganizationTreeCheckKeyMap: new Map(),
          groupUserListSize: 0
        });
      })
    },
    contactsBookTreeClick(active) {
      this.active = active;
    },
    organizationTreeCheck(node) {
      let isNew = true;
      for (let i = 0; i < this.userTagList.length; i++) {
        const userTage = this.userTagList[i];
        if (userTage.imId == node.imId) {
          this.userTagList.remove(userTage)
          this.defaultOrganizationTreeCheckedKeys.remove(node.imId)
          isNew = false;
          break;
        }
      }
      if (isNew) {
        this.defaultOrganizationTreeCheckedKeys.push(node.imId)
        this.userTagList.push({
          name: node.name,
          imId: node.imId,
          type: "user"
        })
      }
    },
    userTagClose(info) {
      switch (info.type) {
        case "user": {
          this.userTagList.remove(info)
          this.defaultOrganizationTreeCheckedKeys.remove(info.imId)
          break;
        }
      }
    },
    searchContactUserInputHandleSelect(node) {
      let isNew = true;
      for (let i = 0; i < this.userTagList.length; i++) {
        const userTage = this.userTagList[i];
        if (userTage.imId == node.imUid) {
          this.userTagList.remove(userTage)
          this.defaultOrganizationTreeCheckedKeys.remove(node.imUid)
          isNew = false;
          break;
        }
      }
      if (isNew) {
        this.defaultOrganizationTreeCheckedKeys.push(node.imUid)
        this.userTagList.push({
          name: node.userName,
          imId: node.imUid,
          type: "user"
        })
      }
    },
    inviteJoinGroup() {
      this.loading = true;
      let inviteJoinUserLst = [];
      for (let i = 0; i < this.userTagList.length; i++) {
        const user = this.userTagList[i];
        inviteJoinUserLst.push(user.imId);
      }
      GroupUserController.getInstance().inviteJoinGroup(
        this.session.msgTo,
        inviteJoinUserLst.join(",")
      ).then(res => {
        this.closed()
      }).catch(err => {
        this.$message({
          showClose: true,
          type: "warning",
          message: "添加失败"
        });
      });
    },
  }
};
</script>

<style scoped>
#JoinUsersGroupDialoge >>> .el-dialog__body {
  padding: 0;
}
#JoinUsersGroupDialoge >>> .el-dialog__header {
  padding: 0;
}
#JoinUsersGroupDialoge >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#JoinUsersGroupDialoge >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#JoinUsersGroupDialoge .header {
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
}
#JoinUsersGroupDialoge .headerText {
  padding: 15px 10px;
}
#JoinUsersGroupDialoge .leftBox {
  float: left;
  height: calc(100% - 50px - 64px);
  width: 287px;
}
#JoinUsersGroupDialoge .leftButton {
  float: right;
  height: 64px;
  width: 290px;
}
#JoinUsersGroupDialoge .rightBox {
  float: right;
  border-left: 1px solid #e6eaea;
  height: calc(100% - 50px);
  width: 289px;
}
#JoinUsersGroupDialoge .leftBox .userTagBox {
  height: 280px;
  overflow: auto;
  padding: 10px 8px;
  border-bottom: 10px solid #e6eaea;
}

#JoinUsersGroupDialoge .leftBox .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#JoinUsersGroupDialoge .leftBox .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#JoinUsersGroupDialoge .leftBox .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}
</style>


