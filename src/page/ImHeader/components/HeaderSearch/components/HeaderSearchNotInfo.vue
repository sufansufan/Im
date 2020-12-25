<template>
  <div id="HeaderSearchNotInfo">
    <div>
      <img class="notInfoImg" src="/static/icon/sousuo_beijing.png" />
      <p style="text-align: center;">
        <span style="color:#999;">{{text}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderSearchContactUserTree from "./HeaderSearchContactUserTree"

export default {
  components: {
    HeaderSearchContactUserTree
  },
  props: {
    text: {
      type: String,
      default: "按键盘 Tab 快速切换分类"
    }
  },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {

  }
};
</script>

<style scoped>
#HeaderSearchNotInfo .notInfoImg {
  padding: 90px 0px 20px 65px;
  width: 110px;
  height: 118px;
}
</style>


