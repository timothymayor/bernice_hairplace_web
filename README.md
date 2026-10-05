# 👑 Bernice Hairplace Lagos — Production E-Commerce Store

> Luxury Raw Hair Extensions, Bespoke Couture Units & HD Lace Closures. Crafted with 100% single-donor cuticle-aligned hair for discerning clientele across Lagos, Abuja, London, and worldwide.

---

## 🚀 Live Demo & Preview

- **Vite SPA** built with React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, and Canvas Confetti.
- Integrated **Paystack Multi-Channel Checkout** simulation with 256-bit SSL encryption.
- **Instant Search & Multi-Criteria Filtering** (names, descriptions, categories, price ranges, textures).
- **VIP Studio Concierge & Head Measurement Custom Couture Wig Builder**.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography**: Bodoni Moda (Editorial Display Serif) & Plus Jakarta Sans (Modern Clean Sans)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Deployment Targets**: [Vercel](https://vercel.com/) / [GitHub Pages](https://pages.github.com/) / [Netlify](https://www.netlify.com/)

---

## 📦 How to Deploy on GitHub

### 1. Initialize Git and Push to GitHub

```bash
# 1. Initialize a new Git repository (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial release of Bernice Hairplace Lagos e-commerce store"

# 4. Create a repository on GitHub (e.g. named 'bernice-hairplace-ecommerce')
# Link your local repo to GitHub:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/bernice-hairplace-ecommerce.git

# 5. Push to GitHub
git push -u origin main
```

---

## ⚡ How to Deploy on Vercel

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Log in with your **GitHub account**.
3. Import your `bernice-hairplace-ecommerce` repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. *(Optional)* In the **Environment Variables** section, configure the variables listed in `.env.example`:
   ```env
   VITE_APP_URL=https://your-domain.vercel.app
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
   ```
6. Click **Deploy**. Your luxury store will be live in ~30 seconds with automatic HTTPS and global edge CDN caching!

---

### Method 2: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Log in to your Vercel account
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server (running on http://localhost:3000)
npm run dev

# 4. Run type checking & linting
npm run lint

# 5. Build for production
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated GitHub Actions CI workflow
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Brand header with live search & cart counter
│   │   ├── Footer.tsx         # Studio assurance, newsletter & links
│   │   ├── CartDrawer.tsx     # Luxury slide-out shopping bag
│   │   ├── PaystackModal.tsx  # Secure Paystack payment handshake simulator
│   │   ├── QuickViewModal.tsx # Fast product preview & length selection
│   │   └── WhatsAppConciergeModal.tsx # VIP custom consultation modal
│   ├── context/
│   │   └── ShopContext.tsx    # State store for cart, currency, filters, orders
│   ├── data/
│   │   ├── products.ts        # Comprehensive catalog of raw bundles & wigs
│   │   └── initialData.ts     # User profile, addresses & past order history
│   ├── types/
│   │   └── index.ts           # Type definitions for products, cart, and orders
│   ├── views/
│   │   ├── HomeView.tsx       # Editorial homepage with visualizer & bestsellers
│   │   ├── CatalogView.tsx    # Search, category filters & price sliders
│   │   ├── ProductDetailView.tsx # Multi-angle gallery & length selector
│   │   ├── CheckoutView.tsx   # Multi-step checkout with delivery options
│   │   ├── PaymentStatusView.tsx # Order confirmation & tracking
│   │   ├── AccountView.tsx    # Customer dashboard & order history
│   │   ├── CollectionsView.tsx # Curated category showcase
│   │   ├── AboutView.tsx      # Sourcing manifesto & hair science
│   │   ├── CustomOrderModal.tsx # Head measurement & bespoke wig builder
│   │   └── DocumentationView.tsx # Technical architecture & API integration
│   ├── App.tsx                # App root with view routing & notification toasts
│   ├── index.css              # Custom typography and styling
│   └── main.tsx               # Application entry point
├── vercel.json                # Vercel deployment & routing configuration
├── index.html                 # HTML entry with SEO & Google Fonts
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── tsconfig.json              # TypeScript strict configuration
└── package.json               # Scripts & dependencies
```

---

## 🔒 Security & Performance Features

- **SPA Routing Rewrite**: Configured in `vercel.json` to prevent 404s on deep links and sub-routes.
- **Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `X-XSS-Protection`.
- **Immutable Asset Caching**: 1-year CDN caching on static Vite bundles in `/assets/`.
- **Zero Runtime Errors**: 100% typechecked with strict TypeScript compiler rules.
