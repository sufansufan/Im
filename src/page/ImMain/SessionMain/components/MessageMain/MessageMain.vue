<template>
  <div id="MessageMain">
    <DefaultMessageMain v-if="sessionId == -1" />
    <GroupMessageMain v-if="sessionId != -1 && session.groupType == ConstantType.GroupType.GROUP && isShow" />
    <SingleMessageMain v-if="sessionId != -1 && session.groupType == ConstantType.GroupType.SINGLE && isShow" />
    <PlatformMessageMain v-if="sessionId != -1 && session.groupType == ConstantType.GroupType.PLATFORM && isShow" />
  </div>
</template>

<script>
import ResizeCacheChange from '../../../../../Resize/ResizeCacheChange';
import ResizeSessionChange from '../../../../../Resize/ResizeSessionChange';

import DefaultMessageMain from "./components/DefaultMessageMain"
import GroupMessageMain from "./components/GroupMessageMain"
import SingleMessageMain from "./components/SingleMessageMain"
import PlatformMessageMain from "./components/PlatformMessageMain"


import sessionUtils from '../../../../../utils/sessionUtils';
import ConstantType from '../../../../../js/sdk/constant/ConstantType';
export default {
  mixins: [ResizeCacheChange, ResizeSessionChange],
  components: {
    DefaultMessageMain,
    GroupMessageMain,
    SingleMessageMain,
    PlatformMessageMain
  },
  computed: {

  },
  data() {
    return {
      session: {},
      isShow: true,
      ConstantType
    };
  },
  methods: {
    loadDataForCacheChange() {
      this.loadData();
    },
    loadDataForSessionChange() {
      this.isShow = false;
      this.$nextTick(() => {
        this.isShow = true;
        this.loadData();
      })
    },
    loadData() {
      let session = sessionUtils.getOneBySessionId(this.sessionId);
      if (session) {
        this.session = session;
      }
    }
  }
};
</script>

<style scoped>
#MessageMain {
  width: calc(100% - 250px);
  float: right;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
