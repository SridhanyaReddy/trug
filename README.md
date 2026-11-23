# TRUG 🛒

<div align="center">

**Enterprise Hyperlocal Quick-Commerce Engine**

*Direct-from-neighbourhood store fulfillment with guaranteed ₹0 delivery fees.*

[![Live Platform](https://img.shields.io/badge/Production-withtrug.com-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://withtrug.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📌 Executive Summary

**TRUG** is an enterprise-grade hyperlocal quick-commerce application designed to connect urban residential communities directly with neighborhood retail partners, artisanal bakers, local organic grocers, and fresh daily dairy producers. 

Unlike conventional dark-store quick-commerce models that run on high real-estate overheads and delivery surcharges, TRUG orchestrates direct dispatch from verified brick-and-mortar neighborhood stores to doorstep in **10–15 minutes**, backed by a permanent **₹0 delivery fee** guarantee.

---

## ⚡ Core Technical Features

### 1. Dual-Engine Geolocation & Interactive Map Pinpoint
- **Hardware-Level Geolocation:** Native browser GPS integration with high-accuracy query options.
- **Draggable Map Interface:** Built with Leaflet and OpenStreetMap geocoding proxies, enabling users to fine-tune doorstep delivery pins directly on an interactive tile map.
- **Server-Side Reverse Geocoding Proxy:** Integrated proxy API (`/api/geo/geocode` & `/api/geo/ip`) bypassing client CORS restrictions to resolve road, suburb, and locality names reliably.
- **Network Locality Fallback:** Automated IP geolocation failover calibrated for Hyderabad metro areas (Dundigal, Jubilee Hills, Gachibowli, Madhapur, Kondapur).

### 2. Intelligent Fulfillment & Slot Scheduling
- **Instant Express Dispatch:** Sub-15-minute fulfillment workflow with live order telemetry.
- **Scheduled Windows:** Morning (06:00–09:00), Afternoon (12:00–15:00), and Evening (18:00–21:00) delivery windows for bulk groceries and meal planning.
- **Daily Recurring Subscriptions:** Automated subscription engine for daily fresh milk, bread, farm eggs, and greens with pause/resume controls.

### 3. Zepto-Style Mobile UX Architecture
- **Responsive Viewport Configuration:** Capped viewports with touch-first controls, custom mobile address sheets, and slide-over drawers.
- **Fixed Mobile Navigation Dock:** Native-app feel with bottom tab navigation (`Home`, `Stores`, `Daily`, `Basket`, `Account`) wrapped in Next.js Partial Prerendering suspense boundaries.
- **Floating Cart Pill:** Auto-elevating floating cart summary positioned above navigation bars with real-time item count badges and price calculation.

### 4. Integrated Payment & TRUG Wallet System
- **In-App Pre-Paid Wallet:** Stored-value ledger for 1-click order placement, balance top-ups, and automated transaction logs.
- **Multi-Method Checkout:** Cash on Delivery (COD), UPI, Card/NetBanking, and Wallet deduction.
- **Zero Surcharge Engine:** Strict ₹0 packaging fees and ₹0 delivery fees applied across all transaction types.

### 5. Live Telemetry & Direct WhatsApp Concierge
- **Real-Time Order Lifecycle:** Visual step progression (`Order Placed` ➔ `Confirmed by Merchant` ➔ `Rider Picked Up` ➔ `Out for Delivery` ➔ `Delivered`).
- **Direct Dispatch WhatsApp Hook:** Automated one-click WhatsApp customer support pipeline routed directly to operations at `+91 95158 03954`.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TRUG CLIENT APPLICATION                         │
├───────────────────────────────────┬────────────────────────────────────┤
│  Storefront Experience (App Router) │  State & Context Engines          │
│  • Home & Catalog (/shops)        │  • CartContext (Local & Cloud Sync)│
│  • Category Flow (/categories)    │  • Wallet & Addresses Engine       │
│  • Recurring Subscriptions        │  • AuthModal & OTP Flow            │
├───────────────────────────────────┴────────────────────────────────────┤
│                         NEXT.JS API BACKEND                            │
├────────────────────────────────────────────────────────────────────────┤
│  • /api/products          • /api/categories      • /api/customer       │
│  • /api/orders/place      • /api/geo/geocode     • /api/customer/wallet│
│  • /api/customer/addresses• /api/geo/ip          • /api/health         │
├────────────────────────────────────────────────────────────────────────┤
│                       DATA & EXTERNAL SERVICES                         │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 🐘 Supabase PG    │ 🗺️ Leaflet / OSM  │ 💬 WhatsApp Business API       │
│ Database & Auth   │ Map Geocoding     │ Direct Operational Support     │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 🛠️ Technology Matrix

| Domain | Technology / Library | Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (Turbopack) | Server/Client components, SSR, and dynamic streaming |
| **Language** | TypeScript 5.x | Strict end-to-end typing across models and API contracts |
| **Styling** | Tailwind CSS v4 | Responsive utility design system with customized warm TRUG palette |
| **Icons** | Lucide React | Unified iconography system |
| **Maps & GIS** | Leaflet & React-Leaflet | Draggable pin canvas, dynamic tile layer rendering |
| **Database** | Supabase (PostgreSQL) | Managed database storage with connection pooling |
| **Deployment** | Vercel Edge Network | Global CDN caching, edge serverless API routes |

---

## 📂 Project Structure

```text
trug/
├── frontend/
│   ├── public/                 # Static assets, SVG icons, logo assets
│   ├── src/
│   │   ├── app/                # Next.js App Router routes & API endpoints
│   │   │   ├── api/            # Serverless API routes (geo, orders, wallet, customer)
│   │   │   ├── categories/     # Dynamic category browsing
│   │   │   ├── product/        # Product detail pages
│   │   │   ├── recurring/      # Daily subscription management
│   │   │   ├── shops/          # Neighbourhood store discovery
│   │   │   ├── profile/        # Customer address book & order history
│   │   │   ├── layout.tsx      # Root layout with responsive viewport & meta
│   │   │   └── page.tsx        # Homepage hero, categories, and storefront
│   │   ├── components/         # Reusable UI component library
│   │   │   ├── AppShell.tsx    # Responsive shell, floating cart, drawers
│   │   │   ├── Header.tsx      # Responsive header with location selector
│   │   │   ├── MobileBottomNav # Zepto-style fixed mobile navigation dock
│   │   │   ├── RealMapLocation # Draggable Leaflet map modal with GPS detect
│   │   │   ├── CartDrawer.tsx  # Slide-over checkout drawer
│   │   │   └── FAQSection.tsx  # Customer FAQ with direct WhatsApp trigger
│   │   ├── context/            # Global React Context providers (Cart, Auth)
│   │   ├── services/           # Supabase live database connection utilities
│   │   └── types/              # Type definitions and Supabase schema types
│   ├── next.config.ts          # Turbopack & Next.js production configuration
│   ├── package.json            # Project dependencies and script declarations
│   └── tsconfig.json           # Strict TypeScript compiler options
└── README.md                   # Enterprise project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm** or **pnpm**
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SridhanyaReddy/trug.git
   cd trug/frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env.local` inside the `frontend/` directory:
   ```env
   # Supabase Database Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Operational Support Configuration
   NEXT_PUBLIC_SUPPORT_PHONE=9515803954
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Execute Production Build Verification:**
   ```bash
   npm run build
   ```

---

## 🚢 Production Deployment

The project is configured for continuous zero-downtime deployment on **Vercel**:

1. Link the GitHub repository to Vercel.
2. Select **Next.js** framework preset.
3. Configure **Root Directory** as `frontend`.
4. Add environment variables under project settings.
5. Deploy — builds automatically through Next.js 16 Turbopack pipeline.

---

## 📞 Support & Community

- **Official Web Portal:** [withtrug.com](https://withtrug.com)
- **Direct WhatsApp Concierge:** [+91 95158 03954](https://wa.me/919515803954?text=Hi%20TRUG%20Support)
- **Primary Service Metro:** Hyderabad, India

---

<div align="center">

Copyright &copy; 2026 **TRUG by Focsera**. All rights reserved.  
*Empowering local neighbourhood commerce.*

</div>
