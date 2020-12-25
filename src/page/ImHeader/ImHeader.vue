<template>
  <div id="ImHeader">
    <!-- 按钮 -->
    <HeaderButton
      v-for="(buttonConfig,index) in buttonConfigArray"
      :key="index"
      :name="buttonConfig.name"
      :code="buttonConfig.code"
      :un-active-url="buttonConfig.unActiveUrl"
      :active-url="buttonConfig.activeUrl"
      @imClick="buttonConfig.onlick"
    />
    <HeaderSearch />
    <HeaderLinkStatus />
  </div>
</template>

<script>
import HeaderButton from "./components/HeaderButton"
import HeaderSearch from "./components/HeaderSearch/HeaderSearch"
import HeaderLinkStatus from "./components/HeaderLinkStatus"
import platformGroupApi from '../../js/sdk/api/platformGroupApi';
export default {
  components: {
    HeaderButton,
    HeaderSearch,
    HeaderLinkStatus
  },
  data() {
    return {
      buttonConfigArray: [
        {
          name: "通讯录",
          code: "addressBook",
          unActiveUrl: "/static/icon/tongxunlu_icon.png",
          activeUrl: "/static/icon/tongxunlui_dangqian.png",
          onlick: () => { }
        },
        {
          name: "会话",
          code: "session",
          unActiveUrl: "/static/icon/huihua_moren.png",
          activeUrl: "/static/icon/huihua_dangqian.png",
          onlick: () => { }
        },
        {
          name: "创建群组",
          code: "",
          unActiveUrl: "/static/icon/qunlaio_moren.png",
          activeUrl: "",
          onlick: () => {
            this.$store.dispatch("openCreateGroupUserDialog");
          }
        }
      ]
    };
  },
  created() {

  },
  methods: {

  }
};
</script>

<style scoped>
#ImHeader {
  width: 100%;
  height: 53px;
  border-bottom: 1px solid #e6eaea;
}
</style>
