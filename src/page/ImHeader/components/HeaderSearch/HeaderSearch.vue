<template>
  <div id="HeaderSearch">
    <el-popover
      placement="bottom-start"
      width="250"
      trigger="manual"
      v-model="searchVisible"
      popper-class="HeaderSearch-Popover"
    >
      <el-input
        class="searchInput"
        prefix-icon="el-icon-search"
        placeholder="搜索联系人、群组"
        slot="reference"
        v-model="searchInputText"
        clearable
        @click.native="openHeaderSearch"
      ></el-input>
      <div class="HeaderSearchPopoverButton">
        <div :class="buttonIsActive(1)" @click="activeButtonName=1">联系人</div>
        <div :class="buttonIsActive(2)" @click="activeButtonName=2">群组</div>
      </div>
      <div class="HeaderSearchPopoverView">
        <HeaderSearchNotInfo v-if="!searchInputText" text="按键盘 Tab 快速切换分类" />
        <HeaderSearchContactUserTree
          v-show="activeButtonName==1"
          :searchInputText="searchInputText"
        />
        <HeaderSearchGroupTree v-show="activeButtonName==2" :searchInputText="searchInputText" />
      </div>
    </el-popover>
  </div>
</template>

<script>
import HeaderSearchContactUserTree from "./components/HeaderSearchContactUserTree"
import HeaderSearchGroupTree from "./components/HeaderSearchGroupTree"
import HeaderSearchNotInfo from "./components/HeaderSearchNotInfo"

export default {
  components: {
    HeaderSearchNotInfo,
    HeaderSearchGroupTree,
    HeaderSearchContactUserTree
  },
  data() {
    return {
      searchInputText: "",
      activeButtonName: "1"
    };
  },
  computed: {
    searchVisible: {
      get() {
        return this.$store.state.headerStore.headerSearchVisible;
      },
      set(val) {
        this.$store.dispatch("setHeaderSearchVisible", val);
      }
    }
  },
  watch: {

  },
  created() {
    document.onkeydown = e => {
      var key = window.event.keyCode;
      if (key == 9 && this.$store.state.headerStore.headerSearchVisible && this.activeButtonName) {
        this.activeButtonName = this.activeButtonName == "1" ? "2" : "1";
        return false;
      }
    };
  },
  methods: {
    openHeaderSearch(event) {
      event.stopPropagation();
      this.$store.dispatch("setHeaderSearchVisible", true);
    },
    buttonIsActive(buttonName) {
      if (this.activeButtonName == buttonName) {
        return "HeaderSearchPopoverButtonColor HeaderSearchPopoverButtonDiv"
      }
      return "HeaderSearchPopoverButtonDiv"
    }
  }
};
</script>

<style scoped>
#HeaderSearch {
  padding-top: 10px;
  width: 230px;
  float: left;
  margin-left: 10px;
}
#HeaderSearch .searchInput {
  background-color: #f5f5f5;
  border-radius: 15px;
}

#HeaderSearch >>> .el-input__inner {
  border: 1px solid #dcdfe600;
  background-color: #f5f5f5;
  height: 30px;
}

#HeaderSearch >>> .el-input__icon {
  line-height: 30px;
}
</style>
<style>
.HeaderSearch-Popover {
  height: 460px;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}
.HeaderSearch-Popover .HeaderSearchPopoverButton {
  height: 40px;
  border-bottom: 1px solid #e6eaea;
}
.HeaderSearchPopoverButtonDiv {
  margin-left: 20px;
  font-size: 12px;
  padding-top: 14px;
  float: left;
  cursor: pointer;
}
.HeaderSearchPopoverButtonColor {
  color: #0a4c8b;
}
.HeaderSearchPopoverButtonDiv:hover {
  color: #6a86ac;
}
.HeaderSearchPopoverView {
  width: 100%;
  height: calc(100% - 41px);
  background-color: #f5f5f5;
}
</style>


