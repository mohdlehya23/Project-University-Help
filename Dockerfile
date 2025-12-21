# Stage 1: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY src/backend/package*.json ./
RUN npm ci
COPY src/backend ./
RUN npm run build

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY src/frontend/package*.json ./
RUN npm ci
COPY src/frontend ./
RUN npm run build

# Stage 3: Production Backend
FROM node:20-alpine AS backend-production
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./
RUN npm ci --only=production
EXPOSE 5000
CMD ["node", "dist/src/server.js"]

# Stage 4: Production Frontend (Nginx)
FROM nginx:alpine AS frontend-production
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
