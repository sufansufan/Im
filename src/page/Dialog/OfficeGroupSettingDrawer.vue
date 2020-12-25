<template>
  <div>
    <el-dialog
      id="OfficeGroupSettingDrawer"
      :visible.sync="isShow"
      width="340px"
      top="55px"
      @open="open"
      @closed="closed"
      :append-to-body="true"
    >
      <div class="header">群设置</div>
      <div class="body">
        <!-- 群成员 -->
        <div class="groupUserList">
          <div class="text">群成员{{userInfoList.length}}人</div>
          <div class="userView">
            <HeadPortraitAndName
              v-for="(userInfo,index) in userInfoList"
              :key="index"
              :userInfo="userInfo"
              :isOwner="userInfo.isOwner"
              :isAdmin="userInfo.isAdmin"
              :isDelete="false"
              :padding="'4px 15px'"
              v-if="(showAll?(true):(index<8))"
            />
            <!-- <div v-if="ownerIsMe || adminIsMe" class="addUser">
              <img src="/static/icon/tianjia_icon02.png" />
            </div>-->
            <div v-if="!showAll && userInfoList.length>8" class="button">
              <span @click="showAll = true">查看更多</span>
            </div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="splitLine"></div>
        <!-- 群类型 -->
        <div class="textBox">
          <div class="textNode">
            <div class="title">群类型</div>
            <div class="context">{{groupUtils.formatGroupType(group.type)}}</div>
          </div>
        </div>
        <!-- 群名称 -->
        <div class="inputBox">
          <div class="inputNode">
            <div class="title">群名称</div>
            <div class="input">
              <el-input v-model="session.name" disabled></el-input>
            </div>
          </div>
        </div>
        <!-- 我在本群的群昵称 -->
        <!-- <div class="inputBox">
          <div class="inputNode">
            <div class="title">我在本群的群昵称</div>
            <div class="input">
              <el-input v-model="myGroupInfo.groupNick" disabled></el-input>
            </div>
          </div>
        </div>-->
        <!-- 群管理 -->
        <!-- <div class="textBox">
          <div class="textNode">
            <div class="title">群管理</div>
            <div class="contextButton">
              设置群资料、加群方式
              <i class="el-icon-arrow-right" />
            </div>
          </div>
        </div>-->
        <!-- 分割线 -->
        <div class="splitLine"></div>
        <!-- 解散本群 -->
        <!-- <div class="textBox" v-if="ownerIsMe">
          <div class="textButton" @click="disbandGroupHttp">解散该群</div>
        </div>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ResizeCacheChange from '../../Resize/ResizeCacheChange';
import ResizeSessionChange from '../../Resize/ResizeSessionChange';
import sessionUtils from '../../utils/sessionUtils';
import groupUtils from '../../utils/groupUtils';
import HeadPortraitAndName from '../../commonComponents/HeadPortraitAndName';
import GroupUserController from '../../js/sdk/service/GroupUserController';
import urlUtils from '../../utils/urlUtils';
import ConstantType from '../../js/sdk/constant/ConstantType';
import groupUserUtils from '../../utils/groupUserUtils';
import openApiUserUtils from '../../utils/openApiUserUtils';


export default {
  mixins: [ResizeCacheChange, ResizeSessionChange],
  components: {
    HeadPortraitAndName
  },
  data() {
    return {
      session: {},
      group: {},
      myGroupInfo: {},
      userInfoList: [],
      showAll: false,
      ownerIsMe: false,
      adminIsMe: false,

      groupUtils: groupUtils,

    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.officeGroupSettingDrawer.isShow;
      },
      set() {
        this.$store.dispatch("closeOfficeGroupSettingDrawer");
      }
    }
  },
  methods: {
    loadDataForCacheChange() {
      this.loadData();
    },
    loadDataForSessionChange() {
      this.loadData();
    },
    loadData(callback) {
      let session = sessionUtils.getOneBySessionId(this.sessionId);
      if (session) {
        this.session = session;
        let group = groupUtils.getOneByGroupId(session.msgTo);
        if (group) {
          this.group = group;
          let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);

          if (group && groupUserList) {
            let userInfoList = [];
            let owner = null;
            for (let i = 0; i < groupUserList.length; i++) {
              const groupUser = groupUserList[i];
              let isMe = openApiUserUtils.isMe(groupUser.userId)
              if (isMe) {
                this.myGroupInfo = groupUser;
              }
              // 群主
              if (groupUser.userId == group.owner) {
                this.ownerIsMe = isMe;
                groupUser.isOwner = true;
                owner = groupUser;
              }
              // 管理员
              else if (groupUser.adminIdentity == "Y") {
                this.adminIsMe = isMe;
                groupUser.isAdmin = true;
                userInfoList.unshift(groupUser);
              }
              // 群成员
              else {
                userInfoList.push(groupUser);
              }
            }
            if (owner) {
              userInfoList.unshift(owner);
            }
            this.userInfoList = userInfoList;
          }
        }
      }
      this.$nextTick(() => {
        if (callback) callback();
      })
    },
    open() {
      this.loadData();
    },
    closed() {
      this.showAll = false;
      this.userInfoList = [];
    },
    getIsDelete(userInfo) {
      let isDelete = false;
      let isMe = openApiUserUtils.isMe(userInfo.userId)
      if (isMe) {
        return false;
      }
      else if (this.ownerIsMe) {
        return true;
      }
      else if (this.adminIsMe) {
        if (userInfo.isOwner) {
          return false;
        }
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped>
#OfficeGroupSettingDrawer >>> .el-dialog {
  float: right;
  margin: 0;
  margin-right: 1px;
  height: calc(100% - 56px);
}
#OfficeGroupSettingDrawer >>> .el-dialog__body {
  height: calc(100%);
  padding: 0;
}
#OfficeGroupSettingDrawer >>> .el-dialog__header {
  padding: 0;
}
#OfficeGroupSettingDrawer >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#OfficeGroupSettingDrawer >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#OfficeGroupSettingDrawer .header {
  padding: 15px 15px;
  border-bottom: 1px solid #e6eaea;
}
#OfficeGroupSettingDrawer .body {
  width: calc(100% - 3px);
  height: calc(100% - 50px);
  overflow: auto;
}
#OfficeGroupSettingDrawer .body .groupUserList {
  width: calc(100% - 3px);
  overflow: auto;
  overflow-x: hidden;
}
#OfficeGroupSettingDrawer .body .groupUserList .text {
  margin: 8px 20px 0px 20px;
  font-size: 12px;
}
#OfficeGroupSettingDrawer .body .groupUserList .userView {
  padding-left: 5px;
  float: left;
}
#OfficeGroupSettingDrawer .body .groupUserList .addUser {
  width: 50px;
  height: 50px;
  float: left;
  position: relative;
  padding: 4px 15px;
}
#OfficeGroupSettingDrawer .body .groupUserList .addUser img {
  width: 36px;
  height: 36px;
  padding: 3px 3px;
  margin: 0px 4px;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
}
#OfficeGroupSettingDrawer .body .groupUserList .addUser img:hover {
  background-color: rgb(204, 204, 204);
}
#OfficeGroupSettingDrawer .body .groupUserList .button {
  padding: 4px 25px 10px 25px;
  width: calc(100% - 17 * 2px);
  float: left;
  text-align: center;
}
#OfficeGroupSettingDrawer .body .groupUserList .button span {
  cursor: pointer;
  color: #0b4d8a;
}
#OfficeGroupSettingDrawer .body .groupUserList .button span:hover {
  color: #2f86d6;
}
#OfficeGroupSettingDrawer .body .splitLine {
  border-bottom: 10px solid #e6eaea;
}
#OfficeGroupSettingDrawer .body .textBox {
  padding: 0 6px 0 20px;
  height: 35px;
}
#OfficeGroupSettingDrawer .body .textBox .textNode {
  border-bottom: 1px solid #e6eaea;
  padding: 8px 0;
  width: 100%;
  float: left;
}
#OfficeGroupSettingDrawer .body .textBox .textNode .title {
  float: left;
}
#OfficeGroupSettingDrawer .body .textBox .textNode .context {
  color: #999999;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  margin-right: 5px;
}
#OfficeGroupSettingDrawer .body .textBox .textNode .contextButton {
  color: #0b4d8a;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  cursor: pointer;
}
#OfficeGroupSettingDrawer .body .textBox .textNode .contextButton:hover {
  color: #2f86d6;
}
#OfficeGroupSettingDrawer .body .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#OfficeGroupSettingDrawer .body .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#OfficeGroupSettingDrawer .body .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}
#OfficeGroupSettingDrawer .body .textBox .textButton {
  border-bottom: 1px solid #e6eaea;
  padding: 8px 0;
  width: 100%;
  text-align: center;
  cursor: pointer;
  color: #0b4d8a;
}
#OfficeGroupSettingDrawer .body .textBox .textButton:hover {
  color: #2f86d6;
}
</style>


