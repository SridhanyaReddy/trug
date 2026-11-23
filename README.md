# TRUG

A modern hyperlocal commerce platform connecting residential communities with verified local stores, organic grocers, and dairy providers.

**Live Store:** [withtrug.com](https://withtrug.com)

---

## Overview

TRUG enables direct-to-doorstep delivery from neighbourhood merchants with zero delivery fees. The platform operates on a decentralized fulfillment model, routing orders directly from local neighborhood businesses rather than centralized dark stores.

### Core Capabilities

- **Precision Delivery Pinpoint:** Interactive map interface with GPS auto-detection, draggable pin placement, and landmark search.
- **Flexible Fulfillment:** Support for both instant express delivery (10–15 minutes) and scheduled slots (Morning, Afternoon, Evening).
- **Daily Subscriptions:** Automated recurring delivery management for daily essentials such as milk, eggs, and fresh bakery items.
- **TRUG Wallet:** In-app wallet for instant checkout, easy balance top-ups, and immediate refund processing.
- **Mobile-First Experience:** Optimized touch navigation with sticky category browsing, floating cart controls, and an app-like bottom navigation dock.
- **Integrated Support:** Direct operational support connected via WhatsApp (+91 95158 03954).

---

## Applications

The repository contains three primary portals:

| Portal | Route | Description |
| :--- | :--- | :--- |
| **Customer Storefront** | `/` | Browse local stores, manage cart, track orders, and configure delivery locations. |
| **Merchant Dashboard** | `/vendor/dashboard` | Manage product catalogs, monitor incoming orders, update inventory, and configure delivery windows. |
| **Admin Control Tower** | `/admin/dashboard` | Platform monitoring, vendor verification, order tracking, and directory management. |

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Mapping:** Leaflet & OpenStreetMap Geocoding
- **Hosting:** [Vercel](https://vercel.com/)

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SridhanyaReddy/trug.git
   cd trug
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

To connect live external services, configure the following in `frontend/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Support Contact
NEXT_PUBLIC_SUPPORT_PHONE=9515803954
```

---

## Deployment

The application is configured for deployment on Vercel:

1. Import the repository into your Vercel account.
2. Set the **Root Directory** to `frontend`.
3. Add any necessary environment variables.
4. Click **Deploy**.

---

## License

Copyright &copy; 2026 TRUG. All rights reserved.
