/*
# Add demographic and product_type columns, seed categories and products

1. New Columns
- `products.demographic` (text) - target demographic: 'men', 'women', 'kids', 'unisex'
- `products.product_type` (text) - product category: 'clothes', 'shoes', 'accessories'

2. Data Changes
- Clear existing categories
- Insert new demographics as categories: Men, Women, Kids
- Insert sample products for each demographic and product type combination

3. Security
- No changes to RLS policies (existing policies allow anon + authenticated SELECT)

4. Notes
- This is a single-tenant storefront with no user accounts
- Categories now represent demographics (Men/Women/Kids)
- Each product has demographic + product_type for granular filtering
- Added indexes for the new columns
*/

-- Add demographic and product_type columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS demographic text NOT NULL DEFAULT 'unisex';
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'clothes';

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_demographic ON products(demographic);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);

-- Clear existing categories and products
DELETE FROM products;
DELETE FROM categories;

-- Insert demographic categories (Men, Women, Kids)
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Men', 'men', 'Discover our curated collection of premium men''s clothing and footwear. Crafted for the modern gentleman.', 'https://images.pexels.com/photos/1496647/pexels-photo-1496647.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Women', 'women', 'Explore elegant women''s fashion and footwear. Timeless designs for every occasion.', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Kids', 'kids', 'Quality clothing and shoes for children. Durable, comfortable, and stylish.', 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800', 3);

-- Insert sample Men's products
INSERT INTO products (name, slug, description, price, compare_at_price, image_url, gallery, category_id, demographic, product_type, rating, review_count, featured, in_stock, tags) VALUES
-- Men's Clothes
('Classic Oxford Shirt', 'classic-oxford-shirt', 'Premium cotton oxford shirt with a timeless fit. Perfect for both casual and formal occasions.', 4500, 5500, 'https://images.pexels.com/photos/3628546/pexels-photo-3628546.jpeg?auto=compress&cs=tinysrgb&w=800', '["https://images.pexels.com/photos/2979308/pexels-photo-2979308.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800"]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'clothes', 4.8, 124, true, true, '["formal", "cotton", "oxford"]'),
('Casual Linen Blazer', 'casual-linen-blazer', 'Lightweight linen blazer perfect for summer events. Relaxed fit with modern tailoring.', 8900, NULL, 'https://images.pexels.com/photos/3283427/pexels-photo-3283427.jpeg?auto=compress&cs=tinysrgb&w=800', '["https://images.pexels.com/photos/3866452/pexels-photo-3866452.jpeg?auto=compress&cs=tinysrgb&w=800"]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'clothes', 4.6, 89, true, true, '["blazer", "linen", "summer"]'),
('Slim Fit Chinos', 'slim-fit-chinos', 'Versatile slim-fit chinos in premium stretch cotton. Comfortable for all-day wear.', 5200, NULL, 'https://images.pexels.com/photos/4212560/pexels-photo-4212560.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'clothes', 4.5, 156, true, true, '["casual", "chinos", "everyday"]'),
('Merino Wool Sweater', 'merino-wool-sweater', 'Luxuriously soft merino wool sweater. Perfect layering piece for cooler weather.', 7800, 9200, 'https://images.pexels.com/photos/4283383/pexels-photo-4283383.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'clothes', 4.9, 203, true, true, '["wool", "sweater", "winter"]'),
('Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'Essential premium cotton t-shirt with a perfect fit. Made from 100% organic cotton.', 2800, NULL, 'https://images.pexels.com/photos/1653823/pexels-photo-1653823.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'clothes', 4.7, 412, true, true, '["casual", "cotton", "essential"]'),

-- Men's Shoes
('Leather Oxford Shoes', 'leather-oxford-shoes', 'Handcrafted leather oxford shoes. Classic design with exceptional craftsmanship.', 15000, 18000, 'https://images.pexels.com/photos/263742/pexels-photo-263742.jpeg?auto=compress&cs=tinysrgb&w=800', '["https://images.pexels.com/photos/2439022/pexels-photo-2439022.jpeg?auto=compress&cs=tinysrgb&w=800"]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'shoes', 4.9, 87, true, true, '["formal", "leather", "oxford"]'),
('Casual Leather Sneakers', 'casual-leather-sneakers', 'Comfortable leather sneakers perfect for everyday wear. Cushioned insole for all-day comfort.', 8500, NULL, 'https://images.pexels.com/photos/2672979/pexels-photo-2672979.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'shoes', 4.7, 234, true, true, '["casual", "sneakers", "leather"]'),
('Suede Chelsea Boots', 'suede-chelsea-boots', 'Premium suede chelsea boots with elastic side panels. Stylish and versatile.', 12000, NULL, 'https://images.pexels.com/photos/263253/pexels-photo-263253.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'shoes', 4.6, 156, true, true, '["boots", "suede", "chelsea"]'),
('Running Trainers', 'running-trainers', 'High-performance running trainers with responsive cushioning. Ideal for daily training.', 9800, NULL, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'men'), 'men', 'shoes', 4.8, 198, true, true, '["sports", "running", "trainers"]'),

-- Women's Clothes
('Silk Midi Dress', 'silk-midi-dress', 'Elegant silk midi dress with a flattering silhouette. Perfect for special occasions.', 12500, 15000, 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800', '["https://images.pexels.com/photos/1579190/pexels-photo-1579190.jpeg?auto=compress&cs=tinysrgb&w=800"]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'clothes', 4.9, 156, true, true, '["dress", "silk", "formal"]'),
('Cashmere Cardigan', 'cashmere-cardigan', 'Luxuriously soft cashmere cardigan. Timeless design for effortless elegance.', 9800, NULL, 'https://images.pexels.com/photos/10820835/pexels-photo-10820835.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'clothes', 4.8, 234, true, true, '["cardigan", "cashmere", "winter"]'),
('Tailored Wool Trousers', 'tailored-wool-trousers', 'Perfectly tailored wool trousers with a modern fit. Versatile for work or weekend.', 6500, NULL, 'https://images.pexels.com/photos/2251572/pexels-photo-2251572.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'clothes', 4.7, 189, true, true, '["trousers", "wool", "formal"]'),
('Floral Blouse', 'floral-blouse', 'Delicate floral blouse in premium silk blend. Feminine and sophisticated.', 4200, NULL, 'https://images.pexels.com/photos/2687156/pexels-photo-2687156.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'clothes', 4.6, 167, true, true, '["blouse", "floral", "silk"]'),
('Linen Summer Dress', 'linen-summer-dress', 'Breezy linen summer dress perfect for warm days. Relaxed fit with beautiful drape.', 5800, NULL, 'https://images.pexels.com/photos/2622699/pexels-photo-2622699.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'clothes', 4.8, 256, true, true, '["dress", "linen", "summer"]'),

-- Women's Shoes
('Leather Ankle Boots', 'leather-ankle-boots', 'Chic leather ankle boots with block heel. Versatile design for day-to-night wear.', 11000, 13500, 'https://images.pexels.com/photos/2672780/pexels-photo-2672780.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'shoes', 4.8, 198, true, true, '["boots", "leather", "heel"]'),
('Classic Pumps', 'classic-pumps', 'Timeless patent leather pumps with comfortable heel height. Office-ready elegance.', 9500, NULL, 'https://images.pexels.com/photos/2672925/pexels-photo-2672925.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'shoes', 4.7, 321, true, true, '["pumps", "formal", "heel"]'),
('Woven Leather Sandals', 'woven-leather-sandals', 'Artisanal woven leather sandals. Handcrafted for exceptional comfort and style.', 6800, NULL, 'https://images.pexels.com/photos/2672400/pexels-photo-2672400.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'shoes', 4.6, 145, true, true, '["sandals", "leather", "summer"]'),
('Canvas Sneakers', 'canvas-sneakers', 'Comfortable canvas sneakers with vintage-inspired design. Perfect for casual outings.', 4200, NULL, 'https://images.pexels.com/photos/2420832/pexels-photo-2420832.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'women'), 'women', 'shoes', 4.5, 276, true, true, '["sneakers", "canvas", "casual"]'),

-- Kids' Clothes
('Organic Cotton Romper', 'organic-cotton-romper', 'Soft organic cotton romper for babies. Gentle on delicate skin.', 2800, NULL, 'https://images.pexels.com/photos/3754684/pexels-photo-3754684.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'clothes', 4.9, 89, true, true, '["baby", "organic", "romper"]'),
('Denim Overall Set', 'denim-overall-set', 'Adorable denim overall set for toddlers. Durable and comfortable for play time.', 3500, NULL, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'clothes', 4.7, 156, true, true, '["toddler", "denim", "playwear"]'),
('Kids Cotton Dress', 'kids-cotton-dress', 'Pretty cotton dress with playful print. Perfect for everyday adventures.', 3200, NULL, 'https://images.pexels.com/photos/1456977/pexels-photo-1456977.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'clothes', 4.8, 234, true, true, '["dress", "cotton", "girls"]'),
('Boys Polo Set', 'boys-polo-set', 'Classic polo shirt with matching shorts. Smart casual for special occasions.', 3800, NULL, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'clothes', 4.6, 178, true, true, '["polo", "boys", "smart"]'),
('Fleece Zip Jacket', 'fleece-zip-jacket', 'Cozy fleece zip-up jacket for kids. Perfect for cooler days and outdoor play.', 4500, NULL, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'clothes', 4.7, 201, true, true, '["jacket", "fleece", "warm"]'),

-- Kids' Shoes
('Kids Velcro Sneakers', 'kids-velcro-sneakers', 'Easy-to-wear velcro sneakers for kids. Durable sole for active play.', 3200, NULL, 'https://images.pexels.com/photos/2672979/pexels-photo-2672979.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'shoes', 4.8, 189, true, true, '["sneakers", "velcro", "everyday"]'),
('Canvas Slip-On Shoes', 'canvas-slip-on-shoes', 'Convenient slip-on canvas shoes. Lightweight and breathable for summer.', 2800, NULL, 'https://images.pexels.com/photos/2420832/pexels-photo-2420832.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'shoes', 4.7, 167, true, true, '["slip-on", "canvas", "summer"]'),
('Kids Leather Sandals', 'kids-leather-sandals', 'Comfortable leather sandals with adjustable straps. Perfect for growing feet.', 3500, NULL, 'https://images.pexels.com/photos/2672400/pexels-photo-2672400.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'shoes', 4.9, 145, true, true, '["sandals", "leather", "summer"]'),
('School Uniform Shoes', 'school-uniform-shoes', 'Durable school uniform shoes in black leather. Built to last through the school year.', 4800, NULL, 'https://images.pexels.com/photos/263742/pexels-photo-263742.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'shoes', 4.6, 234, true, true, '["school", "formal", "leather"]'),
('Sports Trainers', 'sports-trainers', 'Lightweight sports trainers for active kids. Excellent cushioning and support.', 4000, NULL, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', '[]', (SELECT id FROM categories WHERE slug = 'kids'), 'kids', 'shoes', 4.8, 198, true, true, '["sports", "trainers", "running"]');
