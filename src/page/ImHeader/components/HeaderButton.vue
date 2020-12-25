<template>
  <el-tooltip effect="dark" :content="name" placement="top-start">
    <div id="HeaderButton" @click="onClick">
      <div class="imgDiv">
        <img class="img" v-if="activeCode != code" :src="unActiveUrl" />
        <img class="img" v-if="activeCode == code" :src="activeUrl" />
      </div>
    </div>
  </el-tooltip>
</template>

<script>

export default {
  props: {
    code: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    unActiveUrl: {
      type: String,
      default: ""
    },
    activeUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {

    };
  },
  computed: {
    activeCode() {
      return this.$store.state.headerStore.headerButtonActive;
    }
  },
  methods: {
    onClick() {
      this.$emit("imClick")
      if (this.code) {
        this.$store.dispatch("setHeaderButtonActive", this.code);
      }
    }
  }
};
</script>

<style scoped>
#HeaderButton {
  float: right;
  padding: 5px 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 8px;
  margin-left: 8px;
}

#HeaderButton:hover {
  background-color: #e6eaea;
  border-radius: 5px;
}

#HeaderButton .imgDiv {
  width: 22px;
  height: 22px;
}

#HeaderButton .imgDiv .img {
  width: 22px;
  height: 22px;
}
</style>
