-- ==============================================================================
-- RYNOCHI LUXURY E-COMMERCE - SUPABASE PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vuppljzfwkflprwwbboe/sql/new
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  product_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  short_description TEXT,
  description TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  base_price NUMERIC NOT NULL,
  discount_price NUMERIC,
  stock INTEGER DEFAULT 100,
  min_order_qty INTEGER DEFAULT 1,
  is_customizable BOOLEAN DEFAULT TRUE,
  engraving_type TEXT,
  additional_customization_fee NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  images JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  fonts JSONB DEFAULT '[]'::jsonb,
  customization_fields JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  customization_total NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'ORDER_PLACED',
  payment_status TEXT DEFAULT 'PENDING',
  payment_method TEXT DEFAULT 'CASH_ON_DELIVERY',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  tracking_number TEXT,
  delivery_partner TEXT,
  tracking_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  business_name TEXT DEFAULT 'RYNOCHI',
  logo_url TEXT,
  announcement_text TEXT,
  announcement_active BOOLEAN DEFAULT TRUE,
  whatsapp_number TEXT DEFAULT '917277338436',
  support_email TEXT DEFAULT 'orders@rynochi.com',
  support_phone TEXT DEFAULT '+91 72773 38436',
  office_address TEXT,
  shipping_fee NUMERIC DEFAULT 99,
  free_shipping_threshold NUMERIC DEFAULT 999,
  tax_rate_percent NUMERIC DEFAULT 18,
  razorpay_enabled BOOLEAN DEFAULT TRUE,
  cod_enabled BOOLEAN DEFAULT TRUE,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Categories: Anyone can read
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products: Anyone can read
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write products" ON public.products;
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders: Anyone can create order and read their order
DROP POLICY IF EXISTS "Public create orders" ON public.orders;
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write orders" ON public.orders;
CREATE POLICY "Admin write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Store Settings: Anyone can read, admin can update
DROP POLICY IF EXISTS "Public read settings" ON public.store_settings;
CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write settings" ON public.store_settings;
CREATE POLICY "Admin write settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable Supabase Realtime for Orders & Products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 5. Seed Initial Categories
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-pens', 'Personalized Pens', 'personalized-pens', 'Everyday writing instruments engraved with a name or message.', '/images/products-optimized/1.png', 12, 1, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-metal-pens', 'Premium Metal Pens', 'premium-metal-pens', 'Weighty, polished finishes made to be kept and noticed.', '/images/products-optimized/2.png', 8, 2, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-diaries', 'Customized Diaries', 'customized-diaries', 'Leather-finish diaries with a name plate that is yours alone.', '/images/products-optimized/3.png', 10, 3, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-gift-sets', 'Diary & Pen Gift Sets', 'gift-sets', 'A diary and pen, boxed and ready to gift.', '/images/products-optimized/6.png', 15, 4, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-corporate', 'Corporate Gifts', 'corporate-gifts', 'Branded sets for clients, teams, launches and festivals.', '/images/products-optimized/5.png', 14, 5, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, display_order, is_active)
VALUES ('cat-stylus', 'Stylus Pens & Accessories', 'stylus-pens', 'Touch-tip pens and engraved desk essentials.', '/images/products-optimized/7.png', 9, 6, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  product_count = EXCLUDED.product_count,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 6. Seed Initial Products
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-001', 'Matte Black Engraved Pen', 'matte-black-engraved-pen', 'RYN-PEN-001',
  'Sleek matte black executive pen with precision laser engraving exposing lustrous golden brass underneath.', 'The RYNOCHI Matte Black Engraved Pen combines understated minimalism with executive distinction. Crafted from solid machined brass and treated with a resilient tactile matte black finish, the high-precision laser engraving cleanly cuts away the surface lacquer to expose the radiant golden brass beneath.

Features:
• Laser engraving calibrated to 0.01mm depth for permanent high-contrast legibility.
• German 0.7mm smooth rollerball refill with instantaneous fast-drying blue ink.
• Balanced ergonomic heft (36g) engineered for effortless, fatigue-free signing.
• Delivered in an embossed black slide gift box with protective sleeve.', 'cat-pens', 'Personalized Pens',
  1199, 849, 95, 1,
  TRUE, 'Precision Laser Engraving', 0,
  TRUE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/1.png","/images/products-optimized/1 (1).png","/images/products-optimized/1 (2).png","/images/products-optimized/1 (3).png","/images/products-optimized/1 (4).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-pen-name","label":"Name to Engrave on Pen Barrel","fieldType":"TEXT","placeholder":"e.g. Saurabh Kumar","helperText":"Permanent golden brass laser etch on the barrel.","isRequired":true,"maxCharacters":22,"extraCharge":0},{"id":"field-pen-font","label":"Typography Style","fieldType":"FONT_SELECTION","isRequired":true,"extraCharge":0,"options":[{"label":"Classic (Cinzel Serif)","value":"Cinzel"},{"label":"Script (Great Vibes Cursive)","value":"Great Vibes"},{"label":"Modern (Manrope Sans)","value":"Manrope"}]},{"id":"field-logo","label":"Upload Logo (Optional)","fieldType":"LOGO_UPLOAD","helperText":"High resolution PNG/SVG files recommended.","isRequired":false,"extraCharge":100}]'::jsonb, '{"Barrel Material":"Solid Machined Brass with Matte Black Coating","Refill Type":"0.7mm German Fluid Rollerball","Ink Color":"Executive Royal Blue","Weight":"36 grams","Packaging":"RYNOCHI Rigid Slide Box"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-002', 'Textured Metal Rollerball', 'textured-metal-rollerball-pen', 'RYN-PEN-002',
  'Heavyweight textured metal rollerball pen with knurled grip, rose gold accents and custom laser engraved dedication.', 'Weighty, polished, and unmistakable in hand. The RYNOCHI Textured Metal Rollerball features diamond-cut micro-texture patterning along the barrel for an extraordinary tactile feel. Paired with polished champagne gold or rose gold trims and personalized with your name or corporate insignia.

Features:
• Diamond knurled metal barrel offering non-slip ergonomic writing balance.
• High-gloss champagne and rose gold PVD plated hardware.
• Precision laser etching with tone-on-tone metallic finish.
• Accompanied by RYNOCHI signature presentation gift box.', 'cat-metal-pens', 'Premium Metal Pens',
  1499, 1099, 75, 1,
  TRUE, 'Laser Etched Metal Plating', 0,
  TRUE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/2.png","/images/products-optimized/2 (1).png","/images/products-optimized/2 (2).png","/images/products-optimized/2 (3).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-pen-name","label":"Name or Title for Barrel","fieldType":"TEXT","placeholder":"e.g. Ananya Sharma","isRequired":true,"maxCharacters":22,"extraCharge":0},{"id":"field-pen-font","label":"Engraving Typography","fieldType":"FONT_SELECTION","isRequired":true,"extraCharge":0,"options":[{"label":"Classic (Cinzel)","value":"Cinzel"},{"label":"Script (Great Vibes)","value":"Great Vibes"},{"label":"Modern (Manrope)","value":"Manrope"}]}]'::jsonb, '{"Material":"Textured Aerospace Alloy & Solid Brass","Trim":"Champagne Gold PVD","Refill":"0.7mm German Rollerball","Weight":"42 grams (Solid Heft)"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-003', 'Black Leather Diary with Custom Brass Plate', 'black-leather-diary-custom-nameplate', 'RYN-DIA-003',
  'Signature A5 black PU leather organizer with reinforced stitching, magnetic strap, and custom laser-engraved gold nameplate.', 'An organizer created to embody discipline and prestige. Handcrafted in water-resistant rich black PU leather with neat perimeter stitching, this A5 journal features a solid golden brass nameplate riveted on the cover and engraved with your recipient''s name or corporate title.

Features:
• Custom golden brass nameplate laser engraved with permanent, scratch-proof lettering.
• Concealed magnetic clasp keeping pages neatly closed and notes confidential.
• 160 pages of 80 GSM bleed-proof ivory ruled paper with date and subject header.
• Internal credit/business card slots and document slip pocket.
• Integrated pen holder loop and satin bookmark ribbon.', 'cat-diaries', 'Customized Diaries',
  1599, 1199, 120, 1,
  TRUE, 'Brass Plaque Laser Engraving', 0,
  TRUE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/3.png","/images/products-optimized/3 (1).png","/images/products-optimized/3 (2).png","/images/products-optimized/3 (3).png","/images/products-optimized/3 (4).png","/images/products-optimized/3 (5).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-diary-name","label":"Name or Title for Brass Plate","fieldType":"TEXT","placeholder":"e.g. Vikramaditya Roy","helperText":"Max 25 characters engraved on the golden plate.","isRequired":true,"maxCharacters":25,"extraCharge":0},{"id":"field-font","label":"Engraving Typography","fieldType":"FONT_SELECTION","isRequired":true,"extraCharge":0,"options":[{"label":"Classic (Cinzel Serif)","value":"Cinzel"},{"label":"Script (Great Vibes Cursive)","value":"Great Vibes"},{"label":"Modern (Manrope Sans)","value":"Manrope"}]}]'::jsonb, '{"Dimensions":"21.5 cm x 15.5 cm x 2.2 cm (A5 Standard)","Material":"Hand-stitched Premium PU Leather","Paper":"160 Ruled Pages (80 GSM Acid-Free Ivory)","Closure":"Concealed Magnetic Strap"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-004', 'Grey Notebook Diary with Gold Nameplate', 'grey-notebook-diary-gold-nameplate', 'RYN-DIA-004',
  'Contemporary textured grey PU leather diary featuring polished gold brass plaque, pen loop, and magnetic strap.', 'Modern, elegant, and versatile. The RYNOCHI Grey Notebook Diary offers a contemporary cool grey palette complemented by the warmth of polished golden hardware. Designed for meetings, daily journaling, and corporate milestones.

Features:
• Metallic golden nameplate laser etched with recipient name.
• Textured supple PU leather exterior with fine contrast stitching.
• Magnetic closure strap, card sleeves, and elastic pen loop.
• 160 pages of smooth 80 GSM writing paper.', 'cat-diaries', 'Customized Diaries',
  1599, 1149, 80, 1,
  TRUE, 'Brass Plaque Laser Engraving', 0,
  TRUE, FALSE, TRUE, TRUE,
  '["/images/products-optimized/4.png","/images/products-optimized/4 (1).png","/images/products-optimized/4 (2).png","/images/products-optimized/4 (3).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-diary-name","label":"Name for Brass Plate","fieldType":"TEXT","placeholder":"e.g. Dr. Raghav Singhania","isRequired":true,"maxCharacters":25,"extraCharge":0}]'::jsonb, '{"Dimensions":"21 cm x 14.5 cm (A5)","Material":"Textured PU Leather","Paper":"80 GSM Ivory Paper, 160 Pages"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-005', 'Diary & Pen Gift Set — White Presentation Box', 'diary-pen-gift-set-white-box', 'RYN-SET-005',
  'Executive gift set featuring matching diary and metal pen encased in an immaculate white presentation box.', 'A pristine gifting ensemble. The RYNOCHI White Box Gift Set pairs a handcrafted leather organizer diary with a matching engraved dual-tone pen, nestled in precision die-cut foam inside an elegant white rigid gift box.

Features:
• Complete bespoke personalization: Name on diary brass plate + name on pen barrel.
• High-grade white gift box with gold foil branding.
• Perfect for corporate executive welcoming, client appreciation, and academic graduations.', 'cat-gift-sets', 'Diary & Pen Gift Sets',
  2699, 1999, 65, 1,
  TRUE, 'Dual Laser Engraving (Diary + Pen)', 0,
  TRUE, FALSE, TRUE, TRUE,
  '["/images/products-optimized/5.png","/images/products-optimized/5 (1).png","/images/products-optimized/5 (2).png","/images/products-optimized/5 (3).png","/images/products-optimized/5 (4).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-set-diary-name","label":"Name on Diary Brass Plate","fieldType":"TEXT","placeholder":"e.g. Saurabh Kumar","isRequired":true,"maxCharacters":25,"extraCharge":0},{"id":"field-set-pen-name","label":"Name on Pen Barrel","fieldType":"TEXT","placeholder":"e.g. Saurabh Kumar","isRequired":true,"maxCharacters":22,"extraCharge":0}]'::jsonb, '{"Set Includes":"1x A5 Leather Diary + 1x Engraved Metal Pen","Box":"Luxury White Rigid Gift Box with Foam Cushioning","Pages":"160 Ruled Pages (80 GSM)"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-006', 'Diary & Pen Gift Set — Signature Gold Box', 'diary-pen-gift-set-gold-box', 'RYN-SET-006',
  'Our flagship gifting suite: Tan brown leather diary and engraved metal rollerball presented in a gold patterned luxury box.', 'The quintessential RYNOCHI gifting experience. The Signature Gold Box Gift Set presents our heritage tan brown leather diary with a matching engraved executive pen inside an opulent gold-embossed presentation box.

Features:
• Handcrafted PU leather organizer with laser-etched golden nameplate.
• Solid brass dual-tone rollerball pen with matching laser personalization.
• Luxurious gold pattern rigid box ready for immediate gifting without extra wrapping.
• 160 pages of 80 GSM smooth ruled paper, magnetic closure, and inner pockets.', 'cat-gift-sets', 'Diary & Pen Gift Sets',
  2899, 2199, 90, 1,
  TRUE, 'Dual Laser Engraving (Diary + Pen)', 0,
  TRUE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/6.png","/images/products-optimized/6 (1).png","/images/products-optimized/6 (2).png","/images/products-optimized/6 (3).png","/images/products-optimized/6 (4).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-gold-diary-name","label":"Name for Diary Brass Plate","fieldType":"TEXT","placeholder":"e.g. Saurabh Kumar","isRequired":true,"maxCharacters":25,"extraCharge":0},{"id":"field-gold-pen-name","label":"Name on Pen Barrel","fieldType":"TEXT","placeholder":"e.g. Saurabh Kumar","isRequired":true,"maxCharacters":22,"extraCharge":0}]'::jsonb, '{"Set Includes":"1x A5 Diary + 1x Metal Pen + 1x Signature Gold Box","Engraving":"Laser Engraved Brass Plaque + Metal Pen Body","Box Finish":"Opulent Gold Foil Embellished Rigid Box"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-007', 'Executive Dual-Function Stylus Pen', 'executive-dual-function-stylus-pen', 'RYN-STY-007',
  'Capacitive touch stylus tip for tablets and phones combined with a smooth-writing twist ballpoint and custom laser engraving.', 'Designed for modern hybrid workflows. The Executive Stylus Pen integrates an ultra-sensitive conductive stylus tip that works smoothly across iPads, touchscreens, and tablets, paired with an executive ballpoint pen. Custom laser engraved with your name or corporate logo.', 'cat-stylus', 'Stylus Pens & Accessories',
  999, 699, 110, 1,
  TRUE, 'Laser Etched Metal Body', 0,
  FALSE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/7.png","/images/products-optimized/7 (1).png","/images/products-optimized/7 (2).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-stylus-name","label":"Name to Engrave","fieldType":"TEXT","placeholder":"e.g. Sweta Saha","isRequired":true,"maxCharacters":22,"extraCharge":0}]'::jsonb, '{"Tip":"High-sensitivity Micro-Knit Capacitive Stylus + Ballpoint","Body":"Machined Aluminum Alloy","Ink":"Medium 1.0mm Black Hybrid Ink"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-008', 'Emerald Prestige Dual-Tone Stylus Pen', 'emerald-prestige-stylus-pen', 'RYN-PEN-008',
  'Lustrous emerald green finish with faceted crystal gemstone clip and responsive capacitive touch stylus.', 'The Emerald Prestige pen merges jewelry-grade craftsmanship with touch-screen utility. Featuring an inset faceted emerald green gemstone on the clip, polished champagne gold trim, and precision laser etching.', 'cat-stylus', 'Stylus Pens & Accessories',
  1450, 999, 55, 1,
  TRUE, 'Gold Tone-on-Tone Laser Etch', 0,
  FALSE, FALSE, TRUE, TRUE,
  '["/images/products-optimized/8.png","/images/products-optimized/8 (1).png","/images/products-optimized/8 (2).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-emerald-name","label":"Name or Message for Barrel","fieldType":"TEXT","placeholder":"e.g. Dr. Ananya Sharma","isRequired":true,"maxCharacters":20,"extraCharge":0}]'::jsonb, '{"Barrel":"Matte Emerald Green with Inset Crystal Gem","Plating":"Champagne Gold PVD","Compatibility":"Universal Touchscreens & Paper Note-taking"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-009', 'Imperial Blue & Gold Executive Rollerball Pen', 'imperial-blue-gold-executive-rollerball', 'RYN-PEN-009',
  'Royal navy brass body paired with 24K gold PVD trim, German liquid rollerball refill, and laser customized barrel.', 'An instrument of authority. The Imperial Blue Executive Rollerball features deep navy multi-coat lacquer over solid brass. Laser engraving vaporizes the blue lacquer to expose the luminous golden brass beneath.', 'cat-pens', 'Personalized Pens',
  1299, 899, 85, 1,
  TRUE, 'High-Contrast Fiber Laser Engraving', 0,
  FALSE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/9.png","/images/products-optimized/9 (1).png","/images/products-optimized/9 (2).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-blue-name","label":"Name to Engrave","fieldType":"TEXT","placeholder":"e.g. SWETA SAHA","isRequired":true,"maxCharacters":22,"extraCharge":0}]'::jsonb, '{"Material":"Solid Machined Brass with Imperial Blue Lacquer","Trim":"24K Gold PVD Plated Stainless Steel","Refill":"0.7mm German Fluid Ink"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;
INSERT INTO public.products (
  id, name, slug, sku, short_description, description, category_id, category_name,
  base_price, discount_price, stock, min_order_qty, is_customizable, engraving_type,
  additional_customization_fee, is_featured, is_bestseller, is_new_arrival, is_active,
  images, colors, fonts, customization_fields, specifications
) VALUES (
  'prod-010', 'Luxury Corporate Gift Ensemble (Batch Custom)', 'luxury-corporate-gift-ensemble', 'RYN-CORP-010',
  'Complete corporate gifting solution featuring matching engraved diary, stylus pen, and cardholder with bulk company logo engraving.', 'Engineered for distinguished corporate gifting, partner onboarding, and summit appreciation. Every piece in this ensemble is personalized with your organization’s official emblem plus individual recipient names. Digital proof approved before batch production begins.', 'cat-corporate', 'Corporate Gifts',
  3499, 2699, 200, 5,
  TRUE, 'Multi-Product Fiber Laser Engraving', 0,
  TRUE, TRUE, FALSE, TRUE,
  '["/images/products-optimized/10.png","/images/products-optimized/10 (1).png","/images/products-optimized/10 (2).png","/images/products-optimized/10 (3).png","/images/products-optimized/10 (4).png"]'::jsonb, NULL, NULL,
  '[{"id":"field-corp-name","label":"Company or Batch Name","fieldType":"TEXT","placeholder":"e.g. Google Cloud / McKinsey","isRequired":true,"maxCharacters":30,"extraCharge":0},{"id":"field-corp-logo","label":"Upload High-Resolution Company Logo","fieldType":"LOGO_UPLOAD","isRequired":false,"extraCharge":0}]'::jsonb, '{"Ensemble":"A5 Leather Diary + Precision Pen + Presentation Box","Minimum Quantity":"5 Units for Corporate Batch Pricing","Proof":"Digital Vector PDF Proof sent via WhatsApp/Email before production"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  sku = EXCLUDED.sku,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  base_price = EXCLUDED.base_price,
  discount_price = EXCLUDED.discount_price,
  stock = EXCLUDED.stock,
  is_customizable = EXCLUDED.is_customizable,
  is_featured = EXCLUDED.is_featured,
  images = EXCLUDED.images;

-- 7. Seed Initial Store Settings
INSERT INTO public.store_settings (
  id, business_name, logo_url, announcement_text, announcement_active,
  whatsapp_number, support_email, support_phone, office_address,
  shipping_fee, free_shipping_threshold, tax_rate_percent, razorpay_enabled, cod_enabled, social_links
) VALUES (
  'default', 'RYNOCHI', '/images/brand/rynochi-gold-logo.png', '✨ FREE ALL-INDIA SHIPPING ON ORDERS ABOVE ₹999 • COMPLIMENTARY LASER ENGRAVING • ZERO DEFECT GUARANTEE',
  TRUE, '917277338436', 'orders@rynochi.com',
  '+91 72773 38436', 'T371-FAST FLOR CHAMELIN ROAD KAROL BAGH DELHI-110006 NEW DELHI DELHI 110006 India', 99,
  999, 18, TRUE,
  TRUE, '{"instagram":"https://www.instagram.com/rynochi__eye_wear?utm_source=qr&srtk=MTB0MDVyMzd5anJsOQ==","facebook":"https://www.facebook.com/share/19ca1jff5P/","youtube":"http://youtube.com/@rynochi-p?si=8yDkeTxuhbS1fZQ3","whatsapp":"https://wa.me/917277338436?text=Hello%20RYNOCHI,%20I%20have%20an%20enquiry","amazonStore":"https://www.amazon.in/sp?ie=UTF8&seller=A199V62RGC67K7&asin=B0G5QF6YG8&ref_=dp_merchant_link","linkedin":"https://linkedin.com/company/rynochi","twitter":"https://twitter.com/rynochi"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  announcement_text = EXCLUDED.announcement_text,
  whatsapp_number = EXCLUDED.whatsapp_number,
  support_phone = EXCLUDED.support_phone,
  office_address = EXCLUDED.office_address,
  social_links = EXCLUDED.social_links;
