import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMsg } = useCart();
  if (!toastMsg) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] pointer-events-none"
      style={{ animation: 'toastIn 0.3s ease' }}>
      <div className="bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl whitespace-nowrap flex items-center gap-2">
        {toastMsg}
      </div>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(-50%) translateY(-12px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
