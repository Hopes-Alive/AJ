"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Package, LayoutGrid, BadgeDollarSign, Truck } from "lucide-react";

const stats = [
  { value: 130, suffix: "+", label: "Wholesale Products", icon: Package },
  { value: 12, suffix: "", label: "Product Categories", icon: LayoutGrid },
  { value: 100, suffix: "%", label: "Transparent Pricing", icon: BadgeDollarSign },
  { value: 5, suffix: "+", label: "Cities Covered", icon: Truck },
];

function AnimatedNumber({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = duration / (target / step);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Brand teal gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.1 178) 0%, oklch(0.38 0.11 182) 50%, oklch(0.44 0.1 175) 100%)",
        }}
      />

      {/* Lighter accent glows */}
      <div
        className="absolute top-0 left-[10%] w-[35%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.55 0.13 176 / 0.2), transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 right-[10%] w-[30%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, oklch(0.5 0.12 190 / 0.15), transparent 70%)",
        }}
      />

      {/* Top edge highlight */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.7 0.1 176 / 0.35), oklch(0.65 0.08 195 / 0.3), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const hue = 176 + i * 8;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative text-center group"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: "oklch(1 0 0 / 0.12)",
                      border: "1px solid oklch(1 0 0 / 0.15)",
                      boxShadow: "0 0 20px oklch(1 0 0 / 0.05)",
                    }}
                  >
                    <Icon
                      className="h-5 w-5 text-white/90"
                    />
                  </div>
                </div>

                {/* Animated number */}
                <p className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-white"
                  style={{ textShadow: "0 2px 16px oklch(0 0 0 / 0.15)" }}
                >
                  <AnimatedNumber
                    target={stat.value}
                    suffix={stat.suffix}
                    inView={isInView}
                  />
                </p>

                {/* Label */}
                <p className="mt-2 text-sm text-white/65 font-medium tracking-wide">
                  {stat.label}
                </p>

                {/* Accent underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 32 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="mx-auto mt-4 h-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, oklch(1 0 0 / 0.6), oklch(1 0 0 / 0.1))",
                    boxShadow: "0 0 8px oklch(1 0 0 / 0.15)",
                  }}
                />

                {/* Vertical divider (not on last item) */}
                {i < stats.length - 1 && (
                  <div
                    className="hidden lg:block absolute right-0 top-[15%] h-[70%] w-px"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, oklch(1 0 0 / 0.15), transparent)",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom edge highlight */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.6 0.12 176 / 0.2), transparent)",
        }}
      />
    </section>
  );
}
