"use client";

import { ReactNode } from "react";

interface AnimatedElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animation?: string;
  className?: string;
  once?: boolean;
}

// Animations disabled to prevent flicker
export function AnimatedElement({
  children,
  className,
}: AnimatedElementProps) {
  return <div className={className}>{children}</div>;
}

// Staggered children wrapper - animations disabled
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
}: StaggerContainerProps) {
  return <div className={className}>{children}</div>;
}

// Child item for stagger container - animations disabled
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return <div className={className}>{children}</div>;
}
