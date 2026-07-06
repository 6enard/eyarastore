/*
# Create products and categories tables for Eyarastore

1. New Tables
- `categories`
  - `id` (uuid, primary key)
  - `name` (text, not null) — category display name
  - `slug` (text, unique, not null) — URL-safe identifier
  - `description` (text) — optional category blurb
  - `image_url` (text) — hero image for the category
  - `sort_order` (int, default 0) — display ordering
  - `created_at` (timestamptz)

- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null) — product name
  - `slug` (text, unique, not null) — URL-safe identifier
  - `description` (text, not null) — rich product description
  - `price` (numeric, not null) — current price in USD
  - `compare_at_price` (numeric) — original price for sale items
  - `image_url` (text, not null) — primary product image
  - `gallery` (jsonb) — array of additional image URLs
  - `category_id` (uuid, FK to categories) — product category
  - `rating` (numeric, default 0) — average rating 0-5
  - `review_count` (int, default 0) — number of reviews
  - `featured` (boolean, default false) — show on homepage
  - `in_stock` (boolean, default true) — availability flag
  - `tags` (jsonb) — array of tag strings for filtering
  - `created_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated SELECT on both tables (public storefront, no sign-in).
- No INSERT/UPDATE/DELETE policies — data is managed via Supabase dashboard, not the frontend.

3. Notes
- This is a single-tenant storefront with no user accounts.
- Products and categories are publicly readable.
- Cart state lives in the browser (localStorage), not the database.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  image_url text NOT NULL,
  gallery jsonb DEFAULT '[]'::jsonb,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  rating numeric(2,1) DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  in_stock boolean NOT NULL DEFAULT true,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
