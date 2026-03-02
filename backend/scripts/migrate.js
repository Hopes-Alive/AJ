// One-time migration script — creates the orders table in Supabase
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SQL = `
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Orders table
create table if not exists public.orders (
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

-- Drop existing policies if any
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Users can update own orders" on public.orders;

-- RLS Policies
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();
`;

async function migrate() {
  console.log("Running migration against:", SUPABASE_URL);

  // Try via pg-meta v1 query endpoint (available on hosted Supabase)
  const endpoints = [
    `${SUPABASE_URL}/pg-meta/v1/query`,
    `${SUPABASE_URL}/rest/v1/rpc/exec`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: SQL }),
      });

      const text = await res.text();

      if (res.ok) {
        console.log("✅ Migration succeeded via", endpoint);
        return;
      }

      console.log(`  ${endpoint} → ${res.status}: ${text.slice(0, 120)}`);
    } catch (e) {
      console.log(`  ${endpoint} → network error: ${e.message}`);
    }
  }

  // If all endpoints fail, print the SQL so the user can paste it
  console.log("\n⚠️  Could not auto-run migration (expected for most Supabase setups).");
  console.log("👉 Please run this SQL in your Supabase SQL editor:");
  console.log("   https://supabase.com/dashboard/project/nzjtkbaybombvkvgkjar/sql/new\n");
  console.log("--- SQL START ---");
  console.log(SQL);
  console.log("--- SQL END ---");
}

migrate().catch(console.error);
