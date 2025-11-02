"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type MotionSectionProps = PropsWithChildren<{
  delay?: number;
  className?: string;
}>;

export function MotionSection({
  children,
  delay = 0,
  className,
}: MotionSectionProps) {
  return (
    <motion.section
      className={cn(className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.section>
  );
}
