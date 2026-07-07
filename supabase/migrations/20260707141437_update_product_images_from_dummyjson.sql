/*
# Update product images with DummyJSON images

Replace generic/reused Pexels images with category-appropriate product photos
from DummyJSON (https://dummyjson.com). Each product now gets a distinct
image_url and gallery that matches its demographic + product_type.

Source categories mapped:
- men / clothes  -> mens-shirts (5 products, 4 images each)
- men / shoes    -> mens-shoes (5 products, 4 images each)
- women / clothes -> womens-dresses + tops (10 products total)
- women / shoes  -> womens-shoes (5 products, 4 images each)
- kids / clothes -> tops (5 products, 4 images each)
- kids / shoes   -> mens-shoes + womens-shoes (cycled)

Category hero images also updated to use DummyJSON thumbnails.
*/

-- Update category hero images
UPDATE categories SET image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp' WHERE slug = 'men';
UPDATE categories SET image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/1.webp' WHERE slug = 'women';
UPDATE categories SET image_url = 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp' WHERE slug = 'kids';

-- ============================================================
-- Men's Clothes -> mens-shirts images
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp","https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp","https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp"]'::jsonb
WHERE slug = 'classic-oxford-shirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp","https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp","https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/4.webp"]'::jsonb
WHERE slug = 'casual-linen-blazer';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp"]'::jsonb
WHERE slug = 'slim-fit-chinos';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/4.webp"]'::jsonb
WHERE slug = 'merino-wool-sweater';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/2.webp","https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp","https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/4.webp"]'::jsonb
WHERE slug = 'premium-cotton-tshirt';

-- Men's additional clothes (cycle through mens-shirts images again with different angles)
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp"]'::jsonb
WHERE slug = 'premium-polo-shirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp"]'::jsonb
WHERE slug = 'denim-jean-jacket';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp"]'::jsonb
WHERE slug = 'comfort-fit-jeans';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp"]'::jsonb
WHERE slug = 'summer-cargo-shorts';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp"]'::jsonb
WHERE slug = 'fleece-hoodie';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp"]'::jsonb
WHERE slug = 'leather-bomber-jacket';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp"]'::jsonb
WHERE slug = 'cotton-henley-shirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/4.webp"]'::jsonb
WHERE slug = 'quilted-vest';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/4.webp"]'::jsonb
WHERE slug = 'linen-beach-pants';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/4.webp"]'::jsonb
WHERE slug = 'formal-dress-shirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp"]'::jsonb
WHERE slug = 'athletic-track-pants';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp","https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp"]'::jsonb
WHERE slug = 'thermal-base-layer';

-- ============================================================
-- Men's Shoes -> mens-shoes images
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp","https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/3.webp","https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/4.webp"]'::jsonb
WHERE slug = 'leather-oxford-shoes';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/2.webp","https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/3.webp","https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/4.webp"]'::jsonb
WHERE slug = 'casual-leather-sneakers';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/2.webp","https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/3.webp","https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/4.webp"]'::jsonb
WHERE slug = 'suede-chelsea-boots';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/2.webp","https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/3.webp","https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/4.webp"]'::jsonb
WHERE slug = 'running-trainers';

-- ============================================================
-- Women's Clothes -> womens-dresses + tops images
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/2.webp","https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/3.webp","https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/4.webp"]'::jsonb
WHERE slug = 'silk-midi-dress';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/2.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/3.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/4.webp"]'::jsonb
WHERE slug = 'cashmere-cardigan';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/2.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/3.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/4.webp"]'::jsonb
WHERE slug = 'tailored-wool-trousers';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp","https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/3.webp","https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/4.webp"]'::jsonb
WHERE slug = 'floral-blouse';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/2.webp","https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/3.webp","https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/4.webp"]'::jsonb
WHERE slug = 'linen-summer-dress';

-- Women's additional clothes (use tops category)
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp","https://cdn.dummyjson.com/product-images/tops/blue-frock/3.webp","https://cdn.dummyjson.com/product-images/tops/blue-frock/4.webp"]'::jsonb
WHERE slug = 'pleated-midi-skirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/2.webp","https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/3.webp","https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/4.webp"]'::jsonb
WHERE slug = 'structured-blazer';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp","https://cdn.dummyjson.com/product-images/tops/gray-dress/3.webp","https://cdn.dummyjson.com/product-images/tops/gray-dress/4.webp"]'::jsonb
WHERE slug = 'wool-trench-coat';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/short-frock/2.webp","https://cdn.dummyjson.com/product-images/tops/short-frock/3.webp","https://cdn.dummyjson.com/product-images/tops/short-frock/4.webp"]'::jsonb
WHERE slug = 'silk-jumpsuit';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/tartan-dress/2.webp","https://cdn.dummyjson.com/product-images/tops/tartan-dress/3.webp","https://cdn.dummyjson.com/product-images/tops/tartan-dress/4.webp"]'::jsonb
WHERE slug = 'cotton-wrap-blouse';

-- Cycle through womens-dresses with different image angles
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/3.webp"]'::jsonb
WHERE slug = 'high-waist-skinny-jeans';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/3.webp"]'::jsonb
WHERE slug = 'crochet-beach-cover-up';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/3.webp"]'::jsonb
WHERE slug = 'oversized-knit-sweater';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/3.webp"]'::jsonb
WHERE slug = 'tailored-shorts';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/3.webp"]'::jsonb
WHERE slug = 'bohemian-maxi-dress';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/4.webp"]'::jsonb
WHERE slug = 'cardigan-coat';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/4.webp"]'::jsonb
WHERE slug = 'athletic-leggings';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/4.webp"]'::jsonb
WHERE slug = 'silk-camisole-top';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/4.webp"]'::jsonb
WHERE slug = 'peasant-blouse';

-- ============================================================
-- Women's Shoes -> womens-shoes images
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/2.webp","https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/3.webp","https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/4.webp"]'::jsonb
WHERE slug = 'leather-ankle-boots';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/2.webp","https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/3.webp","https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/4.webp"]'::jsonb
WHERE slug = 'classic-pumps';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/2.webp","https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/3.webp","https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/4.webp"]'::jsonb
WHERE slug = 'woven-leather-sandals';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/2.webp","https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/3.webp","https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/4.webp"]'::jsonb
WHERE slug = 'canvas-sneakers';

-- ============================================================
-- Kids' Clothes -> tops images (cycled)
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/blue-frock/3.webp"]'::jsonb
WHERE slug = 'organic-cotton-romper';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/3.webp"]'::jsonb
WHERE slug = 'denim-overall-set';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/gray-dress/3.webp"]'::jsonb
WHERE slug = 'kids-cotton-dress';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/short-frock/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/short-frock/3.webp"]'::jsonb
WHERE slug = 'boys-polo-set';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/tartan-dress/3.webp"]'::jsonb
WHERE slug = 'fleece-zip-jacket';

-- Kids additional clothes
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/blue-frock/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/blue-frock/4.webp"]'::jsonb
WHERE slug = 'classic-school-uniform';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/4.webp"]'::jsonb
WHERE slug = 'rainbow-print-tshirt';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/gray-dress/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/gray-dress/4.webp"]'::jsonb
WHERE slug = 'cozy-fleece-jacket';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/short-frock/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/short-frock/4.webp"]'::jsonb
WHERE slug = 'stretchy-leggings';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/tartan-dress/4.webp"]'::jsonb
WHERE slug = 'denim-overalls';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/blue-frock/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp"]'::jsonb
WHERE slug = 'princess-tutu-dress';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/2.webp"]'::jsonb
WHERE slug = 'casual-sweatpants';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/gray-dress/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp"]'::jsonb
WHERE slug = 'wool-knit-sweater';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/short-frock/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp","https://cdn.dummyjson.com/product-images/tops/short-frock/2.webp"]'::jsonb
WHERE slug = 'summer-shorts-set';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp","https://cdn.dummyjson.com/product-images/tops/tartan-dress/2.webp"]'::jsonb
WHERE slug = 'hooded-beach-towel-poncho';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/3.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/4.webp"]'::jsonb
WHERE slug = 'sports-team-jersey';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp"]'::jsonb
WHERE slug = 'pajama-set';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/4.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp","https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/2.webp"]'::jsonb
WHERE slug = 'winter-puffer-jacket';

-- ============================================================
-- Kids' Shoes -> mens-shoes + womens-shoes (cycled)
-- ============================================================
UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/2.webp","https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/3.webp"]'::jsonb
WHERE slug = 'kids-velcro-sneakers';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/1.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/2.webp","https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/3.webp"]'::jsonb
WHERE slug = 'canvas-slip-on-shoes';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/1.webp","https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/3.webp"]'::jsonb
WHERE slug = 'kids-leather-sandals';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp","https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/3.webp"]'::jsonb
WHERE slug = 'school-uniform-shoes';

UPDATE products SET
  image_url = 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/2.webp',
  gallery = '["https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp","https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/3.webp"]'::jsonb
WHERE slug = 'sports-trainers';
