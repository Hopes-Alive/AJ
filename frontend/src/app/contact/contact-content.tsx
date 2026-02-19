"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

const contactDetails = [
  {
    icon: MapPin,
    title: "Location",
    lines: ["Australia"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["0450 767 508"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["ali@ajfreshfoods.com.au"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: [
      "Mon - Fri: 7am - 5pm",
      "Saturday: 8am - 12pm",
      "Sunday: Closed",
    ],
  },
];

export function ContactContent() {
  return (
    <>
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Contact Us"
            title="Let's Talk"
            titleGradient="Wholesale"
            description="Whether you're an existing partner or looking to stock your store with quality products, we'd love to hear from you."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactDetails.map((detail, i) => {
              const Icon = detail.icon;
              return (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:glow-sm"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary mb-5 transition-all duration-300 group-hover:scale-110 group-hover:glow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold mb-3">{detail.title}</h3>
                    {detail.lines.map((line) => (
                      <p
                        key={line}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-600 to-cyan-700 px-8 py-16 text-center sm:px-16 glow-lg"
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
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Partner With Us?
              </h2>
              <p className="mt-4 text-white/80 max-w-lg mx-auto text-lg">
                Get in touch to set up your wholesale account and start
                ordering. We&apos;ll get back to you within 24 hours.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 h-12 px-8 text-base font-semibold"
                  asChild
                >
                  <a href="mailto:ali@ajfreshfoods.com.au">
                    Email Us <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base"
                  asChild
                >
                  <a href="tel:0450767508">Call 0450 767 508</a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
