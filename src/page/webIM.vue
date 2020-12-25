<template>
  <div
    id="WebIM"
    v-loading="!initStatus"
    element-loading-text="正在初始化数据...."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <ImHeader />
    <SessionMain v-show="headerButtonActive == 'session'" />
    <AddressBookMain v-if="headerButtonActive == 'addressBook'" />

    <!-- 弹框 -->
    <UserInfoDialog />
    <ReadingDetailsDialog />
    <GroupSettingDrawer />
    <OfficeGroupSettingDrawer />
    <CreateGroupUserDialog />
    <JoinUsersGroupDialoge />
    <MessageContextmenu />
    <ForwardDialoge />
    <CreateOfficeGroupDialog />

    <iframe width="0" height="0" frameborder="0" name="hrong" style="display:none"></iframe>
  </div>
</template>

<script>
import ImHeader from "./ImHeader/ImHeader"
import SessionMain from "./ImMain/SessionMain/SessionMain"
import AddressBookMain from "./ImMain/AddressBookMain/AddressBookMain"
import UserInfoDialog from "./Dialog/UserInfoDialog"
import ReadingDetailsDialog from "./Dialog/ReadingDetailsDialog"
import GroupSettingDrawer from "./Dialog/GroupSettingDrawer"
import OfficeGroupSettingDrawer from "./Dialog/OfficeGroupSettingDrawer"
import CreateGroupUserDialog from "./Dialog/CreateGroupUserDialog"
import CreateOfficeGroupDialog from "./Dialog/CreateOfficeGroupDialog"
import JoinUsersGroupDialoge from "./Dialog/JoinUsersGroupDialoge"
import ForwardDialoge from "./Dialog/ForwardDialoge"
import MessageContextmenu from "../commonComponents/MessageContextmenu"


export default {
  components: {
    ImHeader,
    SessionMain,
    AddressBookMain,

    UserInfoDialog,
    ReadingDetailsDialog,
    GroupSettingDrawer,
    CreateGroupUserDialog,
    OfficeGroupSettingDrawer,
    MessageContextmenu,
    JoinUsersGroupDialoge,
    ForwardDialoge,
    CreateOfficeGroupDialog
  },
  data() {
    return {
    };
  },
  computed: {
    initStatus() {
      return this.$store.state.cache.initStatus;
    },
    headerButtonActive() {
      return this.$store.state.headerStore.headerButtonActive;
    }
  }
};
</script>

<style>
.el-message__content {
  line-height: normal;
}
.v-modal {
  background: #0000008c;
}
.pswp__bg {
  background: #535353;
}
#WebIM {
  width: 100%;
  height: 100%;
  border: 1px solid #e6eaea;
}
.el-button--primary.is-plain {
}

.el-breadcrumb__inner a:hover,
.el-breadcrumb__inner.is-link:hover {
  color: #2f86d6;
}
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #0b4d8a;
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #0a4c8b;
  outline: 0;
}
/* input搜索框下拉菜单样式 */
.el-autocomplete-suggestion {
  width: 180px !important;
}
.el-autocomplete-suggestion li.highlighted,
.el-autocomplete-suggestion li:hover {
  background-color: #e6eaea;
}
.el-autocomplete-suggestion li {
  line-height: normal;
  cursor: default;
  padding: 0;
}
.el-autocomplete-suggestion__wrap {
  padding: 0;
}
.el-popper[x-placement^="bottom"] .popper__arrow::after {
  top: 0px;
}
/* 树形菜单复选框 */
/* tree 复选框样式 */
.el-checkbox__inner {
  border-radius: 22px;
  width: 16px;
  height: 16px;
  border-color: #999999;
}
/* tree 复选框样式 */
.el-checkbox__inner:hover {
  border-color: #0a4c8b;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0a4c8b;
  border-color: #0a4c8b;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #e6eaea;
  border-color: #999999;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:hover {
  background-color: #e6eaea;
  border-color: #999999;
}
.el-checkbox__inner::after {
  height: 8px;
  left: 5px;
}
.el-checkbox__input.is-disabled .el-checkbox__inner::after {
  cursor: not-allowed;
  border-color: #999999 !important;
}
.el-tree-node__content > label.el-checkbox {
  margin-right: 0px;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #999999;
}

/** **************************************** */
/** ************ 文字按钮全局样式 ************ */
/** **************************************** */
.el-button:hover {
  color: #0b4d8a;
  border-color: #0b4d8a !important;
}
.el-button {
  border-color: #999 !important;
}
.el-button--text:focus,
.el-button--text:hover {
  color: #6a86ac;
}

.el-button--text {
  color: #333333;
}
.el-button--primary:hover {
  color: white;
  background-color: #094073 !important;
  border-color: #094073 !important;
}
.el-button--primary {
  color: white;
  background-color: #0b4d8a !important;
  border-color: #0b4d8a !important;
}
.el-button--primary.is-disabled,
.el-button--primary.is-disabled:active,
.el-button--primary.is-disabled:focus,
.el-button--primary.is-disabled:hover {
  background-color: #84a1bc !important;
  border-color: #84a1bc !important;
}
/** **************************************** */
/** ************ 右键菜单全局样式 ************ */
/** **************************************** */
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.4);
}
.contextmenu li {
  margin: 0;
  padding: 7px 10px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #e7e7e7;
}

.atwho-view .cur {
  background: #f5f5f5;
}
.atwho-view .atwho-header {
  margin: 5px 5px 0 5px;
}
</style>
