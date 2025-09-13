# Use Bun's official image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
WORKDIR /app/apps/api
RUN bun run db:generate

# Build the application
WORKDIR /app
RUN bun run build

# Production stage
FROM oven/bun:1-slim as production
WORKDIR /app

# Copy built application
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=base /app/package.json ./

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["bun", "run", "--cwd", "apps/api", "start"]


