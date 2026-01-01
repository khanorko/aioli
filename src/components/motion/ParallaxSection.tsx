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

// Hero parallax - simplified for smooth scrolling
interface HeroParallaxProps {
  children: ReactNode;
  className?: string;
}

export function HeroParallax({ children, className }: HeroParallaxProps) {
  // Disabled parallax for smoother scrolling - just render children
  return (
    <div className={className}>
      {children}
    </div>
  );
}
