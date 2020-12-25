#!/bin/bash
if [ "$1" == "" ];then
	echo "miss env"
	echo "Usage:$0 {dev|qa|pre|default|bh}"
	exit 1
else
	env=$1
fi
case $env in
    dev)
        domain=dev.zgjdy.cn
        ;;
    qa)
        domain=qa.zgjdy.cn
        ;;
    pre)
        domain=pre.zgjdy.cn
        ;;
    bh)
        domain=bh.zgjdy.cn
        ;;
    default)
        domain=www.zgjdy.cn
    ;;
esac
basedir=$(cd $(dirname $0);echo $(pwd))
cat $basedir/configmap.yaml.tpl >$basedir/configmap.yaml
kubectl -n $env get configmap im-webui
if [ $? = 0 ];then
    sed "s/@domain/$domain/g" $basedir/configmap.yaml.tpl >$basedir/configmap.yaml
	kubectl -n $env replace -f $basedir/configmap.yaml
	if [ $? -ne 0 ];then
	    exit 1
	fi
else
    sed "s/@domain/$domain/g" $basedir/configmap.yaml.tpl >$basedir/configmap.yaml
	kubectl -n $env apply -f $basedir/configmap.yaml
	if [ $? -ne 0 ];then
	    exit 1
	fi
fi
rm -f $basedir/configmap.yaml