import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin");
  }

  const userName = user.user_metadata?.full_name as string | undefined;

  return (
    <div className="min-h-screen flex bg-background">
      {/* 80px = floating site header height on lg+ */}
      <aside className="hidden lg:block shrink-0">
        <div className="sticky top-[80px] h-[calc(100vh-80px)]">
          <Sidebar />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userEmail={user.email} userName={userName} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
