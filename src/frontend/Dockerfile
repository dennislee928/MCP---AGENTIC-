# Next.js 前端 Dockerfile
FROM node:18-alpine AS base

# ============================================
# 依賴階段
# ============================================
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 複製 package 檔案
COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# 建置階段
# ============================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 建置 Next.js 應用
RUN npm run build

# ============================================
# 生產階段
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 建立非 root 使用者
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製必要檔案
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

