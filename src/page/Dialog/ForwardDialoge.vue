<template>
  <div>
    <el-dialog
      id="ForwardDialoge"
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
          <div class="headerText">消息转发</div>
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
              @handleSelect="searchContactUserInputHandleSelect"
            />
          </div>
        </div>
        <div class="rightBox">
          <ContactsBookTree
            v-show="active == 'ContactsBookTree'"
            :contactsBookTreeNode="['myGroup','organization']"
            @imClick="contactsBookTreeClick"
          />
          <OrganizationTree
            v-if="active == 'organization'"
            :defaultCheckedKeys="defaultOrganizationTreeCheckedKeys"
            @headerClick="active = 'ContactsBookTree'"
            @imCheck="organizationTreeCheck"
          />
          <MyGroupTree
            v-if="active == 'myGroup'"
            :defaultCheckedKeys="defaultMyGroupTreeCheckedKeys"
            @headerClick="active = 'ContactsBookTree'"
            @imCheck="myGroupTreeCheck"
          />
        </div>
        <div class="leftButton">
          <el-button
            style="float: right; margin-right: 12px; margin-top: 10px; padding: 10px 15px; font-size: 12px;"
            type="primary"
            size="medium"
            :disabled="userTagList.length < 1"
            @click="forward"
          >发送</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import UserTag from "../../commonComponents/UserTag"
import MyGroupTree from "../../commonComponents/MyGroupTree"
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
import Client from '../../js/sdk/client'

export default {
  components: {
    UserTag,
    ContactsBookTree,
    OrganizationTree,
    SearchContactUserInput,
    MyGroupTree
  },
  data() {
    return {
      loading: false,
      active: 'ContactsBookTree',
      userTagList: [],
      defaultOrganizationTreeCheckedKeys: [],
      defaultMyGroupTreeCheckedKeys: [],
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.forwardDialoge.isShow;
      },
      set() {
        this.$store.dispatch("closeForwardDialoge");
      }
    }
  },
  watch: {
  },
  methods: {
    loadData() {
    },
    open() {
      this.loadData();
    },
    closed() {
      this.$store.dispatch("closeForwardDialoge");
      this.$nextTick(() => {
        Object.assign(this.$data, {
          loading: false,
          active: 'ContactsBookTree',
          userTagList: [],
          defaultOrganizationTreeCheckedKeys: [],
          defaultMyGroupTreeCheckedKeys: [],
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
        if (userTage.id == node.imId) {
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
          data: node,
          id: node.imId,
          type: "user"
        })
      }
    },
    myGroupTreeCheck(node) {
      let isNew = true;
      for (let i = 0; i < this.userTagList.length; i++) {
        const userTage = this.userTagList[i];
        if (userTage.type == 'group' && userTage.id == node.groupId) {
          this.userTagList.remove(userTage)
          this.defaultMyGroupTreeCheckedKeys.remove(node.groupId)
          isNew = false;
          break;
        }
      }
      if (isNew) {
        this.defaultMyGroupTreeCheckedKeys.push(node.groupId)
        this.userTagList.push({
          name: node.groupName,
          data: node,
          id: node.groupId,
          type: "group"
        })
      }
    },
    userTagClose(userTage) {
      switch (userTage.type) {
        case "user": {
          this.userTagList.remove(userTage)
          this.defaultOrganizationTreeCheckedKeys.remove(userTage.id)
          break;
        }
        case "group": {
          this.userTagList.remove(userTage)
          this.defaultMyGroupTreeCheckedKeys.remove(userTage.id)
          break;
        }
      }
    },
    searchContactUserInputHandleSelect(node) {
      let isNew = true;
      for (let i = 0; i < this.userTagList.length; i++) {
        const userTage = this.userTagList[i];
        if (userTage.id == node.imUid) {
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
          data: node,
          id: node.imUid,
          type: "user"
        })
      }
    },
    forward() {
      this.loading = true;
      let msg = this.$store.state.forwardDialoge.msg;
      for (let i = 0; i < this.userTagList.length; i++) {
        const userTage = this.userTagList[i];
        let msgFrom = openApiUserUtils.getMe().imUid;
        let msgTo = userTage.id;
        let groupType = userTage.type == "user" ? ConstantType.GroupType.SINGLE : ConstantType.GroupType.GROUP;
        let unReadNum = userTage.type == "user" ? 1 : groupUserUtils.getOneListSizeByGroupId(msgTo);
        switch (msg.msgSecondType) {
          case ConstantType.CharSecondType.CAHT_TEXT: {
            Client.getInstance().sendTextMessage(
              groupType,
              msgFrom,
              msgTo,
              msg.chatMsg.content,
              false,
              () => { this.closed() },
              unReadNum
            );
            break;
          }
          case ConstantType.CharSecondType.CAHT_IMAGE:
          case ConstantType.CharSecondType.CAHT_FILE: {
            Client.getInstance().forwardFileMessage(
              groupType,
              msgFrom,
              msgTo,
              msg.msgSecondType,
              {
                name: msg.chatMsg.description,
                url: msg.chatMsg.content,
                size: msg.chatMsg.remark
              },
              false,
              () => { this.closed() },
              unReadNum
            );
            break;
          }
        }
      }
    },
  }
};
</script>

<style scoped>
#ForwardDialoge >>> .el-dialog__body {
  padding: 0;
}
#ForwardDialoge >>> .el-dialog__header {
  padding: 0;
}
#ForwardDialoge >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#ForwardDialoge >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#ForwardDialoge .header {
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
}
#ForwardDialoge .headerText {
  padding: 15px 10px;
}
#ForwardDialoge .leftBox {
  float: left;
  height: calc(100% - 50px - 64px);
  width: 287px;
}
#ForwardDialoge .leftButton {
  float: right;
  height: 64px;
  width: 290px;
}
#ForwardDialoge .rightBox {
  float: right;
  border-left: 1px solid #e6eaea;
  height: calc(100% - 50px);
  width: 289px;
}
#ForwardDialoge .leftBox .userTagBox {
  height: 280px;
  overflow: auto;
  padding: 10px 8px;
  border-bottom: 10px solid #e6eaea;
}

#ForwardDialoge .leftBox .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#ForwardDialoge .leftBox .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#ForwardDialoge .leftBox .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}
</style>


