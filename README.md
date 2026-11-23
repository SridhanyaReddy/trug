# TRUG by Focsera 🛒

[![Production Status](https://img.shields.io/badge/Status-Live%20Production-2ea44f?style=for-the-badge&logo=vercel)](https://withtrug.com)
[![Next.js](https://img.shields.io/badge/Next.js%2016-Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

> **TRUG** is an enterprise-grade, high-performance hyperlocal commerce engine connecting urban residential neighbourhoods with verified local artisans, organic grocers, dairy providers, and neighbourhood stores — delivering everyday essentials with **₹0 delivery fee**.

🌐 **Live Platform**: [https://withtrug.com](https://withtrug.com)  
📱 **Support & Operations**: `+91 95158 03954`  
📍 **Primary Hub**: Hyderabad (Dundigal, Jubilee Hills, Gachibowli, Madhapur, Kondapur)

---

## 📑 Table of Contents
- [Architectural Overview](#-architectural-overview)
- [Key Platform Features](#-key-platform-features)
- [Multi-Portal Ecosystem](#-multi-portal-ecosystem)
- [Technology Stack](#-technology-stack)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Production Deployment](#-production-deployment)
- [License & Authors](#-license--authors)

---

## 🏛️ Architectural Overview

TRUG addresses the inefficiencies of conventional quick-commerce dark stores by championing **neighbourhood-first commerce**:

1. **Direct Merchant Dispatch**: Eliminates costly dark-store inventory overhead; orders flow straight from local merchants to residential doorsteps.
2. **Sub-15m & Scheduled Windows**: Real-time routing supporting Instant Dispatch (10–15 mins) as well as Morning, Afternoon, and Evening recurring delivery slots.
3. **Multi-Modal Geocoding**: Dual-engine address pinpointing combining real-time GPS geolocation, Leaflet interactive draggable pin mapping, and server-side geocoding fallback.
4. **Resilient Offline-First Architecture**: Intelligent dual-persistence layer combining Supabase PostgreSQL remote storage with localStorage cache failovers for sub-millisecond cart reactions.

---

## ✨ Key Platform Features

### 🛍️ Hyperlocal Customer Experience
- **Interactive Map Pinpoint**: High-precision doorstep delivery pin selector featuring draggable map coordinates, landmark search, and network-assisted GPS detection.
- **Smart Delivery Scheduling**: Select between **Instant Express (10–15 min)** or curated slots (**Morning 6–9 AM**, **Afternoon 12–3 PM**, **Evening 6–9 PM**).
- **Zepto-Style Mobile Interface**: Mobile-first design with responsive viewports, sticky category carousels, quick-checkout floating action pill, and fixed bottom navigation dock.
- **TRUG Pre-paid Wallet**: One-click instant checkout with balance recharge, transaction history, and instant refunds.
- **Direct WhatsApp Concierge**: Instant customer support pipeline directly hooked to operational dispatch at `+91 95158 03954`.
- **Live Order & Rider Telemetry**: Visual delivery tracker showing live rider transit routes and milestone updates from vendor confirmation to doorstep handover.

### 🔄 Daily Recurring Subscriptions
- Subscribe to daily milk, farm-fresh eggs, artisanal bread, and greens.
- Configure custom frequency (Daily, Weekdays, Alternate Days, or Custom Schedule) with pause and resume controls.

---

## 🏢 Multi-Portal Ecosystem

The repository provides a unified multi-tenant architecture serving three critical stakeholders:

```
┌────────────────────────────────────────────────────────┐
│                      TRUG PLATFORM                     │
├───────────────────┬───────────────────┬────────────────┤
│ 🛒 Customer Hub   │ 🏪 Merchant Hub   │ 🛡️ Admin Tower │
│ (/)               │ (/vendor)         │ (/admin)       │
├───────────────────┼───────────────────┼────────────────┤
│ • Hyperlocal Shop │ • Catalog & SKU   │ • Merchant KYC │
│ • Interactive Map │ • Order Queue     │ • Platform Log │
│ • Wallet & Cart   │ • Inventory & POS │ • Dispute Desk │
│ • Live Tracking   │ • Slot Windows    │ • Global Audit │
└───────────────────┴───────────────────┴────────────────┘
```

1. **Customer Storefront (`/`)**:
   - Dynamic catalogue exploration categorized by groceries, dairy, bakery, beverages, and personal care.
   - Smart address manager with multiple saved locations (Home, Work, Other).

2. **Merchant Portal (`/vendor/dashboard`)**:
   - Order fulfillment lifecycle management: `Pending` ➔ `Confirmed` ➔ `Packing` ➔ `Out for Delivery` ➔ `Delivered`.
   - Real-time inventory toggling, price management, and store operating hours configuration.

3. **Admin Control Tower (`/admin/dashboard`)**:
   - Platform-wide GMV, vendor onboarding KYC approval workflows, rider allocation status, and dispute moderation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing across API & state) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Lucide Icons, Custom Warm Palette |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL with RLS, Storage & SQL Functions) |
| **Maps & Geocoding** | Leaflet, OpenStreetMap Nominatim, Google Maps Static Integration |
| **State Management** | React Context API, LocalStorage Sync, Optimistic UI Updates |
| **Deployment** | [Vercel](https://vercel.com/) with Edge caching & serverless functions |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x+`
- **npm** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SridhanyaReddy/trug.git
   cd trug
   ```

2. **Navigate to the frontend directory & install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside the `frontend` folder to connect external services (optional for mock/offline preview):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp Concierge & Support Phone
NEXT_PUBLIC_SUPPORT_PHONE=9515803954

# Google Maps / Reverse Geocoding (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 📦 Production Build & Testing

Run a type check and production build:

```bash
# Verify TypeScript compile & build all routes
npm run build

# Start production server locally
npm run start
```

---

## 🚢 Production Deployment

The project is pre-configured for automated continuous deployment with **Vercel**:

1. Fork or push your changes to `main` branch.
2. Link the repository on [Vercel Dashboard](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Deploy — Vercel will automatically build the Next.js Turbopack bundle with zero configuration needed.

---

## 📄 License & Legal

Copyright © 2026 **TRUG by Focsera**. All rights reserved.  
Built for neighbourhood empowerment, fair merchant margins, and customer convenience.
