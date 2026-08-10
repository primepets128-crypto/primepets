import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = "", delay = 0, animation = "fade-up" }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: "0px 0px -50px 0px"
    });

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-left': return 'reveal-fade-left';
      case 'fade-right': return 'reveal-fade-right';
      case 'scale-up': return 'reveal-scale-up';
      case 'fade-down': return 'reveal-fade-down';
      default: return 'reveal-fade-up';
    }
  };

  return (
    <div
      ref={domRef}
      className={`${getAnimationClass()} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
