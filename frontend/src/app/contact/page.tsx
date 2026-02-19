import type { Metadata } from "next";
import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AJ Distributors. Find our address, phone, email, and office hours. We'd love to discuss how we can serve your supermarket.",
};

export default function ContactPage() {
  return <ContactContent />;
}
