import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AJ Fresh Foods website and services.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
        We collect only the information needed to respond to enquiries and process
        wholesale business requests. We do not sell personal data. Contact us if
        you need your information updated or removed.
      </p>
    </section>
  );
}
