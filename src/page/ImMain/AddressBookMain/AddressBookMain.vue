<template>
  <div id="AddressBookMain">
    <ContactsBookTree
      :contactsBookTreeNode="['myGroup','organization']"
      :isAddressBook="true"
      :highlightCurrent="true"
      @imClick="contactsBookTreeClick"
    />
    <div id="viewMain">
      <DefaultMessageMain v-if="!active" />
      <OrganizationTree
        v-if="active == 'organization'"
        :isAddressBook="true"
        @imClick="organizationTreeClick"
      />
      <MyGroupTree
        v-if="active == 'myGroup'"
        :isAddressBook="true"
        @imClick="myGroupTreeClick"
        @headerClick="active = 'ContactsBookTree'"
      />
    </div>
  </div>
</template>

<script>
import ContactsBookTree from "../../../commonComponents/ContactsBookTree"
import OrganizationTree from "../../../commonComponents/OrganizationTree"
import MyGroupTree from "../../../commonComponents/MyGroupTree"
import DefaultMessageMain from "../../ImMain/SessionMain/components/MessageMain/components/DefaultMessageMain"
import openApiUserUtils from '../../../utils/openApiUserUtils'
import SessionsController from '../../../js/sdk/service/SessionsController'

export default {
  components: {
    ContactsBookTree,
    DefaultMessageMain,
    OrganizationTree,
    MyGroupTree
  },
  data() {
    return {
      active: ""
    };
  },
  computed: {

  },
  methods: {
    contactsBookTreeClick(active) {
      this.active = active;
    },
    organizationTreeClick(node) {
      this.$store.dispatch('openUserInfoDialog', node.imId);
    },
    myGroupTreeClick(node) {
      SessionsController.getInstance().createSession(
        openApiUserUtils.getMe().imUid,
        node.groupId + "",
        1
      );
      this.$store.dispatch("setSessionId", node.groupId + "1");
      this.$store.dispatch("closeUserInfoDialog");
      this.$store.dispatch("setHeaderButtonActive", "session");
    }
  }
};
</script>

<style scoped>
#AddressBookMain {
  height: calc(100% - 54px);
}
#AddressBookMain >>> #ContactsBookTree {
  height: 100%;
  width: 249px;
  float: left;
  border-right: 1px solid #e6eaea;
  overflow-y: auto;
}
#AddressBookMain #viewMain {
  width: calc(100% - 250px);
  float: right;
  height: 100%;
  background-color: #f5f5f5;
}
#AddressBookMain >>> .el-checkbox {
  visibility: hidden;
}
#AddressBookMain >>> #OrganizationTree .el-tree {
  background-color: whitesmoke;
}
#AddressBookMain >>> #MyGroupTree .el-tree {
  background-color: whitesmoke;
}
</style>
