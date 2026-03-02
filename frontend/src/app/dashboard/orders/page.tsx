import type { Metadata } from "next";
import { OrderHistory } from "@/components/dashboard/order-history";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <OrderHistory />
    </div>
  );
}
