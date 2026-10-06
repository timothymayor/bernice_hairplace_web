# syntax=docker/dockerfile:1

# ── Build stage: compile the Vite storefront ──
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at build time, so they are build args (public values only, never secrets).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_WHATSAPP_NUMBER
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

RUN npm run build

# ── Runtime stage: serve static files with nginx ──
FROM nginx:1.27-alpine AS runtime

# nginx renders /etc/nginx/templates/*.template with envsubst at startup.
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Where /api/* is forwarded (a deployment running the Vercel functions), e.g. https://bernicehairplace.com
ENV API_UPSTREAM=https://bernicehairplace.com
# Only substitute our variable so nginx's own $variables are left intact.
ENV NGINX_ENVSUBST_FILTER=^API_UPSTREAM$

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
