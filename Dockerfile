# Multi-stage Dockerfile для production
# Backend (Django) - будет дополнен в Фазе 5

# Этап 1: Backend
FROM python:3.11-slim as backend

WORKDIR /app/backend

# Системные зависимости для PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
# CMD будет настроен в Фазе 1 (Django)

# Этап 2: Frontend (Next.js) - будет дополнен в Фазе 2
# FROM node:20-alpine as frontend
# WORKDIR /app/frontend
# COPY frontend/package*.json ./
# RUN npm ci --only=production
# COPY frontend/ .
# RUN npm run build
# CMD ["npm", "start"]
