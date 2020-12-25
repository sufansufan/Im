#!/bin/bash
if [ "$1" == "" ];then
	echo "miss env and miss verison"
	echo "Usage:$0 {dev|qa|pre|default|bh} {version}"
	exit 1
elif [ "$2" == "" ];then
	echo "miss version"
	echo "Usage:$0 {dev|qa|pre|default|bh} {version}"
	exit 1
else
	env=$1
	version=$2
fi
case $env in
    dev|qa|pre|bh)
        nodetype=test
        ;;
    default)
        nodetype=prod
        ;;
esac
basedir=$(cd $(dirname $0);echo $(pwd))
kubectl -n $env get deployment im-webui
if [ $? = 0 ];then
	sed "s/@version/$version/g;s/@timestamp/$(date -u +%FT%TZ)/g;s/@nodetype/$nodetype/g" $basedir/deployment.yaml.tpl >$basedir/deployment.yaml
	kubectl -n $env replace -f $basedir/deployment.yaml
	if [ $? -ne 0 ];then
	    exit 1
	fi
else
	sed "s/@version/$version/g;s/@timestamp/$(date -u +%FT%TZ)/g;s/@nodetype/$nodetype/g" $basedir/deployment.yaml.tpl >$basedir/deployment.yaml
	kubectl -n $env apply -f $basedir/deployment.yaml
	if [ $? -ne 0 ];then
	    exit 1
	fi
fi
rm -f $basedir/deployment.yaml