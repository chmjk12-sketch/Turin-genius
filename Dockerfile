FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS server-builder
WORKDIR /server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

FROM node:22-alpine
WORKDIR /app

# 安装 nginx
RUN apk add --no-cache nginx curl

# 复制前端构建产物
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# 复制后端代码
COPY --from=server-builder /server /app/server

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

EXPOSE 3003

CMD ["/app/start.sh"]