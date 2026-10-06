# Bernice Hairplace Lagos — E-Commerce Store

Luxury raw hair extensions, closures and HD lace units. A React 19 + Vite storefront with Google sign-in,
a Supabase database, Paystack payments, and Mailgun confirmation emails. It is deployed on Vercel from GitHub.

## Tech stack

| Concern | Service |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Auth | Supabase Auth with the **Google** provider (OAuth client from Google Cloud Console) |
| Database | Supabase Postgres with row-level security |
| Payments | Paystack (Inline popup, server-side initialize/verify, and a signed webhook) |
| Email | Mailgun (order confirmations) |
| Hosting | Vercel (static SPA and Node serverless functions in `api/`) |
| CI | GitHub Actions: typecheck and build on every push and PR |

## How it works

**Sign-in.** Customers sign in with Google (Supabase Auth). The first sign-in creates a row in `profiles`.
Browsing and adding to the bag work without an account. **Checkout requires sign-in.** When a customer signs in,
their bag and wishlist merge with their account and stay in sync across devices.

**Checkout and payment.**

1. `POST /api/paystack/initialize` (requires the customer's Supabase access token) validates the delivery details,
   **prices the bag from the catalog on the server**, saves a `pending_payment` order with its `order_items`,
   saves the address to the customer's profile, and starts a Paystack transaction.
2. The Paystack popup opens. When it closes, the browser calls `GET /api/paystack/verify`, which confirms the
   payment with Paystack, checks that the amount matches the order, marks the order `paid`, and sends the
   **Mailgun confirmation email**.
3. `POST /api/paystack/webhook` (signed by Paystack) does the same if the customer closes the browser early.
   Both paths are idempotent: an order is marked paid once and emailed exactly once.

**Data in Supabase.** The tables are `profiles`, `orders`, `order_items`, `cart_items`, `wishlist_items`,
`custom_wig_requests` and `newsletter_subscribers`. Customers can read only their own data. Orders can be created
and changed only by the server. The **product catalog stays in code** (`src/data/products.ts`).

**Managing orders.** Use Supabase → Table Editor → `orders`. Move `status` through
`paid → processing → in_transit → delivered` and optionally set `waybill_number`. Customers see the changes
under **My Orders**.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/migrations/20261006120000_initial_schema.sql` and run it.
   With the Supabase CLI you can instead run `supabase link` and then `supabase db push`.
3. In **Project Settings → API**, copy the Project URL, the anon/publishable key and the service-role key.

### 2. Google sign-in (Google Cloud Console)

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project.
2. Go to **APIs & Services → OAuth consent screen**. Choose *External* and fill in the app name, support
   email and logo. Add the `email`, `profile` and `openid` scopes, then publish the app.
3. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**:
   - **Authorized JavaScript origins**: `https://your-domain.com` and `http://localhost:3000`
   - **Authorized redirect URIs**: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client secret into **Supabase → Authentication → Sign In / Providers → Google** and enable it.
5. In **Supabase → Authentication → URL Configuration**:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: `https://your-domain.com/**`, `http://localhost:3000/**`, and for Vercel previews
     `https://*-<your-vercel-team>.vercel.app/**`

### 3. Mailgun

1. In Mailgun, add and verify a sending domain (for example `mg.bernicehairplace.com`) by adding the DNS records it shows.
2. Create a private API key under **API Security**.
3. Set `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM_EMAIL`, and `MAILGUN_REGION` (`eu` if the domain is in the EU region).
   On a Mailgun sandbox domain, email is delivered only to authorized recipients.

### 4. Paystack

1. Copy your secret key from **Settings → API Keys & Webhooks** into `PAYSTACK_SECRET_KEY`.
2. Set the **Webhook URL** to `https://your-domain.com/api/paystack/webhook`.

### 5. Vercel

1. Import the GitHub repository at [vercel.com/new](https://vercel.com/new). Vite is detected automatically.
2. Add every variable from `.env.example` under **Settings → Environment Variables**.
   Use `sk_test_…` for Preview and `sk_live_…` for Production.
3. Deploy. After this, every push to `main` deploys to production, and every branch or PR gets a preview URL.

## Local development

```bash
npm install
npm run dev          # storefront only at http://localhost:3000 (no /api functions)
```

For sign-in, checkout and email end to end, run the functions too:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
vercel dev --listen 3000
```

Other scripts: `npm run lint` (typecheck), `npm run build`, `npm run preview`.

## Docker (frontend)

The `Dockerfile` builds the storefront with Node and serves it from nginx on port **8080**, with SPA routing,
caching, security headers and a `/healthz` endpoint. The payment functions in `api/` are Vercel serverless
functions, so the container forwards `/api/*` to a deployment that runs them, set by `API_UPSTREAM`.

```bash
# VITE_* values are baked in at build time (public values only)
docker build -t bernice-hairplace-web \
  --build-arg VITE_SUPABASE_URL=https://<ref>.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=<anon-key> \
  --build-arg VITE_WHATSAPP_NUMBER=2348012345678 .

docker run -p 8080:8080 -e API_UPSTREAM=https://your-app.vercel.app bernice-hairplace-web
```

You can also put the values in `.env` and run `docker compose up --build`, then open <http://localhost:8080>.

Notes:

- `API_UPSTREAM` must not end with a slash.
- Add the container's URL (for example `http://localhost:8080/**`) to Supabase's **Redirect URLs** and Google's
  **Authorized JavaScript origins** so Google sign-in can return to it.
- Keep the Paystack webhook pointed at the Vercel deployment directly.

## Project structure

```
api/paystack/        # Vercel functions: initialize, verify, webhook
server/              # Server-only modules: Supabase admin + auth, orders, Paystack, Mailgun, email template
supabase/migrations/ # Database schema, row-level security policies, triggers
src/
  components/        # Header, Footer, CartDrawer, GoogleSignInButton, modals
  context/           # ShopContext: auth, bag/wishlist sync, orders, checkout and payment flow
  data/products.ts   # Product catalog (single source of truth for prices)
  lib/               # pricing, Supabase client, Paystack helpers, order row mapping
  views/             # Home, Catalog, Product, Checkout, Order status, My Orders, etc.
vercel.json          # SPA rewrites (excluding /api), caching and security headers
```
