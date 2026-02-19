"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.12), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.1 178), oklch(0.38 0.11 182), oklch(0.35 0.1 188))",
          }}
        >
          {/* Ambient glows */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.14 170 / 0.15), transparent 60%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.3 0.08 195 / 0.2), transparent 60%)",
            }}
          />

          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 0.7) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, oklch(1 0 0 / 0.1) 50%, transparent 90%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ready to Stock Your Store?
            </h2>
            <p className="mt-5 text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Get wholesale pricing on 130+ products. Contact us to set up your
              account and start ordering.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-sm font-semibold rounded-xl bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-[1.03]"
                style={{
                  boxShadow:
                    "0 4px 20px oklch(0 0 0 / 0.15), 0 1px 4px oklch(0 0 0 / 0.1)",
                }}
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us Today
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-sm font-semibold rounded-xl text-white/90 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
                style={{
                  border: "1px solid oklch(1 0 0 / 0.25)",
                }}
                asChild
              >
                <Link href="/products">
                  View Catalogue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
