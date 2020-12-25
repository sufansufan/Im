<template>
  <div>
    <el-dialog
      id="GroupSettingDrawer"
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
              :isDelete="getIsDelete(userInfo)"
              :padding="'4px 15px'"
              @imDeleteClick="deleteGroupUser"
              v-if="(showAll?(true):((!ownerIsMe && !adminIsMe)?(index<8):(index<7)))"
            />
            <div v-if="ownerIsMe || adminIsMe" class="addUser" @click="openJoinUsersGroupDialoge">
              <img src="/static/icon/tianjia_icon02.png" />
            </div>
            <div
              v-if="!showAll && ((!ownerIsMe && !adminIsMe)?(userInfoList.length>8):(userInfoList.length>7))"
              class="button"
            >
              <span @click="showAll = true">查看更多</span>
            </div>
          </div>
        </div>
        <!-- 分割线 -->
        <div class="splitLine"></div>
        <!-- 群类型 -->
        <!-- <div class="textBox">
          <div class="textNode">
            <div class="title">群类型</div>
            <div class="context">普通群</div>
          </div>
        </div>-->
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
        <div class="textBox" v-if="ownerIsMe">
          <div class="textButton" @click="disbandGroupHttp">解散该群</div>
        </div>
        <!-- 退出群聊 -->
        <div class="textBox">
          <div class="textButton" @click="logoutGroupHttp">退出群聊</div>
        </div>
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
      adminIsMe: false
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.groupSettingDrawer.isShow;
      },
      set() {
        this.$store.dispatch("closeGroupSettingDrawer");
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
        let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);
        this.group = group;
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
    },
    deleteGroupUser(userInfo) {
      this.$confirm(
        "移除后，" + openApiUserUtils.getNameByUser(userInfo) + " 将无法收到该群聊的消息",
        "移除群成员",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          GroupUserController.getInstance().kickOutGroup(
            parseInt(this.session.msgTo),
            openApiUserUtils.getImUidByUser(userInfo)
          ).then(result => {
            this.$message({
              showClose: true,
              type: "success",
              message: "移除成功!"
            });
          });
        })
        .catch(err => { console.log(err) });
    },
    disbandGroupHttp() {
      this.$confirm("确定要解散该群吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          GroupUserController.getInstance().dissolveGroup(parseInt(this.session.msgTo)).then(
            result => {
              this.$store.dispatch("closeGroupSettingDrawer");
            }
          );
        })
        .catch(() => { });
    },
    logoutGroupHttp() {
      this.$confirm("确定删除并退出该群聊？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          GroupUserController.getInstance().logoutGroup(parseInt(this.session.msgTo)).then(
            result => {
              this.$store.dispatch("closeGroupSettingDrawer");
            }
          );
        })
        .catch(() => { });
    },
    openJoinUsersGroupDialoge() {
      this.$store.dispatch("openJoinUsersGroupDialoge");
    }
  }
};
</script>

<style scoped>
#GroupSettingDrawer >>> .el-dialog {
  float: right;
  margin: 0;
  margin-right: 1px;
  height: calc(100% - 56px);
}
#GroupSettingDrawer >>> .el-dialog__body {
  height: calc(100%);
  padding: 0;
}
#GroupSettingDrawer >>> .el-dialog__header {
  padding: 0;
}
#GroupSettingDrawer >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#GroupSettingDrawer >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#GroupSettingDrawer .header {
  padding: 15px 15px;
  border-bottom: 1px solid #e6eaea;
}
#GroupSettingDrawer .body {
  width: calc(100% - 3px);
  height: calc(100% - 50px);
  overflow: auto;
}
#GroupSettingDrawer .body .groupUserList {
  width: calc(100% - 3px);
  overflow: auto;
  overflow-x: hidden;
}
#GroupSettingDrawer .body .groupUserList .text {
  margin: 8px 20px 0px 20px;
  font-size: 12px;
}
#GroupSettingDrawer .body .groupUserList .userView {
  padding-left: 5px;
  float: left;
}
#GroupSettingDrawer .body .groupUserList .addUser {
  width: 50px;
  height: 50px;
  float: left;
  position: relative;
  padding: 4px 15px;
}
#GroupSettingDrawer .body .groupUserList .addUser img {
  width: 36px;
  height: 36px;
  padding: 3px 3px;
  margin: 0px 4px;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
}
#GroupSettingDrawer .body .groupUserList .addUser img:hover {
  background-color: rgb(204, 204, 204);
}
#GroupSettingDrawer .body .groupUserList .button {
  padding: 4px 25px 10px 25px;
  width: calc(100% - 17 * 2px);
  float: left;
  text-align: center;
}
#GroupSettingDrawer .body .groupUserList .button span {
  cursor: pointer;
  color: #0b4d8a;
}
#GroupSettingDrawer .body .groupUserList .button span:hover {
  color: #2f86d6;
}
#GroupSettingDrawer .body .splitLine {
  border-bottom: 10px solid #e6eaea;
}
#GroupSettingDrawer .body .textBox {
  padding: 0 6px 0 20px;
  height: 35px;
}
#GroupSettingDrawer .body .textBox .textNode {
  border-bottom: 1px solid #e6eaea;
  padding: 8px 0;
  width: 100%;
  float: left;
}
#GroupSettingDrawer .body .textBox .textNode .title {
  float: left;
}
#GroupSettingDrawer .body .textBox .textNode .context {
  color: #999999;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  margin-right: 5px;
}
#GroupSettingDrawer .body .textBox .textNode .contextButton {
  color: #0b4d8a;
  font-size: 12px;
  float: right;
  margin-top: 2px;
  cursor: pointer;
}
#GroupSettingDrawer .body .textBox .textNode .contextButton:hover {
  color: #2f86d6;
}
#GroupSettingDrawer .body .inputBox {
  padding: 0 6px 0 20px;
  height: 84px;
}
#GroupSettingDrawer .body .inputBox .inputNode {
  padding: 8px 0;
  width: 100%;
}
#GroupSettingDrawer .body .inputBox .inputNode .title {
  float: left;
  padding-bottom: 8px;
}
#GroupSettingDrawer .body .textBox .textButton {
  border-bottom: 1px solid #e6eaea;
  padding: 8px 0;
  width: 100%;
  text-align: center;
  cursor: pointer;
  color: #0b4d8a;
}
#GroupSettingDrawer .body .textBox .textButton:hover {
  color: #2f86d6;
}
</style>


