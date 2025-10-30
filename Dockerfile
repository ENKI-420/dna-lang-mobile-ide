# DNA Lang Mobile IDE - Powered by Red Hat
# Multi-stage build for optimized production image

# Stage 1: Build
FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:latest

# Metadata
LABEL name="DNA Lang Mobile IDE" \
      vendor="DNA Lang Project" \
      summary="Cloud-native mobile IDE for DNA Lang - Powered by Red Hat" \
      description="DNA Lang Mobile IDE provides a comprehensive development environment for DNA programming language, optimized for mobile devices and cloud deployment on Red Hat OpenShift." \
      version="1.0.0" \
      maintainer="DNA Lang Team"

# Set working directory
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production \
    PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run with non-root user (UBI default)
USER 1001

# Start the application
CMD ["npm", "run", "preview"]
