apiVersion: apps/v1
kind: Deployment
metadata: 
  name: im-webui
  labels:
    name: im
spec:
  replicas: 1
  selector:
    matchLabels:
      k8s-app: im-webui
  template:
    metadata:
      annotations:
        aliyun.kubernetes.io/deploy-timestamp: @timestamp
      labels:
        k8s-app: im-webui
        name: im
    spec:
      nodeSelector:
        type: @nodetype
      containers:
        - name: im-webui
          image: registry-vpc.cn-zhangjiakou.aliyuncs.com/jdyh/im-webui:@version
          imagePullPolicy: Always
          volumeMounts:
            - name: timezone
              mountPath: /etc/timezone
              readOnly: True
            - name: localtime
              mountPath: /etc/localtime
              readOnly: True
            - name: default-conf
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: default.conf
      imagePullSecrets:
        - name: registrysecret
      volumes:
        - name: timezone
          hostPath:
            path: /etc/timezone
        - name: localtime
          hostPath:
            path: /etc/localtime
        - name: default-conf
          configMap:
            name: im-webui
            items:
              - key: default.conf
                path: default.conf