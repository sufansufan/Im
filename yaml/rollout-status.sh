#!/bin/bash
if [ "$1" == "" ];then
	echo "miss env"
	echo "Usage:$0 {dev|qa|pre|default|bh}"
	exit 1
else
	env=$1
fi
kubectl -n $env rollout status deployment/im-webui