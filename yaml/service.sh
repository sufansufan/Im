#!/bin/bash
if [ "$1" == "" ];then
    echo "miss env"
    echo "Usage:$0 {dev|qa|pre|default|bh}"
    exit 1
else
	env=$1
fi
basedir=$(cd $(dirname $0);echo $(pwd))
cat $basedir/service.yaml.tpl >$basedir/service.yaml
kubectl -n $env get service im-webui
kubectl -n $env apply -f $basedir/service.yaml
if [ $? -ne 0 ];then
	exit 1
fi
rm -f $basedir/service.yaml