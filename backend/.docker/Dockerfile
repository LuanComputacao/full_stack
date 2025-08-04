FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod 
RUN addgroup -g 1001 -S nodejs && \
    adduser -S app -u 1001 -G nodejs
COPY --from=builder --chown=app:nodejs /app/dist ./dist
RUN mkdir -p /app/data && chown -R app:nodejs /app/data
USER app
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').request('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).end()"

CMD ["node", "dist/index.js"]
