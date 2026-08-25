import React, { useState } from 'react';
import { Clock, Tag, Star, ShoppingBag, Heart, Flame, Zap, Copy, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

const DEFAULT_COUPONS = [
  { id: 1, title: 'PAWDAY SALE', sub: 'Up to 60% Off Sitewide', expiry: '2 Days Left', grad: 'from-[#d07e20] to-[#a65d14]', emoji: '🐾', code: 'PAWDAY60', isActive: true },
  { id: 2, title: 'MONSOON MANIA', sub: '35% Off Grooming & Wear', expiry: '5 Days Left', grad: 'from-[#0F9B8E] to-[#007CF0]', emoji: '🌧️', code: 'MONSOON35', isActive: true },
  { id: 3, title: 'FIRST ORDER', sub: 'Extra 15% Off for New Users', expiry: 'Ongoing', grad: 'from-[#6C3FC8] to-[#E040FB]', emoji: '🎁', code: 'NEWPET15', isActive: true },
  { id: 4, title: 'WEEKEND DEAL', sub: '20% Off All Accessories', expiry: '3 Days Left', grad: 'from-[#E91E63] to-[#9C27B0]', emoji: '🎀', code: 'WEEKEND20', isActive: true },
];

const FLASH_PRODUCTS = [
  { id: 1, name: 'Royal Canin 3kg', price: 1099, mrp: 1599, img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=250&h=250&fit=crop', rating: 4.5, off: '31% OFF', left: 12 },
  { id: 2, name: 'Whiskas Tuna 1.2kg', price: 449, mrp: 699, img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=250&h=250&fit=crop', rating: 4.3, off: '35% OFF', left: 7 },
  { id: 3, name: 'Pedigree Chicken 3kg', price: 749, mrp: 999, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=250&h=250&fit=crop', rating: 4.4, off: '25% OFF', left: 23 },
  { id: 4, name: 'Drools Adult 5kg', price: 999, mrp: 1399, img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=250&h=250&fit=crop', rating: 4.2, off: '28% OFF', left: 4 },
  { id: 5, name: 'Farmina Grain Free', price: 1799, mrp: 2799, img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=250&h=250&fit=crop', rating: 4.7, off: '35% OFF', left: 9 },
  { id: 6, name: "Hill's Science 1.5kg", price: 1299, mrp: 1999, img: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=250&h=250&fit=crop', rating: 4.6, off: '34% OFF', left: 15 },
];

const DEAL_CATEGORIES = [
  { id: 1, label: 'DOG FOOD', off: '30% OFF', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=260&fit=crop', grad: 'from-[#d07e20] to-[#a65d14]', bg: '#FFF4ED', border: '#e6c8a8', flash: true },
  { id: 2, label: 'CAT FOOD', off: '25% OFF', img: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=400&h=260&fit=crop', grad: 'from-[#9C27B0] to-[#6A1B9A]', bg: '#F9F0FF', border: '#DDB6FF', flash: false },
  { id: 3, label: 'GROOMING', off: '35% OFF', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=260&fit=crop', grad: 'from-[#0F9B8E] to-[#007CF0]', bg: '#E0F7FA', border: '#80DEEA', flash: true },
  { id: 4, label: 'DOG TREATS', off: '25% OFF', img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=260&fit=crop', grad: 'from-[#2196F3] to-[#0D47A1]', bg: '#EFF6FF', border: '#BFDBFE', flash: false },
  { id: 5, label: 'CAT TREATS', off: '20% OFF', img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=260&fit=crop', grad: 'from-[#4CAF50] to-[#1B5E20]', bg: '#F0FDF4', border: '#BBF7D0', flash: false },
  { id: 6, label: 'ACCESSORIES', off: '40% OFF', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=260&fit=crop', grad: 'from-[#F44336] to-[#B71C1C]', bg: '#FFF1F2', border: '#FECACA', flash: true },
];

function CouponCard({ item, delay }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(item.code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <ScrollReveal delay={delay} className="flex-shrink-0 md:flex-shrink min-w-[240px] h-full">
    <div className={`bg-gradient-to-r ${item.grad} rounded-2xl p-4 md:p-5 text-white relative overflow-hidden h-full flex flex-col`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
      <div className="text-3xl mb-2">{item.emoji}</div>
      <p className="font-black text-lg leading-tight">{item.title}</p>
      <p className="text-white/80 text-xs mt-0.5">{item.sub}</p>
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 bg-white/20 border border-white/30 border-dashed rounded-lg px-3 py-1.5 flex items-center justify-between">
          <span className="font-black text-sm tracking-widest">{item.code}</span>
          <button onClick={copy}>{copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} className="text-white/80" />}</button>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-auto pt-2">
        <Clock size={10} className="text-white/70" />
        <span className="text-white/70 text-[10px] font-medium">{item.expiry}</span>
      </div>
    </div>
    </ScrollReveal>
  );
}

export default function OffersPage() {
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();
  const { coupons: liveCoupons, dealCategories: liveDealCategories, products } = useData();

  // Use live coupons from admin if available (filtered to active only), otherwise fall back to defaults
  const activeCoupons = (liveCoupons && liveCoupons.length > 0)
    ? liveCoupons.filter(c => c.isActive)
    : DEFAULT_COUPONS;

  const activeDealCategories = (liveDealCategories && liveDealCategories.length > 0)
    ? liveDealCategories
    : DEAL_CATEGORIES;

  // Filter flash sale products from database dynamically
  const dbFlashProducts = (products && products.length > 0)
    ? products.filter(p => p.isFlashSale)
    : [];

  const flashSaleItems = dbFlashProducts.length > 0
    ? dbFlashProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        mrp: p.mrp,
        img: p.img,
        rating: p.rating,
        off: p.tag || `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF`,
        left: p.flashSaleLeft || 10
      }))
    : FLASH_PRODUCTS;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-24 md:pb-8">

        {/* Hero */}
        <ScrollReveal>
        <div className="bg-gradient-to-br from-[#b96c1a] via-[#d07e20] to-[#a65d14] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-16 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={20} className="text-yellow-300" />
                  <span className="text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-widest">Exclusive Offers</span>
                </div>
                <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">Offer Zone 🎉</h1>
                <p className="text-orange-100 text-sm md:text-base mt-2">Handpicked deals just for your pets. Save big every day!</p>
              </div>
              {/* Countdown */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 text-center">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5 justify-center">
                  <Zap size={13} className="text-yellow-300" /> Flash Sale ends in
                </p>
                <div className="flex items-center gap-2 justify-center">
                  {[{ val: '05', label: 'Hrs' }, { val: '47', label: 'Min' }, { val: '22', label: 'Sec' }].map(t => (
                    <React.Fragment key={t.label}>
                      <div className="text-center">
                        <div className="bg-white/20 text-white font-black text-2xl md:text-3xl px-4 py-2 rounded-xl min-w-[52px]">{t.val}</div>
                        <p className="text-white/60 text-[10px] mt-1">{t.label}</p>
                      </div>
                      {t.label !== 'Sec' && <span className="text-white font-black text-2xl -mt-5">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Coupons */}
          <ScrollReveal delay={100}>
          <section className="mt-8 md:mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#d07e20]" />
                <h2 className="text-gray-800 font-bold text-lg md:text-xl">Active Coupons</h2>
                <span className="bg-orange-100 text-[#d07e20] text-xs font-bold px-2 py-0.5 rounded-full">{activeCoupons.length} available</span>
              </div>
            </div>
            {/* Mobile: scroll | Desktop: grid */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 pb-2 md:pb-0">
              {activeCoupons.map((c, idx) => <CouponCard key={c.id} item={c} delay={idx * 100} />)}
            </div>
          </section>
          </ScrollReveal>

          {/* Flash Sale */}
          <ScrollReveal delay={100}>
          <section className="mt-8 md:mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#d07e20]" />
                <h2 className="text-gray-800 font-bold text-lg md:text-xl">⚡ Flash Sale</h2>
              </div>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="text-[#d07e20] text-sm font-bold flex items-center gap-1 hover:underline">See All <ArrowRight size={14} /></button>
            </div>
            {/* Mobile: scroll | Desktop: 3/6-col grid */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-6 pb-2 md:pb-0">
              {flashSaleItems.map((p, idx) => (
                <ScrollReveal key={p.id} delay={(idx % 6) * 100} className="flex-shrink-0 md:flex-shrink min-w-[148px] h-full">
                <Link to={`/product/${p.id}`} className="block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl product-card cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-all">
                  <div className="relative bg-gray-50 overflow-hidden flex-shrink-0" style={{ height: 130 }}>
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">{p.off}</span>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
                      <Heart size={12} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-[8px] font-bold text-center py-1">
                      Only {p.left} left!
                    </div>
                  </div>
                  <div className="p-2.5 flex flex-col flex-1">
                    <p className="text-gray-800 text-xs font-bold leading-tight line-clamp-2">{p.name}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-600 text-[10px] font-semibold">{p.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-gray-900 font-black text-sm">₹{p.price}</span>
                      <span className="text-gray-400 text-[9px] line-through">₹{p.mrp}</span>
                    </div>
                    <div className="mt-auto pt-2">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                        className={`w-full text-[10px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all ${isInCart(p.id) ? 'bg-green-600 text-white' : 'bg-[#d07e20] text-white hover:bg-[#E06900]'}`}>
                        {isInCart(p.id) ? '✓ Added' : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
          </ScrollReveal>

          {/* Deal categories */}
          <ScrollReveal delay={100}>
          <section className="mt-8 md:mt-10 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} className="text-[#d07e20]" />
              <h2 className="text-gray-800 font-bold text-lg md:text-xl">Deals by Category</h2>
            </div>
            {/* 2-col mobile → 3-col md → 6-col lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {activeDealCategories.map((d, idx) => (
                <ScrollReveal key={d.id} delay={(idx % 6) * 100} className="h-full">
                <div className="rounded-2xl overflow-hidden cursor-pointer product-card border h-full flex flex-col" style={{ backgroundColor: d.bg, borderColor: d.border }}>
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: 120 }}>
                    <MediaDisplay src={d.img} alt={d.label} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${d.grad} opacity-40`} />
                    {d.flash && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 rounded-full px-2 py-0.5">
                        <Zap size={8} className="text-white" />
                        <span className="text-white text-[8px] font-bold">FLASH</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 flex flex-col flex-1">
                    <p className={`font-black text-sm bg-clip-text text-transparent bg-gradient-to-r ${d.grad}`}>{d.off}</p>
                    <p className="text-gray-700 font-bold text-xs">{d.label}</p>
                    <div className="mt-auto pt-2">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className={`w-full bg-gradient-to-r ${d.grad} text-white text-[10px] font-bold py-1.5 rounded-xl`}>Shop Now →</button>
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
          </ScrollReveal>
        </div>
      </main>

      <div className="h-20 md:hidden" />
    </div>
  );
}
