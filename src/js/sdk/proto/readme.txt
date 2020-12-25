1.在用命令构建proto.js

"proto": "pbjs -t json-module -w commonjs -o src/js/sdk/proto.js src/js/sdk/*.proto"

2.在生成的proto.js文件中需要加入下面的处理代码,添加Long模块处理uint64类型的数据

var Long = require("long");
$protobuf.util.Long = Long;
$protobuf.configure();
