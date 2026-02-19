import type { Metadata } from "next";
import { ServicesContent } from "./services-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Our distribution services include warehousing, scheduled route delivery, order management, and in-store merchandising support for supermarkets.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
