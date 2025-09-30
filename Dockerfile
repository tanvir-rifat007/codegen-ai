# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy frontend source
COPY . .
# Build frontend (outputs to dist/ or build/)
RUN npm run build

# Stage 2: Build Go Backend
FROM golang:1.24-bookworm AS backend-builder
WORKDIR /app
# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download
# Copy entire project
COPY . .
# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist
# Build Go application with CGO enabled (required for v8go)
RUN CGO_ENABLED=1 go build -o app ./cmd/api

# Stage 3: Final Runtime
FROM debian:bookworm-slim
# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    tzdata \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Copy the Go binary
COPY --from=backend-builder /app/app .
# Copy the built frontend
COPY --from=backend-builder /app/dist ./dist
# Copy App.js (needed at runtime)
COPY --from=backend-builder /app/App.js .
# Copy email templates (adjust path as needed)
COPY --from=backend-builder /app/internal/mailer/templates ./internal/mailer/templates
# Expose port
EXPOSE 8080
# Run the application
CMD ["./app"]
