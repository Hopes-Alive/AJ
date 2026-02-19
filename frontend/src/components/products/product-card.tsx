"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  groupPack?: string;
  groupPrice?: string;
  index: number;
  accentHue?: number;
}

export function ProductCard({
  product,
  groupPack,
  groupPrice,
  index,
  accentHue = 176,
}: ProductCardProps) {
  const pack = product.pack || groupPack;
  const price = product.price || groupPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.025, duration: 0.35 }}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-400"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 4px oklch(0 0 0 / 0.04), 0 2px 8px oklch(0 0 0 / 0.02)",
      }}
    >
      {/* Hover glow behind card */}
      <div
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10 blur-lg"
        style={{ background: `oklch(0.55 0.12 ${accentHue} / 0.08)` }}
      />

      {/* Hover border overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          border: `1px solid oklch(0.55 0.12 ${accentHue} / 0.2)`,
        }}
      />

      {/* Top shine edge */}
      <div
        className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 10%, oklch(1 0 0 / var(--highlight-edge-a)) 50%, transparent 90%)",
        }}
      />

      {/* Lift & scale on hover via wrapper */}
      <div className="relative flex flex-col h-full transition-transform duration-400 group-hover:-translate-y-1">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <ProductPlaceholder name={product.name} hue={accentHue} />
          )}

          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-black/5 dark:from-white/4 dark:to-black/15 pointer-events-none" />

          {/* Price badge */}
          {price && (
            <div
              className="absolute top-2 right-2 rounded-lg px-2 py-0.5 text-[11px] font-bold text-white z-10"
              style={{
                background: `linear-gradient(135deg, oklch(0.5 0.12 ${accentHue} / 0.9), oklch(0.44 0.1 ${accentHue + 12} / 0.9))`,
                backdropFilter: "blur(8px)",
                boxShadow: `0 2px 10px oklch(0.5 0.12 ${accentHue} / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.1)`,
              }}
            >
              {price}
            </div>
          )}

          {/* Bottom image vignette */}
          <div
            className="absolute bottom-0 inset-x-0 h-8 pointer-events-none"
            style={{
              background: "linear-gradient(to top, oklch(0 0 0 / 0.06), transparent)",
            }}
          />
        </div>

        {/* Info area */}
        <div className="relative flex flex-col flex-1 p-3 sm:p-3.5">
          {/* Subtle accent separator */}
          <div
            className="absolute inset-x-3 top-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, oklch(0.55 0.12 ${accentHue} / 0.08), oklch(0.55 0.12 ${accentHue} / 0.03), transparent)`,
            }}
          />

          <h4 className="font-semibold text-[13px] leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h4>
          {pack && (
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <span
                className="inline-block h-1 w-1 rounded-full flex-shrink-0"
                style={{ background: `oklch(0.55 0.12 ${accentHue} / 0.4)` }}
              />
              {pack}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductPlaceholder({
  name,
  hue,
}: {
  name: string;
  hue: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `linear-gradient(145deg, oklch(var(--placeholder-l) var(--placeholder-c) ${hue}), oklch(calc(var(--placeholder-l) - 0.03) calc(var(--placeholder-c) + 0.005) ${hue + 12}))`,
      }}
    >
      {/* Ambient light spot */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, oklch(1 0 0 / var(--highlight-a)), transparent 50%)`,
        }}
      />

      {/* Geometric pattern (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(oklch(0.55 0.12 ${hue} / 0.8) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Initials badge */}
      <div
        className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        style={{
          background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.18), oklch(0.55 0.12 ${hue} / 0.08))`,
          color: `oklch(var(--subtle-text-l) 0.1 ${hue})`,
          border: `1px solid oklch(0.55 0.12 ${hue} / 0.12)`,
          boxShadow: `inset 0 1px 0 oklch(1 0 0 / var(--highlight-a))`,
        }}
      >
        {initials}
      </div>
    </div>
  );
}
