<template>
  <div id="SearchContactUserInput">
    <el-autocomplete
      class="inline-input"
      v-model="inputStr"
      :fetch-suggestions="querySearch"
      placeholder="搜索"
      :trigger-on-focus="false"
      @select="handleSelect"
    >
      <template slot-scope="{ item }">
        <UserInfoNode
          :user-info="item"
          :businessTypeIsShow="true"
          height="64px"
          head-portrait-width="44px"
          name-font-size="14px"
          :highlight-str="inputStr"
        />
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import UserInfoNode from "./UserInfoNode"

import businessUserUtils from '../utils/businessUserUtils';
import openApiUserUtils from '../utils/openApiUserUtils';
export default {
  components: {
    UserInfoNode
  },
  props: {
    unCheckKeyMap: {
      type: Map,
      default: () => { return new Map() }
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => { return [] }
    },

  },
  data() {
    return {
      inputStr: ""
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    querySearch(queryString, cb) {
      let results = [];
      let defaultCheckedKeyMap = new Map();
      for (let i = 0; i < this.defaultCheckedKeys.length; i++) {
        const imUid = this.defaultCheckedKeys[i];
        defaultCheckedKeyMap.set(imUid, imUid)
      }
      if (queryString) {
        let businessUserMap = businessUserUtils.getAll();
        for (let businessUser of businessUserMap) {
          let imUid = businessUser[0];
          let user = businessUser[1];
          let index = openApiUserUtils.getNameByUser(user).toLowerCase().indexOf(queryString.toLowerCase())
          if (index != -1 && !this.unCheckKeyMap.get(imUid) && !defaultCheckedKeyMap.get(imUid)) {
            results.push(user);
          }
        }
      }
      cb(results);
    },
    handleSelect(item) {
      this.$emit("handleSelect", item)
    }
  }
};
</script>

<style scoped>
#SearchContactUserInput {
  float: left;
}
#SearchContactUserInput >>> .el-input__inner {
  height: 32px;
  margin: 5px;
  padding: 0px;
  border: 0px solid #dcdfe6;
}
#SearchContactUserInput >>> .el-input {
  max-width: 80px;
}
</style>


