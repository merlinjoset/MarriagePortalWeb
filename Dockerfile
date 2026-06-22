# ---- Dependencies ----
FROM node:22-slim AS deps
WORKDIR /app
RUN npm install -g pnpm@11.8.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM node:22-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11.8.0
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined at build time, so the API URL must be known here.
# Render passes service env vars to the build; declare it as a build arg.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

# ---- Runtime (Next.js standalone) ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# server.js honours $PORT, which Render sets at runtime (fallback 3000 for local runs).
ENTRYPOINT ["sh", "-c", "node server.js"]
