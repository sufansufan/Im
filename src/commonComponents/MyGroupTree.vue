<template>
  <div id="MyGroupTree">
    <div class="header" @click="headerClick" v-if="!isAddressBook">
      <i class="el-icon-arrow-left">我的群组({{groupList.length}}个)</i>
    </div>
    <div class="isAddressBookHeader" v-if="isAddressBook">
      <ImHeadPortrait
        :url-list="['/static/icon/02应用图标—icon/qunzu_icon.png']"
        width="44px"
        float="left"
        margin="0 0 0 10px"
      />
      <!-- 第一行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText text="我的群组" color="#333" margin="2px 0px 0px 10px;" />
      </div>
      <!-- 第二行显示 -->
      <div style="width: 100%; height: 50%;">
        <NodeText
          :text="'('+ groupList.length +'个)'"
          :fontSize="'calc(14px - 2px)'"
          :margin="'calc((44px / 2) - 14px - 4px - 2px) 0px 0px 10px;'"
        />
      </div>
    </div>
    <el-container :style="'height: calc(100% - '+(isAddressBook?'53px':'39px')+');'">
      <el-main ref="elMain">
        <div>
          <el-tree
            ref="groupTree"
            empty-text="暂无群组"
            show-checkbox
            node-key="groupId"
            :props="defaultProps"
            :data="groupList"
            :defaultCheckedKeys="defaultCheckedKeys"
            @node-click="treeClick"
            @check="treeCheck"
          >
            <span slot-scope="{ node, data }" style="width: calc(100% - 22px);height:100%;">
              <GroupNode
                :group-info="data"
                height="64px"
                head-portrait-width="44px"
                name-font-size="14px"
              />
            </span>
          </el-tree>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import groupUtils from '../utils/groupUtils';
import GroupNode from '../commonComponents/GroupNode';
import NodeText from '../commonComponents/NodeText';
import ImHeadPortrait from '../commonComponents/ImHeadPortrait';


export default {
  components: {
    GroupNode,
    NodeText,
    ImHeadPortrait
  },
  props: {
    defaultCheckedKeys: {
      type: Array,
      default: () => { return [] }
    },
    isAddressBook: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultProps: {
        children: "null"
      },
      groupList: []
    }
  },
  watch: {
    defaultCheckedKeys(val) {
      this.$refs.groupTree.setCheckedKeys(val)
    }
  },
  computed: {

  },
  created() {
    this.loadData();
  },
  mounted() {

  },
  methods: {
    loadData() {
      let groupList = [];
      let groupMap = groupUtils.getAll();
      for (let groupInfo of groupMap) {
        let groupId = groupInfo[0];
        let group = groupInfo[1];
        groupList.push(group)
      }
      this.groupList = groupList;
    },
    headerClick() {
      this.$emit("headerClick")
    },
    treeCheck(node, a) {
      this.$emit("imCheck", node);
    },
    treeClick(node, a) {
      this.$emit("imClick", node);
    },
  }
};
</script>

<style scoped>
#MyGroupTree {
  height: 100%;
}
#MyGroupTree .isAddressBookHeader {
  width: 100%;
  height: 44px;
  padding: calc((53px - 44px) / 2) 0;
  border-bottom: 1px solid #e6eaea;
}

#MyGroupTree >>> .el-main #ImHeadPortrait {
  margin: 0px 0px 0px 5px !important;
}
#MyGroupTree .header {
  border-bottom: 1px solid #e6eaea;
  font-size: 14px;
  padding: 10px 10px;
  cursor: pointer;
}
#MyGroupTree .header:hover {
  background-color: #e6eaea;
}
#MyGroupTree >>> .el-container {
  width: 100%;
}
#MyGroupTree >>> .el-header {
  height: auto !important;
  font-size: 12px;
  padding: 7px 23px;
  border-bottom: 1px solid #e6eaea;
}
#MyGroupTree >>> .el-main {
  padding: 0px;
  width: calc(100% - 3px);
}
#MyGroupTree >>> .el-checkbox {
  margin-left: 5px;
}

/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#MyGroupTree >>> .el-tree {
  background-color: white;
}
/* tree hover事件样式 */
#MyGroupTree >>> .el-tree-node__content:hover {
  background-color: #e7e7e7;
}
/* tree 隐藏图标 */
#MyGroupTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#MyGroupTree >>> .el-tree-node__content {
  height: 65px;
  cursor: default;
}
/* tree 选中样式 */
/* #MyGroupTree
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #f5f5f5;
} */
#MyGroupTree .splitLine {
  border-bottom: 1px solid #e6eaea;
  width: calc(100% - 82px);
  float: right;
}
#MyGroupTree .orgTree {
  width: calc(100% - 48px);
  padding: 21px 0;
  padding-left: 48px;
  float: left;
}
</style>


