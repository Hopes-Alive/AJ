"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-24 relative">
      {/* Top gradient divider for dark mode separation */}
      <div
        className="absolute top-0 inset-x-0 h-px hidden dark:block"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.15), transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-600 to-cyan-700 px-8 py-16 text-center sm:px-16 sm:py-20 glow-lg"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <motion.div
            className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-[80px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-[60px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Stock Your Store?
            </h2>
            <p className="mt-5 text-white/80 max-w-lg mx-auto text-lg">
              Get wholesale pricing on 130+ products. Contact us to set up your
              account and start ordering.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 h-12 px-8 text-base font-semibold"
                asChild
              >
                <Link href="/contact">
                  Contact Us Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base"
                asChild
              >
                <Link href="/products">View Full Catalogue</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
