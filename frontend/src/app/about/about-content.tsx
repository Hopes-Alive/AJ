"use client";

import { motion, useInView } from "framer-motion";
import {
  Target,
  Handshake,
  Award,
  TrendingUp,
  Globe,
  ShieldCheck,
  Package,
  Users,
  Truck,
  MapPin,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";
import { milestones } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every product we distribute meets strict quality standards. We only carry brands and products we trust.",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Target,
    title: "Competitive Pricing",
    description:
      "Transparent wholesale pricing with GST clarity. We help retailers maximise their margins.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We grow when you grow. Our success is measured by the success of the stores we serve.",
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    description:
      "We source products from trusted manufacturers worldwide, bringing the best international brands to Australian shelves.",
    color: "from-sky-500/20 to-sky-600/5",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "Consistent supply and timely delivery. Our partners count on us, and we deliver — every time.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "Growth Focused",
    description:
      "We continuously expand our product range and reach, adapting to market trends and retailer needs.",
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const stats = [
  { value: "130+", label: "Products", icon: Package },
  { value: "12", label: "Categories", icon: TrendingUp },
  { value: "100+", label: "Retail Partners", icon: Users },
  { value: "Australia", label: "Wide Delivery", icon: Truck },
];

const founders = [
  {
    name: "Hussain Ali",
    role: "Co-Founder & Managing Director",
    bio: "Hussain brings a sharp business acumen and deep understanding of the Australian retail landscape to AJ Fresh Foods. His vision of making quality international grocery products accessible to every retailer drives the company's growth and strategic direction.",
    location: "Cranbourne, Victoria",
    initials: "HA",
  },
  {
    name: "Ali",
    role: "Co-Founder & Operations Director",
    bio: "With expertise in supply chain management and logistics, Ali ensures every product reaches retailers efficiently and on time. His commitment to operational excellence is the backbone of AJ Fresh Foods' reliable distribution network across Australia.",
    location: "Cranbourne, Victoria",
    initials: "A",
  },
];

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? value : "0"}
    </span>
  );
}

export function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          >
            <Image
              src="/images/hero/about-hero.jpg"
              alt="AJ Fresh Foods warehouse"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/55" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.1 0.04 180 / 0.4) 0%, transparent 35%, oklch(0.08 0.03 180 / 0.5) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background:
                "radial-gradient(ellipse at 25% 75%, oklch(0.55 0.15 176 / 0.5), transparent 50%)",
            }}
          />
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 z-[2] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-40 pb-32 sm:pb-40 lg:pb-48">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-6 sm:mb-8"
              style={{
                background: "oklch(1 0 0 / 0.07)",
                border: "1px solid oklch(1 0 0 / 0.1)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "oklch(0.7 0.15 165)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "oklch(0.7 0.15 165)" }} />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                About AJ Fresh Foods
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
              style={{ textShadow: "0 2px 30px oklch(0 0 0 / 0.3)" }}
            >
              We Build Trust,{" "}
              <br className="hidden sm:block" />
              <span
                className="inline-block mt-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.65 0.13 192))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 2px 10px oklch(0.55 0.12 176 / 0.3))",
                }}
              >
                One Delivery at a Time
              </span>
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 64, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
              className="mt-5 sm:mt-6 h-[3px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.6 0.12 176), oklch(0.55 0.1 195))",
                boxShadow: "0 0 16px oklch(0.55 0.12 176 / 0.4)",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/50 leading-relaxed max-w-lg"
            >
              Australia&#39;s trusted wholesale grocery partner — curating quality
              products from around the world for retailers who expect the best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Link
                href="/contact"
                className="group/btn relative inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3 text-[13px] sm:text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 190))",
                  boxShadow: [
                    "0 2px 8px oklch(0.5 0.12 176 / 0.3)",
                    "0 12px 36px oklch(0.5 0.12 176 / 0.15)",
                    "inset 0 1px 0 oklch(1 0 0 / 0.12)",
                  ].join(", "),
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get in Touch
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3 text-[13px] sm:text-sm font-medium text-white/65 border border-white/12 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:text-white hover:bg-white/5 active:scale-[0.98]"
              >
                View Catalogue
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "oklch(1 0 0 / 0.08)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "oklch(0.7 0.12 176)" }} />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-white leading-none">
                        <AnimatedCounter value={stat.value} />
                      </p>
                      <p className="text-[10px] sm:text-xs text-white/35 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative py-14 sm:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                    <Image
                      src="/images/categories/beverages.jpg"
                      alt="Beverages range"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                    <Image
                      src="/images/categories/shan-masala.jpg"
                      alt="Spices collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                    <Image
                      src="/images/categories/rice.jpg"
                      alt="Rice range"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                    <Image
                      src="/images/categories/noodles.jpg"
                      alt="Noodles range"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 z-10 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl glow-sm"
              >
                <p className="text-2xl sm:text-3xl font-bold">12+</p>
                <p className="text-xs opacity-80">Years of Trust</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Our Story
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Built on Trust,{" "}
                <span className="text-gradient">Driven by Quality</span>
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  AJ Fresh Foods was born from a simple idea — Australian
                  retailers deserve a wholesale partner that prioritises quality,
                  transparency, and competitive pricing. What started as a small
                  operation has grown into a trusted distribution network
                  spanning the nation.
                </p>
                <p>
                  We specialise in bringing the world's best grocery products
                  to Australian shelves. From our own AJ branded fruit juices
                  and coconut water to trusted international names like Shan,
                  Indomie, Nescafe, and OKF — our catalogue of 130+ products
                  across 12 categories is designed to serve diverse communities.
                </p>
                <p>
                  Today, we continue to expand our range and reach, always
                  staying true to our founding principles: quality products,
                  fair prices, and reliable partnerships.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Beverages",
                  "Spices",
                  "Rice",
                  "Noodles",
                  "Dried Fruits",
                  "Household",
                ].map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-full bg-primary/8 dark:bg-primary/15 border border-primary/15 dark:border-primary/25 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {cat}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  +6 more
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders / Leadership */}
      <section className="relative py-14 sm:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              The people behind AJ Fresh Foods — building a distribution network
              that Australian retailers can rely on.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((founder, i) => (
              <FounderCard key={founder.name} founder={founder} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Interested in joining our team?{" "}
              <a
                href="/contact"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Get in touch
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What Drives Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every product
              we deliver.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${value.color} mb-5 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-6 w-6 ${value.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              The <span className="text-gradient">Journey</span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent sm:left-1/2" />

            <div className="space-y-16">
              {milestones.map((milestone, i) => (
                <MilestoneItem key={milestone.year} milestone={milestone} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.1 178), oklch(0.38 0.11 182), oklch(0.35 0.1 188))",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to Partner with Us?
            </h2>
            <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto">
              Join the growing network of retailers who trust AJ Fresh Foods
              for their wholesale grocery needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white text-primary font-semibold px-8 shadow-lg hover:bg-white/90 transition-all duration-300 hover:shadow-xl"
              >
                Get in Touch
              </a>
              <a
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 text-white font-semibold px-8 hover:bg-white/10 transition-all duration-300"
              >
                View Catalogue
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FounderCard({
  founder,
  index,
}: {
  founder: (typeof founders)[number];
  index: number;
}) {
  const [imgError, setImgError] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="group relative"
    >
      <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
        {/* Large photo area */}
        <div className="relative h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-primary/8 via-primary/3 to-muted/30 dark:from-primary/15 dark:via-primary/8 dark:to-muted/20">
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/25 to-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40 group-hover:glow-sm">
                  <span className="text-4xl font-bold text-primary">
                    {founder.initials}
                  </span>
                </div>
                <div className="absolute -bottom-1 right-0 h-7 w-7 rounded-full bg-emerald-500 border-3 border-card flex items-center justify-center shadow-md">
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/60 uppercase tracking-widest">
                Photo Coming Soon
              </p>
            </div>
          ) : (
            <>
              <Image
                src={`/images/team/${founder.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.jpg`}
                alt={founder.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-emerald-500 border-3 border-white/30 flex items-center justify-center shadow-md">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            </>
          )}
        </div>

        {/* Info area */}
        <div className="relative px-4 sm:px-7 py-5 sm:py-6">
          <div className="absolute -top-5 left-4 sm:left-7 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 shadow-lg glow-xs">
            <span className="text-xs font-semibold text-primary-foreground">
              {founder.role.split("&")[0].trim()}
            </span>
          </div>

          <div className="pt-3">
            <h3 className="text-xl sm:text-2xl font-bold">{founder.name}</h3>
            <p className="text-sm text-primary font-medium mt-0.5">
              {founder.role}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {founder.location}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {founder.bio}
          </p>

          <div className="mt-5 pt-5 border-t border-border/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-muted/80 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
              <Linkedin className="h-4 w-4" />
            </div>
            <div className="h-9 w-9 rounded-xl bg-muted/80 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
              <Mail className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 ${
        isEven ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary to-teal-500 border-4 border-background shadow-md shadow-primary/20" />
        <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
      </div>

      <div
        className={`ml-16 sm:ml-0 sm:w-1/2 ${
          isEven ? "sm:pr-14 sm:text-right" : "sm:pl-14"
        }`}
      >
        <div
          className={`inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-1.5 ${
            isEven ? "sm:ml-auto" : ""
          }`}
        >
          <span className="text-sm font-bold text-primary">
            {milestone.year}
          </span>
        </div>
        <h3 className="font-bold text-base sm:text-lg mt-3">{milestone.title}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}
