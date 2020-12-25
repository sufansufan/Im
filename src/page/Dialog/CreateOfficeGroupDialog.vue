<template>
  <div>
    <el-dialog
      id="CreateOfficeGroupDialog"
      :visible.sync="isShow"
      width="342px"
      top="70px"
      @open="open"
      @closed="closed"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <el-card class="box-card" body-style="padding:0;height:460px" v-loading="loading">
        <div class="header">
          <div class="headerText">群组({{userTagList.length}}人)</div>
        </div>
        <div class="leftBox">
          <div class="userTagBox">
            <UserTag
              v-for="(userTagInfo,index) in userTagList"
              :key="index"
              :info="userTagInfo"
              :isNotShowDelete="true"
            />
          </div>
          <div class="textBox">
            <div class="textNode">
              <div class="title">群类型</div>
              <div class="context">{{groupUtils.formatGroupType(orgType)}}</div>
            </div>
          </div>
          <div class="inputBox">
            <div class="inputNode">
              <div class="title">群名称</div>
              <div class="input">
                <el-input v-model="groupName" placeholder="请输入群名称" type="text" maxlength="50"></el-input>
              </div>
            </div>
          </div>
          <!-- 分割线 -->
          <div class="splitLine"></div>
          <!-- <div class="textBox" v-if="orgType == ConstantType.GroupTypeConstant.Group_MAIN_COMPANY">
            <div class="textNode">
              <div class="title">是否包含分公司</div>
              <div class="context">
                <el-switch
                  v-model="isHaveFiliale"
                  active-color="#0b4d8a"
                  inactive-color="#999"
                  size="small"
                  @change="isHaveFilialeChange"
                ></el-switch>
              </div>
            </div>
          </div>-->
          <!-- <div class="textBox" v-if="orgType == ConstantType.GroupTypeConstant.Group_MAIN_COMPANY">
            <div class="textNode">
              <div class="title">是否包含项目部</div>
              <div class="context">
                <el-switch
                  v-model="isHaveProdepart"
                  active-color="#0b4d8a"
                  inactive-color="#999"
                  size="small"
                ></el-switch>
              </div>
            </div>
          </div>-->
          <!-- <div class="textBox">
            <div class="textNode">
              <div class="title">是否包含兼职员工</div>
              <div class="context">
                <el-switch
                  v-model="isHaveParttime"
                  active-color="#0b4d8a"
                  inactive-color="#999"
                  size="small"
                ></el-switch>
              </div>
            </div>
          </div>-->
        </div>
        <div class="leftButton">
          <el-button
            style="float: right; margin-right: 12px; margin-top: 10px; padding: 10px 15px; font-size: 12px;"
            type="primary"
            size="medium"
            @click="createSession"
          >完成创建</el-button>
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
import platformOrganizationApi from '../../js/sdk/api/platformOrganizationApi'
import groupUtils from '../../utils/groupUtils'
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
      loading: true,
      userTagList: [],
      groupName: "",
      orgType: "",
      orgTree: {},
      userTagList: [],
      isHaveFiliale: false,
      isHaveProdepart: false,
      isHaveParttime: false,
      groupUtils: groupUtils,
      ConstantType: ConstantType
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.createOfficeGroupDialog.isShow;
      },
      set() {
        this.$store.dispatch("closeCreateOfficeGroupDialog");
      }
    }
  },
  watch: {
  },
  methods: {
    loadData() {
      this.loading = true;
      let orgId = this.$store.state.createOfficeGroupDialog.id;
      platformOrganizationApi.queryPersonnelOrgTreeForIm(orgId, true, false).then(res => {
        this.orgTree = res.data;
        this.getOrgUserList(this.userTagList, this.orgTree, this.isHaveFiliale, this.isHaveProdepart);
        this.orgType = this.formatOrgType(res.data.orgType)
        this.loading = false;
      });
    },
    open() {
      this.loadData();
    },
    closed() {
      this.$store.dispatch("closeCreateOfficeGroupDialog");
      this.$nextTick(() => {
        Object.assign(this.$data, {
          loading: true,
          userTagList: [],
          groupName: "",
          orgType: "",
          orgTree: {},
          userTagList: [],
          isHaveFiliale: false,
          isHaveProdepart: false,
          isHaveParttime: false,
          groupUtils: groupUtils,
          ConstantType: ConstantType
        });
      })
    },
    getOrgUserList(orgList, orgData, isHaveSubCompany, isHaveProjectDepartment) {
      // 是人
      if (openApiUserUtils.getImUidByUser(orgData) && !orgData.children) {
        orgList.push(orgData);
      }
      // 不是人且有子节点
      else if (!openApiUserUtils.getImUidByUser(orgData) && orgData.children) {
        // 循环子节点
        for (let i = 0; i < orgData.children.length; i++) {
          const children = orgData.children[i];
          // 是否分公司
          let isSubCompany = children.orgType == "SubCompany";
          if (isSubCompany && !isHaveSubCompany) {
            continue;
          }
          // 是否项目部
          let isProjectDepartment = children.orgType == "ProjectDepartment";
          if (isProjectDepartment && !isHaveProjectDepartment) {
            continue;
          }
          // 
          else {
            this.getOrgUserList(orgList, children, isHaveSubCompany);
          }
        }
      }
    },
    formatOrgType(orgType) {
      switch (orgType) {
        case "Company":
          return ConstantType.GroupTypeConstant.Group_MAIN_COMPANY;
        case "SubCompany":
          return ConstantType.GroupTypeConstant.Group_BRANCH_COMPANY;
        case "ProjectDepartment":
          return ConstantType.GroupTypeConstant.Group_PROJECTDEPARTMENT;
        case "Department":
          return ConstantType.GroupTypeConstant.Group_COMPANY;
      }
    },
    isHaveFilialeChange(val) {
      let userTagList = [];
      this.getOrgUserList(userTagList, this.orgTree, this.isHaveFiliale, this.isHaveProdepart);
      this.userTagList = userTagList;
    },
    createSession() {
      this.loading = true;
      let orgId = this.$store.state.createOfficeGroupDialog.id;
      let groupName = this.orgTree.orgName;
      if (this.groupName) {
        groupName = this.groupName;
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
            platformGroupApi.createOfficialGroup(
              orgId,
              groupName,
              "",
              this.isHaveFiliale,
              this.isHaveProdepart,
              this.isHaveParttime
            ).then(res => {
              if (res.code == 500 || !res.data) {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "创建失败!请联系管理员!"
                });
              } else {
                ContactUserController.getInstance().syncAllFromHttp().then(() => {
                  let haveMe = false;
                  for (let i = 0; i < this.userTagList.length; i++) {
                    const user = this.userTagList[i];
                    if (openApiUserUtils.isMe(openApiUserUtils.getImUidByUser(user))) {
                      haveMe = true;
                      break;
                    }
                  }
                  if (haveMe) {
                    this.$store.dispatch("setHeaderButtonActive", "session");
                  } else {
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: "创建成功!"
                    });
                  }
                  this.$store.dispatch("setCreateOfficeGroupDialogSuccessId", { orgId: orgId, groupId: res.data.groupId });
                  this.closed();
                });
              }
            });
          }
        }
      )
    },
  }
};
</script>

<style scoped>
#CreateOfficeGroupDialog .splitLine {
  border-bottom: 10px solid #e6eaea;
}
#CreateOfficeGroupDialog >>> .el-input--suffix .el-input__inner {
  padding-right: 45px;
}
#CreateOfficeGroupDialog >>> .el-switch__core {
  height: 14px !important ;
  width: 26px !important;
}
#CreateOfficeGroupDialog >>> .el-switch__core:after {
  top: 0px;
  left: 0px;
  width: 12px;
  height: 12px;
}
#CreateOfficeGroupDialog >>> .el-switch.is-checked .el-switch__core::after {
  margin-left: -12px !important;
  left: 100% !important;
}
#CreateOfficeGroupDialog >>> .el-dialog__body {
  padding: 0;
}
#CreateOfficeGroupDialog >>> .el-dialog__header {
  padding: 0;
}
#CreateOfficeGroupDialog >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#CreateOfficeGroupDialog >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#CreateOfficeGroupDialog .header {
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
}
#CreateOfficeGroupDialog .headerText {
  padding: 15px 10px;
}
#CreateOfficeGroupDialog .leftBox {
  float: left;
  height: calc(100% - 50px - 64px);
  overflow: auto;
  width: 337px;
}
#CreateOfficeGroupDialog .leftButton {
  float: right;
  height: 64px;
  width: 290px;
}
#CreateOfficeGroupDialog .rightBox {
  float: right;
  border-left: 1px solid #e6eaea;
  height: calc(100% - 50px);
  width: 289px;
}
#CreateOfficeGroupDialog .leftBox .userTagBox {
  height: 160px;
  overflow: auto;
  padding: 10px 8px;
  border-bottom: 10px solid #e6eaea;
}

#CreateOfficeGroupDialog .leftBox .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#CreateOfficeGroupDialog .leftBox .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#CreateOfficeGroupDialog .leftBox .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}

#CreateOfficeGroupDialog .leftBox .textBox {
  padding: 0 6px 0 20px;
  height: 35px;
}
#CreateOfficeGroupDialog .leftBox .textBox .textNode {
  border-bottom: 1px solid #e6eaea;
  padding: 8px 0;
  width: 100%;
  float: left;
}
#CreateOfficeGroupDialog .leftBox .textBox .textNode .title {
  float: left;
}
#CreateOfficeGroupDialog .leftBox .textBox .textNode .context {
  color: #999999;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  margin-right: 5px;
}
#CreateOfficeGroupDialog .leftBox .textBox .textNode .contextButton {
  color: #0b4d8a;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  cursor: pointer;
}
#CreateOfficeGroupDialog .leftBox .textBox .textNode .contextButton:hover {
  color: #2f86d6;
}
</style>


