# ShopNova — React + Node + Express + MySQL E-commerce

## Folder structure
```
shopnova/
├── backend/   (Express API + MySQL)
└── frontend/  (React + Vite)
```

## Run it in Termux — step by step

### 1. Install required packages (one time)
```
pkg update && pkg upgrade -y
pkg install nodejs mariadb -y
```

### 2. Start the database
First time only — initialize the data directory:
```
mysql_install_db --datadir=$PREFIX/var/lib/mysql
```
Start the server (run this every time you resume work):
```
mysqld_safe --datadir=$PREFIX/var/lib/mysql &
```
Create the database (first time only):
```
mysql -u root
```
Inside the `mysql>` prompt:
```sql
CREATE DATABASE shopnova;
EXIT;
```

### 3. Load the schema
**If this is a brand-new database:**
```
cd shopnova/backend
mysql -u root shopnova < sql/schema.sql
```
**If you already had ShopNova running before this update** (your `orders` table doesn't yet have shipping columns), also run:
```
mysql -u root shopnova < sql/migration_001_shipping_address.sql
```

### 4. Configure environment variables
```
cd shopnova/backend
cp .env.example .env
```
Open `.env` in Acode and fill in `DB_PASSWORD` (leave blank if you didn't set a root password) and change `JWT_SECRET` to any random string.

### 5. Install backend dependencies and start the server
```
cd shopnova/backend
npm install
npm start
```
You should see: `ShopNova backend running on http://0.0.0.0:5000`

### 6. In a new Termux session, install and start the frontend
Open a new Termux session (swipe from the left edge → New session), then:
```
cd shopnova/frontend
npm install
npm run dev
```
Vite will print a URL like `http://localhost:5173`.

### 7. Open the site
Open Chrome on your phone and go to:
```
http://localhost:5173
```

## What's included
- **Storefront:** hero banner, shop-by-category tiles, featured products, full product catalog with search + category/price filters + sorting, product detail pages
- **Accounts:** register/login (JWT + bcrypt), customer account page with order history, order detail view with shipping address
- **Cart & checkout:** persistent cart, quantity editing, a real checkout page that collects and stores a shipping address, stock validation at checkout (orders are rejected if an item's quantity exceeds remaining stock)
- **Admin dashboard** (`/admin`, admin role required): overview stats (products/customers/orders/revenue), product management (add/edit/delete), customer list, order management with status updates
- Loading, empty, and error states throughout; responsive layout for mobile and desktop

## Making yourself an admin
```
mysql -u root shopnova
```
```sql
UPDATE users SET role='admin' WHERE email='youremail@example.com';
EXIT;
```
**Important:** log out and log back in afterward. Your JWT was issued with your old role baked in, so you need a fresh token that reflects `admin`. Once logged in again, an "Admin" link appears in the navbar, and `/admin` becomes accessible.

## Editing code
Open the `shopnova` folder in Acode to edit any file. After saving a backend file, stop the server (Ctrl+C in that Termux session) and run `npm start` again. The frontend (Vite) auto-reloads on save.

## API reference (for your own testing)
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products` (supports `?search=&category=&minPrice=&maxPrice=&sort=`), `GET /api/products/categories`, `GET /api/products/:id`
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` — admin only
- `GET /api/cart`, `POST /api/cart`, `DELETE /api/cart/:id`, `POST /api/cart/checkout` (requires shipping fields: `shippingName`, `shippingPhone`, `shippingAddress`, `shippingCity`, `shippingZip`)
- `GET /api/orders/my`, `GET /api/orders/:id` — your own orders only
- `GET /api/admin/stats`, `GET /api/admin/customers`, `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status` — admin only, re-verified server-side against MySQL on every request
