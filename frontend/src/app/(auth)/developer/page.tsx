import type { Metadata } from "next";
import { AdminAuthForm } from "@/components/auth/admin-auth-form";

export const metadata: Metadata = {
  title: "Developer Portal",
  description: "AJ Fresh Foods developer access",
};

export default function DeveloperPage() {
  return <AdminAuthForm portalType="developer" />;
}
