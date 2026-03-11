# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 nginx:alpine AS runner

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built site from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config: serve SPA-style with fallback to index.html for 404s
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
