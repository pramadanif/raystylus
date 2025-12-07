'use client';

import { motion, useInView, UseInViewOptions, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollAnimation = ({
  children,
  className = "",
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
  threshold = 0.2,
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
        // use a named easing to satisfy TS; keep it smooth
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
