<template>
  <div id="OrganizationTree" v-loading="firstLoading">
    <div class="header" @click="headerClick" v-if="!isAddressBook">
      <i class="el-icon-arrow-left">{{organization.orgName}}</i>
    </div>
    <div class="isAddressBookHeader" v-if="isAddressBook">
      <!-- 头像 -->
      <ImHeadPortrait
        :url-list="[organization.icon?organization.icon:'/static/icon/logo.icon.jpg']"
        defaultUrl="/static/icon/logo.icon.jpg"
        errorUrl="/static/icon/logo.icon.jpg"
        width="44px"
        float="left"
        margin="0px 0px 0px 10px!important;"
      />
      <NodeText
        :text="organization.orgName"
        :max-width="'calc(100% - 44px - 20px)'"
        color="#333"
        margin="12px 0px 0px 10px;"
      />
    </div>
    <el-container
      v-loading="loading"
      :style="'height: calc(100% - '+(isAddressBook?'53px':'39px')+');'"
    >
      <el-header v-if="!loading">
        <el-breadcrumb separator="➨">
          <el-breadcrumb-item v-for="(item,key,index) in breadcrumbList" :key="index">
            <a
              style="font-size:12px"
              href="javascript:void(0);"
              @click="breadcrumbClick(item,key)"
            >{{item.data.orgName}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main ref="elMain">
        <div v-if="!loading && breadcrumbList.length>0">
          <el-tree
            v-if="(breadcrumbList[breadcrumbList.length - 1].contactsList.length > 0) || (breadcrumbList[breadcrumbList.length - 1].contactsList.length == 0 && breadcrumbList[breadcrumbList.length - 1].orgList.length == 0)"
            ref="userTree"
            empty-text="暂无人员"
            show-checkbox
            node-key="imId"
            :props="defaultProps"
            :data="breadcrumbList[breadcrumbList.length - 1].contactsList"
            :defaultCheckedKeys="defaultCheckedKeys"
            @node-click="treeClick"
            @check="treeCheck"
          >
            <span slot-scope="{ node, data }" style="width:100%;height:100%;">
              <UserInfoNode
                :user-info="data"
                :businessTypeIsShow="true"
                :businessTypeIsShowTime="isAddressBook"
                height="64px"
                head-portrait-width="44px"
                name-font-size="14px"
              />
            </span>
          </el-tree>
          <el-tree
            v-if="breadcrumbList[breadcrumbList.length - 1].orgList.length > 0"
            :props="defaultProps"
            :data="breadcrumbList[breadcrumbList.length - 1].orgList"
            @node-click="orgTreeNodeClick"
          >
            <span slot-scope="{ node, data }" style="width:100%;height:100%;">
              <div class="orgTree">
                <img
                  src="/static/icon/zuzhi01.png"
                  style="width:22px;height:22px;float: left;margin-right: 10px;"
                />
                <div
                  :style="'font-size: 14px;float: left; margin-top: 2px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: calc(100% - '+(isAddressBook?'200px':'110px')+');'"
                >{{data.orgName}}</div>
                <div
                  v-if="data.orgType"
                  style="font-size: 14px;float: left; margin-top: 2px; "
                >&nbsp;({{data.personnelCount}}人)</div>
                <el-button
                  v-if="isAddressBook && data.personnelCount>0 && !data.imGroupId && data.createGroup"
                  size="mini"
                  plain
                  @click="openCreateOfficeGroupDialog(data.id)"
                >群组</el-button>
              </div>
              <div class="splitLine"></div>
            </span>
          </el-tree>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import platformOrganizationApi from '../js/sdk/api/platformOrganizationApi';
import openApiUserUtils from '../utils/openApiUserUtils';
import UserInfoNode from './UserInfoNode';
import ImHeadPortrait from './ImHeadPortrait';
import NodeText from './NodeText';

export default {
  components: {
    UserInfoNode,
    ImHeadPortrait,
    NodeText
  },
  props: {
    defaultCheckedKeys: {
      type: Array,
      default: () => { return [] }
    },
    unOrganizationTreeCheckKeyMap: {
      type: Map,
      default: () => { return new Map() }
    },
    isAddressBook: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      organization: {},
      firstLoading: true,
      loading: false,
      breadcrumbList: [],
      organizationTreeList: {},
      defaultProps: {
        children: "null"
      },
    }
  },
  watch: {
    defaultCheckedKeys(val) {
      this.$refs.userTree.setCheckedKeys(val)
    },
    successOrgId(val) {
      let orgList = this.breadcrumbList[this.breadcrumbList.length - 1].orgList;
      for (let i = 0; i < orgList.length; i++) {
        const org = orgList[i];
        if (org.id == val) {
          org.imGroupId = this.$store.state.createOfficeGroupDialog.successGroupId;
        }
      }
      this.breadcrumbList[this.breadcrumbList.length - 1].orgList = orgList;
    }
  },
  computed: {
    successOrgId() {
      return this.$store.state.createOfficeGroupDialog.successOrgId;
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.$refs["elMain"].$el.onscroll = () => {
      this.scrollTop = this.$refs["elMain"].$el.scrollTop;
    }
  },
  methods: {
    loadData(id) {
      if (!this.firstLoading) {
        this.loading = true;
      }
      platformOrganizationApi.queryPersonnelOrgTreeForIm(id, false, false).then(
        res => {
          if (!id) {
            this.organization = res.data;
          }
          let breadcrumb = {
            contactsList: [],
            orgList: [],
            data: res.data,
            scrollTop: 0
          }
          let childrenList = res.data.children;
          if (childrenList) {
            for (let i = 0; i < childrenList.length; i++) {
              const children = childrenList[i];
              let imId = children.imId;
              if (!children.children && imId) {
                // 设置是否禁用
                if (this.unOrganizationTreeCheckKeyMap.has(imId)) {
                  children.disabled = true;
                }
                // 设置图片路径
                children.headPortrait = children.icon;
                // 设置考勤状态
                breadcrumb.contactsList.push(children)
              }
              else {
                breadcrumb.orgList.push(children)
              }
            }
          }
          this.breadcrumbList.push(breadcrumb);
          this.$nextTick(() => {
            this.loading = false;
            this.firstLoading = false;
          })
        }
      ).catch(
        err => {
          console.error(err)
        }
      );
    },
    headerClick() {
      this.$emit("headerClick")
    },
    /** 组织树的点击事件 */
    orgTreeNodeClick(data, node, el) {
      this.loading = true;
      this.$nextTick(() => {
        this.breadcrumbList[this.breadcrumbList.length - 1].scrollTop = this.scrollTop;
        this.$refs["elMain"].$el.scrollTop = 0;
        // 分类文件夹
        if (!data.type) {
          // 渲染结束后
          this.breadcrumbList.push({
            contactsList: [],
            orgList: data.children,
            data: data,
            scrollTop: 0
          });
          this.$nextTick(() => {
            this.loading = false;
          })
        }
        // 组织
        else if (data.type == "org") {
          this.loadData(data.id);
        }
      })
    },
    /** 面包屑点击事件 */
    breadcrumbClick(item, index) {
      let scrollTop = item.scrollTop;
      this.loading = true;
      this.$nextTick(function () {
        this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);
        this.loading = false;
        this.$nextTick(() => {
          this.$refs["elMain"].$el.scrollTop = scrollTop;
        })
      });
    },
    /** 人员选中事件 */
    treeCheck(node, a) {
      this.$emit("imCheck", node);
    },
    /** 人员点击事件 */
    treeClick(node, a) {
      this.$emit("imClick", node);
    },
    openCreateOfficeGroupDialog(id) {
      event.stopPropagation();
      this.$store.dispatch("openCreateOfficeGroupDialog", id)
    }
  }
};
</script>

<style scoped>
#OrganizationTree .isAddressBookHeader {
  width: 100%;
  height: 44px;
  padding: calc((53px - 44px) / 2) 0;
  border-bottom: 1px solid #e6eaea;
}
#OrganizationTree {
  height: 100%;
}
#OrganizationTree >>> .el-button {
  float: right;
  padding: 4px 8px;
  margin-right: 10px;
  border-color: #0b4d8a !important;
  color: #0b4d8a;
}
#OrganizationTree >>> .el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: white !important;
  background-color: #0b4d8a;
}
#OrganizationTree >>> #ImHeadPortrait {
  margin: 0px 0px 0px 5px !important;
}
#OrganizationTree .header {
  border-bottom: 1px solid #e6eaea;
  font-size: 14px;
  padding: 10px 10px;
  cursor: pointer;
}
#OrganizationTree .header:hover {
  background-color: #e6eaea;
}
#OrganizationTree >>> .el-container {
  width: 100%;
}
#OrganizationTree >>> .el-header {
  height: auto !important;
  font-size: 12px;
  padding: 7px 23px;
  border-bottom: 1px solid #e6eaea;
}
#OrganizationTree >>> .el-main {
  padding: 0px;
  width: calc(100% - 3px);
  overflow-x: hidden;
}
#OrganizationTree >>> .el-checkbox {
  margin-left: 5px;
}

/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#OrganizationTree >>> .el-tree {
  background-color: white;
}
/* tree hover事件样式 */
#OrganizationTree >>> .el-tree-node__content:hover {
  background-color: #e7e7e7;
}
/* tree 隐藏图标 */
#OrganizationTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#OrganizationTree >>> .el-tree-node__content {
  height: 65px;
  cursor: default;
}
/* tree 选中样式 */
/* #OrganizationTree
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #f5f5f5;
} */
#OrganizationTree .splitLine {
  border-bottom: 1px solid #e6eaea;
  width: calc(100% - 82px);
  float: right;
}
#OrganizationTree .orgTree {
  width: calc(100% - 48px);
  padding: 21px 0;
  padding-left: 48px;
  float: left;
}
</style>


