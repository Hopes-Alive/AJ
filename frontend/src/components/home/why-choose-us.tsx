"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Truck,
  ShieldCheck,
  DollarSign,
  HeadphonesIcon,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const reasons: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  stat: { value: string; label: string };
}[] = [
  {
    icon: Truck,
    title: "Australia-Wide Delivery",
    subtitle: "Logistics",
    description:
      "From coast to coast, our logistics network keeps your shelves fully stocked. Reliable delivery routes covering all major regions — timely restocks without the hassle.",
    bullets: [
      "Sydney, Melbourne, Brisbane, Perth & Adelaide",
      "Flexible scheduling to suit your store hours",
      "Real-time order tracking & notifications",
    ],
    image: "/images/why-choose-us/delivery.jpg",
    imageAlt: "Delivery truck on Australian highway",
    stat: { value: "5+", label: "Major Cities" },
  },
  {
    icon: ShieldCheck,
    title: "130+ Quality Products",
    subtitle: "Product Range",
    description:
      "We curate only the best across 12 product categories — from international favourites to locally loved brands. Every item sourced for quality, shelf appeal, and strong turnover.",
    bullets: [
      "Beverages, spices, rice, noodles & dried fruits",
      "Trusted brands like Coca-Cola, Shan, Indomie",
      "New product lines added regularly",
    ],
    image: "/images/why-choose-us/products.jpg",
    imageAlt: "Wide range of quality grocery products",
    stat: { value: "12", label: "Categories" },
  },
  {
    icon: DollarSign,
    title: "Wholesale Pricing",
    subtitle: "Value",
    description:
      "Competitive carton pricing designed to maximise your margins. Transparent GST handling and flexible order sizes make inventory and budget management effortless.",
    bullets: [
      "Competitive per-carton rates across all categories",
      "GST-inclusive transparent pricing",
      "Volume discounts for recurring orders",
    ],
    image: "/images/why-choose-us/wholesale.jpg",
    imageAlt: "Business wholesale pricing and inventory",
    stat: { value: "100%", label: "GST Transparent" },
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    subtitle: "Partnership",
    description:
      "More than a supplier — we're your wholesale growth partner. Our team is always a call or message away for orders, queries, and custom requirements.",
    bullets: [
      "Direct phone & email support line",
      "Personalised account management",
      "Custom product sourcing on request",
    ],
    image: "/images/why-choose-us/support.jpg",
    imageAlt: "Friendly team providing customer support",
    stat: { value: "24h", label: "Response Time" },
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Light mode bg */}
      <div className="absolute inset-0 bg-muted/40 dark:hidden" />
      {/* Dark mode surface */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.025 180) 0%, oklch(0.15 0.03 176) 50%, oklch(0.12 0.025 180) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 dark:opacity-40" />

      {/* Accent glows (dark mode) */}
      <div
        className="absolute top-[10%] right-[15%] w-[50%] h-[40%] pointer-events-none hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.55 0.12 176 / 0.05), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[10%] w-[40%] h-[35%] pointer-events-none hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.5 0.1 195 / 0.04), transparent 70%)",
        }}
      />

      {/* Top divider */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.2), oklch(0.5 0.1 195 / 0.15), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20 lg:mb-24"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.12 176 / 0.1), oklch(0.55 0.12 176 / 0.04))",
              border: "1px solid oklch(0.55 0.12 176 / 0.15)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Why Choose Us
            </span>
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
            Why Choose{" "}
            <span className="text-gradient">AJ Fresh Foods</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            More than a supplier — we&apos;re your wholesale growth partner.
          </p>
        </motion.div>

        {/* Timeline connector (desktop only) */}
        <div className="hidden lg:block absolute left-1/2 top-[220px] bottom-[120px] w-px -translate-x-1/2">
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(0.55 0.12 176 / 0.15) 10%, oklch(0.55 0.12 176 / 0.15) 90%, transparent)",
            }}
          />
        </div>

        <div className="flex flex-col gap-12 sm:gap-20 lg:gap-24 xl:gap-32">
          {reasons.map((reason, i) => (
            <ReasonRow key={reason.title} reason={reason} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.2), transparent)",
        }}
      />
    </section>
  );
}

function ReasonRow({
  reason,
  index,
}: {
  reason: (typeof reasons)[0];
  index: number;
}) {
  const Icon = reason.icon;
  const isReversed = index % 2 !== 0;
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const hues = [176, 195, 165, 185];
  const hue = hues[index % hues.length];

  return (
    <div ref={ref} className="relative">
      {/* Timeline dot (desktop only) */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
          className="relative"
        >
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, oklch(0.5 0.12 ${hue}), oklch(0.4 0.1 ${hue + 15}))`,
              boxShadow: `0 0 20px oklch(0.55 0.12 ${hue} / 0.25), 0 0 40px oklch(0.55 0.12 ${hue} / 0.1)`,
              border: "2px solid oklch(1 0 0 / 0.15)",
            }}
          >
            <span className="text-white font-bold text-sm">0{index + 1}</span>
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: `oklch(0.55 0.12 ${hue} / 0.15)`,
              animationDuration: "2s",
              animationIterationCount: "1",
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-24 items-center`}
      >
        {/* ── Image side ── */}
        <motion.div
          className={`relative overflow-hidden ${isReversed ? "lg:order-2" : "lg:order-1"}`}
          initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {/* Glow behind the image frame */}
          <div
            className="absolute -inset-2 sm:-inset-4 rounded-3xl pointer-events-none blur-2xl opacity-40 dark:opacity-30"
            style={{
              background: `radial-gradient(ellipse at ${isReversed ? "30%" : "70%"} 50%, oklch(0.55 0.12 ${hue} / 0.2), transparent 70%)`,
            }}
          />

          <div className="relative">
            {/* Decorative offset frame */}
            <div
              className="absolute -inset-[3px] rounded-[20px]"
              style={{
                background: `linear-gradient(${isReversed ? "225deg" : "135deg"}, oklch(0.55 0.12 ${hue} / 0.5), oklch(0.55 0.12 ${hue} / 0.05) 40%, oklch(0.55 0.12 ${hue} / 0.3))`,
              }}
            />

            <div
              className="relative aspect-[4/3] rounded-[18px] overflow-hidden group"
              style={{
                boxShadow: [
                  `0 8px 30px oklch(0.1 0.02 ${hue} / 0.2)`,
                  `0 25px 60px oklch(0.1 0.03 ${hue} / 0.15)`,
                ].join(", "),
              }}
            >
              {/* Gradient fallback */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, oklch(0.25 0.04 ${hue}), oklch(0.18 0.03 ${hue + 20}))`,
                }}
              />

              {!imgError ? (
                <Image
                  src={reason.image}
                  alt={reason.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-20 w-20 text-white/15" />
                </div>
              )}

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />

              {/* Hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.1), transparent 60%)`,
                }}
              />

              {/* Top highlight line */}
              <div
                className="absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.2), transparent)",
                }}
              />

              {/* Stat badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`absolute bottom-4 ${isReversed ? "left-4" : "right-4"} z-10`}
              >
                <div
                  className="px-4 py-2.5 rounded-xl backdrop-blur-xl flex items-center gap-3"
                  style={{
                    background: "oklch(0.08 0.02 180 / 0.7)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    boxShadow:
                      "0 8px 32px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.06)",
                  }}
                >
                  <span
                    className="text-lg sm:text-xl font-extrabold"
                    style={{
                      color: `oklch(0.75 0.12 ${hue})`,
                    }}
                  >
                    {reason.stat.value}
                  </span>
                  <span className="text-[11px] font-medium text-white/60 leading-tight">
                    {reason.stat.label}
                  </span>
                </div>
              </motion.div>

              {/* Index number (mobile) */}
              <div className="absolute top-4 left-4 z-10 lg:hidden">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-xs backdrop-blur-md"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.5 0.12 ${hue} / 0.85), oklch(0.4 0.1 ${hue} / 0.7))`,
                    border: "1px solid oklch(1 0 0 / 0.15)",
                  }}
                >
                  0{index + 1}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Text side ── */}
        <motion.div
          className={`${isReversed ? "lg:order-1" : "lg:order-2"}`}
          initial={{ opacity: 0, x: isReversed ? -60 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className={`max-w-xl ${isReversed ? "lg:ml-auto lg:text-right" : ""}`}>
            {/* Icon + subtitle badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.4 }}
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-5 ${isReversed ? "lg:flex-row-reverse" : ""}`}
              style={{
                background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.1), oklch(0.55 0.12 ${hue} / 0.03))`,
                border: `1px solid oklch(0.55 0.12 ${hue} / 0.12)`,
              }}
            >
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, oklch(0.5 0.12 ${hue}), oklch(0.42 0.1 ${hue + 10}))`,
                  boxShadow: `0 2px 8px oklch(0.5 0.12 ${hue} / 0.3)`,
                }}
              >
                <Icon className="h-3 w-3 text-white" />
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: `oklch(0.55 0.12 ${hue})` }}
              >
                {reason.subtitle}
              </span>
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold tracking-tight mb-5 leading-[1.15]">
              {reason.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-7">
              {reason.description}
            </p>

            {/* Bullet points in a card */}
            <div
              className={`rounded-xl p-5 sm:p-6 ${isReversed ? "lg:text-left" : ""}`}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: [
                  "0 1px 3px oklch(0.2 0 0 / var(--shadow-a, 0.06))",
                  "0 4px 16px oklch(0.2 0 0 / calc(var(--shadow-a, 0.06) * 0.6))",
                  "inset 0 1px 0 oklch(1 0 0 / var(--highlight-edge-a, 0.04))",
                ].join(", "),
              }}
            >
              <ul className="space-y-3.5">
                {reason.bullets.map((bullet, bi) => (
                  <motion.li
                    key={bi}
                    initial={{ opacity: 0, x: isReversed ? -15 : 15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.45 + bi * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="h-5 w-5 mt-0.5 shrink-0"
                      style={{
                        color: `oklch(0.55 0.12 ${hue})`,
                      }}
                    />
                    <span className="text-sm sm:text-[15px] text-foreground/80 leading-relaxed">
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Accent bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className={`mt-7 h-1 rounded-full ${isReversed ? "lg:ml-auto" : ""}`}
              style={{
                background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue}), oklch(0.65 0.1 ${hue + 20} / 0.3))`,
                boxShadow: `0 0 12px oklch(0.55 0.12 ${hue} / 0.2)`,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
