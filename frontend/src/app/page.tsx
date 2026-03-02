import { ScrollVideoHero } from "@/components/home/scroll-video-hero";
import { Stats } from "@/components/home/stats";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedBrands } from "@/components/home/featured-brands";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      {/* Landing page sections intentionally render in this order. */}
      <ScrollVideoHero />
      <Stats />
      <CategoryShowcase />
      <FeaturedBrands />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </>
  );
}
