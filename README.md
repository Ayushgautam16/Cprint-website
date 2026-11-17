# RYNOCHI – Premium Custom Printing & Personalized Gifting E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-02042b?style=flat-square&logo=razorpay)](https://razorpay.com/)

**RYNOCHI** is a production-ready, luxury customized printing and personalized gifting e-commerce platform. Designed for discerning executives, corporate organizations, and personal celebrations, the platform pairs an **Apple-grade editorial shopping experience** with an **interactive real-time laser engraving preview studio**, full-funnel checkout with **Razorpay**, comprehensive **12-stage order lifecycle tracking**, and a **dedicated operations admin dashboard**.

---

## 🌟 Brand Identity & Aesthetic Direction

The platform's visual design system is guided by the official **RYNOCHI Golden Identity**:
- **Deep Navy Blue:** `#0B132B`, `#070C1E`, `#101B3B`
- **Metallic & Champagne Gold:** `#D4AF37`, `#F3E5AB`, `#C5A059`, `#AA8417`
- **Warm White & Soft Ivory:** `#FDFBF7`, `#FAF6EE`, `#EDE3CB`
- **Subtle Slate Greys:** `#1C2541`, `#3A4750`, `#64748B`
- **Typography:**
  - Headings: *Cinzel* & *Playfair Display* (Classical Roman & Editorial Serif)
  - Body: *Montserrat* & *Inter* (Legible Modern Geometric Sans)
  - Signature Engravings: *Great Vibes* (Flowing Royal Calligraphy)

---

## 🚀 Key Functional Modules

### 1. Customer Storefront & Editorial Homepage
- **Promotional Announcement Bar:** Admin-configurable top banner with free shipping counters.
- **Hero Showcase:** Visual product presentation featuring official RYNOCHI photography, metallic typography, and direct customization CTAs.
- **Curated Category Grid:** Personalized Pens, Premium Metal Pens, Styluses, Handcrafted Diaries, Corporate Sets, and Executive Accessories.
- **Bestseller Grid:** Highlighting savings percentages, stock statuses, and quick customization links.
- **3-Step Customization Experience:** Interactive visualization (*Choose -> Personalize -> Preview & Order*).
- **Hallmark Trust Pillars:** 0.02mm Fiber Laser Precision, 24–48h Express Dispatch, 100% Free Defect Replacement Guarantee.
- **Corporate & Bulk Gifting Suite:** Volume pricing tiers (25 to 1,000+ units) and instant RFP submission.
- **Interactive FAQ Accordion & Verified Reviews:** Genuine patron feedback and answers to customization questions.

### 2. Live Product Customization & Laser Mockup Engine
- **Dedicated Product Detail Pages (`/product/[slug]`):**
  - **Left Gallery:** Multi-image carousel with hover-zoom lens and angle inspector.
  - **Right Customization Studio:**
    - Live text input with real-time character counters.
    - Typography style selector (*Cinzel*, *Great Vibes*, *Playfair*, *Montserrat*).
    - Engraving placement toggle (*Brass Plaque*, *Pen Barrel*, *Pen Cap*).
    - Artwork/logo file uploader supporting PNG, SVG, PDF, and JPG (with 10MB client-side validation).
    - Live Mockup Canvas showing the laser mark simulated directly on the product's brass plate or lacquered metal barrel with light reflections.
    - Special instructions for master craftsmen.
    - Instant price recalculation including variant adjustments and artwork setup fees.

### 3. Shopping Bag & Checkout
- **Slide-Over Quick Cart Drawer:** Real-time item management, engraving details summary, and free shipping progress meter.
- **Full Cart Page (`/cart`):** Coupon code engine (try `RYNOCHI10` for 10% off), breakdown of GST (18%) and shipping fees.
- **Secure Checkout (`/checkout`):**
  - Guest & authenticated customer checkout.
  - Indian address validation (PIN Code, State, City).
  - Server-side price verification (prevents client-side price tampering).
  - Payment options: **Razorpay Online Payment** (UPI, Credit/Debit Cards, Net Banking) and **Cash on Delivery**.

### 4. Payment Gateway & Server-Side Security
- **Backend Order Creation:** `/api/razorpay/create-order` creates secure orders via the Razorpay SDK.
- **HMAC-SHA256 Signature Verification:** `/api/razorpay/verify-payment` verifies payment signatures cryptographically on the server.
- **Resilient Fallback & Sandbox Mode:** Smooth mock simulation for development and testing environments without API credential friction.

### 5. 12-Stage Order Lifecycle Tracking (`/track-order`)
Customers and administrators can track progress through 12 discrete milestones:
1. `ORDER_PLACED`
2. `PAYMENT_CONFIRMED`
3. `CUSTOMIZATION_UNDER_REVIEW`
4. `DESIGN_APPROVAL_PENDING`
5. `DESIGN_APPROVED`
6. `PROCESSING`
7. `PRINTING_ENGRAVING`
8. `QUALITY_CHECK`
9. `PACKED`
10. `SHIPPED` (Includes courier name and live AWB tracking link)
11. `OUT_FOR_DELIVERY`
12. `DELIVERED`

### 6. Full-Featured Admin Operations Portal (`/admin`)
- **Dashboard Overview (`/admin`):** Real-time gross revenue, order volume, active production bench queues, and low-stock alerts.
- **Orders & Customization Desk (`/admin/orders`):**
  - Search by Order ID, customer name, email, or telephone.
  - Filter by lifecycle stage.
  - Review exact customer engraving texts, chosen fonts, and download vector logos.
  - Update order status across all 12 stages, record Courier AWB tracking numbers, and add internal notes.
- **Product Management (`/admin/products`):**
  - Add, edit, or delete products and variants.
  - Toggle laser customization capability, featured status, and bestseller badges.
  - Adjust base and discount pricing.
- **Inventory Ledger (`/admin/inventory`):**
  - Live stock balances with quick +/- adjustments (+5, -5, +25 restock shortcuts).
  - Visual low-stock alert thresholds.
- **Customer Directory (`/admin/customers`):** Lifetime spend tracking and patron order histories.
- **Website Settings (`/admin/settings`):**
  - Update WhatsApp business phone number.
  - Manage announcement bar copy and toggle status.
  - Configure free shipping threshold and tax rates.

### 7. Omnipresent WhatsApp Concierge Integration
- **Floating Concierge Widget:** One-click WhatsApp bubble on every page.
- **Prefilled Message Generator:** Automatically generates customer name, chosen product SKU, engraved text, and quantity into the chat draft.
- **Direct Order Inquiries:** Available from Product Pages, Cart, Checkout, and Order Tracking.

### 8. Comprehensive SEO & Structured Data
- Server-side rendered pages with unique meta titles and descriptions.
- JSON-LD Schema markup:
  - `Organization` (RYNOCHI brand entity, contacts, social profiles).
  - `Product` & `Offer` (SKU, pricing, stock availability, ratings).
  - `BreadcrumbList` (Hierarchical store navigation).
- Dynamic `sitemap.xml` (`/sitemap.ts`) and `robots.txt` (`/robots.ts`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with custom metallic gold gradients & shadows |
| **Icons & UI** | Lucide React |
| **Database ORM** | Prisma ORM with PostgreSQL schema (26 entities & relations) |
| **State & Persistence** | Resilient dual-layer store (LocalStorage client cache + In-memory server fallback) |
| **Payment Gateway** | Razorpay Node.js SDK & Checkout Client |
| **Security** | Bcrypt password hashing, JWT sessions, HMAC signature verification |

---

## 📦 Project Directory Structure

```
Cprint-website/
├── prisma/
│   ├── schema.prisma           # Full PostgreSQL Prisma schema (26 models & enums)
│   └── seed.js                 # Database seed script for production data
├── public/
│   └── images/
│       ├── brand/              # RYNOCHI brand logos and emblems
│       └── products/           # Authentic uploaded product photography:
│           ├── diary-pen-giftset-box.jpg
│           ├── pen-imperial-blue-gold.jpg
│           ├── pen-emerald-prestige-stylus.jpg
│           ├── diary-tan-feature-guide.jpg
│           └── giftset-diary-pen-showcase.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Announcement, Navbar, Cart, Footer)
│   │   ├── page.tsx            # Full Homepage
│   │   ├── shop/page.tsx       # Dynamic catalogue with faceted filtering
│   │   ├── category/[slug]/    # Category-specific listing pages
│   │   ├── product/[slug]/     # Product studio & live customization engine
│   │   ├── cart/page.tsx       # Cart page with coupon discounts
│   │   ├── checkout/page.tsx   # Razorpay checkout & COD form
│   │   ├── track-order/        # 12-stage order tracker
│   │   ├── payment/            # Success & failure callbacks
│   │   ├── account/            # Customer account portal
│   │   ├── login/ & register/  # Authentication with 1-click evaluation shortcuts
│   │   ├── corporate/          # Bulk gifting volume calculator & RFP form
│   │   ├── about/ & contact/   # Heritage story and studio contact
│   │   ├── faqs/               # Interactive FAQ accordion
│   │   ├── sitemap.ts & robots.ts # Technical SEO files
│   │   ├── privacy-policy/, terms-and-conditions/, shipping-policy/, refund-cancellation-policy/
│   │   ├── admin/              # Management Dashboard
│   │   │   ├── page.tsx        # Overview & analytics
│   │   │   ├── orders/         # Order inspection & stage progression
│   │   │   ├── products/       # Catalogue CRUD & variant editing
│   │   │   ├── inventory/      # Stock tracking & restock shortcuts
│   │   │   ├── customers/      # Customer lifetime value directory
│   │   │   └── settings/       # Storefront & WhatsApp configuration
│   │   └── api/                # Backend API Routes
│   │       ├── orders/         # Order creation & retrieval
│   │       └── razorpay/       # Payment creation & HMAC signature verification
│   ├── components/             # Reusable UI Components
│   │   ├── brand/              # Vector golden Logo & Crest Emblem
│   │   ├── layout/             # AnnouncementBar, Navbar, Footer, CartDrawer, FloatingWhatsApp
│   │   ├── home/               # HeroSection, FeaturedCategories, BestsellerGrid, CustomizationStepSection, etc.
│   │   └── product/            # CustomizationEngine, EngravingPreviewCanvas, ProductGallery, ProductCard
│   └── lib/                    # Core utilities, types, mock data, and store
│       ├── types.ts            # TypeScript interfaces
│       ├── utils.ts            # Currency, date, and formatting helpers
│       ├── mockData.ts         # Rich seed catalog matching uploaded assets
│       ├── store.ts            # Reactive client/server store & cart hook
│       ├── razorpay.ts         # Razorpay keys & signature verification
│       └── seo.ts              # JSON-LD structured data generators
├── .env.example                # Sample environment variables
└── README.md                   # System documentation
```

---

## ⚡ Local Setup & Development Instructions

### 1. Prerequisites
- **Node.js:** v18.17+ or v20+ (Node v26 verified)
- **Package Manager:** `npm`

### 2. Installation
Navigate into the repository directory and install all required dependencies:
```bash
cd Cprint-website
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your parameters (works out-of-the-box in test mode without external dependencies):
```ini
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rynochi_db?schema=public"
JWT_SECRET="rynochi_luxury_jwt_secret_key_change_in_production_2026"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_RYNOCHI_DEMO_KEY"
RAZORPAY_KEY_ID="rzp_test_RYNOCHI_DEMO_KEY"
RAZORPAY_KEY_SECRET="rynochi_mock_secret_key_test_mode"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

### 4. Database Setup (Optional if connecting PostgreSQL)
Generate Prisma Client:
```bash
npm run prisma:generate
```
Push the schema to your PostgreSQL instance:
```bash
npm run prisma:push
```
Run the seed script:
```bash
npm run prisma:seed
```

### 5. Running the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

<<<<<<< HEAD
=======


>>>>>>> origin/main
## 🚀 Production Deployment Guide

### Deploying to Vercel
1. Push the code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete RYNOCHI personalized gifting platform"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the root directory to `Cprint-website` if needed.
4. Add the environment variables from `.env.local`.
5. Deploy!
