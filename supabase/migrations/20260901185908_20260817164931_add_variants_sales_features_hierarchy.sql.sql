-- 1. categories: make demographic/product_type nullable + add parent_id
ALTER TABLE categories
  ALTER COLUMN demographic DROP NOT NULL,
  ALTER COLUMN product_type DROP NOT NULL;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);

-- 2. products: description fields + sale fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description_paragraph text,
  ADD COLUMN IF NOT EXISTS description_features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sale_price integer,
  ADD COLUMN IF NOT EXISTS sale_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS sale_end_at timestamptz;

-- 3. product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text,
  color text,
  sku text NOT NULL UNIQUE,
  price_override integer,
  stock integer NOT NULL DEFAULT 0,
  sale_price integer,
  sale_start_at timestamptz,
  sale_end_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT variants_unique_size_color UNIQUE (product_id, size, color)
);

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_product_variants" ON product_variants;
CREATE POLICY "anon_select_product_variants" ON product_variants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_product_variants" ON product_variants;
CREATE POLICY "anon_insert_product_variants" ON product_variants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_product_variants" ON product_variants;
CREATE POLICY "anon_update_product_variants" ON product_variants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_product_variants" ON product_variants;
CREATE POLICY "anon_delete_product_variants" ON product_variants FOR DELETE
  TO anon, authenticated USING (true);

-- updated_at trigger for product_variants
DROP TRIGGER IF EXISTS product_variants_updated_at ON product_variants;
CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. order_items: variant snapshot columns
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS sku text;

-- 5. active_sale_price() helper
CREATE OR REPLACE FUNCTION active_sale_price(
  p_price integer,
  p_sale_price integer,
  p_sale_start_at timestamptz,
  p_sale_end_at timestamptz
) RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_sale_price IS NOT NULL
      AND p_sale_price >= 0
      AND (p_sale_start_at IS NULL OR now() >= p_sale_start_at)
      AND (p_sale_end_at IS NULL OR now() <= p_sale_end_at)
    THEN p_sale_price
    ELSE p_price
  END
$$;

-- 6. place_order() RPC
CREATE OR REPLACE FUNCTION place_order(
  p_items jsonb,
  p_customer jsonb
) RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order orders%ROWTYPE;
  v_order_number text;
  v_subtotal integer := 0;
  v_shipping integer := 0;
  v_total integer := 0;
  v_item jsonb;
  v_product_id uuid;
  v_variant_id uuid;
  v_qty integer;
  v_unit_price integer;
  v_line_total integer;
  v_product_name text;
  v_product_image text;
  v_size text;
  v_color text;
  v_sku text;
  v_current_stock integer;
BEGIN
  -- Generate order number EY-XXXXXX
  v_order_number := 'EY-' || lpad(
    (nextval('order_number_seq') % 1000000)::text,
    6, '0'
  );

  -- Insert order header
  INSERT INTO orders (
    order_number, customer_name, customer_email, customer_phone,
    shipping_address, city, status, subtotal, shipping_cost, total, notes
  ) VALUES (
    v_order_number,
    COALESCE(p_customer->>'name', ''),
    COALESCE(p_customer->>'email', ''),
    p_customer->>'phone',
    p_customer->>'shipping_address',
    p_customer->>'city',
    'pending',
    0, 0, 0,
    p_customer->>'notes'
  )
  RETURNING * INTO v_order;

  -- Process each item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := NULLIF(v_item->>'product_id', '')::uuid;
    v_variant_id := NULLIF(v_item->>'variant_id', '')::uuid;
    v_qty := COALESCE((v_item->>'quantity')::integer, 1);
    v_unit_price := COALESCE((v_item->>'price')::integer, 0);
    v_line_total := v_unit_price * v_qty;
    v_size := v_item->>'size';
    v_color := v_item->>'color';
    v_sku := v_item->>'sku';

    -- Snapshot product name + image from products table
    SELECT name, image_url INTO v_product_name, v_product_image
    FROM products WHERE id = v_product_id;

    IF v_product_name IS NULL THEN
      v_product_name := v_item->>'name';
      v_product_image := v_item->>'image';
    END IF;

    -- If a variant is selected, validate + deduct stock atomically
    IF v_variant_id IS NOT NULL THEN
      SELECT stock INTO v_current_stock
      FROM product_variants WHERE id = v_variant_id FOR UPDATE;

      IF v_current_stock IS NULL THEN
        RAISE EXCEPTION 'Variant % not found', v_variant_id;
      END IF;

      IF v_current_stock < v_qty THEN
        RAISE EXCEPTION 'Insufficient stock for SKU % (requested %, available %)',
          v_sku, v_qty, v_current_stock;
      END IF;

      UPDATE product_variants
        SET stock = stock - v_qty
        WHERE id = v_variant_id;
    END IF;

    -- Insert order item with snapshots
    INSERT INTO order_items (
      order_id, product_id, variant_id, product_name, product_image,
      price, quantity, line_total, size, color, sku
    ) VALUES (
      v_order.id, v_product_id, v_variant_id,
      v_product_name, v_product_image,
      v_unit_price, v_qty, v_line_total, v_size, v_color, v_sku
    );

    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  v_total := v_subtotal + v_shipping;

  -- Update order totals
  UPDATE orders
    SET subtotal = v_subtotal, shipping_cost = v_shipping, total = v_total
    WHERE id = v_order.id
    RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

-- Sequence for order numbers (starts at 1)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Grant execute on the RPC to anon + authenticated
GRANT EXECUTE ON FUNCTION place_order(jsonb, jsonb) TO anon, authenticated;

-- 7. Backfill: if a product has a description but no paragraph, copy it
UPDATE products
  SET description_paragraph = description
  WHERE description_paragraph IS NULL
    AND description IS NOT NULL
    AND description <> '';