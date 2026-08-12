/*
# Create orders and order_items tables for Eyara Store

## Summary
Creates two new tables — `orders` and `order_items` — to track customer orders
in the Eyara store admin panel. This enables the admin to view, manage, and
update order statuses (pending, processing, shipped, delivered, cancelled).

## 1. New Tables

### orders
- `id` (uuid, primary key)
- `order_number` (text, not null, unique) — human-readable order number like EY-0001
- `customer_name` (text, not null)
- `customer_email` (text, not null)
- `customer_phone` (text, nullable)
- `shipping_address` (text, nullable)
- `city` (text, nullable)
- `status` (text, not null, default 'pending') — pending, processing, shipped, delivered, cancelled
- `subtotal` (integer, not null, default 0) — in KES
- `shipping_cost` (integer, not null, default 0) — in KES
- `total` (integer, not null, default 0) — in KES
- `notes` (text, nullable) — admin notes
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### order_items
- `id` (uuid, primary key)
- `order_id` (uuid, not null, FK to orders.id ON DELETE CASCADE)
- `product_id` (uuid, nullable, FK to products.id ON DELETE SET NULL)
- `product_name` (text, not null) — snapshot of product name at time of order
- `product_image` (text, nullable) — snapshot of product image
- `price` (integer, not null) — price per unit in KES
- `quantity` (integer, not null, default 1)
- `line_total` (integer, not null) — price * quantity
- `created_at` (timestamptz, default now())

## 2. Indexes
- `orders_status_idx` on orders.status
- `orders_created_at_idx` on orders.created_at
- `order_items_order_id_idx` on order_items.order_id
- `order_items_product_id_idx` on order_items.product_id

## 3. Security
- RLS enabled on both tables.
- Single-tenant store with no sign-in; admin uses password gate, not Supabase Auth.
- Policies allow anon + authenticated full CRUD on both tables.

## 4. Important Notes
1. Both tables use `TO anon, authenticated` because the storefront has no login.
2. `order_items` stores a snapshot of product name and image so historical orders
   remain intact even if a product is later renamed or deleted.
3. `updated_at` auto-updated via trigger on orders.
4. Order numbers use format EY-XXXXXX for human readability.
*/

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address text,
  city text,
  status text NOT NULL DEFAULT 'pending',
  subtotal integer NOT NULL DEFAULT 0,
  shipping_cost integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  price integer NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  line_total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies (anon + authenticated full CRUD)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Order items policies (anon + authenticated full CRUD)
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at trigger for orders
DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();