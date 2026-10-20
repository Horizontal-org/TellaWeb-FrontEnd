FROM node:22-alpine AS base

ENV NEXT_REDIRECT_API_URL=http://api:3001
ENV NEXT_PUBLIC_API_URL=/api

# Install dependencies only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
# Exactly what package-lock.json lists. If this fails with "Missing: … from lock file", the
# lockfile was rewritten by an older npm 11 (e.g. 11.6) that drops entries npm 10 needs; see CLAUDE.md
RUN npm ci

COPY . .
RUN npm run build

# Keep only what `next start` needs in the final image: runtime dependencies (no Jest, ESLint,
# Playwright…) and no build cache (Next recreates .next/cache for optimized images at runtime)
RUN npm prune --omit=dev && rm -rf .next/cache

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]
