<template>
  <div>
    <el-dialog
      id="CreateGroupUserDialog"
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
          <div class="headerText">发起群聊({{userTagList.length}}人)</div>
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
          <div class="inputBox">
            <div class="inputNode">
              <div class="title">群名称</div>
              <div class="input">
                <el-input v-model="groupName" placeholder="请输入群名称" type="text" maxlength="50"></el-input>
              </div>
            </div>
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
            :disabled="userTagList.length < 2"
            @click="createSession"
          >确定 ({{userTagList.length}}/1000)</el-button>
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
import openApi from '../../js/sdk/api/openApi'

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
      groupName: ""
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.createGroupUserDialog.isShow;
      },
      set() {
        this.$store.dispatch("closeCreateGroupUserDialog");
      }
    }
  },
  watch: {
  },
  methods: {
    loadData() {
      let myInfo = openApiUserUtils.getMe()
      this.defaultOrganizationTreeCheckedKeys.push(myInfo.imUid)
      this.unOrganizationTreeCheckKeyMap.set(myInfo.imUid, myInfo.imUid)
      this.userTagList.push({
        name: myInfo.name,
        imId: myInfo.imUid,
        type: "organizationTree",
        unDelete: true
      })
    },
    open() {
      this.loadData();
    },
    closed() {
      this.$store.dispatch("closeCreateGroupUserDialog");
      this.$nextTick(() => {
        Object.assign(this.$data, {
          loading: false,
          active: 'ContactsBookTree',
          userTagList: [],
          defaultOrganizationTreeCheckedKeys: [],
          groupName: ""
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
    createSession() {
      this.loading = true;
      // 单聊
      if (this.defaultOrganizationTreeCheckedKeys.length == 2) {
        SessionsController.getInstance().createSession(
          openApiUserUtils.getMe().imUid,
          this.defaultOrganizationTreeCheckedKeys[1] + "",
          ConstantType.GroupType.SINGLE
        ).then(res => {
          this.$store.dispatch("setSessionId", this.defaultOrganizationTreeCheckedKeys[1] + "0");
          this.$store.dispatch("setHeaderButtonActive", "session");
          this.closed();
        });
      }
      // 群聊
      else {
        // 构建群名称
        var groupName = "";
        if (this.groupName) {
          groupName = this.groupName;
        } else {
          var groupNameArray = [];
          for (let i = 0; i < this.defaultOrganizationTreeCheckedKeys.length; i++) {
            if (i >= 4) break;
            const imUid = this.defaultOrganizationTreeCheckedKeys[i];
            groupNameArray.push(openApiUserUtils.getNameByUser(businessUserUtils.getOneByImUid(imUid)));
          }
          var src = groupNameArray.join(",");
          groupName = src.substring(0, 51);
        }
        openApi.getEscapeGroupName(groupName).then(
          res => {
            let str = res.data;
            if (str.length > 50) {
              this.$message({
                showClose: true,
                type: "warning",
                message: "群名称超出长度，限制50字符"
              });
              this.loading = false;
            } else {
              // 发起群聊
              platformGroupApi.createGroup(
                groupName,
                this.defaultOrganizationTreeCheckedKeys.join(","),
                ConstantType.GroupTypeConstant.Group_COMMON
              ).then(res => {
                if (res.code == 500) {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: "创建失败,请联系管理员"
                  });
                }
                Promise.all([GroupController.getInstance().syncAllFormHttp(), ContactUserController.getInstance().syncAllFromHttp()]).then(res => {
                  this.$store.dispatch("setHeaderButtonActive", "session");
                  this.closed();
                }).catch(err => {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: "创建失败,请联系管理员"
                  });
                });
              })
            }
          }
        )
      }
    },
  }
};
</script>

<style scoped>
#CreateGroupUserDialog >>> .el-dialog__body {
  padding: 0;
}
#CreateGroupUserDialog >>> .el-input--suffix .el-input__inner {
  padding-right: 45px;
}
#CreateGroupUserDialog >>> .el-dialog__header {
  padding: 0;
}
#CreateGroupUserDialog >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#CreateGroupUserDialog >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#CreateGroupUserDialog .header {
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
}
#CreateGroupUserDialog .headerText {
  padding: 15px 10px;
}
#CreateGroupUserDialog .leftBox {
  float: left;
  height: calc(100% - 50px - 64px);
  width: 287px;
}
#CreateGroupUserDialog .leftButton {
  float: right;
  height: 64px;
  width: 290px;
}
#CreateGroupUserDialog .rightBox {
  float: right;
  border-left: 1px solid #e6eaea;
  height: calc(100% - 50px);
  width: 289px;
}
#CreateGroupUserDialog .leftBox .userTagBox {
  height: 160px;
  overflow: auto;
  padding: 10px 8px;
  border-bottom: 10px solid #e6eaea;
}

#CreateGroupUserDialog .leftBox .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#CreateGroupUserDialog .leftBox .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#CreateGroupUserDialog .leftBox .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}
</style>


