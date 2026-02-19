"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Convenience Store Owner",
    location: "Sydney, NSW",
    rating: 5,
    text: "AJ Fresh Foods has been our go-to supplier for over a year now. Their beverage range is incredible — the coconut water and basil seed drinks fly off our shelves. Reliable delivery every single time.",
  },
  {
    name: "Raj P.",
    role: "Supermarket Manager",
    location: "Melbourne, VIC",
    rating: 5,
    text: "The Shan Masala range and Indomie noodles are always in demand. AJ Fresh Foods offers the best wholesale pricing we've found, and their customer service is genuinely helpful.",
  },
  {
    name: "David L.",
    role: "Grocery Shop Owner",
    location: "Brisbane, QLD",
    rating: 5,
    text: "We switched to AJ Fresh Foods for our dried fruits and rice supply. The quality is consistently excellent and the pricing is very competitive. Our customers love the Soneri Basmati range.",
  },
  {
    name: "Fatima A.",
    role: "Mini-Mart Operator",
    location: "Perth, WA",
    rating: 5,
    text: "Excellent product variety across all categories. From charcoal to candies, they have everything we need in one place. The ordering process is simple and deliveries are always on time.",
  },
  {
    name: "James W.",
    role: "Independent Retailer",
    location: "Adelaide, SA",
    rating: 5,
    text: "Switching suppliers was the best decision we made. AJ Fresh Foods understands what Australian retailers need. Great variety, fair prices, and a team that genuinely cares.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [active]);

  const go = (dir: -1 | 1) => {
    setDirection(dir);
    setActive((p) => (p + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <section className="py-14 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.97 0.004 178), oklch(0.96 0.007 182), oklch(0.97 0.004 178))",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.1 0.015 178) 0%, oklch(0.13 0.022 182) 50%, oklch(0.1 0.015 178) 100%)",
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

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
            Customer Reviews
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            What Our Customers{" "}
            <span className="text-gradient">Say</span>
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="relative max-w-3xl mx-auto">
          {/* Large quote marks */}
          <div
            className="absolute -top-4 sm:-top-6 -left-1 sm:-left-8 text-[4rem] sm:text-[6rem] lg:text-[8rem] leading-none font-serif pointer-events-none select-none"
            style={{
              color: "oklch(0.55 0.12 176 / 0.08)",
            }}
          >
            &ldquo;
          </div>

          <div className="relative min-h-[260px] sm:min-h-[240px] flex items-center pl-6 sm:pl-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg sm:text-xl lg:text-2xl xl:text-[1.7rem] font-medium leading-relaxed tracking-tight">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 192))",
                      color: "white",
                      boxShadow: "0 4px 16px oklch(0.55 0.12 176 / 0.25)",
                    }}
                  >
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.role}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 ml-auto text-sm text-muted-foreground/60">
                    <MapPin className="h-3.5 w-3.5" />
                    {t.location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className="relative h-2.5 rounded-full transition-all duration-400 cursor-pointer"
                  style={{
                    width: i === active ? 28 : 10,
                    background:
                      i === active
                        ? "linear-gradient(90deg, oklch(0.5 0.12 176), oklch(0.45 0.1 192))"
                        : "oklch(0.5 0.05 176 / 0.2)",
                    boxShadow:
                      i === active
                        ? "0 0 10px oklch(0.55 0.12 176 / 0.3)"
                        : "none",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow:
                    "0 2px 8px oklch(0.2 0 0 / var(--shadow-a, 0.06))",
                }}
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => go(1)}
                className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 192))",
                  boxShadow: "0 4px 16px oklch(0.55 0.12 176 / 0.25)",
                }}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
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
