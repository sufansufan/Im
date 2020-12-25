import Client from '../js/sdk/client'
import ConstantType from '../js/sdk/constant/ConstantType'
import Long from 'long'
import sessionUtils from '../utils/sessionUtils';
import messageUtils from '../utils/messageUtils';
export default {
  data() {
    return {
      messageViewScroll: {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
      },
      sendReadMap: new Map(),
      pullHistoryMessageSequenceId: ""
    };
  },
  computed: {
    cacheChangeFlag() {
      return this.$store.state.cache.cacheChangeFlag;
    }
  },
  watch: {
    cacheChangeFlag(val, oldVal) {
      this.loadDataForCacheChange();
    }
  },
  created() {
    this.loadDataForCacheChange();
  },
  methods: {
    loadDataForCacheChange() {
      throw new Error('未检测到loadDataForCacheChange方法，请添加loadDataForCacheChange方法')
    },
    setScrollByCacheChange() {
      let messageViewDom = document.getElementById("messageView")
      // 滚动条在最下面时
      if (this.messageViewScroll.scrollTop == (this.messageViewScroll.scrollHeight - this.messageViewScroll.clientHeight)) {
        messageViewDom.scrollTop = messageViewDom.scrollHeight - messageViewDom.clientHeight;
      } else {
        messageViewDom.scrollTop = messageViewDom.scrollHeight - messageViewDom.clientHeight - (this.messageViewScroll.scrollHeight - this.messageViewScroll.scrollTop - this.messageViewScroll.clientHeight);
      }
      this.messageViewScroll.scrollTop = messageViewDom.scrollTop;
      this.messageViewScroll.scrollHeight = messageViewDom.scrollHeight;
      this.messageViewScroll.clientHeight = messageViewDom.clientHeight;
      this.sendOperationMessage();
      this.pullHistoryMessage();

      // 滚动条事件
      messageViewDom.onscroll = () => {
        this.messageViewScroll.scrollTop = messageViewDom.scrollTop;
        this.messageViewScroll.scrollHeight = messageViewDom.scrollHeight;
        this.messageViewScroll.clientHeight = messageViewDom.clientHeight;
        this.sendOperationMessage();
        this.pullHistoryMessage();
      }
    },
    pullHistoryMessage() {
      if (this.messageViewScroll.scrollTop == 0) {
        let session = sessionUtils.getOneBySessionId(this.sessionId)
        let sequenceId = Long.fromString("9223372036854775807");
        let messageViewDom = document.getElementById("messageView");
        let messageViewDomchildren = messageViewDom.children
        for (let i = 0; i < messageViewDomchildren.length; i++) {
          const messageDom = messageViewDomchildren[i];
          let sequenceIdString = messageDom.id.split('_')[3];
          if (sequenceIdString) {
            sequenceId = Long.fromString(sequenceIdString);
            break;
          }
        }
        if (this.pullHistoryMessageSequenceId != sequenceId.toString()) {
          if (session.groupType == ConstantType.GroupType.PLATFORM) {
            Client.getInstance().pullHistoryMessage(sequenceId, session.msgFrom, session.groupType);
          } else {
            Client.getInstance().pullHistoryMessage(sequenceId, session.msgTo, session.groupType);
          }
          this.pullHistoryMessageSequenceId = sequenceId.toString()
        }
      }
    },
    sendOperationMessage() {
      let messageViewDom = document.getElementById("messageView");
      let messageViewDomchildren = messageViewDom.children
      if (messageViewDomchildren.length > 0) {
        for (let i = 0; i < messageViewDomchildren.length; i++) {
          const messageDom = messageViewDomchildren[i];
          let readStatus = messageDom.id.split('_')[1];
          let msgTo = messageDom.id.split('_')[2];
          let sequenceIdString = messageDom.id.split('_')[3];
          let groupType = messageDom.id.split('_')[4];
          if (sequenceIdString && !this.sendReadMap.get(sequenceIdString) && readStatus == 'false' && msgTo && groupType && groupType != ConstantType.GroupType.PLATFORM) {
            let messageViewDomClientRectTop = messageViewDom.getBoundingClientRect().top;
            let messageViewDomClientRectHeight = messageViewDom.getBoundingClientRect().height
            let messageDomClientRectTop = messageDom.getBoundingClientRect().top;
            let domTop = messageDomClientRectTop - messageViewDomClientRectTop;
            if (0 <= domTop && domTop <= messageViewDomClientRectHeight) {
              Client.getInstance().sendOperationMessage(
                msgTo,
                sequenceIdString,
                ConstantType.OperationMsgConstant.OPERATION_READ,
                groupType
              );

              Client.getInstance().sendOperationMessage(
                msgTo,
                sequenceIdString,
                ConstantType.OperationMsgConstant.OPERATION_CHECK_STATUS,
                groupType
              );
              this.sendReadMap.set(sequenceIdString, sequenceIdString);
            }
          }
        }
      }
    }
  }
};
