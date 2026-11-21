-- Run this ONLY if you already created your database from the earlier schema.sql
-- (i.e. your `orders` table does not yet have shipping columns).
-- Run with: mysql -u root -p shopnova < sql/migration_001_shipping_address.sql
--
-- If you are setting up the database for the first time, skip this file —
-- the updated schema.sql already includes these columns.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(150) AFTER status,
  ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(30) AFTER shipping_name,
  ADD COLUMN IF NOT EXISTS shipping_address VARCHAR(255) AFTER shipping_phone,
  ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100) AFTER shipping_address,
  ADD COLUMN IF NOT EXISTS shipping_zip VARCHAR(20) AFTER shipping_city;
