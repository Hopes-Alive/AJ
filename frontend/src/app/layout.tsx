import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AJ Fresh Foods | Wholesale Grocery Distribution",
    template: "%s | AJ Fresh Foods",
  },
  description:
    "Australian wholesale grocery distributor. 130+ products across beverages, spices, rice, noodles, dried fruits, and more. Competitive carton pricing for retailers.",
  keywords: [
    "wholesale grocery",
    "food distribution Australia",
    "FMCG wholesale",
    "supermarket supplier",
    "AJ Fresh Foods",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "AJ Fresh Foods",
    title: "AJ Fresh Foods | Wholesale Grocery Distribution",
    description:
      "Australian wholesale grocery distributor. 130+ products across beverages, spices, rice, noodles, dried fruits, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
