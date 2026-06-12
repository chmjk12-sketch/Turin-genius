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

# Install nginx
RUN apk add --no-cache nginx curl

# Copy frontend build output
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy backend code
COPY --from=server-builder /server /app/server

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure nginx main.conf exists and includes conf.d
RUN mkdir -p /etc/nginx/conf.d && \
    if [ ! -f /etc/nginx/nginx.conf ]; then \
      echo 'worker_processes auto;\nerror_log /var/log/nginx/error.log warn;\npid /var/run/nginx.pid;\nevents { worker_connections 1024; }\nhttp {\n  include /etc/nginx/mime.types;\n  default_type application/octet-stream;\n  sendfile on;\n  keepalive_timeout 65;\n  include /etc/nginx/conf.d/*.conf;\n}' > /etc/nginx/nginx.conf;\n    fi

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

EXPOSE 3003

CMD ["/app/start.sh"]
