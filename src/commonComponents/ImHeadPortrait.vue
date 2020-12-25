<template>
  <div
    id="ImHeadPortrait"
    :style="'width:'+width+';height:'+width+';float:'+float+';margin:'+margin+';background-color: #cccccc; overflow: hidden; border-radius: 5px;'+(imUid?'cursor: pointer;':'')"
    @click="imClick"
  >
    <div v-if="urlList.length==1">
      <img
        v-for="(url,index) in urlList"
        :key="index"
        :src="url"
        :style="'width:'+width+';height:'+width+';float:'+float"
        @error="onError"
      />
      <!-- <el-image
        v-for="(url,index) in urlList"
        :key="index"
        :src="url"
        :style="'width:'+width+';height:'+width+';float:'+float"
      >
        <div slot="error">
          <img :style="'width:'+width+';height:'+width" :src="errorUrl" />
        </div>
        <div slot="placeholder">
          <img :style="'width:'+width+';height:'+width" :src="defaultUrl" />
        </div>
      </el-image>-->
    </div>

    <div v-if="urlList.length==2">
      <el-image
        v-for="(url,index) in urlList"
        :key="index"
        :src="url"
        :style="'padding: 1px;width:calc('+ width +'/ 2 - 2px);height:calc('+width+' - 2px);float:'+float"
        fit="cover"
      >
        <div slot="error">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);position: relative; right: calc(100% / 2);height:calc('+width+' - 2px)'"
            :src="errorUrl"
          />
        </div>
        <div slot="placeholder">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);position: relative; right: calc(100% / 2);height:calc('+width+' - 2px)'"
            :src="defaultUrl"
          />
        </div>
      </el-image>
    </div>

    <div v-if="urlList.length==3">
      <el-image
        v-for="(url,index) in urlList"
        :key="index"
        v-if="index==0"
        :src="url"
        :style="'padding: 1px;width:calc('+ width +'/ 2 - 2px);height:calc('+width+' - 2px);float:'+float"
        fit="cover"
      >
        <div slot="error">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);position: relative; right: calc(100% / 2);height:height:calc('+width+' - 2px)'"
            :src="errorUrl"
          />
        </div>
        <div slot="placeholder">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);position: relative; right: calc(100% / 2);height:height:calc('+width+' - 2px)'"
            :src="defaultUrl"
          />
        </div>
      </el-image>
      <el-image
        v-for="(url,index) in urlList"
        :key="index"
        v-if="index>0"
        :src="url"
        :style="'padding: 1px;width:calc('+ width +'/ 2 - 2px);height:height:calc('+width+' - 2px);float:'+float"
        fit="cover"
      >
        <div slot="error">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);height:calc('+ width +'/ 2 - 2px)'"
            :src="errorUrl"
          />
        </div>
        <div slot="placeholder">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);height:calc('+ width +'/ 2 - 2px)'"
            :src="defaultUrl"
          />
        </div>
      </el-image>
    </div>
    <div v-if="4 <= urlList.length && urlList.length <=8 ">
      <el-image
        v-for="(url,index) in urlList"
        :key="index"
        v-if="index <= 4"
        :src="url"
        :style="'padding: 1px;width:calc('+ width +'/ 2 - 2px);height:calc('+ width +'/ 2 - 2px);float:'+float"
        fit="cover"
      >
        <div slot="error">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);height:calc('+ width +'/ 2 - 2px)'"
            :src="errorUrl"
          />
        </div>
        <div slot="placeholder">
          <img
            :style="'padding: 1px;width:'+ width +'/ 2 - 2px);height:calc('+ width +'/ 2 - 2px)'"
            :src="defaultUrl"
          />
        </div>
      </el-image>
    </div>
    <div v-if="9 <= urlList.length">
      <el-image
        v-for="(url,index) in urlList"
        :key="index"
        v-if="index <= 9"
        :src="url"
        :style="'padding: 1px;width:calc('+ width +'/ 3 - 2px);height:calc('+ width +'/ 3 - 2px);float:'+float"
        fit="cover"
      >
        <div slot="error">
          <img
            :style="'padding: 1px;width:'+ width +'/ 3 - 2px);height:calc('+ width +'/ 3 - 2px)'"
            :src="errorUrl"
          />
        </div>
        <div slot="placeholder">
          <img
            :style="'padding: 1px;width:'+ width +'/ 3 - 2px);height:calc('+ width +'/ 3 - 2px)'"
            :src="defaultUrl"
          />
        </div>
      </el-image>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    imUid: {
      type: String | Number,
      default: ""
    },
    defaultUrl: {
      type: String,
      default: "/static/icon/02应用图标—icon/tu00.png"
    },
    errorUrl: {
      type: String,
      default: "/static/icon/02应用图标—icon/tu00.png"
    },
    width: {
      type: String,
      default: ""
    },
    float: {
      type: String,
      default: ""
    },
    margin: {
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
    imClick() {
      if (this.imUid) {
        this.$store.dispatch('openUserInfoDialog', this.imUid);
      }
    },
    onError(event){
      event.srcElement.src = this.errorUrl;
    }
  }
};
</script>

<style scoped>
#ImHeadPortrait {
}
</style>


