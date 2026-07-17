# ─────────────────────────────────────────────
# Stage 1: Build Frontend
# ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Production Server
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy database scripts
COPY database/ ./database/

EXPOSE 5000

WORKDIR /app/backend
CMD ["node", "server.js"]
