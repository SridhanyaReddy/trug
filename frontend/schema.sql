-- TRUG Supabase Database Schema
-- Run this in the Supabase SQL Editor once your project is created

-- 1. Profiles (for Customers, Vendors, and Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('customer', 'vendor', 'admin')) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Vendors / Shops
CREATE TABLE IF NOT EXISTS public.vendors (
    id TEXT PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    rating_count INTEGER DEFAULT 0,
    delivery_time TEXT DEFAULT '20-30 mins',
    min_order NUMERIC(10, 2) DEFAULT 0,
    image TEXT,
    banner_image TEXT,
    status TEXT CHECK (status IN ('active', 'pending', 'suspended')) DEFAULT 'pending',
    fssai_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    unit TEXT NOT NULL,
    variants JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('published', 'draft', 'paused')) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    vendor_id TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    vendor_name TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('placed', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled')) DEFAULT 'placed',
    delivery_type TEXT CHECK (delivery_type IN ('delivery', 'pickup')) DEFAULT 'delivery',
    delivery_slot TEXT,
    delivery_address JSONB,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Recurring Subscriptions
CREATE TABLE IF NOT EXISTS public.recurring_subscriptions (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    frequency TEXT CHECK (frequency IN ('daily', 'alternate_days', 'weekly')) DEFAULT 'daily',
    time_slot TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
    next_delivery DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Support Tickets & Disputes
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Public can view active vendors, products, and categories
CREATE POLICY "Public vendors viewable by everyone" ON public.vendors FOR SELECT USING (status = 'active');
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Public categories viewable by everyone" ON public.categories FOR SELECT USING (true);

