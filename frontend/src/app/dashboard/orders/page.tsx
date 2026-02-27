import type { Metadata } from "next";
import { OrderHistory } from "@/components/dashboard/order-history";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your complete order history
        </p>
      </div>
      <OrderHistory />
    </div>
  );
}
