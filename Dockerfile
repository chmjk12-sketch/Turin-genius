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

FROM nginx:alpine
WORKDIR /app

# Install node for backend
RUN apk add --no-cache nodejs curl

# Copy frontend build
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy backend
COPY --from=server-builder /server /app/server

# Copy nginx config (just server block, conf.d/ style)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["/app/start.sh"]
