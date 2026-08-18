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
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-gradient-to-br from-[#1a0e05] to-[#5c3110]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
          <picture>
            <source srcSet="/MA_logo.webp" type="image/webp" />
            <img src="/MA_logo.png" alt="Loading" className="w-10 h-10 object-contain" />
          </picture>
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
  const [started, setStarted] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};

  useEffect(() => {
    if (!started) return;

    // Cycle quotes every 2.5 seconds
    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 2500);

    // Smooth incremental progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (dataReady) {
          if (prev >= 100) {
            clearInterval(progressTimer);
            setIsReady(true);
            return 100;
          }
          return Math.min(100, prev + 15);
        } else {
          if (prev >= 85) return 85;
          return prev + 5;
        }
      });
    }, 80);

    return () => {
      clearInterval(quoteTimer);
      clearInterval(progressTimer);
    };
  }, [started, dataReady]);

  const handleTap = () => {
    // Circumvent mobile browser audio autoplay policy
    const audio = document.getElementById('site-bg-audio');
    if (audio) {
      audio.play().catch(err => console.log('Audio autoplay blocked:', err));
    }
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  if (skip) return null;

  return (
    <AnimatePresence>
      {isVisible && started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
          className="fixed inset-0 z-[500] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#1a0e05] to-[#5c3110] overflow-hidden"
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
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 relative"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1], y: [0, -5, 0], opacity: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                className="relative flex items-center justify-center drop-shadow-2xl"
              >
                {/* Clean, smaller white circle wrapper */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center p-3 md:p-5 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20">
                  <picture>
                    <source srcSet={settings.logoBase64 || "/MA_logo.webp"} type="image/webp" />
                    <img 
                      src={settings.logoBase64 || "/MA_logo.png"} 
                      alt="Logo" 
                      fetchpriority="high" 
                      className="w-full h-full object-contain relative z-10" 
                    />
                  </picture>
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

            {/* Interactive Control: Progress Bar or Enter Button */}
            <div className="h-28 flex flex-col items-center justify-center mb-8">
              {isReady ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#ffd8a8] via-[#ffb347] to-[#d07e20] text-[#1a0e05] rounded-full font-black tracking-[0.2em] text-xs md:text-sm shadow-[0_0_35px_rgba(208,126,32,0.6)] border border-[#ffd8a8]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTap();
                  }}
                >
                  🐾 TAP TO ENTER 🐾
                </motion.button>
              ) : (
                <div className="w-48 md:w-64 flex flex-col items-center">
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffd8a8] via-[#ffb347] to-[#d07e20] shadow-[0_0_10px_rgba(208,126,32,0.8)] transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] md:text-xs text-orange-300/60 mt-3 uppercase tracking-widest font-semibold">
                    Loading Experience... {progress}%
                  </p>
                </div>
              )}
            </div>

            {/* Skip Button (always visible during loading so users aren't forced to wait) */}
            {!isReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="relative group mt-2"
              >
                <button 
                  className="px-5 py-1.5 bg-[#5c3110]/50 backdrop-blur-sm border border-[#d07e20]/20 rounded-full text-orange-200/60 hover:text-white font-bold tracking-wide uppercase text-[10px] shadow-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTap();
                  }}
                >
                  Skip ⏩
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
