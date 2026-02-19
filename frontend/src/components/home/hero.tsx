"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.7,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
});

export function Hero() {
  const [imgErr, setImgErr] = useState(false);

  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[380px] sm:min-h-[540px] max-h-[800px] flex items-center justify-center">
      {/* ─── Background image with slow zoom ─── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.06] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        {!imgErr ? (
          <Image
            src="/images/hero/hero-wide.jpg"
            alt="Fresh grocery products"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.04 176), oklch(0.12 0.03 195))",
            }}
          />
        )}
      </motion.div>

      {/* Overlay stack */}
      <div className="absolute inset-0 z-[1] bg-black/50" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 0%, oklch(0 0 0 / 0.4) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.05 178 / 0.25) 0%, transparent 35%, oklch(0.1 0.04 178 / 0.3) 100%)",
        }}
      />

      {/* Bottom blend into page */}
      <div className="absolute bottom-0 inset-x-0 h-40 z-[2] bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* ─── Content ─── */}
      <div className="relative z-[3] mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Logo mark */}
        <motion.div {...fadeUp(0.05)} className="mb-6 inline-block">
          <Image
            src="/images/logo.png"
            alt="AJ Fresh Foods"
            width={110}
            height={110}
            className="w-20 h-20 sm:w-[110px] sm:h-[110px] brightness-0 invert opacity-90 drop-shadow-[0_2px_16px_oklch(0_0_0/0.4)]"
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          {...fadeUp(0.15)}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[13px] font-medium text-white/75 backdrop-blur-md"
            style={{
              background: "oklch(1 0 0 / 0.07)",
              border: "1px solid oklch(1 0 0 / 0.1)",
              boxShadow: "0 4px 20px oklch(0 0 0 / 0.15)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Wholesale Grocery Distribution
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.25)}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.1]"
          style={{ textShadow: "0 2px 30px oklch(0 0 0 / 0.3)" }}
        >
          Quality Products,
          <br />
          <span
            className="inline-block mt-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.68 0.13 192))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px oklch(0.55 0.12 176 / 0.3))",
            }}
          >
            Fresh Delivered
          </span>
        </motion.h1>

        {/* Accent line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 72, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8, ease: "easeOut" }}
          className="mx-auto mt-6 h-[3px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.6 0.12 176), oklch(0.55 0.1 195))",
            boxShadow: "0 0 16px oklch(0.55 0.12 176 / 0.4)",
          }}
        />

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.42)}
          className="mt-6 text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed"
        >
          Your reliable wholesale partner with competitive pricing
          and dependable delivery for retailers across Australia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.55)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group/btn relative inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 190))",
              boxShadow: [
                "0 2px 8px oklch(0.5 0.12 176 / 0.3)",
                "0 12px 36px oklch(0.5 0.12 176 / 0.2)",
                "inset 0 1px 0 oklch(1 0 0 / 0.12)",
              ].join(", "),
            }}
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Browse Catalogue
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </Link>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-medium text-white/75 border border-white/15 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/5 active:scale-[0.98]"
          >
            <Phone className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
            Get in Touch
          </Link>
        </motion.div>
      </div>

      {/* ─── Scroll indicator ─── */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[3]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-7 w-[18px] rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="h-1.5 w-[3px] rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
