import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Tag, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home',    icon: Home,     path: '/' },
  { label: 'Shop',    icon: Grid3X3,  path: '/category' },
  { label: 'Offers',  icon: Tag,      path: '/offers' },
  { label: 'Hub',     icon: BookOpen, path: '/hub' },
  { label: 'Account', icon: User,     path: '/account' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pressed, setPressed] = useState(null);

  return (
    /* Only visible on mobile (< md) */
    <div
      className="md:hidden fixed z-[80] left-1/2 -translate-x-1/2"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
      }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#d07e20]/40 via-transparent to-[#d07e20]/40 blur-xl pointer-events-none" />

      {/* Glass pill */}
      <nav
        className="relative rounded-[28px] flex items-center px-2 py-2 gap-1"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(208,126,32,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => {
                setPressed(item.path);
                setTimeout(() => setPressed(null), 300);
                navigate(item.path);
              }}
              aria-label={item.label}
              className="relative flex-1 flex flex-col items-center justify-center py-2 rounded-[20px] transition-all duration-200 active:scale-90"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(208,126,32,0.25), rgba(208,126,32,0.12))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(208,126,32,0.35)'
                  : '1px solid transparent',
              }}
            >
              {/* Icon */}
              <motion.div
                animate={pressed === item.path ? { scale: [1, 0.8, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? '#d07e20' : 'rgba(80,60,40,0.65)',
                    filter: isActive
                      ? 'drop-shadow(0 0 6px rgba(208,126,32,0.6))'
                      : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </motion.div>

              {/* Label */}
              <span
                className="text-[9px] font-bold mt-0.5 tracking-wide"
                style={{
                  color: isActive ? '#d07e20' : 'rgba(80,60,40,0.55)',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d07e20]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
