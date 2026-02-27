import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingCart, ClipboardList, Search, ArrowRight, Package } from "lucide-react";

const quickActions = [
  {
    href: "/dashboard/new-order",
    icon: ShoppingCart,
    title: "Start New Order",
    description: "Browse 130+ products and place a wholesale order",
    cta: "Place order",
    accent: "bg-primary/10 text-primary",
    border: "border-primary/20 hover:border-primary/40",
  },
  {
    href: "/dashboard/orders",
    icon: ClipboardList,
    title: "My Orders",
    description: "View and track all your previous orders",
    cta: "View orders",
    accent: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    href: "/dashboard/lookup",
    icon: Search,
    title: "Order Lookup",
    description: "Find any order instantly using its order number",
    cta: "Look up order",
    accent: "bg-purple-500/10 text-purple-500",
    border: "border-purple-500/20 hover:border-purple-500/40",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ")[0] ?? "there";
  const businessName = user?.user_metadata?.business_name as string | undefined;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {userName}
        </h1>
        {businessName && (
          <p className="text-muted-foreground mt-1">{businessName}</p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">{user?.email}</p>
      </div>

      <div className="mb-6">
        <Link
          href="/dashboard/new-order"
          className="flex items-center justify-between p-5 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Start a New Order</p>
              <p className="text-primary-foreground/80 text-sm">
                130+ wholesale products ready to order
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {quickActions.slice(1).map(({ href, icon: Icon, title, description, cta, accent, border }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col gap-4 p-5 rounded-xl border bg-card transition-colors group ${border}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              {cta} <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
        <Package className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need help?</span> Contact us at{" "}
          <a href="mailto:info@ajfreshfoods.com.au" className="text-primary hover:underline">
            info@ajfreshfoods.com.au
          </a>{" "}
          or visit our{" "}
          <Link href="/products" className="text-primary hover:underline">
            product catalogue
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
