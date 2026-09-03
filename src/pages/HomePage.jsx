import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, ShoppingBag, Heart,
  MapPin, Gift, Zap, ArrowRight, TrendingUp, Award, Shield, Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';

/* ── HERO CAROUSEL ── */
function HeroCarousel() {
  const { slides } = useData();
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const navigate = useNavigate();
  const next = () => setCur(c => (c + 1) % slides.length);
  const prev = () => setCur(c => (c - 1 + slides.length) % slides.length);
  useEffect(() => {
    if (auto && slides.length > 0) { ref.current = setInterval(next, 4500); }
    return () => clearInterval(ref.current);
  }, [auto, cur, slides.length]);
  
  if (!slides || slides.length === 0) return null;
  const s = slides[cur] || slides[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative z-10 max-w-[1920px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10"
    >
      <div
        className="relative overflow-hidden shadow-lg rounded-3xl w-full aspect-[1920/640]"
        onMouseEnter={() => setAuto(false)}
        onMouseLeave={() => setAuto(true)}
      >
      {s.heroImage && (
        <MediaDisplay src={s.heroImage} alt="Hero Background" className="w-full h-full object-cover" loading="eager" />
      )}
      
      {/* Arrows — smaller on mobile */}
      <button onClick={prev} className="absolute left-1.5 md:left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 md:p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all z-20">
        <ChevronLeft size={16} className="text-gray-700" />
      </button>
      <button onClick={next} className="absolute right-1.5 md:right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 md:p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all z-20">
        <ChevronRight size={16} className="text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === cur ? 'bg-white w-6 md:w-8' : 'bg-white/50 w-2'}`} />
        ))}
      </div>
      </div>

    </motion.div>
  );
}

/* ── QUICK CATEGORIES ── */
function QuickCategories() {
  const { categories } = useData();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Duplicate 6 times for a virtually infinite native scroll that doesn't break iOS momentum
  const infiniteCategories = Array(6).fill(categories || []).flat();

  useEffect(() => {
    if (scrollRef.current) {
      // Start in the exact middle so user can infinitely swipe left or right
      const el = scrollRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [categories]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#d07e20]/50 shadow-[0_0_40px_rgba(208,126,32,0.15)] universe-bg">
        
        {/* Sleek dark background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Moving 3D Starfield */}
          <div className="universe-stars" />
          <div className="universe-stars-2" />

          {/* Live floating glowing orbs - hidden on mobile for better performance */}
          <div className="hidden md:block absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#d07e20]/20 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'blob-float 12s infinite alternate ease-in-out' }} />
          <div className="hidden md:block absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'blob-float 18s infinite alternate-reverse ease-in-out' }} />
          
          {/* Subtle tech lines */}
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#d07e20]/20 to-transparent" />
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d07e20]/20 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-10 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-black text-2xl md:text-4xl tracking-tight flex items-center gap-2">
              Explore Our Pet Universe <span className="text-[#d07e20] drop-shadow-[0_0_10px_rgba(208,126,32,0.8)]">✨</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium">
              From premium treats to cozy beds, discover the perfect picks for your furry friend!
            </p>
          </div>
          <button onClick={() => navigate('/category')}
            className="flex-shrink-0 flex items-center gap-1.5 bg-transparent text-[#d07e20] text-xs md:text-sm font-bold border border-[#d07e20]/50 px-5 py-2.5 rounded-full hover:bg-[#d07e20] hover:text-white hover:shadow-[0_0_15px_rgba(208,126,32,0.5)] transition-all">
            See All Categories <ArrowRight size={14} />
          </button>
        </div>

        {/* Swipable horizontal list of cards */}
        <div className="relative z-10 mask-edges pb-2 md:pb-4 mt-2">
          
          {/* Left Scroll Button */}
          <button onClick={() => scroll('left')} 
            className="absolute left-2 md:left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/80 border border-[#d07e20] text-[#d07e20] shadow-[0_0_20px_rgba(208,126,32,0.4)] transition-all duration-300 hover:bg-[#d07e20] hover:text-white hover:scale-110 backdrop-blur-md hidden md:flex">
            <ChevronLeft size={28} />
          </button>

          <div ref={scrollRef} className="flex gap-3 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-24 py-4">
            {infiniteCategories.map((cat, idx) => (
              <button key={`${cat.label}-${idx}`} onClick={() => navigate('/category', { state: { category: cat.label } })}
                className="snap-center flex-shrink-0 flex flex-col items-center gap-2 md:gap-4 group focus:outline-none w-20 sm:w-28 md:w-40 lg:w-48 btn-interactive">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-[1.2rem] md:rounded-[2.5rem] border border-gray-800 bg-[#140a05] overflow-hidden shadow-xl group-hover:border-[#d07e20] group-hover:shadow-[0_0_30px_rgba(208,126,32,0.4)] transition-all duration-300 relative cursor-pointer">
                  
                  <img src={cat.img} alt={cat.label} loading="lazy" className="relative z-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:48px">${cat.emoji}</div>`; }} />
                </div>
                <span className="text-xs md:text-base font-bold text-gray-300 text-center leading-tight group-hover:text-[#d07e20] transition-colors px-1">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button onClick={() => scroll('right')} 
            className="absolute right-2 md:right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/80 border border-[#d07e20] text-[#d07e20] shadow-[0_0_20px_rgba(208,126,32,0.4)] transition-all duration-300 hover:bg-[#d07e20] hover:text-white hover:scale-110 backdrop-blur-md hidden md:flex">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── DEALS SECTION ── */
function DealsSection() {
  const { deals } = useData();
  const navigate = useNavigate();
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10">
      <div className="glass-panel rounded-3xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-gray-900 font-black text-lg md:text-2xl lg:text-3xl">Deals for Every Pet</h2>
            <p className="text-[#d07e20] text-sm md:text-base font-semibold mt-0.5">Up to 30% off 🎉</p>
          </div>
          <button onClick={() => navigate('/offers')}
            className="flex items-center gap-1.5 text-[#d07e20] text-xs md:text-sm font-bold border border-[#d07e20] px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-[#d07e20] hover:text-white transition-all btn-interactive">
            View All <ArrowRight size={14} />
          </button>
        </div>

        {/* Infinite scrolling marquee */}
        <div className="overflow-hidden py-4 mask-edges whitespace-nowrap">
          <div className="animate-marquee gap-4 md:gap-5">
            {[...deals, ...deals].map((d, index) => (
              <div key={`${d.id}-${index}`} onClick={() => navigate('/offers')}
                className="product-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border interactive-card mx-2"
                style={{ width: 176, backgroundColor: d.bg, borderColor: d.border, display: 'inline-block', whiteSpace: 'normal', verticalAlign: 'top' }}>
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  <MediaDisplay src={d.img} alt={d.sub} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${d.grad} opacity-30`} />
                  <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full">{d.badge}</span>
                  <span className={`absolute top-2 right-2 bg-gradient-to-r ${d.grad} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>{d.tag}</span>
                </div>
                <div className="p-3 md:p-4">
                  <p className={`text-transparent bg-clip-text bg-gradient-to-r ${d.grad} font-black text-sm md:text-base`}>{d.title}</p>
                  <p className="text-gray-700 font-bold text-xs md:text-sm mt-0.5">{d.sub}</p>
                  <div className="flex items-center justify-between mt-2 md:mt-3">
                    <span className="text-green-600 text-[10px] md:text-xs font-semibold">{d.save}</span>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className={`bg-gradient-to-r ${d.grad} text-white text-[10px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-1.5 rounded-full`}>Shop →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURED PRODUCTS ── */
function FeaturedProducts() {
  const { products } = useData();
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10">
      <div className="glass-panel rounded-3xl p-4 md:p-6">
        <ScrollReveal animation="fade-left">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-gray-900 font-black text-lg md:text-2xl lg:text-3xl">Top Picks</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5">Loved by 50,000+ pet parents 🐾</p>
          </div>
          <div className="flex items-center gap-2">
            <ScrollReveal animation="fade-right">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#d07e20] hover:text-[#d07e20] transition-all">
                <TrendingUp size={13} /> Trending
              </button>
            </ScrollReveal>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="flex items-center gap-1.5 text-[#d07e20] text-xs md:text-sm font-bold border border-[#d07e20] px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-[#d07e20] hover:text-white transition-all">
              View All <ArrowRight size={14} />
            </button>
          </div>
        </div>
        </ScrollReveal>

        {/* 2-col mobile → 3-col md → 4-col lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {(products || []).slice(0, 8).map((p, idx) => (
            <ScrollReveal key={p.id} delay={(idx % 4) * 100} className="h-full" animation="scale-up">
            <Link to={`/product/${p.id}`} className="product-card block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#d07e20]/30 transition-all cursor-pointer group h-full flex flex-col">
              <div className="relative bg-gray-50 overflow-hidden" style={{ height: 'clamp(140px, 18vw, 220px)' }}>
                <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 bg-[#d07e20] text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-md">{p.tag}</div>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                  <Heart size={14} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[9px] font-bold text-gray-700">{p.badge}</span>
                </div>
              </div>
              <div className="p-2.5 md:p-4 flex flex-col flex-1">
                <p className="text-[10px] md:text-xs text-[#d07e20] font-semibold uppercase tracking-wide">{p.brand}</p>
                <p className="text-gray-800 text-xs md:text-sm font-bold leading-tight mt-0.5 line-clamp-2">{p.name}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex items-center bg-green-600 rounded px-1 py-0.5 gap-0.5">
                    <Star size={8} className="text-white fill-white" />
                    <span className="text-white text-[9px] font-bold">{p.rating}</span>
                  </div>
                  <span className="text-gray-400 text-[9px] md:text-xs">({p.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-gray-900 font-black text-sm md:text-base">₹{p.price}</span>
                  <span className="text-gray-400 text-[10px] md:text-xs line-through">₹{p.mrp}</span>
                </div>
                <div className="mt-auto pt-2">
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                    className={`mt-2 w-full text-[11px] md:text-xs font-bold py-1.5 md:py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${isInCart(p.id) ? 'bg-green-600 text-white' : 'bg-[#d07e20] text-white hover:bg-[#E06900]'}`}>
                    <ShoppingBag size={11} />
                    {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ── TRUST BAR ── */
function TrustBar() {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹499', color: '#d07e20' },
          { icon: Shield, label: 'Easy Returns', sub: 'Hassle-free returns', color: '#10B981' },
          { icon: Award, label: 'Trusted Brand', sub: '10+ years, 100+ stores', color: '#6366F1' },
          { icon: Zap, label: 'Secure Payment', sub: '100% safe & encrypted', color: '#F59E0B' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <ScrollReveal key={item.label} delay={idx * 100} className="h-full">
            <div className="group flex items-center gap-4 bg-gradient-to-br from-[#2a1608] to-[#120803] rounded-3xl p-4 md:p-6 border border-white/10 hover:border-[#d07e20]/50 hover:-translate-y-1 transition-all duration-300 shadow-xl relative overflow-hidden h-full">
              <div className="absolute -top-10 -right-10 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity blur-3xl rounded-full" style={{ backgroundColor: item.color }} />
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 z-10 bg-black/40 backdrop-blur-md">
                <Icon size={24} style={{ color: item.color }} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_currentColor]" />
              </div>
              <div className="z-10">
                <p className="text-white font-black text-sm md:text-base tracking-wide">{item.label}</p>
                <p className="text-orange-200/60 text-[11px] md:text-sm mt-1 font-medium">{item.sub}</p>
              </div>
            </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ── DESKTOP FOOTER ── */
function Footer() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};

  return (
    <footer className="relative bg-[#0a0502] text-white mt-12 overflow-hidden border-t border-white/5 pb-20 md:pb-0">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d07e20]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5c3110]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-2xl flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(208,126,32,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{settings.logoChar || 'P'}</div>
              <div>
                <p className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-[#d07e20]">{settings.storeName || 'Prime Pets'}</p>
                <p className="text-orange-200/50 text-[10px] tracking-[0.3em] uppercase mt-0.5">{settings.tagline || 'Universe'}</p>
              </div>
            </div>
            <p className="text-orange-100/70 text-sm leading-relaxed mb-6 pr-4">{settings.footerDescription}</p>
            <div className="flex items-center gap-3">
              {[
                { name: 'Facebook', url: settings.facebookUrl, color: '#1877F2', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> },
                { name: 'Instagram', url: settings.instagramUrl, color: '#E1306C', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: 'YouTube', url: settings.youtubeUrl, color: '#FF0000', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg> },
                { name: 'WhatsApp', url: `https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`, color: '#25D366', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> },
              ].map(social => (
                <a
                  key={social.name}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group"
                  style={{ '--hover-color': social.color }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.backgroundColor = `${social.color}20`;
                    e.currentTarget.style.boxShadow = `0 0 15px ${social.color}60`;
                    e.currentTarget.style.color = social.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = 'inherit';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-black text-base uppercase tracking-wider text-white mb-6">Quick Links</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop by Category', path: '/category' },
                { label: 'Offer Zone', path: '/offers' },
                { label: 'About Us', path: '/about-us' }
              ].map(l => (
                <button key={l.label} onClick={() => navigate(l.path)} className="group flex items-center gap-2 text-orange-100/70 text-sm hover:text-white transition-colors text-left w-max">
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#d07e20]">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{l.label}</span>
                </button>
              ))}
              <button onClick={() => navigate('/admin')} className="group flex items-center gap-2 text-[#d07e20] text-sm hover:text-white transition-colors text-left font-bold mt-2 w-max">
                <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">→</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">Admin Panel ⚙️</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="font-black text-base uppercase tracking-wider text-white mb-6">Top Categories</p>
            <div className="flex flex-col gap-3">
              {['Dog Food', 'Cat Food', 'Dog Treats', 'Cat Treats', 'Grooming', 'Accessories'].map(l => (
                <button key={l} onClick={() => navigate('/category', { state: { category: l } })} className="group flex items-center gap-2 text-orange-100/70 text-sm hover:text-white transition-colors text-left w-max">
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#d07e20]">→</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-black text-base uppercase tracking-wider text-white mb-6">Get in Touch</p>
            <div className="flex flex-col gap-3 text-orange-100/70 text-sm">
              {(settings.contactPhone) && (
                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><span className="text-xl">📞</span> {settings.contactPhone}</a>
              )}
              {(settings.contactEmail) && (
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer"><span className="text-xl">✉️</span> {settings.contactEmail}</a>
              )}
              {(!settings.contactPhone && !settings.contactEmail) && (
                <p className="flex items-center gap-3"><span className="text-xl">📞</span> Contact via WhatsApp</p>
              )}
            </div>
            <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <p className="text-xs text-white font-bold mb-3 uppercase tracking-wider">Join the Pack</p>
              <div className="flex gap-2 relative z-10">
                <input placeholder="your@email.com" className="flex-1 bg-black/40 border border-white/10 focus:border-[#d07e20] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors" />
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="bg-gradient-to-r from-[#d07e20] to-[#9a5a15] text-white text-sm font-bold px-4 py-2 rounded-xl hover:shadow-[0_0_15px_rgba(208,126,32,0.6)] hover:scale-105 transition-all">Go</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-center md:text-left">
          <p className="text-orange-200/50 text-xs font-medium tracking-wide">© 2026 {settings.storeName} {settings.tagline}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
            {[
              { label: 'Privacy Policy', path: '/privacy-policy' },
              { label: 'Terms of Use',   path: '/terms-of-use' },
              { label: 'Return Policy',  path: '/return-policy' },
              { label: 'Sitemap',        path: '/sitemap' },
            ].map(l => (
              <button key={l.label} onClick={() => navigate(l.path)} className="text-orange-200/50 text-xs hover:text-[#d07e20] transition-colors">{l.label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── HOME PAGE ── */
export default function HomePage() {
  const { slides, products, deals, categories, banners, frontendSettings } = useData();
  const navigate = useNavigate();

  const announcementRaw = frontendSettings?.announcementText || '[zap] [yellow]Up to 60% Off[/yellow] – Limited Time! | [yellow]FREE DELIVERY[/yellow] on orders above ₹499 | Use code: [orange]PAWDAY30[/orange] | 100+ Stores across India 🐾';
  const announcementItems = announcementRaw.split('|').map(s => s.trim()).filter(Boolean);

  const parseAnnouncementItem = (text) => {
    let remainingText = text;
    let hasZap = false;
    
    if (remainingText.includes('[zap]')) {
      hasZap = true;
      remainingText = remainingText.replace('[zap]', '').trim();
    }
    
    const regex = /(\[yellow\][\s\S]*?\[\/yellow\]|\[orange\][\s\S]*?\[\/orange\]|\*\*[\s\S]*?\*\*)/g;
    const splitParts = remainingText.split(regex);
    
    return (
      <span className="inline-flex items-center gap-2">
        {hasZap && <Zap size={12} className="text-yellow-400" />}
        {splitParts.map((part, i) => {
          if (part.startsWith('[yellow]') && part.endsWith('[/yellow]')) {
            return <span key={i} className="text-yellow-300 font-bold">{part.slice(8, -9)}</span>;
          }
          if (part.startsWith('[orange]') && part.endsWith('[/orange]')) {
            return <span key={i} className="text-orange-300 font-bold">{part.slice(8, -9)}</span>;
          }
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Announcement marquee */}
      <div className="bg-[#5c3110] py-2 overflow-hidden">
        <div className="marquee-inner flex items-center gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(3)].map((_, r) => (
            <React.Fragment key={r}>
              {announcementItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-white text-xs font-semibold">
                    {parseAnnouncementItem(item)}
                  </span>
                  <span className="text-white/40">•</span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Header />

      <main className="relative z-0 pt-4">
        <ScrollReveal delay={0}><HeroCarousel /></ScrollReveal>
        <ScrollReveal delay={100}><QuickCategories /></ScrollReveal>
        <ScrollReveal delay={100}><DealsSection /></ScrollReveal>

        <ScrollReveal delay={100}><FeaturedProducts /></ScrollReveal>

        {/* Rewards Banner (GenZ / Rich Live Background) */}
        <ScrollReveal delay={100}>
        <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6 md:mb-10">
          <div className="relative rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 bg-[#0a0510]">
            
            {/* Live animated background elements - hidden on mobile for performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
              <div className="absolute top-[-30%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'blob-float 15s infinite alternate ease-in-out' }} />
              <div className="absolute bottom-[-30%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#d07e20]/30 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'blob-float 12s infinite alternate-reverse ease-in-out' }} />
              <div className="absolute top-[20%] left-[40%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-blue-600/20 rounded-full blur-[90px] mix-blend-screen" style={{ animation: 'blob-float 18s infinite alternate ease-in-out' }} />
            </div>

            <div className="relative z-10 text-center md:text-left md:w-2/3">
              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400 text-xs md:text-sm font-black uppercase tracking-[0.2em]">Exclusive Members</p>
              </div>
              <h2 className="text-white font-black text-2xl sm:text-3xl md:text-6xl leading-[1.1] tracking-tight drop-shadow-lg mb-4">
                Prime Pets <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d07e20] to-purple-500">Rewards</span> 🚀
              </h2>
              <p className="text-gray-300 text-base md:text-lg mt-2 max-w-xl font-medium leading-relaxed">Earn points on every purchase, redeem for exclusive drops and discounts. The more you buy, the more you save!</p>
              
              <div className="flex flex-wrap gap-2 md:gap-3 mt-6 justify-center md:justify-start">
                {['🏅 Bronze', '🥈 Silver', '🥇 Gold', '💎 Platinum'].map(t => (
                  <span key={t} className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-200 text-xs md:text-sm px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-white/10 transition-colors cursor-default">{t}</span>
                ))}
              </div>
              
              <button onClick={() => navigate('/account')}
                className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#d07e20] to-purple-600 text-white font-black text-sm md:text-base px-8 py-4 rounded-full shadow-[0_0_30px_rgba(208,126,32,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 btn-interactive">
                <Gift size={20} /> Join Free – Get 100 Points
              </button>
            </div>
            
            <div className="relative z-10 flex-shrink-0 mt-8 md:mt-0 group cursor-pointer">
              <div className="w-32 h-32 md:w-56 md:h-56 bg-white/5 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-500">
                <Gift size={64} className="text-yellow-400 md:w-28 md:h-28 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-sm md:text-lg font-black px-4 md:px-5 py-2 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                1240 pts
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>



        <ScrollReveal delay={100}><TrustBar /></ScrollReveal>
      </main>

      <Footer />

      {/* Mobile spacer for bottom nav + safe area */}
      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
