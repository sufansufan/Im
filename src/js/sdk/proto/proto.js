/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");
var Long = require("long");

// 添加Long模块处理uint64类型的数据
$protobuf.util.Long = Long;
$protobuf.configure();
var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  com: {
    nested: {
      jdyh: {
        nested: {
          im: {
            nested: {
              common: {
                nested: {
                  tcpprotocol: {
                    options: {
                      java_outer_classname: "ImCommon"
                    },
                    nested: {
                      ChatMsg: {
                        fields: {
                          msgId: {
                            type: "uint64",
                            id: 1
                          },
                          content: {
                            type: "string",
                            id: 2
                          },
                          description: {
                            type: "string",
                            id: 3
                          },
                          remark: {
                            type: "string",
                            id: 4
                          },
                          deviceId: {
                            type: "string",
                            id: 5
                          },
                          platform: {
                            type: "uint32",
                            id: 6
                          },
                          atList: {
                            rule: "repeated",
                            type: "string",
                            id: 7
                          }
                        }
                      },
                      MsgBean: {
                        fields: {
                          sequenceId: {
                            type: "uint64",
                            id: 1
                          },
                          msgType: {
                            type: "MsgType",
                            id: 2
                          },
                          msgSecondType: {
                            type: "uint32",
                            id: 3
                          },
                          msgFrom: {
                            type: "string",
                            id: 4
                          },
                          msgTo: {
                            type: "string",
                            id: 5
                          },
                          groupType: {
                            type: "GroupType",
                            id: 6
                          },
                          timeStamp: {
                            type: "uint64",
                            id: 7
                          },
                          chatMsg: {
                            type: "ChatMsg",
                            id: 8
                          },
                          operationMsgBase: {
                            type: "OperationMsg",
                            id: 9
                          },
                          systemMsg: {
                            type: "SystemMsg",
                            id: 10
                          },
                          unRead: {
                            type: "uint32",
                            id: 11
                          },
                          readStatus: {
                            type: "bool",
                            id: 12
                          },
                          isDelete: {
                            type: "bool",
                            id: 13
                          },
                          isRevocation: {
                            type: "bool",
                            id: 14
                          },
                          passthroughMsg: {
                            type: "string",
                            id: 15
                          },
                          WorkMsg: {
                            type: "string",
                            id: 16
                          },
                          conversationID: {
                            type: "string",
                            id: 17
                          },
                          checkStatus: {
                            type: "bool",
                            id: 18
                          }
                        }
                      },
                      OperationMsg: {
                        fields: {
                          operationSeqId: {
                            type: "uint64",
                            id: 1
                          }
                        }
                      },
                      SystemMsg: {
                        fields: {
                          userA: {
                            type: "string",
                            id: 1
                          },
                          userB: {
                            rule: "repeated",
                            type: "string",
                            id: 2
                          },
                          groupId: {
                            type: "string",
                            id: 3
                          }
                        }
                      },
                      GroupType: {
                        values: {
                          single: 0,
                          group: 1,
                          imwork: 2,
                          platform: 3
                        }
                      },
                      MsgType: {
                        values: {
                          chat: 0,
                          operation: 1,
                          system: 2,
                          passthrough: 3,
                          work: 4
                        }
                      },
                      ClientType: {
                        values: {
                          app: 0,
                          web: 1,
                          pad: 2
                        }
                      },
                      ClientOS: {
                        values: {
                          android: 0,
                          ios: 1,
                          windows: 2
                        }
                      },
                      imnotify: {
                        options: {
                          java_multiple_files: true
                        },
                        nested: {
                          ImNotify: {
                            fields: {
                              lastseqId: {
                                type: "uint64",
                                id: 1
                              }
                            }
                          }
                        }
                      },
                      imrequest: {
                        options: {
                          java_multiple_files: true
                        },
                        nested: {
                          ImRequest: {
                            fields: {
                              requestId: {
                                type: "string",
                                id: 1
                              }
                            }
                          },
                          ChatRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              msgTo: {
                                type: "string",
                                id: 2
                              },
                              msgSecondType: {
                                type: "uint32",
                                id: 3
                              },
                              groupType: {
                                type: "GroupType",
                                id: 4
                              },
                              chatMsg: {
                                type: "ChatMsg",
                                id: 5
                              }
                            }
                          },
                          OperationRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              operationSeqId: {
                                type: "uint64",
                                id: 2
                              },
                              operationType: {
                                type: "uint32",
                                id: 3
                              }
                            }
                          },
                          PullHistoryRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              firstSeqId: {
                                type: "uint64",
                                id: 2
                              },
                              msgTo: {
                                type: "string",
                                id: 3
                              },
                              groupType: {
                                type: "GroupType",
                                id: 4
                              }
                            }
                          },
                          PullMsgRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              lastSeqId: {
                                type: "uint64",
                                id: 2
                              }
                            }
                          },
                          PullRecentlyRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              limit: {
                                type: "uint32",
                                id: 2
                              },
                              days: {
                                type: "uint32",
                                id: 3
                              }
                            }
                          },
                          LoginInfoRequest: {
                            fields: {
                              imRequest: {
                                type: "ImRequest",
                                id: 1
                              },
                              deviceId: {
                                type: "string",
                                id: 2
                              },
                              token: {
                                type: "string",
                                id: 3
                              },
                              clientType: {
                                type: "ClientType",
                                id: 4
                              },
                              clientOS: {
                                type: "ClientOS",
                                id: 5
                              },
                              appVersion: {
                                type: "string",
                                id: 6
                              }
                            }
                          },
                          LoginOutRequest: {
                            fields: {}
                          }
                        }
                      },
                      imresponse: {
                        options: {
                          java_multiple_files: true
                        },
                        nested: {
                          ImResponse: {
                            fields: {
                              reponseId: {
                                type: "string",
                                id: 1
                              },
                              code: {
                                type: "uint32",
                                id: 2
                              },
                              msg: {
                                type: "string",
                                id: 3
                              }
                            }
                          },
                          ChatResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              timeStamp: {
                                type: "uint64",
                                id: 2
                              }
                            }
                          },
                          OperationResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              timeStamp: {
                                type: "uint64",
                                id: 2
                              }
                            }
                          },
                          PullHistoryResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              msgList: {
                                rule: "repeated",
                                type: "MsgBean",
                                id: 2
                              },
                              msgTo: {
                                type: "string",
                                id: 3
                              },
                              groupType: {
                                type: "GroupType",
                                id: 4
                              },
                              firstSeqId: {
                                type: "uint64",
                                id: 5
                              }
                            }
                          },
                          PullMsgResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              msgList: {
                                rule: "repeated",
                                type: "MsgBean",
                                id: 2
                              },
                              lastSeqId: {
                                type: "uint64",
                                id: 3
                              }
                            }
                          },
                          PullRecentlyResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              msgList: {
                                rule: "repeated",
                                type: "MsgBean",
                                id: 2
                              },
                              limit: {
                                type: "uint32",
                                id: 3
                              },
                              days: {
                                type: "uint32",
                                id: 4
                              }
                            }
                          },
                          LoginInfoResponse: {
                            fields: {
                              imResponse: {
                                type: "ImResponse",
                                id: 1
                              },
                              heartTime: {
                                type: "uint32",
                                id: 2
                              }
                            }
                          },
                          HeartPing: {
                            fields: {
                              newestSeqID: {
                                type: "uint64",
                                id: 1
                              }
                            }
                          }
                        }
                      },
                      imwebsocket: {
                        options: {
                          java_multiple_files: true
                        },
                        nested: {
                          ImWebSocket: {
                            fields: {
                              type: {
                                type: "uint32",
                                id: 1
                              },
                              action: {
                                type: "uint32",
                                id: 2
                              },
                              imuid: {
                                type: "uint32",
                                id: 3
                              },
                              lenth: {
                                type: "uint32",
                                id: 4
                              },
                              crc32: {
                                type: "uint32",
                                id: 5
                              },
                              body: {
                                type: "bytes",
                                id: 6
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
