import type { Metadata } from "next";
import { AdminAuthForm } from "@/components/auth/admin-auth-form";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "AJ Fresh Foods administrator access",
};

export default function AdminPage() {
  return <AdminAuthForm />;
}
