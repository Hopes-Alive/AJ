"use client";

import { motion } from "framer-motion";
import { Warehouse, Truck, ClipboardList, Store, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const iconMap: Record<string, React.ElementType> = {
  warehouse: Warehouse,
  truck: Truck,
  clipboard: ClipboardList,
  store: Store,
};

const services = [
  {
    icon: "warehouse",
    title: "Warehouse & Storage",
    description:
      "Proper warehousing facilities ensuring product freshness and quality from receipt to dispatch.",
  },
  {
    icon: "truck",
    title: "Route Delivery",
    description:
      "Delivery routes across Australia, with reliable on-time performance to keep your shelves stocked.",
  },
  {
    icon: "clipboard",
    title: "Order Management",
    description:
      "Streamlined ordering with dedicated support, flexible carton sizes, and competitive wholesale pricing.",
  },
  {
    icon: "store",
    title: "Retail Support",
    description:
      "In-store merchandising assistance to help optimise product placement and promotional displays.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Get in Touch",
    description:
      "Contact us to set up your wholesale account. We'll discuss your store's needs and product range.",
  },
  {
    step: "02",
    title: "Place Your Order",
    description:
      "Order by phone or email. Choose from 130+ products across 12 categories at wholesale carton prices.",
  },
  {
    step: "03",
    title: "We Pick & Pack",
    description:
      "Our warehouse team picks your order with care, ensuring correct quantities and product quality.",
  },
  {
    step: "04",
    title: "Delivered to You",
    description:
      "Your order is delivered reliably. Products arrive ready to stock on your shelves.",
  },
];

const deliveryAreas = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Canberra",
  "Regional Areas",
];

export function ServicesContent() {
  return (
    <>
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Our Services"
            title="Wholesale"
            titleGradient="Distribution"
            description="From warehouse to shelf, we handle the supply chain so you can focus on running your store."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Warehouse;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:glow-sm"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:glow-xs">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              The Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-600 text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:glow-md">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
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
              Coverage
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Delivery <span className="text-gradient">Areas</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              We deliver to retailers and supermarkets across these regions.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto">
            {deliveryAreas.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-5 py-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:glow-xs"
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{area}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
