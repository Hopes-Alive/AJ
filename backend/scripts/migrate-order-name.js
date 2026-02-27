require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Try to add the order_name column via the REST insert trick
// (will fail gracefully if column already exists)
async function migrate() {
  console.log("Checking if orders table needs order_name column...");

  // Try selecting order_name — if it errors, we need to add it
  const { error } = await supabase
    .from("orders")
    .select("order_name")
    .limit(1);

  if (!error) {
    console.log("✅ order_name column already exists.");
    return;
  }

  console.log("Column missing. Please run this SQL in your Supabase SQL editor:");
  console.log("https://supabase.com/dashboard/project/nzjtkbaybombvkvgkjar/sql/new\n");
  console.log("ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_name text NOT NULL DEFAULT '';");
}

migrate().catch(console.error);
