<template>
  <div id="SendMessage">
    <v-chateditor
      chatEditorStyle="height:100%"
      preStyle="height:calc(100% - 80px)"
      @sendMsg="sendMsg"
      @sendFiles="sendFiles"
    />
    <span
      style="float: right;margin-top: -47px;margin-right: 88px;color: rgb(136, 153, 167);font-size: 13px;"
    >Enter 发送, Ctrl+Enter 换行</span>
  </div>
</template>

<script>
import ResizeCacheChange from '../Resize/ResizeCacheChange';
import ResizeSessionChange from '../Resize/ResizeSessionChange';
import groupUtils from '../utils/groupUtils';
import openApiUserUtils from '../utils/openApiUserUtils';
import businessUserUtils from '../utils/businessUserUtils';
import ConstantType from '../js/sdk/constant/ConstantType';
import sessionUtils from '../utils/sessionUtils';
import messageUtils from '../utils/messageUtils';
import Client from '../js/sdk/client';
import urlUtils from '../utils/urlUtils';
import GroupTypeVue from './GroupType.vue';
import groupUserUtils from '../utils/groupUserUtils';

export default {
  components: {

  },
  mixins: [ResizeCacheChange, ResizeSessionChange],
  props: {

  },
  data() {
    return {
      session: {},
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    let atwhoContainerList = document.getElementsByClassName("atwho-container");
    for (let i = 0; i < atwhoContainerList.length; i++) {
      const atwhoContainer = atwhoContainerList[i];
      atwhoContainer.remove();
    }
    let displayTpl =
      '<img style=" float: left; width: 30px; height: 30px; background-color: rgb(204, 204, 204); border-radius: 5px; margin-left: 10px; margin-top: 6px; " src="${headPortrait}">' +
      '<div style="width: 100%; height: 20px;margin-top: 1px;">' +
      '<span style="margin-top: ${firstMarginTop};color:#333333;float: left;max-width: 93px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left: 10px;font-size: 14px;">${groupNick}</span>' +
      '<img style="display:${businessDisplay};float: left;height: 14px;margin-top: 5px;margin-left: 5px;" src="/static/icon/qingjia_icon.png">' +
      "</div>" +
      '<div style="display:${secondDisplay};width: 100%;height: 20px;margin-top: 2px;">' +
      '<span style="color:#999999;float: left;max-width: 130px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left: 10px;font-size: 12px;">${position}</span>' +
      "</div>";

    $("#preId").atwho({
      at: "@",
      searchKey: "name",
      displayTpl:
        "<li style='width:180px;height:42px;padding:0'>" + displayTpl + "</li>", //显示模板
      insertTpl:
        '<span style="font-weight:bold;" userId="${userId}">${atwho-at}${name}</span>', //插入模板
      headerTpl:
        "<div class='atwho-header'><small>↑&nbsp;↓&nbsp;</small>选择，<small>Enter</small>确认</div>",
      limit: 1000,
      startWithSpace: false,
      callbacks: {
        remoteFilter: (query, callback) => {
          callback(this.groupUsers);
        }
      }
    });
  },
  methods: {
    loadDataForCacheChange() {
      this.loadData();
    },
    loadDataForSessionChange() {
      this.$nextTick(function () {
        // 是否获取到草稿
        let draftMessageMap = this.$store.state.session.draftMessageMap;
        let draftMessage = draftMessageMap.get(this.sessionId);
        if (draftMessage) {
          var preEl = document.getElementById("preId");
          preEl.innerHTML = messageUtils.formatChatMessage(
            {
              chatMsg: { content: draftMessage }
            },
            null,
            true
          );
          this.$store.state.session.draftMessageMap.delete(this.sessionId);
        }
      });
    },
    loadData(callback) {
      let session = sessionUtils.getOneBySessionId(this.sessionId);
      this.session = session;
      if (session.groupType == ConstantType.GroupType.GROUP) {
        let allUser = [
          {
            userId: "all",
            groupNick: "所有人(" + (groupUserUtils.getOneListSizeByGroupId(session.msgTo) - 1) + "人)",
            name: "所有人",
            headPortrait: "/static/icon/02应用图标—icon/@.png",
            firstMarginTop: "11px",
            secondDisplay: "none",
            businessDisplay: "none",
            businessUrl: ""
          }
        ];
        let groupUserList = groupUserUtils.getOneListByGroupId(session.msgTo);
        for (let i = 0; i < groupUserList.length; i++) {
          const groupUser = groupUserList[i];
          let imUid = openApiUserUtils.getImUidByUser(groupUser);
          let openApiUser = openApiUserUtils.getOneByImUid(imUid);
          let businessUser = businessUserUtils.getOneByImUid(imUid);
          if (openApiUserUtils.isMe(imUid)) {
            continue;
          } else {
            let user = {};
            user.headPortrait = openApiUser.headPortrait;
            user.firstMarginTop = "2px";
            user.secondDisplay = "block";
            user.name = openApiUserUtils.getNameByUser(openApiUser);
            user.groupNick = openApiUserUtils.getNameByUser(openApiUser);
            user.userId = imUid;
            user.position = businessUser.position ? businessUser.position : "";
            user.businessDisplay = businessUser.businessType ? businessUser.businessType : "none";
            user.businessUrl = this.getBusinessUrl(businessUser.businessType);
            allUser.push(user)
          }
        }
        this.groupUsers = allUser;
      }
      this.$nextTick(() => {
        if (callback) callback();
      })
    },
    /** 发送文件 */
    sendFiles(files) {
      let msgToInfo = openApiUserUtils.getOneByImUid(this.session.msgTo);
      if (this.session.groupType == ConstantType.GroupType.SINGLE && msgToInfo.state == "ng") {
        this.$message({
          showClose: true,
          type: "warning",
          message: "该人员已非您的同事，不能再聊天！"
        });
      } else {
        let msg = "文件太大，超过100M的不能发送"
        let isSend = true;
        for (var key in files) {
          if (files[key].size / 1024 / 1024 > 100) {
            isSend = false
            msg = files[key].name + '，' + msg
          }
        }
        if (isSend) {
          for (var key in files) {
            Client.getInstance().sendFileMessage(
              this.session.groupType, // 群聊还是单聊
              openApiUserUtils.getMe().imUid, // 我的imId
              this.session.msgTo, // 发送给谁
              this.detectFileType(files[key]), // 文件类型
              files[key], // 文件对象
              false,
              null, // 回调函数
              this.getUnReadNum() // 接收人数
            );
          }
          let messageViewDom = document.getElementById("messageView")
          messageViewDom.scrollTop = messageViewDom.scrollHeight - messageViewDom.clientHeight;
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: msg
          });
        }
      }
    },
    /** 发送消息 */
    sendMsg(message) {
      // 隐藏at框
      var atView = document.getElementById("at-view-64");
      if (atView) atView.style.display = "none";
      let msgToInfo = openApiUserUtils.getOneByImUid(this.session.msgTo);
      if (this.session.groupType == ConstantType.GroupType.SINGLE && msgToInfo.state == "ng") {
        this.$message({
          showClose: true,
          type: "warning",
          message: "该人员已非您的同事，不能再聊天！"
        });
      } else {
        // 构建消息
        if (message.msgArr[0] != "" && message.msgArr[0].replace(/[‍‍\s]/g, "") != "") {
          // 获取消息内容
          var messageInfo = message.msgArr[0];
          // 发送消息
          Client.getInstance().sendTextMessage(
            this.session.groupType,
            openApiUserUtils.getMe().imUid, // 我的imId
            this.session.msgTo,
            messageInfo,
            false,
            null,
            this.getUnReadNum(),
            this.getAtList(message)
          );
          let messageViewDom = document.getElementById("messageView")
          messageViewDom.scrollTop = messageViewDom.scrollHeight - messageViewDom.clientHeight;
        }
      }
    },
    getUnReadNum() {
      let userNum = 1;
      if (this.session.groupType == ConstantType.GroupType.GROUP) {
        userNum = groupUserUtils.getOneListSizeByGroupId(this.session.msgTo);
      }
      return userNum;
    },
    getAtList(message) {
      let atList = [];
      let atWhoId = Array.from(new Set(message.msgArr[1]));
      for (let i = 0; i < atWhoId.length; i++) {
        const userId = atWhoId[i];
        if (userId == "all") {
          let groupUserList = groupUserUtils.getOneListByGroupId(this.session.msgTo);
          let atAll = [];
          groupUserList.forEach(user => {
            let imUid = openApiUserUtils.getImUidByUser(user);
            if (!openApiUserUtils.isMe(imUid)) {
              atAll.push(imUid + "");
            }
          });
          atList = atAll;
          break;
        } else {
          atList.push(userId + "");
        }
      }
      return atList;
    },
    /** 检测文件类型 */
    detectFileType(file) {
      let patt = '';
      // 文件
      var charSecondType = ConstantType.CharSecondType.CAHT_FILE;
      // 图片
      patt = /\.(svg|ico|gif|jpg|jpeg|png)$/;
      if (patt.test(file.name.toLowerCase())) {
        charSecondType = ConstantType.CharSecondType.CAHT_IMAGE;
      }
      // //-- 视频
      // patt = /\.(mp4)$/;
      // if (patt.test(file.name.toLowerCase())) {
      //   charSecondType = 4; // 视频
      // }
      return charSecondType;
    },
    getBusinessUrl(type) {
      let url = "";
      switch (type) {
        case "Leave_Process":
          return "/static/icon/qingjia_icon.png";
        case "BusinessTravel_Process":
          return "/static/icon/chuchai_icon.png";
        case "WorkOut_Process":
          return "/static/icon/waichu_icon.png";
        case "WorkOvertime_Process":
          return "/static/icon/jiaban_icon.png";
      }
      return url;
    },
  }
};
</script>

<style scoped>
#SendMessage {
  height: 100%;
}
#SendMessage >>> .chatEditor_ {
  padding: 0px 20px 20px 10px;
}
#SendMessage >>> .sendMsg {
  width: 58px;
  background-color: #0a4c8a;
  color: white;
  cursor: pointer;
}
#SendMessage >>> .sendMsgDisabled {
  width: 58px;
  color: #999;
  cursor: no-drop;
}
</style>


