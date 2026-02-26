# Product Inventory Management Dashboard

A fully functional product inventory dashboard built with **ReactJS**, **TypeScript**, and **Supabase**. This project allows users to browse, filter, sort, and paginate through a large dataset of products — with all logic handled server-side for optimal performance.

---

## 🚀 Live Demo

(https://productinventorycase.netlify.app/)

---

## ✨ Features

- **Server-Side Pagination** — Displays 10 products per page using Supabase's `.range()` method.
- **Advanced Filtering:**
  - Case-insensitive search by product name
  - Category-based filtering
  - Price range filtering (Min / Max)
  - Stock availability toggle (In Stock / Out of Stock)
- **Dynamic Sorting** — Sort by Name, Price, Stock Quantity, or Created Date in ascending or descending order.
- **Query Optimization** — All filtering, sorting, and pagination are combined into a single Supabase query to prevent over-fetching.
- **Responsive Design** — Fully optimized for mobile and desktop views using Tailwind CSS.
- **State Management** — Filtering and sorting states are synchronized across pagination.

---

## 🛠️ Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| Frontend           | ReactJS (Hooks), TypeScript, Tailwind CSS        |
| Icons              | Lucide React                                    |
| Backend / Database | Supabase (PostgreSQL)                           |
| Build Tool         | Vite                                            |

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/batuhanselcuk9/longrun-case-task.git
cd longrun-inventory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the SQL script in `schema.sql` (or see the [Database Schema](#️-database-schema) section below) inside your **Supabase SQL Editor** to create the `products` table and seed the initial 70 products.

### 5. Run the application

```bash
npm run dev
```

---

## 🗄️ Database Schema

The `products` table has the following structure:

```sql
CREATE TABLE products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  price           NUMERIC(10, 2) NOT NULL,
  stock_quantity  INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> **Row Level Security (RLS)** is enabled with a public `SELECT` policy to allow the frontend to fetch data securely without exposing write access.

---

## 📝 Technical Decisions

- **Server-Side Logic** — All data operations (filtering, sorting, pagination) are handled via Supabase's query builder. The client only receives the 10 records needed for the current view, significantly reducing network payload and ensuring scalability.

- **TypeScript** — Used for robust type safety, especially for the `Product` interface and Supabase response handling.

- **UX / UI** — Loading states and a "No products found" message are included to improve user feedback during data fetches and empty results.