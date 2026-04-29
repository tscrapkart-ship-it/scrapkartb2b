"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const heroEntrance: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const heroChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type RevealProps = HTMLMotionProps<"div"> & { children: ReactNode };

export function Reveal({ children, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={revealVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({ children, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: RevealProps) {
  return (
    <motion.div variants={staggerChild} {...props}>
      {children}
    </motion.div>
  );
}

export function HeroEntrance({ children, ...props }: RevealProps) {
  return (
    <motion.div initial="hidden" animate="show" variants={heroEntrance} {...props}>
      {children}
    </motion.div>
  );
}

export function HeroEntranceItem({ children, ...props }: RevealProps) {
  return (
    <motion.div variants={heroChild} {...props}>
      {children}
    </motion.div>
  );
}
