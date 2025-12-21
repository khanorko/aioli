"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  offset?: number;
  opacityRange?: [number, number];
}

export function ParallaxSection({
  children,
  className,
  offset = 0.3,
  opacityRange = [1, 1],
}: ParallaxSectionProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [
    opacityRange[0],
    1,
    1,
    opacityRange[1],
  ]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Hero parallax with subtle effect (no opacity fade to keep inputs visible)
interface HeroParallaxProps {
  children: ReactNode;
  className?: string;
}

export function HeroParallax({ children, className }: HeroParallaxProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax only - no opacity or scale changes
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
