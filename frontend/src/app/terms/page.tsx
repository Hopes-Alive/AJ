import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for AJ Fresh Foods website and services.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
        By using this website, you agree to use it for lawful business enquiries
        and wholesale communication. Product availability, pricing, and delivery
        terms may change and are confirmed at order time.
      </p>
    </section>
  );
}
