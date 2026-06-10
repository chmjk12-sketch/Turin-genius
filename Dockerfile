FROM nginx:alpine

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 复制构建产物
COPY dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

EXPOSE 3003

CMD ["nginx", "-g", "daemon off;"]
