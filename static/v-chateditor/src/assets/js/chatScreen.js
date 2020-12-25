// 加载
require('../css/chatScreen.css')
require('../css/icons.css')

var Recorder = require('./recorder.js')
// 文件下标计数
var fileId = 0;
// 文件数组容器
var fileArray = [];
// 视频文件发送
var videoFile;
// 长按录音
var luyin;
//文件消息初始
var fileInitial = () => {
  fileId = 0;
  fileArray = [];
};

var EmojiSourcePeople = [
  "\u263a", "\ud83d\ude0a", "\ud83d\ude00", "\ud83d\ude01", "\ud83d\ude02", "\ud83d\ude03",
  "\ud83d\ude04", "\ud83d\ude05", "\ud83d\ude06", "\ud83d\ude07", "\ud83d\ude08", "\ud83d\ude09",
  "\ud83d\ude2f", "\ud83d\ude10", "\ud83d\ude11", "\ud83d\ude15", "\ud83d\ude20", "\ud83d\ude2c",
  "\ud83d\ude21", "\ud83d\ude22", "\ud83d\ude34", "\ud83d\ude2e", "\ud83d\ude23", "\ud83d\ude24",
  "\ud83d\ude25", "\ud83d\ude26", "\ud83d\ude27", "\ud83d\ude28", "\ud83d\ude29", "\ud83d\ude30",
  "\ud83d\ude1f", "\ud83d\ude31", "\ud83d\ude32", "\ud83d\ude33", "\ud83d\ude35", "\ud83d\ude36",
  "\ud83d\ude37", "\ud83d\ude1e", "\ud83d\ude12", "\ud83d\ude0d", "\ud83d\ude1b", "\ud83d\ude1c",
  "\ud83d\ude1d", "\ud83d\ude0b", "\ud83d\ude17", "\ud83d\ude19", "\ud83d\ude18", "\ud83d\ude1a",
  "\ud83d\ude0e", "\ud83d\ude2d", "\ud83d\ude0c", "\ud83d\ude16", "\ud83d\ude14", "\ud83d\ude2a",
  "\ud83d\ude0f", "\ud83d\ude13", "\ud83d\ude2b", "\ud83d\ude4b", "\ud83d\ude4c", "\ud83d\ude4d",
  "\ud83d\ude45", "\ud83d\ude46", "\ud83d\ude47", "\ud83d\ude4e", "\ud83d\ude4f", "\ud83d\ude3a",
  "\ud83d\ude3c", "\ud83d\ude38", "\ud83d\ude39", "\ud83d\ude3b", "\ud83d\ude3d", "\ud83d\ude3f",
  "\ud83d\ude3e", "\ud83d\ude40", "\ud83d\ude48", "\ud83d\ude49", "\ud83d\ude4a", "\ud83d\udca9",
  "\ud83d\udc76", "\ud83d\udc66", "\ud83d\udc67", "\ud83d\udc68", "\ud83d\udc69", "\ud83d\udc74",
  "\ud83d\udc75", "\ud83d\udc8f", "\ud83d\udc91", "\ud83d\udc6a", "\ud83d\udc6b", "\ud83d\udc6c",
  "\ud83d\udc6d", "\ud83d\udc64", "\ud83d\udc65", "\ud83d\udc6e", "\ud83d\udc77", "\ud83d\udc81",
  "\ud83d\udc82", "\ud83d\udc6f", "\ud83d\udc70", "\ud83d\udc78", "\ud83c\udf85", "\ud83d\udc7c",
  "\ud83d\udc71", "\ud83d\udc72", "\ud83d\udc73", "\ud83d\udc83", "\ud83d\udc86", "\ud83d\udc87",
  "\ud83d\udc85", "\ud83d\udc7b", "\ud83d\udc79", "\ud83d\udc7a", "\ud83d\udc7d", "\ud83d\udc7e",
  "\ud83d\udc7f", "\ud83d\udc80", "\ud83d\udcaa", "\ud83d\udc40", "\ud83d\udc42", "\ud83d\udc43",
  "\ud83d\udc63", "\ud83d\udc44", "\ud83d\udc45", "\ud83d\udc8b", "\u2764", "\ud83d\udc99",
  "\ud83d\udc9a", "\ud83d\udc9b", "\ud83d\udc9c", "\ud83d\udc93", "\ud83d\udc94", "\ud83d\udc95",
  "\ud83d\udc96", "\ud83d\udc97", "\ud83d\udc98", "\ud83d\udc9d", "\ud83d\udc9e", "\ud83d\udc9f",
  "\ud83d\udc4d", "\ud83d\udc4e", "\ud83d\udc4c", "\u270a", "\u270c", "\u270b",
  "\ud83d\udc4a", "\u261d", "\ud83d\udc46", "\ud83d\udc47", "\ud83d\udc48", "\ud83d\udc49",
  "\ud83d\udc4b", "\ud83d\udc4f", "\ud83d\udc50"
];

//输入框获取光标位置
function getCursortPosition(textDom) {
  var cursorPos = 0;
  if (document.selection) {
    textDom.focus();
    var selectRange = document.selection.createRange();
    selectRange.moveStart('character', -textDom.value.length);
    cursorPos = selectRange.text.length;
  } else if (textDom.selectionStart || textDom.selectionStart == '0') {
    cursorPos = textDom.selectionStart;
  }
  return cursorPos;
};

//设置光标所在位置
function setCaretPosition(element, pos) {
  var range, selection;
  if (document.createRange) {
    range = document.createRange(); //创建一个选中区域
    range.selectNodeContents(element); //选中节点的内容
    if (element.innerHTML.length > 0) {
      range.setStart(element.childNodes[0], pos); //设置光标起始为指定位置
    }
    range.collapse(true); //设置选中区域为一个点
    selection = window.getSelection(); //获取当前选中区域
    selection.removeAllRanges(); //移出所有的选中范围
    selection.addRange(range); //添加新建的范围
  };
};

//光标前插入节点函数
function insertPositionNode(nodeId, doc) {
  var range, selection; //记录光标位置对象
  selection = window.getSelection(); //获取当前选中区域
  //判断选中区域为某个节点id时才能触发
  if (selection.baseNode && (selection.baseNode.id == nodeId || selection.baseNode.parentElement.id == nodeId)) {
    var node = selection.anchorNode;
    // 这里判断是做是否有光标判断，因为弹出框默认是没有的
    if (node != null) {
      range = selection.getRangeAt(0); // 获取光标起始位置
    } else {
      range = undefined;
    }
    range.insertNode(doc); // 在光标位置插入该对象
    selection.collapseToEnd(); //光标移动至末尾
  };
};

//dom主动获取焦点并且移动到末尾
function getFocus() {
  var selection = window.getSelection(); //获取当前选中区域
  //判断选中区域为某个节点id时才能触发
  if (!(selection.baseNode && (selection.baseNode.id == 'preId' || selection.baseNode.parentElement.id == 'preId'))) {
    var obj = document.getElementById('preId');
    if (window.getSelection) {
      obj.focus();
      selection.selectAllChildren(obj); //range 选择obj下所有子内容
      selection.collapseToEnd(); //光标移至最后
    } else if (document.selection) {
      var range = document.selection.createRange(); //创建选择对象
      range.moveToElementText(obj); //range定位到obj
      range.collapse(false); //光标移至最后
      range.select();
    };
  };
};

//设置按键发送与换行
function keydownFun(cbok) {
  return function (event) {
    // 发送操作
    if (!event.ctrlKey && event.keyCode == 13) {
      event.preventDefault();
      send(cbok)();
    } else
      //换行操作
      if (event.ctrlKey && event.keyCode == 13) {
        event.preventDefault();
        newlineFun();
        boxScroll();
      };
  }
};

//换行函数
function newlineFun() {
  var br_ = document.createElement("br");
  insertPositionNode('preId', br_);
};

//滚动条始终保持最下方
function boxScroll() {
  var doc = document.getElementById('preId');
  doc.scrollTop = doc.scrollHeight;
};

//编辑框添加文件信息
function pushFile(file) {
  // console.log(file.name);
  var doc_img = document.createElement("img");
  doc_img.setAttribute("src", require('./文件icon.png'));
  doc_img.setAttribute("data-fileid", fileId++);
  doc_img.setAttribute("style", 'width:40px;height:40px;');
  insertPositionNode('preId', doc_img);
};

// 视频发送
function pushVideo(cbok) {
  return function () {
    fileId++;
    if (cbok) {
      cbok(videoFile)
    }
  };
};

//编辑框添加图片信息
function pushImage(src_) {
  var doc = document.createElement("img");
  doc.setAttribute("src", src_);
  doc.setAttribute("data-imageid", fileId++);
  doc.setAttribute('style', 'vertical-align:bottom;');
  insertPositionNode('preId', doc);
};

//编辑框添加表情信息
function pushExpression(data) {
  var doc = document.createElement("img");
  doc.setAttribute("src", "../../../../../static/img-apple-64/" + EmojiSourcePeople[data.index_].codePointAt(0).toString(16) + ".png");
  doc.setAttribute("class", "emojiImg");
  doc.setAttribute("emojisourcepeoplenum", data.index_);
  expressionOperation().hideExpression();
  insertPositionNode('preId', doc);
  
};

//获取并操作文件信息
function obtainFile() {
  // var fileVal = document.getElementById('uploadFile').files;
  // for (var i = 0; i < fileVal.length; i++) {
  // 	//判断文件类型并操作
  // 	judgeFileType(fileVal[i]);
  // };
  // document.getElementById('uploadFile').value = '';
  var fileVal = document.getElementById('uploadFile').files;
  var newfileVal = Object.assign({}, fileVal);
  document.getElementById('uploadFile').value = '';
  return newfileVal;
};

//获取文件绝对路径
function getObjectURL(file) {
  var url = null;
  if (window.createObjcectURL != undefined) {
    url = window.createOjcectURL(file);
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};

//判断文件类型
function judgeFileType(file_) {
  var type = file_.type;

  // 图片类型文件处理
  if (type.indexOf('image') > -1) {
    //追加文件
    fileArray.push(file_);
    pushImage(getObjectURL(file_));
  } else

    // 视频类型文件处理
    if (
      type.indexOf('audio') > -1 ||
      type.indexOf('video') > -1
    ) {
      videoFile = file_;
      document.getElementById('sendVideo').click();
    } else

  // 其它文件类型
  {
    fileArray.push(file_);
    pushFile(file_);
  }
};

//文件拖拽至输入框
function dropFile() {
  //获取拖拽区域
  var dropPre = document.querySelector("#preId");
  //绑定拖动释放事件
  dropPre.ondrop = function (e) {
    e.preventDefault();
    getFocus();
    //获取文件对象
    var fileVal = e.dataTransfer.files;
    for (var i = 0; i < fileVal.length; i++) {
      //判断文件类型并操作
      judgeFileType(fileVal[i]);
    };
  };
};

// 切割发送消息
function cutSend(preVal) {


  // 替换表情图片为文字
  var preDom = document.getElementById('preId');
  var cNode = preDom.cloneNode(true);
  var atWhoList = [];
  cNode.childNodes.forEach((item, index, array) => {
    // @
    if (item.className == 'atwho-inserted') {
      atWhoList.push(item.firstChild.getAttribute('userid'));
    }
    // 图片
    if (item.nodeName == 'IMG') {
      var spanIMG = document.createElement("span");
      if (item.getAttribute('emojisourcepeoplenum')) {
        spanIMG.innerText = EmojiSourcePeople[item.getAttribute('emojisourcepeoplenum')];
      }
      cNode.replaceChild(spanIMG, item)

    }
    // 换行符
    if (item.nodeName == 'BR') {
      var spanBR = document.createElement("span");
      spanBR.innerText = "\\n";
      cNode.replaceChild(spanBR, item)
    }
  })
  var messageArr_ = [cNode.innerText.replace(/\\n/g, "\n")];
  messageArr_.push(atWhoList);

  var bool = false;
  var str = '';

  preVal.forEach((item, index, array) => {

    // 文本
    if (item.nodeName == '#text') {
      if (item.data !== '') {
        str += item.data
      }
    } else

      // 图标
      if (item.nodeName == 'IMG') {

        // 表情
        if (item.dataset.id) {

          str += EmojiSourcePeople[item.dataset.id]
        } else

          // 图片文件
          if (item.dataset.imageid) {
            if (str !== '') {
              messageArr_.push({
                type: 'text',
                msg: str
              })
            }
            messageArr_.push({
              type: 'file',
              fileIndex: item.dataset.imageid
            })
            bool = true;
          }

        // 其它文件
        if (item.dataset.fileid) {
          if (str !== '') {
            messageArr_.push({
              type: 'text',
              msg: str
            })
          }
          messageArr_.push({
            type: 'file',
            fileIndex: item.dataset.fileid
          })
          bool = true;
        }

      } else

        // 换行符
        if (item.nodeName == 'BR') {
          str += '\n'
        }

    if (bool) {
      str = '';
      bool = false;
    }
  });

  if (str !== '') {
    messageArr_.push({
      type: 'text',
      msg: str
    })
  }

  return messageArr_
};

//发送消息
function send(cbok) {
  return function () {
    //获取输入框数据信息
    var preVal = document.getElementById('preId').childNodes;
    if (cbok) {
      cbok(cutSend(preVal), fileArray)
    }
  };
};


/************************************	设置 *************************************** */

//表情包操作
function expressionOperation(cbok) {

  //显示表情窗
  function showExpression() {
    var height_ = 0;
    var opacity_ = -0.12;
    var doc = document.getElementById('expression_');
    var mask = document.getElementById('expression_mask');
    mask.style.display = 'block';
    doc.style.display = 'block';

    //第一帧渲染
    window.requestAnimationFrame(render);

    function render() {
      height_ += 10;
      opacity_ += 0.04;
      if (height_ <= 280) {
        doc.style.height = height_ + 'px';
        doc.style.top = (height_ + 5) * -1 + 'px';
        doc.style.opacity = opacity_;
        //递归渲染
        window.requestAnimationFrame(render);
      };
    };

    switchExpression();
    mask.onclick = function () {
      hideExpression()
    };
    getFocus();
  };

  //隐藏表情窗
  function hideExpression() {
    var height_ = 280;
    var opacity_ = 10;
    var doc = document.getElementById('expression_');
    var mask = document.getElementById('expression_mask');
    mask.style.display = 'none';

    //第一帧渲染
    window.requestAnimationFrame(render);

    function render() {
      height_ -= 100;
      opacity_ -= 0.04;
      if (height_ >= 0) {
        doc.style.height = height_ + 'px';
        doc.style.top = (height_ + 5) * -1 + 'px';
        doc.style.opacity = opacity_;
        //递归渲染
        window.requestAnimationFrame(render);
      } else {
        doc.style.display = 'none';
      };
    };

    mask.removeEventListener("click", hideExpression, false);
  };

  //切换表情	
  function switchExpression() {
    document.getElementById('bqShow_k').innerHTML = qqemoji();

    function qqemoji() {
      var str = '';
      for (let i = 0; i < EmojiSourcePeople.length; i++) {
        const element = EmojiSourcePeople[i];
        str += `<button  class="Iclick qq_bqsize" ><i class="EmojiSourcePeople" EmojiSourcePeopleNum="` + i + `" style="background-image: url(../../../../../static/img-apple-64/` + element.codePointAt(0).toString(16) + `.png);"></i></button>`
      }
      return str;
    };
    if (cbok) {
      var emojiSourcePeopleArr = document.getElementsByClassName('EmojiSourcePeople');
      for (var i = 0; i < emojiSourcePeopleArr.length; i++) {
        emojiSourcePeopleArr[i].onclick = function () {
          var index_ = this.getAttribute('emojisourcepeoplenum');
          cbok({
            type: EmojiSourcePeople,
            index_
          });
        };
      };
    };
  };

  return {
    showExpression,
    hideExpression,
    switchExpression,
  }
};

//长按录音
function webRecording() {
  //new一个音频
  var audio_context = new AudioContext;
  var recorder;

  navigator.getUserMedia({
    audio: true
  }, startUserMedia, function (e) {
    console.log('使用媒体设备请求被用户或者系统拒绝');
  });

  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
  }

  function startRecording() {
    recorder && recorder.record();
  }

  function stopRecording(cbok) {
    recorder && recorder.stop();
    createDownloadLink(cbok);
    recorder.clear();
  }

  function createDownloadLink(cbok) {
    recorder && recorder.exportWAV(function (blob) {
      cbok(blob)
    });
  };

  return {
    startRecording,
    stopRecording
  }
};

export default {
  // 输入框初始
  initializeEmpty() {
    document.getElementById('preId').innerHTML = '';
    fileInitial()
  },
  // 视频文件初始
  initiaVideo() {
    videoFile = {}
  },
  // 表情包点击
  expressionClick: function () {
    expressionOperation(pushExpression).showExpression()
  },
  // 打开文件夹
  webWechatPicClick() {
    getFocus()
    videoFile = {}
    document.getElementById('uploadFile').click()
  },
  // 选中文件夹
  uploadFile: obtainFile,
  // enter键发送
  preIdKeydown(sendFun) {
    return keydownFun(sendFun)
  },
  // 点击发送按钮
  sendMsgClick(sendFun) {
    return send(sendFun)
  },
  // 发送视频
  sendVideo(sendVideoFun) {
    return pushVideo(sendVideoFun)
  },
  // 启动录音
  webRecord() {
    luyin = webRecording();
    return {
      startRecording: luyin.startRecording,
      stopRecording: luyin.stopRecording
    }
  },
  // 启动文件拖拽
  dropFile,
  // 发送文本消息
  sendmsg: function () {},
  // 发送视频消息
  sendvideo: function () {},
  // 发送语音消息
  sendaudio: function () {},
  // 修改发送文本消息函数
  setSendMsg: function (cbok) {
    this.sendmsg = cbok;
  },
  // 修改发送视频消息函数
  setSendVideo: function (cbok) {
    this.sendvideo = cbok;
  },
  // 修改发送语音消息函数
  setSendAudio: function (cbok) {
    this.sendaudio = cbok;
  },
  /**
   * 光标
   */
  getFocus:getFocus
};
