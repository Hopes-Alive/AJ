"use client";

import { motion } from "framer-motion";
import {
  Warehouse,
  Truck,
  ClipboardList,
  Store,
  MapPin,
  ArrowRight,
  Package,
  Clock,
  ShieldCheck,
  HeadphonesIcon,
  CheckCircle2,
  Zap,
  BarChart3,
  Heart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Warehouse,
    title: "Warehouse & Storage",
    description:
      "Proper warehousing facilities ensuring product freshness and quality from receipt to dispatch. Every product is stored under optimal conditions.",
    features: [
      "Temperature-controlled storage",
      "Quality inspection on arrival",
      "Organised inventory management",
      "FIFO stock rotation",
    ],
    image: "/images/hero/categories.jpg",
    stat: "24/7",
    statLabel: "Monitored",
    hue: 200,
  },
  {
    icon: Truck,
    title: "Route Delivery",
    description:
      "Delivery routes across Australia, with reliable on-time performance to keep your shelves stocked. Scheduled runs you can depend on.",
    features: [
      "Scheduled weekly deliveries",
      "Australia-wide coverage",
      "Dedicated delivery support",
      "Flexible drop-off times",
    ],
    image: "/images/categories/household.jpg",
    stat: "98%",
    statLabel: "On-time Rate",
    hue: 176,
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    description:
      "Streamlined ordering with dedicated support, flexible carton sizes, and competitive wholesale pricing. Simple processes for busy retailers.",
    features: [
      "Phone & email ordering",
      "Flexible carton quantities",
      "Transparent GST pricing",
      "Dedicated account manager",
    ],
    image: "/images/categories/rice.jpg",
    stat: "130+",
    statLabel: "Products Available",
    hue: 270,
  },
  {
    icon: Store,
    title: "Retail Support",
    description:
      "In-store merchandising assistance to help optimise product placement and promotional displays. We help your store succeed.",
    features: [
      "Shelf placement guidance",
      "Promotional display setup",
      "Product range consultation",
      "Seasonal planning support",
    ],
    image: "/images/categories/beverages.jpg",
    stat: "100+",
    statLabel: "Retail Partners",
    hue: 40,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Get in Touch",
    description:
      "Contact us to set up your wholesale account. We'll discuss your store's needs and product range.",
    icon: HeadphonesIcon,
  },
  {
    step: "02",
    title: "Place Your Order",
    description:
      "Order by phone or email. Choose from 130+ products across 12 categories at wholesale carton prices.",
    icon: ClipboardList,
  },
  {
    step: "03",
    title: "We Pick & Pack",
    description:
      "Our warehouse team picks your order with care, ensuring correct quantities and product quality.",
    icon: Package,
  },
  {
    step: "04",
    title: "Delivered to You",
    description:
      "Your order is delivered reliably. Products arrive ready to stock on your shelves.",
    icon: Truck,
  },
];

const deliveryAreas = [
  { name: "Melbourne", status: "primary" },
  { name: "Sydney", status: "primary" },
  { name: "Brisbane", status: "primary" },
  { name: "Perth", status: "secondary" },
  { name: "Adelaide", status: "secondary" },
  { name: "Gold Coast", status: "primary" },
  { name: "Canberra", status: "secondary" },
  { name: "Regional Areas", status: "secondary" },
];

const whyChooseUs = [
  {
    icon: Package,
    title: "130+ Products",
    description: "Comprehensive catalogue spanning 12 categories",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Every product meets strict quality standards",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "Reliable scheduled deliveries you can count on",
  },
  {
    icon: BarChart3,
    title: "Competitive Pricing",
    description: "Transparent wholesale prices with GST clarity",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Efficient order handling and quick turnaround",
  },
  {
    icon: Heart,
    title: "Dedicated Support",
    description: "Personal account management and retail guidance",
  },
];

export function ServicesContent() {
  return (
    <>
      {/* ─── Page Header ─── */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div
          className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 dark:opacity-20"
          style={{ background: "oklch(0.55 0.12 176)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 dark:bg-primary/10 px-4 py-1.5 mb-5 sm:mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
                Our Services
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]"
            >
              End-to-End{" "}
              <span className="text-gradient">Wholesale</span>
              <br />
              Distribution
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              From warehouse to shelf, we handle the entire supply chain so you
              can focus on what matters — running your store.
            </motion.p>
          </div>

          {/* Service icon strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-3.5 transition-all duration-300 hover:border-primary/25 hover:shadow-md hover:shadow-primary/5"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.55 0.12 ${s.hue} / 0.12), oklch(0.55 0.12 ${s.hue} / 0.05))`,
                      border: `1px solid oklch(0.55 0.12 ${s.hue} / 0.12)`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: `oklch(0.5 0.1 ${s.hue})` }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">
                      {s.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {s.stat} {s.statLabel}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Services — Alternating Cards ─── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 sm:mb-20"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              What We Offer
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Our Core <span className="text-gradient">Services</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Comprehensive distribution solutions designed for Australian
              retailers.
            </p>
          </motion.div>

          <div className="space-y-12 sm:space-y-16 lg:space-y-20">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 sm:mb-20"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              The Process
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Four easy steps to quality wholesale
              products on your shelves.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-7 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Step number */}
                  <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="inline-flex text-[10px] font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-1 mb-3">
                    Step {step.step}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground/40">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                The AJ Advantage
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Why <span className="text-gradient">Choose Us</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                We&apos;re more than a supplier — we&apos;re your growth partner.
                Here&apos;s what sets AJ Fresh Foods apart from the rest.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-card flex items-center justify-center"
                    >
                      <Star className="h-3.5 w-3.5 text-primary" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold">Trusted by 100+ retailers</p>
                  <p className="text-xs text-muted-foreground">
                    Across Australia
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyChooseUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Delivery Areas ─── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Coverage
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Delivery <span className="text-gradient">Areas</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                We deliver to retailers and supermarkets across Australia. Our
                primary routes cover major metro areas with expanding regional
                coverage.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliveryAreas.map((area, i) => (
                  <motion.div
                    key={area.name}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        area.status === "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/60 text-muted-foreground"
                      } group-hover:bg-primary/15`}
                    >
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{area.name}</span>
                      <p className="text-[10px] text-muted-foreground">
                        {area.status === "primary"
                          ? "Active route"
                          : "Expanding"}
                      </p>
                    </div>
                    {area.status === "primary" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Primary routes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  Expanding coverage
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border/50 bg-muted/20 dark:bg-muted/40">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/20 dark:from-primary/10 dark:to-muted/10" />

                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full max-w-[380px]">
                    <svg viewBox="0 0 400 340" className="w-full h-auto">
                      <defs>
                        <linearGradient id="svcAusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="oklch(0.55 0.12 176)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="oklch(0.45 0.1 192)" stopOpacity="0.25" />
                        </linearGradient>
                        <linearGradient id="svcAusStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="oklch(0.55 0.12 176)" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="oklch(0.45 0.1 192)" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M130,30 L155,25 L180,30 L195,20 L220,28 L240,35 L265,25 L290,30 L310,22 L330,30 L350,45 L360,65 L365,90 L355,115 L360,140 L370,165 L365,190 L355,210 L340,225 L320,240 L300,250 L280,260 L265,275 L250,285 L235,280 L220,270 L200,275 L185,285 L170,280 L155,270 L140,280 L120,275 L100,265 L85,250 L75,235 L65,215 L60,195 L55,175 L50,155 L55,135 L65,115 L75,100 L85,85 L95,70 L105,55 L115,40 Z"
                        fill="url(#svcAusGrad)"
                        stroke="url(#svcAusStroke)"
                        strokeWidth="1.5"
                      />
                    </svg>

                    {[
                      { name: "Melbourne", abbr: "MEL", x: "72%", y: "78%", hq: true },
                      { name: "Sydney", abbr: "SYD", x: "82%", y: "62%", hq: false },
                      { name: "Brisbane", abbr: "BNE", x: "85%", y: "38%", hq: false },
                      { name: "Perth", abbr: "PER", x: "15%", y: "62%", hq: false },
                      { name: "Adelaide", abbr: "ADL", x: "58%", y: "68%", hq: false },
                      { name: "Gold Coast", abbr: "GC", x: "88%", y: "43%", hq: false },
                    ].map((city, ci) => (
                      <motion.div
                        key={city.abbr}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + ci * 0.1, type: "spring", stiffness: 200 }}
                        className="absolute"
                        style={{ left: city.x, top: city.y, transform: "translate(-50%, -50%)" }}
                      >
                        {city.hq ? (
                          <div className="relative">
                            <div className="absolute -inset-3 rounded-full animate-ping opacity-20" style={{ background: "oklch(0.55 0.12 176)" }} />
                            <div className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 shadow-lg" style={{ boxShadow: "0 4px 16px oklch(0.55 0.12 176 / 0.35)" }}>
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="text-[11px] font-bold">{city.abbr}</span>
                            </div>
                            <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary whitespace-nowrap">HQ</p>
                          </div>
                        ) : (
                          <div className="group/pin cursor-default relative">
                            <div className="h-3 w-3 rounded-full bg-primary/60 border-2 border-card shadow-md transition-transform duration-200 group-hover/pin:scale-125" />
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                              <div className="flex items-center gap-1 rounded-full bg-card border border-border/50 px-2.5 py-1 shadow-md whitespace-nowrap">
                                <span className="text-[10px] font-bold">{city.name}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {[
                        { x2: 82, y2: 62 },
                        { x2: 85, y2: 38 },
                        { x2: 15, y2: 62 },
                        { x2: 58, y2: 68 },
                        { x2: 88, y2: 43 },
                      ].map((line, li) => (
                        <motion.line
                          key={li}
                          x1={72} y1={78}
                          x2={line.x2} y2={line.y2}
                          stroke="oklch(0.55 0.12 176 / 0.15)"
                          strokeWidth="0.3"
                          strokeDasharray="2 2"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + li * 0.15, duration: 0.8 }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      HQ (Melbourne)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary/60 border border-card" />
                      Delivery Points
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-16 sm:py-24 lg:py-28 overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Ready to Streamline Your Supply?
            </h2>
            <p className="mt-4 text-white/60 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
              Let us handle the logistics while you focus on growing your
              retail business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white text-primary font-semibold px-8 shadow-lg hover:bg-white/90 transition-all duration-300 hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 text-white font-semibold px-8 hover:bg-white/10 transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ─── Service Card — Alternating Image/Content Layout ─── */

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = service.icon;
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div
        className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 ${
            isReversed ? "lg:direction-rtl" : ""
          }`}
        >
          {/* Image side */}
          <div
            className={`relative h-56 sm:h-72 lg:h-auto lg:min-h-[380px] overflow-hidden ${
              isReversed ? "lg:order-2" : ""
            }`}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />
            {isReversed && (
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/5 hidden lg:block" />
            )}
            {!isReversed && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/5 hidden lg:block" />
            )}

            {/* Floating stat glass card */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <div
                className="flex items-center gap-3 rounded-xl sm:rounded-2xl backdrop-blur-xl px-4 py-2.5 sm:px-5 sm:py-3"
                style={{
                  background: "oklch(1 0 0 / 0.08)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  boxShadow: "0 8px 32px oklch(0 0 0 / 0.2)",
                }}
              >
                <div
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.55 0.12 ${service.hue}), oklch(0.45 0.1 ${service.hue + 15}))`,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {service.stat}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-white/55">
                    {service.statLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-center ${
              isReversed ? "lg:order-1" : ""
            }`}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full w-fit px-3 py-1 mb-4"
              style={{
                background: `oklch(0.55 0.12 ${service.hue} / 0.08)`,
                border: `1px solid oklch(0.55 0.12 ${service.hue} / 0.12)`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: `oklch(0.55 0.12 ${service.hue})` }}
              />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Service {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-3">
              {service.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              {service.description}
            </p>

            <div className="space-y-3">
              {service.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 group/feat"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover/feat:bg-primary group-hover/feat:text-primary-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover/feat:text-foreground transition-colors duration-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 group/link"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
