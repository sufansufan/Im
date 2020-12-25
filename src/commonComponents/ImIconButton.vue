<template>
  <el-tooltip effect="dark" :content="name" placement="bottom-start">
    <div id="ImIconButton" @click="onClick" :style="'margin:'+margin">
      <div class="imgDiv">
        <img class="img" :src="url" />
      </div>
    </div>
  </el-tooltip>
</template>

<script>

export default {
  props: {
    url: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    margin: {
      type: String,
      default: "0px 8px 0px 8px"
    }
  },
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
    onClick() {
      this.$emit("imClick")
    }
  }
};
</script>

<style scoped>
#ImIconButton {
  float: right;
  padding: 5px 5px;
  cursor: pointer;
}

#ImIconButton:hover {
  background-color: #e6eaea;
  border-radius: 5px;
}

#ImIconButton .imgDiv {
  width: 22px;
  height: 22px;
}

#ImIconButton .imgDiv .img {
  width: 22px;
  height: 22px;
}
</style>
