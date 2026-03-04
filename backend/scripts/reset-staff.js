require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function resetStaff() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error.message);
    process.exit(1);
  }

  const staffUsers = (data.users || []).filter(
    (u) =>
      u.user_metadata?.is_admin === true ||
      u.user_metadata?.is_developer === true
  );

  if (staffUsers.length === 0) {
    console.log("No admin/developer accounts found.");
    return;
  }

  for (const user of staffUsers) {
    const { error: delError } = await supabase.auth.admin.deleteUser(user.id);
    if (delError) {
      console.error(`Failed to delete ${user.email || user.id}:`, delError.message);
    } else {
      console.log(`Deleted: ${user.email || "(no-email)"} (${user.id})`);
    }
  }

  console.log("Done. Cleared admin/developer accounts.");
}

resetStaff().catch((e) => {
  console.error(e);
  process.exit(1);
});
