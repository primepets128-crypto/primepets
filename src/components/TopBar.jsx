import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    // Start progress on route change
    doneRef.current = false;
    setVisible(true);
    setProgress(0);

    // Quickly ramp to 80% then stall
    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 200);
    const t3 = setTimeout(() => setProgress(80), 400);

    // After page transition completes (~700ms) finish the bar
    const t4 = setTimeout(() => {
      setProgress(100);
      const t5 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      timerRef.current = t5;
    }, 700);

    timerRef.current = t4;
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #d07e20, #FF9A3C)',
        zIndex: 9999,
        transition: progress === 100 ? 'width 0.2s ease' : 'width 0.4s ease',
        boxShadow: '0 0 8px rgba(208,126,32,0.6)',
        borderRadius: '0 2px 2px 0',
      }}
    />
  );
}
