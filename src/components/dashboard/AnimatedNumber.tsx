"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  format?: "currency" | "number";
}

/**
 * Contador que anima de 0 até o valor. Usa rAF para suavidade e respeita
 * prefers-reduced-motion.
 */
export function AnimatedNumber({
  value,
  duration = 800,
  className,
  format = "currency",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    const to = value;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className}>
      {format === "currency" ? formatCurrency(display) : Math.round(display)}
    </span>
  );
}
