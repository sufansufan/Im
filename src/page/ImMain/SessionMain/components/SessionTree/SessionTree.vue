<template>
  <div id="SessionTree">
    <el-tree
      :data="sessions"
      node-key="sessionId"
      highlight-current
      empty-text="暂无会话"
      ref="sessioneElTree"
      @node-contextmenu="treeNodeContextMenu"
      @node-click="treeNodeClick"
    >
      <span
        slot-scope="{ node, data }"
        style="width:100%;height:100%"
        :id="'sessionTree_'+data.sessionId"
      >
        <SingleSessionTreeNode
          v-if="data.groupType == ConstantType.GroupType.SINGLE"
          :user-info="openApiUserUtils.getOneByImUid(data.msgTo)"
          :session="data"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
        <GroupSessionTreeNode
          v-if="data.groupType == ConstantType.GroupType.GROUP"
          :session="data"
          :group-info="groupUtils.getOneByGroupId(data.msgTo)"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
        <PlatformSessionTreeNode
          v-if="data.groupType == ConstantType.GroupType.PLATFORM"
          :session="data"
          :platform-info="publicAccountUtils.getOneByImUid(data.msgFrom)"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
      </span>
    </el-tree>
    <ul
      id="treeContextMenu"
      v-show="treeContextMenuVisible"
      :style="{left:treeContextMenu.left+'px',top:treeContextMenu.top+'px'}"
      class="contextmenu"
    >
      <li @click="deleteSessionById(treeContextMenu.treeNodeData.sessionId)">删除</li>
      <li
        v-if="treeContextMenu.treeNodeData.groupType == ConstantType.GroupType.GROUP"
        @click="settingGroup()"
      >群设置</li>
    </ul>
  </div>
</template>

<script>
import ResizeCacheChange from "../../../../../Resize/ResizeCacheChange"
import ResizeSessionChange from "../../../../../Resize/ResizeSessionChange"

import SessionsController from '../../../../../js/sdk/service/SessionsController';

import publicAccountUtils from '../../../../../utils/publicAccountUtils';
import groupUtils from '../../../../../utils/groupUtils';
import ConstantType from '../../../../../js/sdk/constant/ConstantType';
import sessionUtils from '../../../../../utils/sessionUtils';
import cacheUtils from '../../../../../utils/cacheUtils';

import SingleSessionTreeNode from './components/SingleSessionTreeNode';
import GroupSessionTreeNode from './components/GroupSessionTreeNode';
import PlatformSessionTreeNode from './components/PlatformSessionTreeNode';
import urlUtils from '../../../../../utils/urlUtils';
import Client from '../../../../../js/sdk/client';
import openApiUserUtils from '../../../../../utils/openApiUserUtils';

export default {
  mixins: [ResizeCacheChange, ResizeSessionChange],
  components: {
    SingleSessionTreeNode,
    GroupSessionTreeNode,
    PlatformSessionTreeNode
  },
  computed: {
    treeContextMenuVisible() {
      return this.$store.state.session.treeContextMenuVisible;
    }
  },
  data() {
    return {
      sessions: [],

      treeContextMenu: {
        top: 0,
        left: 0,
        treeNodeData: {}
      },
      openApiUserUtils: openApiUserUtils,
      groupUtils: groupUtils,
      publicAccountUtils: publicAccountUtils,
      ConstantType: ConstantType
    };
  },
  methods: {
    loadDataForCacheChange() {
      this.loadData();
    },
    loadDataForSessionChange() {
      this.loadData();
    },
    loadData() {
      this.$nextTick(() => {
        this.sessions = sessionUtils.getAll();
        this.$nextTick(() => {
          for (let i = 0; i < this.sessions.length; i++) {
            const session = this.sessions[i];
            if (session.state == ConstantType.PassthroughMsgConstant.PASSTHROUGH_CREATE_GROUP) {
              if (groupUtils.isOwner(openApiUserUtils.getMe().imUid, session.msgTo)) {
                this.$store.dispatch("setSessionId", session.sessionId);
                SessionsController.getInstance().updateState(session.sessionId, "");
                break;
              }
            }
          }
          this.$refs.sessioneElTree.setCurrentKey(this.sessionId); // 回选
          sessionUtils.detectSession(sessionUtils.getOneBySessionId(this.sessionId));
          if (document.getElementById("sessionTree_" + this.sessionId)) {
            let sessionTreeDom = document.getElementById("SessionTree");
            let sessionTreeDomClientRectTop = sessionTreeDom.getBoundingClientRect().top;
            let sessionTreeDomClientRectHeight = document.getElementById("SessionTree").getBoundingClientRect().height
            let sessionTreeNodeDom = document.getElementById("sessionTree_" + this.sessionId);
            let sessionTreeNodeDomClientRectTop = sessionTreeNodeDom.getBoundingClientRect().top;
            let domTop = sessionTreeNodeDomClientRectTop - sessionTreeDomClientRectTop;
            if (domTop > sessionTreeDomClientRectHeight || 0 > domTop ) {
              $('#SessionTree').animate({ scrollTop: sessionTreeDom.scrollTop - (55 - sessionTreeNodeDom.getBoundingClientRect().top) + 'px' }, 500)
            }
          }
        });
      })
    },
    /** 树的点击事件 */
    treeNodeClick(data, node, el) {
      console.log(data)
      this.$store.dispatch("setSessionId", data.sessionId); // 记录当前选择的会话
    },
    /** 右键菜单显隐 */
    treeNodeContextMenu(event, data, node, el) {
      this.treeContextMenu.treeNodeData = data; // 缓存数据
      this.treeContextMenu.left = event.clientX; // 设置右键菜单显示位置
      this.treeContextMenu.top = event.clientY; // 设置右键菜单显示位置
      this.$store.dispatch("setSessionTreeContextMenuVisible", true); // 显示右键菜单
    },
    deleteSessionById(sessionId) {
      if (sessionId == this.sessionId) {
        this.$store.dispatch("setSessionId", -1);
      }
      this.$store.dispatch("deleteDraftMessage", sessionId);
      SessionsController.getInstance().deleteSession(sessionId);
    },
    /** 群设置 */
    settingGroup() {
      this.$store.dispatch("setSessionId", this.treeContextMenu.treeNodeData.sessionId); // 跳转会话
      if (
        groupUtils.getOneByGroupId(this.treeContextMenu.treeNodeData.msgTo).type == ConstantType.GroupTypeConstant.Group_COMMON
      ) {
        this.$store.dispatch("openGroupSettingDrawer");
      } else {
        this.$store.dispatch("openOfficeGroupSettingDrawer");
      }
    }
  }
};
</script>

<style scoped>
#SessionTree {
  height: 100%;
  width: 249px;
  float: left;
  border-right: 1px solid #e6eaea;
  overflow-y: auto;
}

/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#SessionTree >>> .el-tree {
  background-color: white;
}
/* tree hover事件样式 */
#SessionTree >>> .el-tree-node__content:hover {
  background-color: #f5f5f5;
}
/* tree 隐藏图标 */
#SessionTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#SessionTree >>> .el-tree-node__content {
  height: 64px;
  border-bottom: 1px solid #e6eaea;
  cursor: default;
}
/* tree 选中样式 */
#SessionTree
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #f5f5f5;
}
</style>
