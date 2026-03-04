import type { Metadata } from "next";
import { CatalogManager } from "@/components/dashboard/catalog-manager";

export const metadata: Metadata = {
  title: "Catalog Manager",
};

export default function CatalogPage() {
  return <CatalogManager />;
}
