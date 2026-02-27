require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function resetAdmin() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error("Error listing users:", error.message); return; }

  if (data.users.length === 0) {
    console.log("No users found — already clean.");
    return;
  }

  for (const user of data.users) {
    const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
    if (delError) {
      console.error(`Failed to delete ${user.email}:`, delError.message);
    } else {
      console.log(`Deleted: ${user.email} (${user.id})`);
    }
  }

  console.log("\nDone. You can now register a fresh admin account at /admin");
}

resetAdmin();
