import store from "../store";
export default {
  getAll() {
    return store.state.cache.cache.publicAccountMap;
  },
  getOneByImUid(imUid) {
    return this.getAll().get(parseInt(imUid));
  }
}
