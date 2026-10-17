-- ==============================================================================
-- Amapati.com - Database Schema & Row Level Security (RLS) Policies
-- Platform: Supabase (PostgreSQL 15+)
-- Features: Multi-role Auth (Superuser, Editor, Customer), Max 20 Active Editors cap,
--           Wholesale Tiered Pricing, RFQs, Inquiries, Audit Logs, Orders & Cart.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('superuser', 'editor', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'invited', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. EDITOR INVITES TABLE (Single-use, 48hr expiry)
CREATE TABLE IF NOT EXISTS public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EDITOR ACCESS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.editor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Tag',
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  base_price NUMERIC(12, 2) NOT NULL,
  moq INT NOT NULL DEFAULT 1,
  stock INT NOT NULL DEFAULT 0,
  lead_time_days INT NOT NULL DEFAULT 7,
  supplier_name TEXT NOT NULL,
  supplier_country TEXT NOT NULL DEFAULT 'China',
  supplier_country_code TEXT NOT NULL DEFAULT 'CN',
  is_verified_supplier BOOLEAN DEFAULT TRUE,
  has_trade_assurance BOOLEAN DEFAULT TRUE,
  supplier_years INT DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_top_rated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PRICE TIERS TABLE (Wholesale quantity discounts)
CREATE TABLE IF NOT EXISTS public.price_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_qty INT NOT NULL,
  max_qty INT, -- NULL means infinity (e.g. 100+)
  unit_price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PRODUCT SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.product_specs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL
);

-- 11. BANNERS TABLE (Homepage Hero Carousel)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT NOT NULL DEFAULT 'Shop Now',
  cta_link TEXT NOT NULL DEFAULT '/#products',
  badge_text TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS & ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status order_status NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'pay_on_delivery',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL
);

-- 13. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 14. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 15. INQUIRIES & RFQS TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT,
  product_image TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  target_quantity INT,
  target_price NUMERIC(12, 2),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  reply_message TEXT,
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AUDIT LOG TABLE (Superuser only)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_email TEXT NOT NULL,
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. SETTINGS TABLE (Single row, Superuser managed)
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL DEFAULT 'Amapati.com',
  site_logo_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'contact@amapati.com',
  support_phone TEXT NOT NULL DEFAULT '+1 (800) 890-AMAPATI',
  default_currency TEXT NOT NULL DEFAULT 'USD',
  enable_pay_on_delivery BOOLEAN NOT NULL DEFAULT TRUE,
  enable_mobile_money BOOLEAN NOT NULL DEFAULT TRUE,
  enable_card_escrow BOOLEAN NOT NULL DEFAULT TRUE,
  enable_trade_assurance BOOLEAN NOT NULL DEFAULT TRUE,
  tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
  min_order_quantity_strict BOOLEAN NOT NULL DEFAULT TRUE,
  hero_announcement TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- ==============================================================================
-- CONSTRAINT & ENFORCEMENT: MAXIMUM 20 ACTIVE EDITORS
-- ==============================================================================
CREATE OR REPLACE FUNCTION check_editor_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_editor_count INT;
BEGIN
  IF NEW.role = 'editor' AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.role <> 'editor' OR OLD.status = 'suspended') AND NEW.status = 'active')) THEN
    SELECT COUNT(*) INTO active_editor_count
    FROM public.profiles
    WHERE role = 'editor' AND status = 'active';

    IF active_editor_count >= 20 THEN
      RAISE EXCEPTION 'Cannot add or activate editor: Maximum limit of 20 active editors reached on Amapati platform.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_editor_limit ON public.profiles;
CREATE TRIGGER trg_enforce_editor_limit
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_editor_limit();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Get current user role
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. PROFILES RLS
CREATE POLICY "Public profiles can be viewed by anyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    -- Cannot elevate role unless superuser
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR (auth.current_user_role() = 'superuser')
  );

CREATE POLICY "Superusers have full control over profiles" ON public.profiles
  FOR ALL USING (auth.current_user_role() = 'superuser');

-- 2. PRODUCTS & STOREFRONT (Public Read, Editor/Superuser Write)
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Product images viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Price tiers viewable by everyone" ON public.price_tiers FOR SELECT USING (true);
CREATE POLICY "Product specs viewable by everyone" ON public.product_specs FOR SELECT USING (true);
CREATE POLICY "Banners viewable by everyone" ON public.banners FOR SELECT USING (active = true OR auth.current_user_role() IN ('editor', 'superuser'));

CREATE POLICY "Editors and Superusers can manage products" ON public.products
  FOR ALL USING (auth.current_user_role() IN ('editor', 'superuser'));

CREATE POLICY "Editors and Superusers can manage categories" ON public.categories
  FOR ALL USING (auth.current_user_role() IN ('editor', 'superuser'));

CREATE POLICY "Editors and Superusers can manage banners" ON public.banners
  FOR ALL USING (auth.current_user_role() IN ('editor', 'superuser'));

-- 3. ORDERS (Customers view/insert own, Editors/Superusers manage all)
CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Customers create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Editors and Superusers can view and update orders" ON public.orders
  FOR ALL USING (auth.current_user_role() IN ('editor', 'superuser'));

-- 4. INQUIRIES & RFQs
CREATE POLICY "Customers can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view their own inquiries" ON public.inquiries
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email' OR auth.current_user_role() IN ('editor', 'superuser'));

CREATE POLICY "Editors and Superusers can reply to inquiries" ON public.inquiries
  FOR UPDATE USING (auth.current_user_role() IN ('editor', 'superuser'));

-- 5. AUDIT LOG & SETTINGS (Superuser Only)
CREATE POLICY "Superuser only audit log access" ON public.audit_log
  FOR ALL USING (auth.current_user_role() = 'superuser');

CREATE POLICY "Settings viewable by everyone" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Superuser only settings update" ON public.settings
  FOR UPDATE USING (auth.current_user_role() = 'superuser');

-- 6. INVITES (Superuser only create/view)
CREATE POLICY "Superuser only invites management" ON public.invites
  FOR ALL USING (auth.current_user_role() = 'superuser');

-- ==============================================================================
-- AUTOMATIC FIRST-SETUP SEED: SUPERUSER stopollos@gmail.com
-- ==============================================================================
-- Automatically assign superuser role when stopollos@gmail.com registers or signs in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Amapati User'),
    CASE 
      WHEN LOWER(NEW.email) = 'stopollos@gmail.com' THEN 'superuser'::user_role
      ELSE 'customer'::user_role
    END,
    'active'::user_status
  )
  ON CONFLICT (id) DO UPDATE
  SET role = CASE 
    WHEN LOWER(EXCLUDED.email) = 'stopollos@gmail.com' THEN 'superuser'::user_role
    ELSE profiles.role
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
