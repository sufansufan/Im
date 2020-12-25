export default {

  /**socket响应类型 */
  WebSocketType: {
    /** 请求 */
    request: 0,
    /** 响应 */
    response: 1,
    /** 通知 */
    notification: 2
  },

  /**客户端类型 */
  ClientType: {
    /** app端 */
    APP: 0,
    /** web端 */
    WEB: 1,
    /** pad端 */
    PAD: 2
  },

  /**会话类型 */
  GroupType: {
    /**单聊 */
    SINGLE: 0,
    /**群聊 */
    GROUP: 1,
    /**工作消息 */
    WORK: 2,
    /**公众号 */
    PLATFORM: 3
  },

  /**
   * 消息发送状态
   */
  MsgSendState: {
    /**草稿 */
    DRAFT: 0,
    /**发送中 */
    SENDING: 1,
    /**发送成功 */
    SUCCESS: 2,
    /**发送失败 */
    FAIL: 3
  },

  /**透传类型 */
  ActionType: {
    /** 心跳ping */
    HEARTPING: 0,
    /** 登录*/
    LOGIN: 1,
    /** 登出请求 */
    LOGINOUT: 2,
    /** 拉取离线消息 */
    PULLMSG: 11,
    /** 拉取历史消息 */
    HISTORYMSG: 12,
    /** 拉取最近消息 */
    RecentlyMsg: 13,
    /** 聊天 */
    CHATING: 21,
    /** 操作 */
    OPERATING: 22
  },

  /**
   * 一级消息类型
   */
  MsgType: {
    /**文本消息 */
    CHAT: 0,
    /**操作消息 */
    OPERATION: 1,
    /**系统消息 */
    SYSTEM: 2,
    /**透传消息 */
    PASSTHROUGH: 3,
    /**工作消息 */
    WORK: 4
  },

  /**文本消息类型 */
  CharSecondType: {
    /** 文本消息*/
    CAHT_TEXT: 1,
    /** 语音消息 */
    CAHT_AUDIO: 2,
    /** 图片消息 */
    CAHT_IMAGE: 3,
    /** 视频消息 */
    CAHT_VIDEO: 4,
    /** 文件消息 */
    CAHT_FILE: 5,
    /** 自定义消息 **/
    CAHT_CUSTOMIZE: 6
  },

  /**工作消息分类 */
  WorkSecondType: {
    /** 系统消息*/
    SYSTEM: 0
  },

  /**操作消息类型 */
  OperationMsgConstant: {
    /** 消息已读（未读数量-针对消息发送者）*/
    OPERATION_READ: 1,
    /** 消息撤回 */
    OPERATION_REVOCATION: 2,
    /** 消息删除 */
    OPERATION_DELETE: 3,
    /** 消息阅读状态（是否已读-针对消息接受者） */
    OPERATION_READ_STATUS: 4,
    /** 消息接收状态（是否已收） */
    OPERATION_CHECK_STATUS: 5
  },

  /** 透传消息类型 */
  PassthroughMsgConstant: {
    /** 更新联系人备注 **/
    // PASSTHROUGH_UPDATE_REMARK: 0,
    /** 自定义透传 **/
    PASSTHROUGH_CUSTOMIZE: 1,
    /** 删除联系人 **/
    // PASSTHROUGH_DELETE_CONTACT: 2,
    /** 更新群昵称 **/
    // PASSTHROUGH_UPDATE_GROUP_NICK: 3,
    /** 创建群 **/
    PASSTHROUGH_CREATE_GROUP: 4,
    /** 群添加成员 **/
    // PASSTHROUGH_GROUP_ADD_USER: 5,
    /** 群删除成员 **/
    // PASSTHROUGH_GROUP_DELETE_USER: 6,
    /** 群解散 **/
    PASSTHROUGH_GROUP_DISSMISS: 7,
    /** 被踢出群 **/
    PASSTHROUGH_GROUP_KICKOUT: 8,
    /** 退出群 **/
    PASSTHROUGH_GROUP_LOGOUT: 9
  },

  /** 自定义透传 */
  PassthroughCustomizeType: {
    /** 组织人员信息变更 */
    ORGANIZATION_EMPLOYEE_CHANGE: "01"
  },

  /** 系统消息类型 */
  SystemMsgType: {
    /** 创建群 **/
    SYSTEM_CREATE_GROUP: 1,
    /** 解散群 **/
    SYSTEM_DISSMISS_GROUP: 2,
    /** 加入群 **/
    SYSTEM_JOIN_GROUP: 3,
    /** 踢出群 **/
    SYSTEM_REMOVE_GROUP: 4,
    /** 退出群 **/
    SYSTEM_EXIT_GROUP: 5
  },

  /**群组类型 */
  GroupTypeConstant: {
    /** 普通群 **/
    Group_COMMON: 0,
    /** 公司群 **/
    Group_MAIN_COMPANY: 1,
    /** 分公司 **/
    Group_BRANCH_COMPANY: 2,
    /** 项目部群 **/
    Group_PROJECTDEPARTMENT: 3,
    /** 部门群 **/
    Group_COMPANY: 4,
    /** 项目群 **/
    Group_PROJECT: 5,
    /** 聊天室 **/
    GROUP_CHATROOM: 10
  },

  /**响应标识 */
  ResultCodeConstant: {
    /** 成功 **/
    SUCCESS: 0,
    /** 授权失败 **/
    AUTH_FAILED: 1,
    /** 没有授权信息 **/
    NO_TOKEN: 2,
    /** unkown destination **/
    UNKNOW_DESTINATION: 3,
    /** 该账号在别处登录 **/
    KICK_OUT: 4
  }
}
