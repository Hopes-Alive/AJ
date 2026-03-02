import type { Metadata } from "next";
import { NewOrderForm } from "@/components/dashboard/new-order-form";

export const metadata: Metadata = {
  title: "New Order",
};

export default function NewOrderPage() {
  return <NewOrderForm />;
}
