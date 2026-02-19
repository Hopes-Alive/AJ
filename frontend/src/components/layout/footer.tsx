"use client";

import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/navigation";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-muted/30 dark:bg-muted/60 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="group flex items-center gap-3 mb-5">
              <Image
                src="/images/logo.png"
                alt="AJ Fresh Foods"
                width={52}
                height={52}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight text-gradient">
                AJ Fresh Foods
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your trusted wholesale distribution partner. Quality grocery
              products delivered to retailers across Australia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Australia</span>
              </li>
              <li>
                <a
                  href="tel:0450767508"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  0450 767 508
                </a>
              </li>
              <li>
                <a
                  href="mailto:ali@ajfreshfoods.com.au"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  ali@ajfreshfoods.com.au
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="font-medium text-foreground">7am - 5pm</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-foreground">8am - 12pm</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-foreground">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AJ Fresh Foods. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
