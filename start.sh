#!/bin/sh
# 启动后端 API 服务
cd /app/server && node index.js &

# 启动 nginx
nginx -g "daemon off;"
