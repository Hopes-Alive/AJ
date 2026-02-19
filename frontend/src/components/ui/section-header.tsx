"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  titleGradient?: string;
  description?: string;
  center?: boolean;
}

export function SectionHeader({
  label,
  title,
  titleGradient,
  description,
  center = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? "text-center mb-14" : "max-w-2xl mb-12"}
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        {label}
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {titleGradient ? (
          <>
            {title} <span className="text-gradient">{titleGradient}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
