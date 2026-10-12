# 🏰 Aura Luxury Villas & Estates - Node.js CMS

A luxury vacation rental & private villa reservation web application, built with the same architecture and technology stack as the **Simone** project (**Node.js + Express + EJS + MySQL / Resilient Mock DB + Express-Session + File Upload**), but elevated with a champagne gold and obsidian dark aesthetic.

---

## 🌟 Key Features

### 🌐 Public Experience
- **Hero & Destination Search**: Dynamic filter bar to search by Destination (Amalfi, Santorini, Bali, French Riviera, Tulum, Zermatt), guest capacity, and nightly rates.
- **Villa Catalog (`/villas`)**: Real-time filtering, pricing sorting, room counts, and high-resolution architecture previews.
- **Villa Details Page (`/villa/:id`)**:
  - Full specs (Guest capacity, bedrooms, bathrooms, square footage).
  - Exclusive amenities checklist (Helipads, private sea access, private chefs, wine cellars).
  - **Live Interactive Nights & Price Estimator** (calculates nights and 12% luxury tax/service on the fly).
  - Direct confidential booking request form (`/book_inquiry`).
- **Signature Experiences (`/amenities`)**: Private chefs, yacht & jet charters, 24/7 dedicated concierges, and wellness spa treatments.
- **Brand Heritage (`/about`)**: Architectural standards, 300-point inspection criteria, and privacy commitments.
- **Visual Gallery (`/gallery`)**: Curated photo showcase of luxury coastal estates.
- **Verified Guest Reviews (`/reviews`)**: Real client feedback with star ratings.
- **Concierge Desk (`/contact`)**: Instant consultation request and 24/7 hotline.

### 🔐 Staff Admin CMS (`/admin`)
- **Authentication**: Session-based login (`admin` / `admin`).
- **Dashboard (`/admin/dashboard`)**: Metric stat cards (Total Estates, Inquiries, Pending Action, Confirmed Bookings).
- **Villa Management (`/admin/villas`)**: Full CRUD (Create, Read, Update, Delete) with image upload support.
- **Inquiries & Bookings (`/admin/inquiries`)**: View client reservation inquiries, live status toggle (Pending, Contacted, Confirmed, Cancelled), and delete.
- **Luxury Services CRUD (`/admin/services`)**: Manage listed bespoke amenities.
- **Reviews Management (`/admin/reviews`)**: Manage verified client reviews.
- **Site Configuration (`/admin/settings`)**: Live updates to site name, tagline, hero copy, and contact info.

---

## 🚀 How to Run

### 1. Install Dependencies
Navigate into the `villas` directory:
```bash
cd villas
npm install
```
*(Dependencies already installed in parent directory if shared)*

### 2. Start the Server
```bash
node server.js
```
The server will start on **Port 4000**:
- **Public Website**: [http://localhost:4000](http://localhost:4000)
- **Admin Panel**: [http://localhost:4000/admin](http://localhost:4000/admin)

### 3. Configure Environment (Optional)
Set `SESSION_SECRET` to a unique, random value before deploying. If it is omitted, the server generates a temporary secret at startup and existing sessions will not survive a restart.

For a local MySQL installation, configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` as environment variables. The database password defaults to an empty string; no database credentials are stored in the source code.

On Windows PowerShell, generate a session secret and start the server with:
```powershell
$env:SESSION_SECRET = (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
node server.js
```

---

## 🗄️ Database Setup (Optional)
This project features **Zero-Downtime Resilient Storage**:
- If MySQL is running and `database.sql` is imported into database `villas_db`, it automatically executes live SQL queries!
- If MySQL is offline or not yet configured, the app runs with complete built-in mock data so you can test, browse, and manage the CMS immediately without database errors.

To import MySQL schema:
1. Open phpMyAdmin or MySQL Workbench.
2. Run the queries in [`database.sql`](database.sql).
3. The seeded MySQL admin login is `admin` / `admin123`. Change it before exposing the application publicly.

When MySQL is unavailable, the built-in mock data uses the demo login `admin` / `admin`. Do not use these demo credentials in a public deployment.
