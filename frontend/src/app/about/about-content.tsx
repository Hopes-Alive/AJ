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
  ArrowRight,
} from "lucide-react";
import { milestones } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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
    name: "Hussien Jafari",
    role: "Co-Founder & Sales Director",
    bio: "Hussien is the driving force behind AJ Fresh Foods' client relationships and sales operations. He works closely with retailers across Australia, ensuring they get the right products at the right prices. His hands-on approach to selling and supplying has built lasting partnerships with stores nationwide.",
    location: "Cranbourne, Victoria",
    initials: "HJ",
    image: "/images/founder-hussien.png",
  },
  {
    name: "Ali Akbari",
    role: "Co-Founder & Procurement Director",
    bio: "Ali leads the importing and procurement side of AJ Fresh Foods. With a keen eye for quality and strong relationships with international suppliers, he ensures the best products make it to Australian shelves. His expertise in sourcing and stock management keeps the catalogue diverse and competitively priced.",
    location: "Cranbourne, Victoria",
    initials: "AA",
    image: "/images/founder-ali.png",
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
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl group">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/images/founder-warehouse.png"
                    alt="Founder at AJ Fresh Foods warehouse with product stock"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                  {/* Decorative frame glow */}
                  <div
                    className="absolute -inset-px rounded-2xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.55 0.12 176 / 0.2), transparent 40%, oklch(0.55 0.12 176 / 0.1))",
                    }}
                  />
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 z-10 bg-primary text-primary-foreground rounded-2xl p-5 shadow-xl glow-sm"
              >
                <p className="text-2xl sm:text-3xl font-bold">2023</p>
                <p className="text-xs opacity-80">Est. Year</p>
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
                  Founded in 2023, AJ Fresh Foods was born from a simple idea — Australian
                  retailers deserve a wholesale partner that prioritises quality,
                  transparency, and competitive pricing. What started as a small
                  operation has quickly grown into a trusted distribution network
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
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--background) 0%, oklch(0.16 0.04 182) 30%, oklch(0.13 0.035 188) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.7 0.1 176) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{ background: "oklch(0.4 0.12 178)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "oklch(0.65 0.12 176)" }}>
              Leadership
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Meet the{" "}
              <span style={{ background: "linear-gradient(135deg, oklch(0.75 0.15 170), oklch(0.58 0.13 195))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Founders
              </span>
            </h2>
            <p className="mt-5 text-white/40 max-w-lg mx-auto text-sm sm:text-base">
              Two partners, one mission — bringing the world&apos;s best grocery products to Australian retailers.
            </p>
          </motion.div>

          {/* Founders — large full-width rows */}
          <div className="space-y-8 sm:space-y-10">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, oklch(0.2 0.025 185 / 0.8), oklch(0.17 0.02 192 / 0.8))",
                  border: "1px solid oklch(1 0 0 / 0.06)",
                  boxShadow: "0 8px 40px oklch(0 0 0 / 0.25)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-stretch`}>
                  {/* Photo side — big */}
                  <div className="relative flex-shrink-0 md:w-[45%] lg:w-[40%] flex items-end justify-center overflow-hidden">
                    {/* Ambient glow */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 sm:w-80 sm:h-80 rounded-full blur-[80px] opacity-30"
                      style={{ background: `oklch(0.45 0.12 ${i === 0 ? 176 : 195})` }}
                    />
                    {/* Subtle light streak */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: `linear-gradient(${i === 0 ? 135 : 225}deg, oklch(0.6 0.12 176 / 0.3), transparent 50%)`,
                      }}
                    />
                    <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] aspect-[3/4] transition-transform duration-600 group-hover:scale-[1.03]">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 768px) 80vw, 360px"
                        style={{ filter: "drop-shadow(0 16px 40px oklch(0 0 0 / 0.5))" }}
                      />
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-14">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="h-2 w-8 rounded-full"
                        style={{ background: "linear-gradient(90deg, oklch(0.6 0.13 176), oklch(0.5 0.1 195))" }}
                      />
                      <span
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: "oklch(0.6 0.12 176)" }}
                      >
                        Co-Founder
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                      {founder.name}
                    </h3>

                    <p
                      className="text-sm sm:text-base font-semibold mt-2"
                      style={{ color: "oklch(0.6 0.12 176)" }}
                    >
                      {founder.role}
                    </p>

                    <p className="text-sm sm:text-[15px] lg:text-base text-white/50 leading-relaxed mt-5 sm:mt-6 max-w-lg">
                      {founder.bio}
                    </p>

                    <div className="flex items-center gap-2 mt-6 sm:mt-8">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.08)" }}
                      >
                        <MapPin className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <span className="text-xs sm:text-sm text-white/35">{founder.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-14 sm:mt-20 text-center"
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, oklch(0.45 0.12 176), oklch(0.38 0.1 192))",
                boxShadow: "0 4px 20px oklch(0.45 0.12 176 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.1)",
              }}
            >
              Interested in joining our team?
              <ArrowRight className="h-4 w-4" />
            </a>
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
