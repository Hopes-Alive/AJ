"use client";

import { motion } from "framer-motion";
import { Target, Handshake, Award } from "lucide-react";
import { milestones } from "@/data/products";
import { SectionHeader } from "@/components/ui/section-header";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every product we distribute meets strict quality standards. We only carry brands and products we trust.",
  },
  {
    icon: Target,
    title: "Competitive Pricing",
    description:
      "Transparent wholesale pricing with GST clarity. We help retailers maximise their margins.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We grow when you grow. Our success is measured by the success of the stores we serve.",
  },
];

export function AboutContent() {
  return (
    <>
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="About Us"
            title="Your Wholesale Partner,"
            titleGradient="AJ Fresh Foods"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed text-lg"
          >
            <p>
              AJ Fresh Foods is an Australian wholesale distribution company
              specialising in grocery products for retailers, supermarkets, and
              convenience stores. We bring together a curated range of quality
              products from around the world.
            </p>
            <p>
              Our catalogue spans 12 categories and 130+ products — from our own
              AJ branded fruit juices and coconut water, to trusted names like
              Shan, Indomie, Nescafe, and OKF. We focus on products that serve
              diverse communities and growing consumer demand.
            </p>
            <p>
              Based in Australia, we offer competitive carton pricing,
              transparent GST, and reliable delivery to help your business
              thrive.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-muted/40 dark:bg-muted/60" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What Drives Us
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our <span className="text-gradient">Values</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:glow-sm"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary mb-5 transition-all duration-300 group-hover:scale-110 group-hover:glow-xs">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Our Story
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our <span className="text-gradient">Journey</span>
            </h2>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent sm:left-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gradient-to-br from-primary to-teal-500 border-4 border-background shadow-md shadow-primary/20 animate-pulse-glow" />

                  <div
                    className={`ml-16 sm:ml-0 sm:w-1/2 ${
                      i % 2 === 0 ? "sm:pr-14 sm:text-right" : "sm:pl-14"
                    }`}
                  >
                    <span className="inline-block text-sm font-bold text-primary bg-primary/10 rounded-full px-3 py-1 glow-xs">
                      {milestone.year}
                    </span>
                    <h3 className="font-bold text-lg mt-3">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
