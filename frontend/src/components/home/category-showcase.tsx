"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/data/products";
import {
  GlassWater,
  Coffee,
  Leaf,
  Cherry,
  Wheat,
  Flame,
  Citrus,
  Soup,
  ChefHat,
  Candy,
  Droplets,
  Home,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "glass-water": GlassWater,
  coffee: Coffee,
  leaf: Leaf,
  cherry: Cherry,
  wheat: Wheat,
  flame: Flame,
  citrus: Citrus,
  soup: Soup,
  "chef-hat": ChefHat,
  candy: Candy,
  droplets: Droplets,
  home: Home,
};

export function CategoryShowcase() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      {/* Dark mode: distinct surface */}
      <div className="absolute inset-0 hidden dark:block" style={{
        background: "linear-gradient(180deg, oklch(0.1 0.015 178) 0%, oklch(0.12 0.025 180) 50%, oklch(0.1 0.015 178) 100%)",
      }} />
      {/* Decorative side glows (dark mode) */}
      <div className="absolute top-0 left-0 w-1/3 h-full pointer-events-none hidden dark:block" style={{
        background: "radial-gradient(ellipse at 0% 50%, oklch(0.55 0.12 176 / 0.04), transparent 70%)",
      }} />
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none hidden dark:block" style={{
        background: "radial-gradient(ellipse at 100% 50%, oklch(0.5 0.1 195 / 0.04), transparent 70%)",
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Our Range
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of wholesale products across 12
            categories, sourced from trusted brands worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {categories.map((cat, i) => {
            const productCount = cat.groups.reduce(
              (sum, g) => sum + g.products.length,
              0
            );
            const Icon = iconMap[cat.icon] || GlassWater;
            const hue = 176 + i * 15;

            return (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                productCount={productCount}
                Icon={Icon}
                hue={hue}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  id,
  name,
  productCount,
  Icon,
  hue,
  index,
}: {
  id: string;
  name: string;
  productCount: number;
  Icon: LucideIcon;
  hue: number;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
    >
      <Link href="/products" className="block group">
        <div
          className="relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-xl"
          style={{
            boxShadow: [
              "0 2px 8px oklch(0.05 0 0 / 0.12)",
              "0 8px 24px oklch(0.05 0 0 / 0.08)",
            ].join(", "),
          }}
        >
          {/* Gradient fallback */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg, oklch(0.22 0.04 ${hue}), oklch(0.15 0.03 ${hue + 25}), oklch(0.18 0.035 ${hue - 10}))`,
            }}
          />

          {/* Large watermark icon (fallback decoration) */}
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Icon className="h-20 w-20 text-white/[0.06]" />
            </div>
          )}

          {/* Image */}
          {!imgError && (
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
              <Image
                src={`/images/categories/${id}.jpg`}
                alt={name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 group-hover:from-black/70 group-hover:via-black/25 transition-all duration-500" />

          {/* Hover inner glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: `inset 0 -40px 60px -20px oklch(0.6 0.12 ${hue} / 0.12)`,
            }}
          />

          {/* Top highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.1), transparent)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <Icon className="h-3.5 w-3.5 text-white/80" />
              </div>
            </div>
            <h3
              className="text-sm sm:text-base font-bold text-white leading-tight"
              style={{ textShadow: "0 1px 8px oklch(0 0 0 / 0.3)" }}
            >
              {name}
            </h3>
            <p className="text-[11px] sm:text-xs text-white/55 mt-0.5">
              {productCount} product{productCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
