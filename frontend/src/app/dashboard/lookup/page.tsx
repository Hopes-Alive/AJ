import type { Metadata } from "next";
import { OrderLookup } from "@/components/dashboard/order-lookup";

export const metadata: Metadata = {
  title: "Order Lookup",
};

export default function LookupPage() {
  return <OrderLookup />;
}
