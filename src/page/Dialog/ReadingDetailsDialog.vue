<template>
  <div>
    <el-dialog
      id="ReadingDetailsDialog"
      :visible.sync="isShow"
      width="430px"
      top="70px"
      @open="open"
      @closed="closed"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <el-card class="box-card" body-style="padding:0;height:460px">
        <div class="header">
          <div class="headerText">消息接收人列表</div>
        </div>
        <div v-loading="loading">
          <div class="mainTop">
            <div class="mainTopText">未读({{unReadUserList.length}}人)</div>
          </div>
          <div style="border-bottom: 10px solid #e6eaea;">
            <div class="mainView">
              <HeadPortraitAndName
                v-for="(unReadUser,index) in unReadUserList"
                :key="index"
                :userInfo="unReadUser"
              />
            </div>
          </div>
          <div class="mainTop">
            <div class="mainTopText">已读({{readUserList.length}}人)</div>
          </div>
          <div>
            <div class="mainView">
              <HeadPortraitAndName
                v-for="(readUser,index) in readUserList"
                :key="index"
                :userInfo="readUser"
              />
            </div>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import HeadPortraitAndName from "../../commonComponents/HeadPortraitAndName"
import ResizeCacheChange from '../../Resize/ResizeCacheChange';
import openApi from '../../js/sdk/api/openApi';
import openApiUserUtils from '../../utils/openApiUserUtils';
export default {
  components: {
    HeadPortraitAndName
  },
  mixins: [ResizeCacheChange],
  data() {
    return {
      loading: false,
      readUserList: [],
      unReadUserList: [],

      setTimeoutId: '',
      index: 0
    };
  },
  computed: {
    isShow: {
      get() {
        return this.$store.state.readingDetailsDialog.isShow;
      },
      set() {
        this.$store.dispatch("closeReadingDetailsDialog");
      }
    }
  },
  methods: {
    /** 当前组件构建时及缓存更新时触发 */
    loadDataForCacheChange() {
      this.loadData();
    },
    loadData() {
      clearTimeout(this.setTimeoutId);
      let message = this.$store.state.readingDetailsDialog.message;
      if (message.sequenceId) {
        this.loading = true;
        openApi.getReadState(message.sequenceId).then(res => {
          if (!res.data && this.index < 5) {
            this.index++;
            setTimeout(() => {
              this.loadData();
            }, 2000)
          } else if (this.index == 5) {
            this.$message({
              type: 'info',
              showClose: true,
              message: "网络不稳定请稍后再试"
            });
          } else {
            let readUserList = [];
            let unReadUserList = [];
            for (let i = 0; i < res.data.length; i++) {
              let userObj = res.data[i];
              if (userObj.readState) {
                readUserList.push(openApiUserUtils.getOneByImUid(userObj.imUID));
              } else {
                unReadUserList.push(openApiUserUtils.getOneByImUid(userObj.imUID));
              }
            }
            this.readUserList = readUserList;
            this.unReadUserList = unReadUserList;
            this.loading = false;
          }
        })
      }
    },
    open() {
      this.loadData();
    },
    closed() {
      this.$store.dispatch("closeReadingDetailsDialog");
      this.readUserList = [];
      this.unReadUserList = [];
      this.index = 0;
    }
  }
};
</script>

<style scoped>
#ReadingDetailsDialog >>> .el-dialog__body {
  padding: 0;
}
#ReadingDetailsDialog >>> .el-dialog__header {
  padding: 0;
}
#ReadingDetailsDialog >>> .el-dialog__headerbtn {
  top: 0px;
  right: 0px;
  margin: 16px 10px;
}
#ReadingDetailsDialog >>> .el-dialog__headerbtn:hover .el-dialog__close {
  color: #2f86d6;
}
#ReadingDetailsDialog .header {
  width: 100%;
  height: 50px;
  background-color: #f5f5f5;
}
#ReadingDetailsDialog .headerText {
  padding: 15px 10px;
}
#ReadingDetailsDialog .mainTop {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #e6eaea;
}
#ReadingDetailsDialog .mainTopText {
  padding: 7px 10px;
  font-size: 12px;
}
#ReadingDetailsDialog .mainView {
  width: calc(100% - 23px);
  height: 169px;
  padding: 0 10px;
  overflow: auto;
}
</style>


