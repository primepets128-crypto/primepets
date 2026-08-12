import { motion } from 'framer-motion';
import React from 'react';

const transitionVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    }
  }
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
