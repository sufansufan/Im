<template>
  <span
    id="UnReadNum"
    :style="'width:'+ width +';float:'+float+';margin:'+margin+';fontSize:'+fontSize+';color:'+color"
  >{{showNum}}</span>
</template>

<script>

export default {
  props: {
    num: {
      type: String | Number,
      default: ""
    },
    float: {
      type: String,
      default: "left"
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
      default: "white"
    }
  },
  data() {
    return {
      url: "",
      width: "",
      showNum: ""
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    this.getUrl()
  },
  methods: {
    getUrl() {
      if (this.num <= 9) {
        this.width = '17px';
        this.showNum = this.num;
      } else if (9 < this.num && this.num <= 99) {
        this.width = '26px';
        this.showNum = this.num;
      } else if (99 < this.num) {
        this.width = '30px';
        this.showNum = "99+";
      }
    }
  }
};
</script>

<style scoped>
#UnReadNum {
  width: 17px;
  height: 17px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;
  transform: scale(0.75);
  background-color: red;
  border-radius: 18px;
}
</style>


