<template>
  <div id="App">
    <keep-alive>
      <webIM />
    </keep-alive>
  </div>
</template>

<script>
import webIM from "./page/webIM";
export default {
  name: "App",
  components: {
    webIM
  }
};
</script>

<style>
html {
  height: 100%;
  width: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#App {
  height: calc(100% - 2px);
  width: 100%;
}
</style>

