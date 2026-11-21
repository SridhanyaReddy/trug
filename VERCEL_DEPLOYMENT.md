# TRUG by Focsera - Vercel Deployment Guide

This repository contains two folders:
- `frontend/` (Next.js 16 app - Customer, Vendor, Admin portals)
- `backend/` (Express.js + Node.js API with Supabase integration)

---

## 1. Deploying the Backend on Vercel

1. Log into [vercel.com](https://vercel.com) and click **"Add New..."** -> **"Project"**.
2. Connect your Git repository.
3. In **Root Directory**, click **Edit** and choose `backend`.
4. Framework Preset: Leave as **Other** (Vercel will detect `api/index.ts` and `vercel.json` automatically).
5. Open **Environment Variables** and add:
   - `SUPABASE_URL` = *(Your Supabase project URL)*
   - `SUPABASE_ANON_KEY` = *(Your Supabase anon key)*
   - `SUPABASE_SERVICE_ROLE_KEY` = *(Optional: service role key)*
   - `CLIENT_URL` = `https://<your-frontend-project>.vercel.app`
6. Click **Deploy**.
7. Once deployed, note down your backend URL, for example: `https://trug-backend.vercel.app`.
   - Test it at `https://trug-backend.vercel.app/api/health`.

---

## 2. Deploying the Frontend on Vercel

1. In Vercel, click **"Add New..."** -> **"Project"**.
2. Select the same Git repository.
3. In **Root Directory**, click **Edit** and choose `frontend`.
4. Framework Preset: **Next.js** (detected automatically).
5. Open **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL` = `https://<your-backend-project>.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = *(Your Supabase URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Your Supabase anon key)*
6. Click **Deploy**.

---

## 3. Database Setup (When you have your Supabase keys)

1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar.
3. Open `backend/schema.sql` from this repository, copy the SQL script, and paste it into the editor.
4. Click **Run**. All tables (`profiles`, `vendors`, `products`, `orders`, `recurring_subscriptions`, `support_tickets`) and security policies will be created immediately.

