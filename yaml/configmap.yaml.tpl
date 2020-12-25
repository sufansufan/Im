apiVersion: v1
kind: ConfigMap
metadata:
  name: im-webui
  labels:
    name: im
data:
  default.conf: |
    server {
      listen  80;
      server_name  @domain;
      root /usr/share/nginx/html;
      index index.html;
    }
