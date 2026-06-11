FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  location / { \
    try_files $uri $uri/ /index.html; \
    add_header Cache-Control "no-cache, no-store, must-revalidate"; \
  } \
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
    try_files $uri =404; \
    add_header Cache-Control "public, max-age=31536000, immutable"; \
  } \
  location /health { return 200 "OK"; } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
