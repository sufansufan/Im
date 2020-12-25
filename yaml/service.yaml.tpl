apiVersion: v1
kind: Service
metadata:
  name: im-webui
  labels:
    name: yunwei
spec:
  selector:
    k8s-app: im-webui
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP