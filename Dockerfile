# Stage 1: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend


COPY src/backend/package*.json ./
RUN npm install


COPY src/backend ./
RUN npm run build

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY src/frontend/package*.json ./
RUN npm install


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY src/frontend ./
# بناء الفرونت إند (تأكد أن الأمر هو vite build فقط لتجاوز أخطاء TypeScript الصارمة)
RUN npm run build

# Stage 3: Production Backend
FROM node:20-alpine AS backend-production
WORKDIR /app

# نسخ الملفات النهائية فقط لتقليل حجم الصورة (Image)
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./

# تثبيت مكتبات التشغيل الضرورية فقط وتجاهل مكتبات التطوير
RUN npm ci --only=production

EXPOSE 5000
# تشغيل السيرفر من الملف المحول (Javascript)
CMD ["node", "dist/src/server.js"]

# Stage 4: Production Frontend (Nginx)
FROM nginx:alpine AS frontend-production
# نسخ ملفات الموقع النهائية لمجلد Nginx الافتراضي
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
# نسخ ملف إعدادات Nginx الخاص بك لربط المسارات
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]