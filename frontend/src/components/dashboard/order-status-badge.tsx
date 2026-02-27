import { cn } from "@/lib/utils";
import type { Order } from "@/lib/api/orders";

export const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    dot: "bg-yellow-400",
  },
  in_progress: {
    label: "In Progress",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-400",
  },
  payment_pending: {
    label: "Payment Pending",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-400",
  },
  paid: {
    label: "Paid",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-400",
  },
  closed: {
    label: "Closed",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-400",
  },
};

export const ALL_STATUSES = Object.entries(STATUS_CONFIG) as [
  Order["status"],
  (typeof STATUS_CONFIG)[Order["status"]]
][];

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.badge
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
