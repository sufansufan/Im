<template>
  <div id="SessionMain">
    <SessionTree />
    <MessageMain />
  </div>
</template>

<script>
import SessionTree from "./components/SessionTree/SessionTree"
import MessageMain from "./components/MessageMain/MessageMain"
export default {
  components: {
    SessionTree,
    MessageMain
  },
  data() {
    return {
    };
  },
  computed: {

  }
};
</script>

<style>
#SessionMain {
  height: calc(100% - 54px);
}
</style>
