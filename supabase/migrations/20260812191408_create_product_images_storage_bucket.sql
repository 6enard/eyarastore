/*
# Create public storage bucket for product and category images

## Summary
Creates a public storage bucket called `product-images` so the admin panel
can upload image files directly from the browser. The bucket is public so
uploaded images can be displayed on the storefront via their public URL.

## 1. Storage Bucket
- `product-images` (public bucket) — stores all product and category images
  uploaded through the admin panel.

## 2. Storage Policies
- Allow anon + authenticated to INSERT (upload) objects to the bucket.
- Allow anon + authenticated to SELECT (read) objects — needed for public URLs.
- Allow anon + authenticated to UPDATE and DELETE objects — so the admin can
  replace or remove images.
- This is a single-tenant store with a client-side admin password gate, so
  the anon-key client must be able to upload. The data is intentionally
  shared/public.

## 3. Important Notes
1. The bucket is public, meaning anyone with the URL can view the image.
   This is standard for product images on an e-commerce storefront.
2. Upload and delete are also open to anon because the admin panel does not
   use Supabase Auth — it uses a simple password gate. For a production store,
   upgrading to Supabase Auth would allow restricting writes to authenticated
   admins only.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read objects (public bucket)
DROP POLICY IF EXISTS "anon_read_product_images" ON storage.objects;
CREATE POLICY "anon_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

-- Allow anyone to upload objects
DROP POLICY IF EXISTS "anon_upload_product_images" ON storage.objects;
CREATE POLICY "anon_upload_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update objects
DROP POLICY IF EXISTS "anon_update_product_images" ON storage.objects;
CREATE POLICY "anon_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to delete objects
DROP POLICY IF EXISTS "anon_delete_product_images" ON storage.objects;
CREATE POLICY "anon_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');
