<template>
  <span
    id="NodeText"
    :style="'float:'+float+';maxWidth:'+maxWidth+';margin:'+margin+';fontSize:'+fontSize+';cursor: '+cursor+';color:'+color"
    v-html="formatStrToHtml()"
    @click="imClick"
  ></span>
</template>

<script>

export default {
  props: {
    cursor:{
      type: String,
      default: "default"
    },
    text: {
      type: String,
      default: ""
    },
    highlightStr: {
      type: String,
      default: ""
    },
    float: {
      type: String,
      default: "left"
    },
    maxWidth: {
      type: String,
      default: "56px"
    },
    margin: {
      type: String,
      default: "0 0 0 10px"
    },
    fontSize: {
      type: String,
      default: "14px"
    },
    color: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
    formatStrToHtml() {
      if (this.highlightStr) {
        return this.text.replace(new RegExp(this.highlightStr, "gm"), '<span style="color: #42638c;font-weight: bolder;">' + this.highlightStr + '</span>')
      } else {
        return this.text;
      }
    },
    imClick() {
      this.$emit("imClick")
    }
  }
};
</script>

<style scoped>
#NodeText {
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>


