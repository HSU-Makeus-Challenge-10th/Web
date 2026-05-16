import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedTagProps {
  children: ReactNode;
  direction?: 'x' | 'y';
  duration?: number;
  className?: string;
}

const AnimatedTag = ({
  children,
  direction = 'x',
  duration = 0.3,
  className,
}: AnimatedTagProps) => {
  const variants = {
    x: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    },
    y: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
  };

  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      exit={variants[direction].exit}
      transition={{ duration }}
      className={`w-full max-w-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTag;
