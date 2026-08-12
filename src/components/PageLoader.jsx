import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

// Generate particles once (fewer on mobile for perf)
const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 40;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
  const size = Math.random() * 4 + 1;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const duration = Math.random() * 10 + 10;
  const delay = Math.random() * 5;
  return { id: i, size, initialX, initialY, duration, delay };
});

function GoldenDust() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.initialX}vw`, y: `${p.initialY}vh` }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            x: [`${p.initialX}vw`, `${p.initialX + 30}vw`],
            y: [`${p.initialY}vh`, `${p.initialY - 20}vh`],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
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

// Simple loader (used as Suspense fallback for sub-pages)
function SimpleLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#1a0e05] to-[#5c3110]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
          <img src="/MA_logo.png" alt="Loading" className="w-10 h-10 object-contain" />
        </div>
        <div className="h-1 w-32 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
            className="h-full bg-gradient-to-r from-[#ffd8a8] to-[#d07e20]"
          />
        </div>
      </div>
    </div>
  );
}

export default function PageLoader({ onFinish, skip, dataReady }) {
  const [isVisible, setIsVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};

  if (skip) return null;

  useEffect(() => {
    if (!started) return;

    // Cycle quotes every 2 seconds
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 2000);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setIsVisible(false);
      if (onFinish) onFinish();
    };

    // Maximum wait: 8 seconds
    const maxTimer = setTimeout(dismiss, 8000);

    // If data is already ready, wait 1.5 seconds minimum then dismiss
    let minTimer;
    if (dataReady) {
      minTimer = setTimeout(dismiss, 1500);
    }

    return () => {
      clearInterval(quoteTimer);
      clearTimeout(maxTimer);
      if (minTimer) clearTimeout(minTimer);
    };
  }, [started, dataReady, onFinish]);

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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 2, rotate: 5, filter: "blur(20px)", transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#0a0502] via-[#1a0e05] to-[#2a1608] overflow-hidden"
          onClick={handleStart}
          onTouchStart={handleStart}
        >
          {/* Ambient Glows */}
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d07e20] rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#a65d14] rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
          </div>
          
          <GoldenDust />
          
          <div className="relative z-10 w-full max-w-md px-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#1a0e05]/60 backdrop-blur-3xl border border-[#d07e20]/20 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col items-center gap-8 text-center group transition-all hover:bg-[#1a0e05]/80 hover:border-[#d07e20]/40"
            >
              {/* Rich Logo Effect */}
              <div className="relative mb-2 w-full flex justify-center">
                <div className="absolute inset-0 bg-[#d07e20] opacity-30 blur-[80px] rounded-full group-hover:opacity-50 transition-opacity duration-700 scale-150" />
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center bg-white rounded-full p-6 shadow-[0_0_40px_rgba(208,126,32,0.4)]">
                  <img 
                    src="/MA_logo.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain relative z-10" 
                  />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ffdbb0] drop-shadow-sm">
                  Let's care for pet
                </h1>
                <p className="text-xs text-[#d07e20] font-bold uppercase tracking-[0.3em]">
                  {settings.storeName || 'Premium Pet Store'}
                </p>
              </div>

              {/* Elegant Small Button */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4"
              >
                <button className="relative px-4 py-1.5 bg-gradient-to-r from-[#d07e20]/20 to-[#ffb347]/20 border border-[#d07e20]/40 rounded-full text-[#ffdbb0] text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(208,126,32,0.2)] hover:shadow-[0_0_30px_rgba(208,126,32,0.5)] transition-all overflow-hidden flex items-center gap-2">
                  <span className="relative z-10">Tap to enter</span>
                  <svg className="w-3 h-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d07e20] to-[#ffb347] opacity-0 hover:opacity-20 transition-opacity" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {isVisible && started && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, filter: "blur(30px)", rotate: -10 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          exit={{ opacity: 0, scale: 1.5, filter: "blur(15px)", transition: { duration: 1.2, ease: "easeInOut" } }}
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
                animate={{ scale: [1, 1.02, 1], y: [0, -8, 0], opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center drop-shadow-[0_0_30px_rgba(208,126,32,0.5)]"
              >
                <div className="relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center p-6 bg-white rounded-full">
                  <img src="/MA_logo.png" alt="Logo" className="w-full h-full object-contain relative z-10 animate-pulse shimmer-loop" style={{ animationDuration: '3s' }} />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Name Text */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl md:text-5xl font-black uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#ffd8a8] to-[#d07e20] mb-3 drop-shadow-sm"
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

            {/* Progress Bar — tied to data loading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="w-48 md:w-64 mb-10"
            >
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: dataReady ? "100%" : "85%" }}
                  transition={dataReady 
                    ? { duration: 0.5, ease: "easeOut" }
                    : { duration: 5, ease: "easeOut" }
                  }
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffd8a8] via-[#ffb347] to-[#d07e20] shadow-[0_0_10px_rgba(208,126,32,0.8)]"
                />
              </div>
              <p className="text-xs text-orange-300/60 mt-3 uppercase tracking-widest font-semibold">
                {dataReady ? 'Ready!' : 'Loading Experience...'}
              </p>
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
