"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import Image, { type ImageProps } from "next/image";

type ParallaxImageProps = Omit<ImageProps, "style"> & {
  /** Visual rest scale; image scales from `intensity * 1.05` → `1.0` as the section traverses the viewport. Default 1. */
  intensity?: number;
  className?: string;
  containerClassName?: string;
  style?: MotionStyle;
};

/**
 * Scales 1.05 → 1.0 and translates 0 → -2% as the section scrolls through the viewport.
 * Reduced motion is handled at the CSS level (transitions become instant), so the visual
 * jump is minimal for users with the preference set.
 */
export function ParallaxImage({
  intensity = 1,
  className,
  containerClassName,
  style,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05 * intensity, 1.0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);

  return (
    <div ref={ref} className={containerClassName} style={{ overflow: "hidden", position: "relative" }}>
      <motion.div style={{ scale, y, ...(style ?? {}) }} className="will-change-transform">
        <Image alt={alt} className={className} {...imageProps} />
      </motion.div>
    </div>
  );
}
