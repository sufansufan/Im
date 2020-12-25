import cacheUtils from '../../utils/cacheUtils';

const cache = {
  state: {
    // 数据缓存
    cache: {
      /********************************* */
      /** 联系人信息 ************************ */
      /********************************* */
      /**平台联系人列表 */
      businessUserMap: new Map(),
      /**平台联系人列表版本 */
      businessUserListVersion: -1,
      /**公众号列表 */
      publicAccountMap: new Map(),
      /**openAipUserList */
      openAipUserMap: new Map(),
      /********************************* */
      /** 群信息 ************************ */
      /********************************* */
      /**群列表 */
      groupMap: new Map(), // 群列表
      /**群成员列表 */
      groupUserMap: new Map(), // 群成员列表
      /********************************* */
      /** 会话和消息 ************************ */
      /********************************* */
      /**会话列表 */
      sessionList: [], // 会话列表
      /**会话消息列表 */
      messagesMap: new Map(), // 会话消息列表
      /**透传消息列表 */
      passThroughMsgMap: new Map(), // 透传消息列表
      /**请求列表 */
      reqMap: new Map(), // 请求列表
      /**最后一条消息id */
      lastSeqId: "",
    },
    // 改变则触发缓存
    cacheChangeFlag: 0,
    // 初始化状态
    initStatus: false
  },
  mutations: {
    /** 同步缓存 */
    SET_CACHE: (state, cache) => {
      cacheUtils.bulidCache(cache)
      state.cache = cache;
      state.cacheChangeFlag += 1;
    },
    /** 设置初始化状态 */
    SET_CACHE_INIT_STATUS: (state) => {
      state.initStatus = true;
    }
  },
  actions: {
    /** 同步缓存 */
    setCache(context, cache) {
      context.commit("SET_CACHE", cache);
    },
    /** 设置初始化状态 */
    setCacheInitStatus(context) {
      context.commit("SET_CACHE_INIT_STATUS");
    }
  }
};

export default cache;
