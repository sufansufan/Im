<template>
  <div id="ContactsBookTree" v-loading="loading">
    <el-tree
      :data="treeData"
      node-key="id"
      @node-click="treeNodeClick"
      empty-text=" "
      :highlight-current="highlightCurrent"
    >
      <span slot-scope="{ node, data }" style="width:100%;height:100%;">
        <ContactsBookTreeMyGroupNode
          v-if="data.id == 'myGroup'"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
        <ContactsBookTreeFrequentContactsNode
          v-if="data.id == 'frequentContacts'"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
        <ContactsBookTreeOrganizationNode
          v-if="data.id == 'organization'"
          :organization="data.data"
          :isAddressBook="isAddressBook"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
        />
      </span>
    </el-tree>
  </div>
</template>

<script>
import ContactsBookTreeMyGroupNode from "./ContactsBookTreeMyGroupNode"
import ContactsBookTreeFrequentContactsNode from "./ContactsBookTreeFrequentContactsNode"
import ContactsBookTreeOrganizationNode from "./ContactsBookTreeOrganizationNode"
import platformOrganizationApi from '../js/sdk/api/platformOrganizationApi'
export default {
  components: {
    ContactsBookTreeMyGroupNode,
    ContactsBookTreeFrequentContactsNode,
    ContactsBookTreeOrganizationNode
  },
  props: {
    contactsBookTreeNode: {
      type: Array,
      default: () => ['myGroup', 'frequentContacts', 'organization']
    },
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    isAddressBook: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.loading = true;
    let isHaveOrganization = false;
    for (let i = 0; i < this.contactsBookTreeNode.length; i++) {
      const nodeName = this.contactsBookTreeNode[i];
      switch (nodeName) {
        case "myGroup":
        case "frequentContacts": {
          this.treeData.push({ id: nodeName })
          break;
        }
        case "organization": {
          platformOrganizationApi.queryPersonnelOrgTreeForIm("", false, false).then(
            res => {
              let organization = res.data;
              this.treeData.push({ id: nodeName, data: organization })
              this.loading = false;
            }
          ).catch(
            err => {
              console.error(err)
              this.loading = false;
            }
          );
          break;
        }
      }
    }
    if (!isHaveOrganization) {
      this.loading = false;
    }
  },
  methods: {
    treeNodeClick(data, node, el) {
      this.$emit("imClick", data.id);
    }
  }
};
</script>

<style scoped>
#ContactsBookTree {
}
/* ******************************************** */
/* ************     tree 样式         ********* */
/* ******************************************** */
/* tree 整体样式 */
#ContactsBookTree >>> .el-tree {
  background-color: white;
}
/* tree hover事件样式 */
#ContactsBookTree >>> .el-tree-node__content:hover {
  background-color: #e7e7e7;
}
/* tree 隐藏图标 */
#ContactsBookTree >>> .el-tree-node__expand-icon.is-leaf {
  display: none;
}
/* tree 节点样式 */
#ContactsBookTree >>> .el-tree-node__content {
  height: 64px;
  border-bottom: 1px solid #e6eaea;
  cursor: default;
}
/* tree 选中样式 */
#ContactsBookTree
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #f5f5f5;
}
</style>


