<template>
  <div>
    <el-dialog
      id="UserInfoDialog"
      :visible.sync="isShow"
      width="340px"
      top="70px"
      @open="open"
      @closed="closed"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <!-- 人员信息弹框 -->
      <el-card class="box-card" body-style="padding:0;height:450px" v-loading="loading">
        <div class="header">
          <UserInfoNode
            :user-info="openAipUser"
            :businessTypeIsShow="false"
            height="64px"
            :isShowSplitLine="false"
            head-portrait-width="44px"
            name-font-size="14px"
          />
          <BusinessType
            :type="businessUser.businessType"
            :status="businessUser.businessTypeCn"
            :isShowTime="true"
            :statusStartTime="businessUser.statusStartTime"
            :statusEndTime="businessUser.statusEndTime"
            height="14px"
            :margin="'-9px 0px 0px 65px;'"
            :textMargin="'-11px 0px 0px 2px;'"
            maxWidth="100%"
          />
        </div>
        <div v-if="!loading">
          <div class="node" v-if=" businessUser && businessUser.telephone">
            <div class="lText">电话</div>
            <div class="rText">{{showTelephone?businessUser.telephone:getTelephone()}}</div>
            <div class="rButton" @click="showTelephone=!showTelephone">{{showTelephone?"隐藏":"显示"}}</div>
          </div>
          <div class="node" v-if=" businessUser && businessUser.orgName">
            <div class="lText">部门</div>
            <div class="rText">{{businessUser.orgName}}</div>
          </div>
          <div
            v-if=" businessUser && (businessUser.telephone || businessUser.orgName)"
            class="splitline"
          ></div>
          <div class="node" v-if=" businessUser && businessUser.email">
            <div class="lText">邮箱</div>
            <div class="rText">{{businessUser.email}}</div>
          </div>
          <div>
            <div
              v-if="isMe && (businessUser && (businessUser.gender || businessUser.birthday || businessUser.residencePlace))"
              class="splitline"
            ></div>
            <div class="node" v-if="isMe && businessUser && businessUser.gender">
              <div class="lText">性别</div>
              <div class="rText">{{ businessUser && businessUser.gender==1?"男":"女"}}</div>
            </div>
            <div class="node" v-if="isMe && businessUser && businessUser.birthday">
              <div class="lText">生日</div>
              <div class="rText">{{businessUser.birthday}}</div>
            </div>
            <div class="node" v-if="isMe && businessUser && businessUser.residencePlace">
              <div class="lText">地区</div>
              <div class="rText">{{businessUser.residencePlace}}</div>
            </div>
          </div>
          <div class="send" v-if="!isMe && openAipUser.state !='ng'">
            <el-button type="primary" @click="createSession">发消息</el-button>
          </div>
          <div class="ng" v-if="!isMe && openAipUser.state =='ng'">
            <el-button disabled type="primary">已离职</el-button>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import platformUserApi from '../../js/sdk/api/platformUserApi';
import SessionsController from '../../js/sdk/service/SessionsController';
import ContactUserController from '../../js/sdk/service/ContactUserController';
import Client from '../../js/sdk/client';

import UserInfoNode from "../../commonComponents/UserInfoNode"
import BusinessType from "../../commonComponents/BusinessType"
import openApi from '../../js/sdk/api/openApi';
import businessUserUtils from '../../utils/businessUserUtils';
import openApiUserUtils from '../../utils/openApiUserUtils';
import ConstantType from '../../js/sdk/constant/ConstantType';

export default {
  components: {
    UserInfoNode,
    BusinessType
  },
  data() {
    return {
      openAipUser: {},
      businessUser: {},
      loading: true,
      showTelephone: false,
      isMe: false
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.userInfoDialog.isShow;
      },
      set() {
        this.$store.dispatch("closeUserInfoDialog");
      }
    }
  },
  methods: {
    open() {
      let imUid = this.$store.state.userInfoDialog.imUid;
      this.loading = true;
      this.isMe = openApiUserUtils.isMe(imUid);
      if (imUid) {
        ContactUserController.getInstance().syncOneFromHttp(imUid).then(res => {
          this.openAipUser = res[0].data;
          this.businessUser = res[1].data;
          Client.getInstance().refreshCache();
          this.loading = false;
        }).catch();
      }
    },
    closed() {
      this.openAipUser = {};
      this.businessUser = {};
      this.showTelephone = false;
      this.$store.dispatch("closeUserInfoDialog");
    },
    createSession() {
      SessionsController.getInstance().createSession(
        openApiUserUtils.getMe().imUid,
        this.openAipUser.imUid + "",
        ConstantType.GroupType.SINGLE
      );
      this.$store.dispatch("setSessionId", this.openAipUser.imUid + "0");
      this.$store.dispatch("closeUserInfoDialog");
      this.$store.dispatch("setHeaderButtonActive", "session");
    },
    getTelephone() {
      let reg = /^(\d{3})\d{4}(\d{4})$/;
      let str = ""
      let tel = this.businessUser.telephone;
      if (tel) {
        let telArray = tel.split("-");
        if (telArray.length > 1) {
          str += telArray[0]
          str += telArray[1].replace(reg, "$1****$2");
        } else {
          str += tel.replace(reg, "$1****$2");
        }
      }
      return str;
    }
  }
};
</script>

<style scoped>
#UserInfoDialog >>> .el-dialog__body {
  padding: 0;
}
#UserInfoDialog >>> .el-dialog__header {
  padding: 0;
}
#UserInfoDialog .header {
  padding: 32px 0;
  width: 100%;
  background-color: #f5f5f5;
}

#UserInfoDialog .node {
  height: 50px;
  border-bottom: 1px solid #e6eaea;
}

#UserInfoDialog .node .lText {
  float: left;
  padding: 16px 10px;
}

#UserInfoDialog .node .rText {
  float: right;
  padding: 17px 10px;
  font-size: 12px;
  color: #999999;
}
#UserInfoDialog .node .rButton {
  float: right;
  padding: 17px 0px;
  font-size: 12px;
  color: #0b4d8a;
  cursor: pointer;
}
#UserInfoDialog .splitline {
  border-bottom: 9px solid #e6eaea;
}
#UserInfoDialog >>> .send .el-button--primary {
  padding: 15.5px 129px;
  margin: 30px 18px;
  background-color: #0b4d8a;
  border-color: #0b4d8a;
}
#UserInfoDialog >>> .send .el-button--primary:hover {
  background-color: #2f86d6;
  border-color: #2f86d6;
}

#UserInfoDialog >>> .ng .el-button--primary {
  color: #c0c4cc;
  padding: 15.5px 129px;
  margin: 30px 18px;
  background-color: #fff !important;
  border-color: #ebeef5 !important;
}
#UserInfoDialog >>> .ng .el-button--primary:hover {
  background-color: #fff !important;
  border-color: #ebeef5 !important;
}
</style>


