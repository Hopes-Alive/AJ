"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { featuredBrands } from "@/data/products";
import { Brand } from "@/types";

const duplicated = [...featuredBrands, ...featuredBrands];

export function FeaturedBrands() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Light bg */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.004 178) 0%, oklch(0.96 0.006 180) 50%, oklch(0.97 0.004 178) 100%)",
        }}
      />
      {/* Dark bg */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.015 178) 0%, oklch(0.12 0.02 182) 50%, oklch(0.09 0.015 178) 100%)",
        }}
      />

      {/* Top divider */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.18), transparent)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
              Trusted Partners
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Brands You{" "}
              <span className="text-gradient">Know & Trust</span>
            </h2>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[oklch(0.97_0.004_178)] dark:from-[oklch(0.09_0.015_178)] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[oklch(0.97_0.004_178)] dark:from-[oklch(0.09_0.015_178)] to-transparent z-10" />

          <motion.div
            className="flex items-center gap-12 sm:gap-16 lg:gap-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicated.map((brand, i) => (
              <BrandLogo key={`${brand.name}-${i}`} brand={brand} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.15), transparent)",
        }}
      />
    </section>
  );
}

function BrandLogo({ brand, index }: { brand: Brand; index: number }) {
  const hue = 176 + (index % 7) * 22;
  const initials = brand.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="shrink-0 flex flex-col items-center gap-3 group cursor-default">
      <div
        className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-400 group-hover:scale-110 group-hover:-translate-y-1"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: [
            "0 1px 4px oklch(0.2 0 0 / var(--shadow-a, 0.06))",
            "0 4px 12px oklch(0.2 0 0 / calc(var(--shadow-a, 0.06) * 0.5))",
          ].join(", "),
        }}
      >
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={64}
            height={64}
            className="object-contain w-14 h-14 sm:w-16 sm:h-16 mix-blend-multiply dark:mix-blend-screen dark:brightness-[1.15]"
          />
        ) : (
          <span
            className="text-lg sm:text-xl font-bold"
            style={{ color: `oklch(0.5 0.1 ${hue})` }}
          >
            {initials}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
        {brand.name}
      </span>
    </div>
  );
}
