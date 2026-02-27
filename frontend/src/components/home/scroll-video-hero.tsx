"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

const TOTAL_FRAMES = 240;
const FRAMES_DIR = "/ezgif-7abfd73abb14409e-jpg";

function frameUrl(index: number) {
  return `${FRAMES_DIR}/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;
}

// Text scenes: each tied to a phase of the video
const SCENES = [
  {
    from: 0.0,
    to: 0.22,
    eyebrow: "Wholesale Grocery Distribution",
    title: ["One Supplier.", "Everything You Need."],
    body: "130+ products across 12 categories — groceries, beverages, snacks, dairy, and more. Delivered to retailers across Australia.",
    cta: false,
    align: "center" as const,
    dark: false,
  },
  {
    from: 0.28,
    to: 0.52,
    eyebrow: "Trusted by Retailers Nationwide",
    title: ["Built for", "Your Business"],
    body: "From independent grocers to large retail chains — AJ Fresh Foods keeps shelves stocked with the products your customers want.",
    cta: false,
    align: "left" as const,
    dark: true,
  },
  {
    from: 0.57,
    to: 0.78,
    eyebrow: "Reliability You Can Count On",
    title: ["Consistent Supply.", "Competitive Prices."],
    body: "We handle the sourcing so you don't have to. Flexible carton quantities, fast dispatch, and wholesale pricing that works for your margins.",
    cta: false,
    align: "right" as const,
    dark: true,
  },
  {
    from: 0.83,
    to: 1.0,
    eyebrow: "Ready to place an order?",
    title: ["Stock Your", "Shelves Today"],
    body: "Browse our full catalogue and place a wholesale order online. Quick, simple, and built for busy store owners.",
    cta: true,
    align: "center" as const,
    dark: true,
  },
];

function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    function update() {
      const rect = container!.getBoundingClientRect();
      const scrollable = container!.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [containerRef]);

  return progress;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const ratio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;
  let dw: number, dh: number, dx: number, dy: number;

  if (ratio > canvasRatio) {
    dh = h;
    dw = dh * ratio;
    dx = (w - dw) / 2;
    dy = 0;
  } else {
    dw = w;
    dh = dw / ratio;
    dx = 0;
    dy = (h - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function sceneOpacity(scene: (typeof SCENES)[number], progress: number): number {
  const fadeDur = 0.06;
  if (progress < scene.from || progress > scene.to) return 0;
  const intoScene = progress - scene.from;
  const remaining = scene.to - progress;
  return Math.min(1, intoScene / fadeDur, remaining / fadeDur);
}

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 1280, h: 720 });
  const currentFrameRef = useRef(-1);

  const progress = useScrollProgress(containerRef);

  // Resize canvas to viewport
  useEffect(() => {
    function resize() {
      setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw helper
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = framesRef.current[frameIndex];
      if (!img) return;
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
      drawCover(ctx, img, canvasSize.w, canvasSize.h);
    },
    [canvasSize]
  );

  // Load frame 0 first, then the rest
  useEffect(() => {
    framesRef.current = Array(TOTAL_FRAMES).fill(null);
    let loaded = 0;

    function loadImg(i: number) {
      const img = new window.Image();
      img.src = frameUrl(i);
      img.onload = () => {
        framesRef.current[i] = img;
        loaded += 1;
        setLoadedCount(loaded);
        // Draw first frame the instant it's ready
        if (i === 0) {
          setFirstFrameReady(true);
        }
      };
      img.onerror = () => {
        loaded += 1;
        setLoadedCount(loaded);
      };
    }

    // Load frame 0 immediately, then queue the rest
    loadImg(0);
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      loadImg(i);
    }
  }, []);

  // Redraw first frame when canvas size changes and it's already loaded
  useEffect(() => {
    if (firstFrameReady && currentFrameRef.current <= 0) {
      drawFrame(0);
    }
  }, [canvasSize, firstFrameReady, drawFrame]);

  // Scrub to the correct frame on scroll
  useEffect(() => {
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.round(progress * (TOTAL_FRAMES - 1))
    );
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  }, [progress, drawFrame, loadedCount]);

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  // Only show the black loading overlay before frame 0 is ready
  const showOverlay = !firstFrameReady;

  return (
    /* Tall scroll container — 500vh gives smooth scrubbing */
    <div ref={containerRef} style={{ height: "500vh" }} className="relative">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          className="absolute inset-0 w-full h-full"
        />

        {/* Loading overlay — only shown before the very first frame is ready */}
        {showOverlay && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
            <div className="mb-4">
              <Image src="/images/logo.png" alt="AJ Fresh Foods" width={72} height={72} className="brightness-0 invert opacity-80" />
            </div>
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/60 transition-all duration-200"
                style={{ width: `${Math.max(5, loadPct)}%` }}
              />
            </div>
          </div>
        )}

        {/* Background frame-loading progress bar — subtle, shown after first frame is visible */}
        {firstFrameReady && loadedCount < TOTAL_FRAMES && (
          <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-transparent pointer-events-none">
            <div
              className="h-full bg-primary/40 transition-all duration-300"
              style={{ width: `${loadPct}%` }}
            />
          </div>
        )}

        {/* Dark gradient overlays — vary per scene */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Bottom blend into page */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background to-transparent" />
          {/* Top fade */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        </div>

        {/* Scene text overlays */}
        {SCENES.map((scene, i) => {
          const opacity = sceneOpacity(scene, progress);
          if (opacity === 0) return null;

          const alignClass =
            scene.align === "left"
              ? "items-start text-left px-10 sm:px-16 lg:px-24"
              : scene.align === "right"
              ? "items-end text-right px-10 sm:px-16 lg:px-24"
              : "items-center text-center px-6";

          const textColor = scene.dark ? "text-white" : "text-white";

          return (
            <div
              key={i}
              className={`absolute inset-0 z-20 flex flex-col justify-center ${alignClass} pointer-events-none`}
              style={{ opacity, transition: "opacity 0.1s ease" }}
            >
              {/* Dark scrim behind text */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    scene.align === "left"
                      ? "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
                      : scene.align === "right"
                      ? "linear-gradient(270deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
                      : "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)",
                }}
              />

              <div className="relative z-10 max-w-lg">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-4" style={{ justifyContent: scene.align === "right" ? "flex-end" : scene.align === "center" ? "center" : "flex-start" }}>
                  <span className="h-px w-6 bg-primary/80" />
                  <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary/90">
                    {scene.eyebrow}
                  </span>
                  <span className="h-px w-6 bg-primary/80" />
                </div>

                {/* Title */}
                <h2
                  className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] ${textColor}`}
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
                >
                  {scene.title[0]}
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.68 0.13 192))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {scene.title[1]}
                  </span>
                </h2>

                {/* Body */}
                <p className="mt-4 text-sm sm:text-base text-white/70 max-w-sm leading-relaxed"
                  style={{ marginLeft: scene.align === "right" ? "auto" : undefined }}>
                  {scene.body}
                </p>

                {/* CTA */}
                {scene.cta && (
                  <div
                    className="mt-8 flex flex-wrap gap-4 pointer-events-auto"
                    style={{ justifyContent: scene.align === "center" ? "center" : "flex-start" }}
                  >
                    <Link
                      href="/products"
                      className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.5 0.12 176), oklch(0.42 0.1 190))",
                        boxShadow: "0 4px 20px oklch(0.5 0.12 176 / 0.35)",
                      }}
                    >
                      Browse Catalogue
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white/80 border border-white/20 backdrop-blur-sm hover:border-white/40 hover:text-white transition-all duration-300"
                    >
                      <Phone className="h-4 w-4" />
                      Get a Quote
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Scroll indicator — shown only at the start */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: Math.max(0, 1 - progress * 15) }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40">Scroll</p>
          <div className="h-8 w-[18px] rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div
              className="h-1.5 w-[3px] rounded-full bg-white/50"
              style={{
                animation: "scrollDot 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/5">
          <div
            className="h-full bg-primary/60 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
