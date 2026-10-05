import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Code,
  Lock,
  Database,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
  Terminal,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const { showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'architecture' | 'paystack' | 'database' | 'mailgun' | 'testing'>('architecture');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    showToast('Copied to Clipboard', 'Code snippet ready to use.', 'info');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="flex flex-col w-full bg-[#FBF9F6] min-h-screen">
      {/* Header */}
      <section className="py-12 bg-[#201A18] text-white border-b border-[#2D2623]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded bg-[#725B38] text-white text-[10px] uppercase font-bold tracking-widest">
              Engineering Specification
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-white font-medium">
            Technical Architecture & Payment Implementation
          </h1>
          <p className="text-xs sm:text-sm text-[#D0C4C0] max-w-3xl mt-2 leading-relaxed">
            Production-grade documentation for Bernice Hairplace: Server-side Paystack transaction lifecycle, HMAC SHA512 webhook security, PostgreSQL RLS schema, inventory reservations, and Mailgun transactional pipeline.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-20 z-30 bg-white border-b border-[#EAE8E5] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: 'architecture', label: '1. Core Architecture', icon: Layers },
            { id: 'paystack', label: '2. Paystack Gateway & Webhooks', icon: Lock },
            { id: 'database', label: '3. PostgreSQL Schema & RLS', icon: Database },
            { id: 'mailgun', label: '4. Mailgun Transactional Email', icon: Mail },
            { id: 'testing', label: '5. Automated Testing & E2E', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1A1412] text-white shadow'
                    : 'text-[#4E4542] hover:bg-[#F5F3F0] hover:text-[#1A1412]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-10 py-10 w-full">
        {/* TAB 1: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <h2 className="font-editorial text-2xl text-[#1A1412] font-semibold mb-3">
                System Overview & Sequence Workflow
              </h2>
              <p className="text-xs sm:text-sm text-[#4E4542] leading-relaxed mb-6">
                The architecture establishes strict server-authoritative separation between order creation, payment initialization, client authorization, server verification, and asynchronous webhook reconciliation.
              </p>

              {/* Workflow Flowchart Diagram */}
              <div className="p-6 bg-[#F5F3F0] rounded-xl border border-[#EAE8E5] font-mono text-xs text-[#1A1412] space-y-3 overflow-x-auto">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1A1412] text-white rounded font-bold">1</span>
                  <span>Customer clicks Checkout → Server calculates authoritative total in Kobo subunits</span>
                </div>
                <div className="flex items-center gap-2 pl-6">↓</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1A1412] text-white rounded font-bold">2</span>
                  <span>Server creates <code>pending_payment</code> order & active inventory reservation</span>
                </div>
                <div className="flex items-center gap-2 pl-6">↓</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1A1412] text-white rounded font-bold">3</span>
                  <span>POST <code>https://api.paystack.co/transaction/initialize</code> with secret Bearer header</span>
                </div>
                <div className="flex items-center gap-2 pl-6">↓</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1A1412] text-white rounded font-bold">4</span>
                  <span>Customer pays on hosted Paystack canal → Redirects to callback URL</span>
                </div>
                <div className="flex items-center gap-2 pl-6">↓</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1A1412] text-white rounded font-bold">5</span>
                  <span>Paystack dispatches signed <code>charge.success</code> webhook (HMAC SHA512)</span>
                </div>
                <div className="flex items-center gap-2 pl-6">↓</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#725B38] text-white rounded font-bold">6</span>
                  <span>Order state → <code>PAID</code>, inventory reservation → <code>CONVERTED</code>, Mailgun confirmation sent</span>
                </div>
              </div>
            </div>

            {/* Critical Money Rule Box */}
            <div className="p-6 bg-[#FEDEB2]/40 rounded-2xl border border-[#FEDEB2] flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-[#725B38] shrink-0 mt-1" />
              <div>
                <h3 className="font-editorial text-lg text-[#281800] font-bold mb-1">
                  Critical Financial Security Rules
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-xs text-[#4E4542]">
                  <li>Browser inputs (prices, totals, currency) are strictly untrusted; all line totals are recalculated server-side using database records.</li>
                  <li>Amounts are converted to integer subunits (NGN Naira → Kobo: ₦185,000 → 18,500,000 kobo) avoiding floating point errors.</li>
                  <li>No Paystack Secret Key (<code>PAYSTACK_SECRET_KEY</code>) or Mailgun credentials are ever bundled client-side.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYSTACK */}
        {activeTab === 'paystack' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-editorial text-2xl text-[#1A1412] font-semibold">
                  Paystack Integration Service (Node.js/TypeScript)
                </h2>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `import crypto from 'crypto';\n\nexport async function initializePaystackTransaction(params: {\n  email: string;\n  amountInKobo: number;\n  reference: string;\n  callbackUrl: string;\n  metadata?: Record<string, any>;\n}) {\n  const res = await fetch('https://api.paystack.co/transaction/initialize', {\n    method: 'POST',\n    headers: {\n      Authorization: \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`,\n      'Content-Type': 'application/json',\n    },\n    body: JSON.stringify({\n      email: params.email,\n      amount: params.amountInKobo,\n      reference: params.reference,\n      callback_url: params.callbackUrl,\n      metadata: params.metadata,\n    }),\n  });\n  return res.json();\n}`,
                      'code-init'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3F0] hover:bg-[#EAE8E5] text-xs font-bold uppercase rounded"
                >
                  {copiedSection === 'code-init' ? <Check className="w-4 h-4 text-[#725B38]" /> : <Copy className="w-4 h-4" />}
                  <span>Copy Code</span>
                </button>
              </div>

              <pre className="p-4 bg-[#1A1412] text-[#FEDEB2] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`// lib/payments/paystack.ts
import crypto from 'crypto';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountInKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}): Promise<PaystackInitResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error('Missing PAYSTACK_SECRET_KEY on server');

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${secretKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountInKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  return response.json();
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  const hash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');
  return hash === signatureHeader;
}`}
              </pre>
            </div>

            {/* Webhook Handler code */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <h3 className="font-editorial text-xl text-[#1A1412] font-semibold mb-3">
                HMAC SHA512 Webhook Endpoint (<code>/api/webhooks/paystack</code>)
              </h3>
              <pre className="p-4 bg-[#1A1412] text-[#FEDEB2] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`// app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/payments/paystack';
import { paymentService } from '@/lib/payments/payment-service';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!signature || !verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    const { reference, amount, currency } = event.data;
    await paymentService.reconcileAndFulfillOrder({
      reference,
      amountReceived: amount,
      currency,
      paystackTrxId: event.data.id,
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE & RLS */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <h2 className="font-editorial text-2xl text-[#1A1412] font-semibold mb-3">
                PostgreSQL Schema & Supabase Row Level Security (RLS)
              </h2>
              <pre className="p-4 bg-[#1A1412] text-[#FEDEB2] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`-- supabase/migrations/001_initial_schema.sql

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price BIGINT NOT NULL, -- Stored in NGN
  sku TEXT UNIQUE NOT NULL,
  inventory_quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending_payment', 'paid', 'processing', 'in_transit', 'delivered', 'cancelled')),
  subtotal BIGINT NOT NULL,
  shipping_cost BIGINT NOT NULL DEFAULT 0,
  total BIGINT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  amount BIGINT NOT NULL, -- Stored in Kobo
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL,
  channel TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can only view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: MAILGUN */}
        {activeTab === 'mailgun' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <h2 className="font-editorial text-2xl text-[#1A1412] font-semibold mb-3">
                Mailgun Transactional Order Confirmation Pipeline
              </h2>
              <pre className="p-4 bg-[#1A1412] text-[#FEDEB2] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`// lib/email/mailgun.ts
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export async function sendOrderConfirmationEmail(order: Order) {
  const domain = process.env.MAILGUN_DOMAIN || 'bernicehairplace.com';
  const from = process.env.MAILGUN_FROM_EMAIL || 'concierge@bernicehairplace.com';

  const html = \`
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F5; padding: 40px;">
      <h1 style="font-family: 'Bodoni Moda', serif; color: #1A1412;">Bernice Hairplace Lagos</h1>
      <h2>Payment Confirmed • Order #\${order.orderNumber}</h2>
      <p>Thank you \${order.customerName}, your raw hair selection has been authorized for dispatch.</p>
      <p>Total Paid: ₦\${order.total.toLocaleString('en-NG')}</p>
      <p>Estimated Delivery: \${order.estimatedDelivery}</p>
    </div>
  \`;

  return mg.messages.create(domain, {
    from: \`Bernice Hairplace <\${from}>\`,
    to: [order.customerEmail],
    subject: \`Order Confirmation #\${order.orderNumber} — Bernice Hairplace\`,
    html,
  });
}`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: TESTING */}
        {activeTab === 'testing' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE8E5] shadow-sm">
              <h2 className="font-editorial text-2xl text-[#1A1412] font-semibold mb-3">
                Automated Vitest & Playwright E2E Test Suite
              </h2>
              <pre className="p-4 bg-[#1A1412] text-[#FEDEB2] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`// tests/payments.test.ts
import { describe, it, expect } from 'vitest';
import { convertToPaystackSubunit, verifyPaystackWebhookSignature } from '@/lib/payments/paystack';

describe('Payment Financial Unit Tests', () => {
  it('converts NGN Naira to Paystack Kobo subunits safely', () => {
    expect(convertToPaystackSubunit(185000)).toBe(18500000);
    expect(convertToPaystackSubunit(75000.5)).toBe(7500050);
  });

  it('validates HMAC SHA512 signatures accurately', () => {
    const raw = '{"event":"charge.success","data":{"id":100}}';
    const secret = 'sk_test_mock';
    process.env.PAYSTACK_SECRET_KEY = secret;
    const crypto = require('crypto');
    const validSig = crypto.createHmac('sha512', secret).update(raw).digest('hex');

    expect(verifyPaystackWebhookSignature(raw, validSig)).toBe(true);
    expect(verifyPaystackWebhookSignature(raw, 'invalid_sig')).toBe(false);
  });
});`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
