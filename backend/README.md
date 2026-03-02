# AJ Fresh Foods — Backend API

Express + TypeScript REST API for the AJ Fresh Foods ordering system.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your Supabase credentials in .env
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port to run the server on (default: 4000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) |
| `FRONTEND_URL` | Frontend URL for CORS (default: http://localhost:3000) |

## Supabase Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  notes text,
  delivery_address text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row Level Security
alter table public.orders enable row level security;

-- Users can only see and modify their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();
```

## API Endpoints

All endpoints require `Authorization: Bearer <supabase_access_token>` header.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/orders` | List user's orders |
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/:id` | Get order by UUID |
| GET | `/api/orders/lookup/:orderNumber` | Look up order by order number (e.g. AJ-2024-0001) |
| PATCH | `/api/orders/:id/cancel` | Cancel a pending order |
