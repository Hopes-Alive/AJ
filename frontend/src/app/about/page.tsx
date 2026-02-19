import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about AJ Fresh Foods — Australian wholesale grocery distributor serving retailers with 130+ quality products across 12 categories.",
};

export default function AboutPage() {
  return <AboutContent />;
}
