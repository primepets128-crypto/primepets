import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

// Generate 40 random dust particles once
const particles = Array.from({ length: 40 }).map((_, i) => {
  const size = Math.random() * 4 + 1; // 1px to 5px
  const initialX = Math.random() * 100; // 0% to 100%
  const initialY = Math.random() * 100; // 0% to 100%
  const duration = Math.random() * 10 + 10; // 10s to 20s
  const delay = Math.random() * 5; // 0s to 5s
  return { id: i, size, initialX, initialY, duration, delay };
});

function GoldenDust() {

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0, 
            x: `${p.initialX}vw`, 
            y: `${p.initialY}vh` 
          }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            x: [`${p.initialX}vw`, `${p.initialX + 30}vw`],
            y: [`${p.initialY}vh`, `${p.initialY - 20}vh`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
          className="absolute rounded-full bg-[#ffb347] shadow-[0_0_8px_2px_rgba(255,179,71,0.8)] blur-[0.5px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

const quotes = [
  "A healthy pet is a happy pet.",
  "Every purr and wag is a thank you.",
  "Premium care for your best friend.",
  "Because they deserve the best.",
  "Nutrition tailored for their joy."
];

export default function PageLoader({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};

  useEffect(() => {
    if (!started) return;
    // Auto dismiss after 7 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 7000);
    
    // Cycle quotes every 2 seconds
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(quoteTimer);
    };
  }, [onFinish, started]);

  const handleStart = () => {
    const audio = document.getElementById('site-bg-audio');
    if (audio) {
      audio.play().catch(e => console.error("Audio playback failed:", e));
    }
    setStarted(true);
  };

  const handleTap = () => {
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  return (
    <AnimatePresence>
      {isVisible && !started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#1a0e05] to-[#5c3110] overflow-hidden"
          onClick={handleStart}
        >
          <div className="absolute inset-0 opacity-20 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d07e20] rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a65d14] rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>
          <GoldenDust />
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-[#d07e20] to-[#ffb347] hover:from-[#ffb347] hover:to-[#d07e20] text-white font-black text-2xl sm:text-3xl md:text-5xl px-7 sm:px-10 py-5 sm:py-6 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(208,126,32,0.8)] cursor-pointer tracking-wider text-center flex flex-col items-center gap-3 sm:gap-4 transition-all mx-4"
            >
              <span>Let's care for pet</span>
              <span className="text-sm font-medium opacity-80 uppercase tracking-widest bg-black/20 px-4 py-1.5 rounded-full">Tap to enter</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {isVisible && started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#1a0e05] to-[#5c3110] overflow-hidden"
          onClick={handleTap}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d07e20] rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a65d14] rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>

          <GoldenDust />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-4"
            >
              <motion.div
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{ 
                  scale: [1, 1.02, 1],
                  y: [0, -8, 0],
                  opacity: 1
                }}
                transition={{ 
                  duration: 3, 
                  ease: "easeInOut",
                  repeat: Infinity
                }}
                className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center drop-shadow-[0_0_15px_rgba(208,126,32,0.5)]"
              >
                <div className="relative w-full h-full flex items-center justify-center drop-shadow-2xl shimmer-loop rounded-full">
                  <img src={settings.logoBase64 || "/logo.png"} alt="Logo" className="max-w-[90%] max-h-[90%] object-contain relative z-10 animate-pulse shimmer-loop" style={{ animationDuration: '3s' }} />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Name Text */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd8a8] to-[#d07e20] tracking-tight mb-2"
            >
              {settings.storeName || 'Prime Pets'}
            </motion.h1>

            {/* Cycling Pet Quotes */}
            <div className="h-6 mb-8 mt-[-1rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-orange-200/80 text-sm md:text-base italic tracking-wide font-medium"
                >
                  "{quotes[quoteIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* 7-Second Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="w-48 md:w-64 mb-10"
            >
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffd8a8] via-[#ffb347] to-[#d07e20] shadow-[0_0_10px_rgba(208,126,32,0.8)]"
                />
              </div>
              <p className="text-xs text-orange-300/60 mt-3 uppercase tracking-widest font-semibold">Loading Experience...</p>
            </motion.div>

            {/* Tap to Skip button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d07e20] to-[#ffb347] rounded-full blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
                <button 
                  className="relative px-6 py-2 bg-[#5c3110]/80 backdrop-blur-sm border border-[#d07e20]/20 hover:border-[#d07e20]/50 rounded-full text-orange-200/80 hover:text-white font-bold tracking-wide uppercase text-xs shadow-xl flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTap();
                  }}
                >
                  Skip
                  <span>⏩</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
