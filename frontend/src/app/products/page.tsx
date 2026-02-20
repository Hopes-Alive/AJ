import type { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-grid";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the full AJ Fresh Foods wholesale catalogue — 130+ products across beverages, coffee, tea, rice, spices, noodles, dried fruits, and more.",
};

export default function ProductsPage() {
  return (
    <section className="relative py-3 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hidden sm:block">
          <SectionHeader
            label="Product Catalogue"
            title="Our Complete"
            titleGradient="Range"
            description="130+ wholesale products across 12 categories. All pricing is per carton and negotiable. Contact us for your best rate."
          />
        </div>
        <ProductCatalog />
      </div>
    </section>
  );
}
