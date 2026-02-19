"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const nearBottom =
        scrolled + window.innerHeight >= document.body.scrollHeight - 600;
      setVisible(scrolled > 500 || nearBottom);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25 }}
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 185))",
            boxShadow:
              "0 4px 16px oklch(0.5 0.12 176 / 0.35), 0 1px 4px oklch(0 0 0 / 0.1)",
            border: "1px solid oklch(1 0 0 / 0.1)",
          }}
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
