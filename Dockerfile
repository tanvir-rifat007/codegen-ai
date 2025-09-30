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
FROM golang:1.24-alpine AS backend-builder

WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy entire project
COPY . .

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist
# If your build outputs to 'build' instead of 'dist', use:
# COPY --from=frontend-builder /app/build ./build

# Build Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/api

# Stage 3: Final Runtime
FROM alpine:latest

# Install CA certificates and timezone data
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the Go binary
COPY --from=backend-builder /app/app .

# Copy the built frontend
COPY --from=backend-builder /app/dist ./dist
# If using 'build' folder:
# COPY --from=backend-builder /app/build ./build

# Copy email templates (adjust path as needed)
COPY --from=backend-builder /app/internal/mailer/templates ./internal/mailer/templates

# Expose port (Railway will use PORT env var, but default to 8080)
EXPOSE 8080

# Run the application
CMD ["./app"]
