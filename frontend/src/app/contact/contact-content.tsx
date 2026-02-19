"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ChevronRight,
  Truck,
  Package,
  ShieldCheck,
  Building2,
  Globe,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    value: "0450 767 508",
    href: "tel:0450767508",
    description: "Mon–Fri 7am–5pm, Sat 8am–12pm",
    action: "Call now",
    hue: 155,
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "ali@ajfreshfoods.com.au",
    href: "mailto:ali@ajfreshfoods.com.au",
    description: "We reply within 24 hours",
    action: "Send email",
    hue: 176,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Cranbourne, Victoria",
    href: "https://maps.google.com/?q=Cranbourne+Victoria+Australia",
    description: "Australia",
    action: "Get directions",
    hue: 270,
  },
];

const hours = [
  { day: "Monday – Friday", time: "7:00 AM – 5:00 PM", active: true },
  { day: "Saturday", time: "8:00 AM – 12:00 PM", active: true },
  { day: "Sunday", time: "Closed", active: false },
];

const quickFacts = [
  { label: "Company", value: "AJ Fresh Foods" },
  { label: "Type", value: "Wholesale Grocery Distribution" },
  { label: "Coverage", value: "Australia-wide" },
  { label: "Catalogue", value: "130+ products · 12 categories" },
];

const faqs = [
  {
    q: "What is the minimum order?",
    a: "We sell by the carton. There's no minimum order quantity — even a single carton is fine to get started.",
  },
  {
    q: "How do I set up an account?",
    a: "Simply call or email us. We'll set up your wholesale account and you can start ordering right away.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We deliver across Australia — covering Melbourne, Sydney, Brisbane, Perth, Adelaide, Gold Coast, and regional areas.",
  },
  {
    q: "How does pricing work?",
    a: "All pricing is per carton with transparent GST. We offer competitive wholesale rates designed to help you maximise margins.",
  },
];

export function ContactContent() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.14 0.04 180) 0%, oklch(0.11 0.03 190) 40%, oklch(0.09 0.02 200) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-[120px] opacity-15"
            style={{ background: "oklch(0.5 0.12 176)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full blur-[100px] opacity-12"
            style={{ background: "oklch(0.45 0.1 270)" }}
          />
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 z-[2] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-28 sm:pb-36 lg:pb-44">
          {/* Top content */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-6 sm:mb-8"
              style={{
                background: "oklch(1 0 0 / 0.06)",
                border: "1px solid oklch(1 0 0 / 0.1)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.7 0.15 165)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "oklch(0.7 0.15 165)" }}
                />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                Get in Touch
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
              style={{ textShadow: "0 2px 30px oklch(0 0 0 / 0.3)" }}
            >
              Let&apos;s Talk{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.65 0.13 192))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 2px 10px oklch(0.55 0.12 176 / 0.3))",
                }}
              >
                Wholesale
              </span>
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 56, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
              className="mx-auto mt-5 h-[3px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.6 0.12 176), oklch(0.55 0.1 195))",
                boxShadow: "0 0 16px oklch(0.55 0.12 176 / 0.4)",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 text-sm sm:text-base lg:text-lg text-white/45 leading-relaxed max-w-lg mx-auto"
            >
              Whether you&apos;re an existing partner or looking to stock your
              store, reach out and we&apos;ll get back within 24 hours.
            </motion.p>
          </div>

          {/* Contact method cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target={method.icon === MapPin ? "_blank" : undefined}
                  rel={
                    method.icon === MapPin
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl p-5 sm:p-6 text-center transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: "oklch(1 0 0 / 0.04)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                  whileHover={{
                    boxShadow: `0 12px 40px oklch(0.55 0.12 ${method.hue} / 0.12)`,
                    borderColor: `oklch(0.55 0.12 ${method.hue} / 0.25)`,
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.5 0.12 ${method.hue}), oklch(0.4 0.1 ${method.hue + 15}))`,
                      boxShadow: `0 4px 20px oklch(0.5 0.12 ${method.hue} / 0.25)`,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-1">
                    {method.title}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white truncate">
                    {method.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/35 mt-1">
                    {method.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: `oklch(0.7 0.12 ${method.hue})` }}
                  >
                    {method.action}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Business Info ─── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 dark:bg-muted/40" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Left — Hours & Info */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                  Our Details
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  Business <span className="text-gradient">Information</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                  Everything you need to know about reaching us and how we
                  operate.
                </p>
              </div>

              {/* Business Hours card */}
              <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      Business Hours
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Australian Eastern Time
                    </p>
                  </div>
                </div>
                <div className="space-y-3.5">
                  {hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            h.active
                              ? "bg-emerald-500"
                              : "bg-muted-foreground/25"
                          }`}
                        />
                        <span className="text-sm">{h.day}</span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          h.active ? "" : "text-muted-foreground/50"
                        }`}
                      >
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick facts card */}
              <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base">
                    Company Details
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {quickFacts.map((fact) => (
                    <div key={fact.label}>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {fact.label}
                      </p>
                      <p className="text-sm font-semibold">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Visual area */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Map-style visual */}
              <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden aspect-[4/3]">
                <div
                  className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/20 dark:from-primary/10 dark:to-muted/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {[70, 115, 160].map((size, idx) => (
                      <motion.div
                        key={size}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12"
                        style={{ width: size * 2, height: size * 2 }}
                        animate={{
                          scale: [1, 1.06, 1],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 3.5,
                          delay: idx * 0.6,
                          repeat: Infinity,
                        }}
                      />
                    ))}

                    <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-600 shadow-2xl"
                      style={{
                        boxShadow:
                          "0 8px 32px oklch(0.55 0.12 176 / 0.3), 0 0 60px oklch(0.55 0.12 176 / 0.1)",
                      }}
                    >
                      <div className="text-center text-primary-foreground">
                        <Globe className="h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-1" />
                        <p className="text-xs font-bold">Australia</p>
                        <p className="text-[9px] opacity-60">Wide</p>
                      </div>
                    </div>

                    {[
                      { label: "MEL", x: "130%", y: "-20%" },
                      { label: "SYD", x: "120%", y: "60%" },
                      { label: "BNE", x: "50%", y: "-70%" },
                      { label: "PER", x: "-100%", y: "30%" },
                    ].map((city, ci) => (
                      <motion.div
                        key={city.label}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.5 + ci * 0.12,
                          type: "spring",
                        }}
                        className="absolute"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `translate(${city.x}, ${city.y})`,
                        }}
                      >
                        <div className="flex items-center gap-1.5 rounded-full bg-card border border-border/50 px-2.5 py-1 shadow-md">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-bold">
                            {city.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Australia-wide", sub: "Delivery" },
                  { icon: Package, label: "130+", sub: "Products" },
                  { icon: ShieldCheck, label: "No minimum", sub: "Order" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-xl border border-border/50 bg-card/90 p-3 sm:p-4 text-center"
                  >
                    <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-bold">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.sub}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Brand badge */}
              <div className="rounded-2xl border border-border/50 bg-card/90 p-5 flex items-center gap-4">
                <Image
                  src="/images/logo.png"
                  alt="AJ Fresh Foods"
                  width={56}
                  height={56}
                  className="rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base">
                    AJ Fresh Foods
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Wholesale Distribution
                  </p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 text-amber-500 fill-amber-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Common Questions
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Frequently <span className="text-gradient">Asked</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
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
              Ready to Partner With Us?
            </h2>
            <p className="mt-4 text-white/60 text-sm sm:text-base lg:text-lg max-w-xl mx-auto">
              Set up your wholesale account and start ordering. We&apos;ll get
              back to you within 24 hours.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="mailto:ali@ajfreshfoods.com.au"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white text-primary font-semibold px-8 shadow-lg hover:bg-white/90 transition-all duration-300 hover:shadow-xl"
              >
                Email Us
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:0450767508"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 text-white font-semibold px-8 hover:bg-white/10 transition-all duration-300"
              >
                Call 0450 767 508
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ─── FAQ Accordion ─── */

function FAQItem({
  faq,
  index,
}: {
  faq: { q: string; a: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left rounded-2xl border bg-card/80 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 ${
          open
            ? "border-primary/30 shadow-lg shadow-primary/5"
            : "border-border/50 hover:border-primary/20"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-bold text-sm sm:text-[15px]">{faq.q}</h3>
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
              open
                ? "bg-primary text-primary-foreground rotate-90"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            marginTop: open ? 12 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {faq.a}
          </p>
        </motion.div>
      </button>
    </motion.div>
  );
}
