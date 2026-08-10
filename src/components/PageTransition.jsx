import { motion } from 'framer-motion';
import React from 'react';

const transitionVariants = {
  initial: {
    opacity: 0,
    y: '50vh',
    scale: 0.9,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom dramatic ease out
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: '-10vh',
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
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
      className="w-full min-h-screen origin-top"
    >
      {children}
    </motion.div>
  );
}
