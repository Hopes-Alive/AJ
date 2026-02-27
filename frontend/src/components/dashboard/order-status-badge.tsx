import { cn } from "@/lib/utils";
import type { Order } from "@/lib/api/orders";

export const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; badge: string; dot: string; glow: string; border: string; bar: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
    dot: "bg-amber-400",
    glow: "oklch(0.78 0.15 80 / 0.15)",
    border: "oklch(0.78 0.15 80 / 0.5)",
    bar: "from-amber-400 to-amber-500",
  },
  in_progress: {
    label: "In Progress",
    badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40",
    dot: "bg-blue-400",
    glow: "oklch(0.55 0.18 250 / 0.15)",
    border: "oklch(0.55 0.18 250 / 0.5)",
    bar: "from-blue-400 to-blue-500",
  },
  payment_pending: {
    label: "Payment Pending",
    badge: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/40",
    dot: "bg-orange-400",
    glow: "oklch(0.7 0.18 50 / 0.15)",
    border: "oklch(0.7 0.18 50 / 0.5)",
    bar: "from-orange-400 to-orange-500",
  },
  paid: {
    label: "Paid",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
    dot: "bg-emerald-400",
    glow: "oklch(0.6 0.15 160 / 0.15)",
    border: "oklch(0.6 0.15 160 / 0.5)",
    bar: "from-emerald-400 to-emerald-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/40",
    dot: "bg-slate-400",
    glow: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.4)",
    bar: "from-slate-400 to-slate-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40",
    dot: "bg-red-400",
    glow: "oklch(0.55 0.2 25 / 0.12)",
    border: "oklch(0.55 0.2 25 / 0.45)",
    bar: "from-red-400 to-red-500",
  },
};

export const ALL_STATUSES = Object.entries(STATUS_CONFIG) as [
  Order["status"],
  (typeof STATUS_CONFIG)[Order["status"]]
][];

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", config.badge)}>
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
      {config.label}
    </span>
  );
}
