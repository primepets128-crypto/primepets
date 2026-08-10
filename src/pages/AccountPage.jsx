import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  User, Package, Heart, MapPin, CreditCard, Bell, Gift, HelpCircle,
  Shield, ChevronRight, Star, ShoppingBag, LogOut, Plus, Trash2, CheckCircle, Clock, Settings,
  PawPrint, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';

const MENU_ITEMS = [
  { icon: Package, label: 'My Orders', sub: '3 Active Orders', color: '#d07e20' },
  { icon: Heart, label: 'My Wishlist', sub: '12 items saved', color: '#EC4899' },
  { icon: MapPin, label: 'Saved Addresses', sub: '2 addresses', color: '#10B981' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'Cards & UPI', color: '#6366F1' },
  { icon: Bell, label: 'Notifications', sub: '5 new updates', color: '#F59E0B' },
  { icon: Gift, label: 'Rewards & Coupons', sub: '1,240 points • 3 coupons', color: '#EC4899' },
  { icon: HelpCircle, label: 'Help & Support', sub: 'Chat, Call or Email', color: '#0EA5E9' },
  { icon: Shield, label: 'Privacy & Security', sub: 'Manage your data', color: '#14B8A6' },
  { icon: Settings, label: 'Account Settings', sub: 'Preferences & profile', color: '#8B5CF6' },
];

const ORDERS = [];

const TABS = ['Profile', 'Orders', 'Wishlist', 'My Pets'];

function WalkingPaws() {
  const paws = [
    { id: 1, x: 15, y: 40, delay: 0, rotate: 10 },
    { id: 2, x: -10, y: 0, delay: 0.4, rotate: 12 },
    { id: 3, x: 25, y: -40, delay: 0.8, rotate: 8 },
    { id: 4, x: 0, y: -80, delay: 1.2, rotate: 10 },
    { id: 5, x: 35, y: -120, delay: 1.6, rotate: 12 },
    { id: 6, x: 10, y: -160, delay: 2.0, rotate: 8 },
  ];

  return (
    <div className="relative w-32 h-48 md:w-40 md:h-64 mr-8">
      {paws.map((paw) => (
        <motion.div
          key={paw.id}
          initial={{ opacity: 0, x: paw.x, y: paw.y, rotate: paw.rotate, scale: 0.9 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], scale: [0.9, 1, 1, 0.95] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: paw.delay,
            ease: "easeInOut",
            times: [0, 0.15, 0.7, 1]
          }}
          className="absolute bottom-10 left-8 text-white/50 drop-shadow-lg"
        >
          <PawPrint size={48} fill="currentColor" strokeWidth={0} />
        </motion.div>
      ))}
    </div>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [cartAdded, setCartAdded] = useState([]);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', type: 'Dog', breed: '', age: '', weight: '' });
  const [myPets, setMyPets] = useState(() => {
    const saved = localStorage.getItem('prime-pets-my-pets');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('prime-pets-my-pets', JSON.stringify(myPets));
  }, [myPets]);

  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    if (!newPet.name) return;
    
    const petColors = ['#fef3c7', '#d1fae5', '#e0e7ff', '#ffe4e6'];
    const randomColor = petColors[Math.floor(Math.random() * petColors.length)];
    const borderColors = {
      '#fef3c7': '#fde68a', '#d1fae5': '#a7f3d0', '#e0e7ff': '#c7d2fe', '#ffe4e6': '#fecdd3'
    };
    const emojis = { 'Dog': '🐶', 'Cat': '🐱', 'Bird': '🦜', 'Small Pet': '🐹' };

    const addedPet = {
      id: Date.now(),
      n: newPet.name,
      t: newPet.breed || newPet.type,
      e: emojis[newPet.type] || '🐾',
      age: newPet.age ? `${newPet.age} years` : '-',
      weight: newPet.weight ? `${newPet.weight} kg` : '-',
      diet: 'Standard',
      vaccine: 'Up to date',
      color: randomColor,
      border: borderColors[randomColor]
    };

    setMyPets([...myPets, addedPet]);
    setIsAddPetModalOpen(false);
    setNewPet({ name: '', type: 'Dog', breed: '', age: '', weight: '' });
    showToast('Pet added successfully! 🐾');
  };

  const { wishlistItems, removeFromWishlist, addToCart, isInCart, showToast } = useCart();
  const addToCartLocal = id => setCartAdded(p => p.includes(id) ? p : [...p, id]);

  /* ── GUEST VIEW ── */
  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pb-24 md:pb-8">

          {/* Hero */}
          <ScrollReveal>
          <div className="bg-gradient-to-br from-[#d07e20] via-[#FF8C00] to-[#a65d14]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-2">Welcome to Prime Pets</p>
                <h1 className="text-white font-black text-3xl md:text-4xl lg:text-5xl leading-tight">My Account</h1>
                <p className="text-orange-100 text-sm md:text-base mt-3 max-w-md">Sign in to access your orders, wishlist, rewards, and exclusive member benefits.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center md:justify-start">
                  <button onClick={() => navigate('/login')}
                    className="bg-white text-[#d07e20] font-bold text-sm px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    Sign In
                  </button>
                  <button onClick={() => navigate('/login')}
                    className="bg-white/20 border border-white/30 text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm">
                    Create Account
                  </button>
                </div>
              </div>
              <WalkingPaws />
            </div>
          </div>
          </ScrollReveal>

          {/* Perks */}
          <ScrollReveal delay={100}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <h2 className="text-gray-800 font-bold text-lg md:text-xl mb-6 text-center md:text-left">Why create an account?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { icon: Package, label: 'Track Orders', sub: 'Real-time updates on all orders', color: '#d07e20' },
                { icon: Heart, label: 'Save Wishlist', sub: 'Keep your favourites in one place', color: '#EC4899' },
                { icon: Gift, label: 'Earn Rewards', sub: 'Points on every purchase', color: '#F59E0B' },
                { icon: Star, label: 'Exclusive Offers', sub: 'Member-only discounts & deals', color: '#6366F1' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.label} delay={idx * 100}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${item.color}15` }}>
                      <Icon size={22} style={{ color: item.color }} />
                    </div>
                    <p className="text-gray-800 font-bold text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-snug">{item.sub}</p>
                  </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
          </ScrollReveal>
        </main>

        <div className="h-20 md:hidden" />
      </div>
    );
  }

  /* ── LOGGED-IN VIEW ── */
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-24 md:pb-8">

        {/* Profile banner */}
        <ScrollReveal>
        <div className="bg-gradient-to-r from-[#5c3110] to-[#8b4513] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative">
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <div className="relative flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt="User" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
                <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-full text-gray-900">🥇 GOLD</span>
              </div>
              <div className="flex-1">
                <h1 className="text-white font-black text-xl md:text-2xl">Hey, {user?.name?.split(' ')[0] || 'Guest'}! 🐾</h1>
                <p className="text-orange-200 text-xs md:text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[{ label: '0 pts', icon: '🏅' }, { label: '0 Orders', icon: '📦' }, { label: '₹0 Cashback', icon: '💰' }].map(s => (
                    <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <span className="text-sm">{s.icon}</span>
                      <span className="text-white text-xs font-bold">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 self-start md:self-auto">
                {isAdmin && (
                  <button onClick={() => navigate('/admin')} className="flex items-center gap-2 bg-[#d07e20] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors border border-orange-500 shadow-md">
                    ⚙️ Admin Panel
                  </button>
                )}
                <button onClick={() => logout()} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-8">

          {/* Desktop: sidebar + content | Mobile: tabs */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Tabs — mobile horizontal scroll, desktop sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Mobile tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 lg:hidden">
                {TABS.map((t, idx) => (
                  <ScrollReveal key={t} delay={idx * 50} className="flex-shrink-0">
                  <button onClick={() => setActiveTab(t)}
                    className={`w-full text-xs font-bold px-4 py-2 rounded-full border transition-all ${activeTab === t ? 'bg-[#5c3110] text-white border-[#5c3110]' : 'bg-white text-gray-600 border-gray-200'}`}>
                    {t}
                  </button>
                  </ScrollReveal>
                ))}
              </div>

              {/* Desktop sidebar menu */}
              <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-50">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Account Menu</p>
                </div>
                {[
                  { icon: User, label: 'Profile', id: 'Profile', color: '#6366F1' },
                  { icon: Package, label: 'My Orders', id: 'Orders', color: '#d07e20' },
                  { icon: Heart, label: 'Wishlist', id: 'Wishlist', color: '#EC4899' },
                  { icon: '🐾', label: 'My Pets', id: 'My Pets', color: '#10B981' },
                ].map((item, idx) => {
                  const Icon = typeof item.icon === 'string' ? null : item.icon;
                  return (
                    <ScrollReveal key={item.id} delay={idx * 50}>
                    <button onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${activeTab === item.id ? 'bg-orange-50 border-r-2 border-[#d07e20]' : 'hover:bg-gray-50'}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}>
                        {Icon ? <Icon size={15} style={{ color: item.color }} /> : <span>{item.icon}</span>}
                      </div>
                      <span className={`text-sm font-semibold ${activeTab === item.id ? 'text-[#d07e20]' : 'text-gray-600'}`}>{item.label}</span>
                      {activeTab === item.id && <ChevronRight size={14} className="ml-auto text-[#d07e20]" />}
                    </button>
                    </ScrollReveal>
                  );
                })}

                <div className="p-4 border-t border-gray-50">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">More</p>
                  {MENU_ITEMS.slice(4).map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <ScrollReveal key={item.label} delay={idx * 50}>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          setActiveTab(item.label); 
                        }} 
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors ${activeTab === item.label ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                      >
                        <Icon size={14} style={{ color: item.color }} />
                        <span className={`text-xs font-medium ${activeTab === item.label ? 'text-[#d07e20]' : 'text-gray-600'}`}>{item.label}</span>
                      </button>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">

              {/* ── PROFILE TAB ── */}
              {activeTab === 'Profile' && (
                <div className="space-y-4">
                  {/* Rewards card */}
                  <div className="bg-gradient-to-r from-[#5c3110] to-[#8b4513] rounded-2xl p-5 md:p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-orange-200 text-xs font-semibold uppercase tracking-wider">Prime Pets Rewards</p>
                        <p className="text-white font-black text-2xl md:text-3xl mt-1">0 pts</p>
                        <p className="text-orange-200 text-xs mt-0.5">= ₹0 discount available</p>
                      </div>
                      <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                        <Gift size={28} className="text-yellow-300" />
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-orange-200 text-xs">Progress to Silver</span>
                        <span className="text-white text-xs font-bold">0 / 500</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: '0%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[{ n: ORDERS.length, l: 'Total Orders', c: '#d07e20' }, { n: wishlistItems.length, l: 'Wishlist', c: '#EC4899' }, { n: '0', l: 'Coupons', c: '#10B981' }].map((s, idx) => (
                      <ScrollReveal key={s.l} delay={idx * 100}>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center h-full">
                        <p className="font-black text-2xl md:text-3xl" style={{ color: s.c }}>{s.n}</p>
                        <p className="text-gray-500 text-xs mt-1">{s.l}</p>
                      </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Menu grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:hidden gap-3">
                    {MENU_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <ScrollReveal key={item.label} delay={idx * 50} className="h-full">
                        <button onClick={() => showToast(`${item.label} coming soon!`)} className="w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-orange-200 transition-all flex flex-col">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5"
                            style={{ backgroundColor: `${item.color}15` }}>
                            <Icon size={18} style={{ color: item.color }} />
                          </div>
                          <p className="text-gray-800 font-bold text-xs mt-auto">{item.label}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{item.sub}</p>
                        </button>
                        </ScrollReveal>
                      );
                    })}
                  </div>

                  {/* My Pets */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-800 font-bold text-sm">🐾 My Pets</p>
                      <button onClick={() => setIsAddPetModalOpen(true)} className="flex items-center gap-1.5 text-[#d07e20] text-xs font-bold border border-[#d07e20] px-3 py-1 rounded-full hover:bg-[#d07e20] hover:text-white transition-all">
                        <Plus size={11} /> Add Pet
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {myPets.length === 0 ? (
                        <div className="w-full text-center py-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <p className="text-gray-500 text-xs">You have no pets added yet.</p>
                        </div>
                      ) : (
                        myPets.map((p, idx) => (
                          <ScrollReveal key={p.n} delay={idx * 100} className="flex-1">
                          <div className="h-full bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
                            <div className="text-4xl mb-2">{p.e}</div>
                            <p className="text-gray-800 font-bold text-sm">{p.n}</p>
                            <p className="text-gray-500 text-xs">{p.t}</p>
                            <p className="text-gray-400 text-[10px] mt-0.5">{p.age}</p>
                          </div>
                          </ScrollReveal>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ORDERS TAB ── */}
              {activeTab === 'Orders' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-gray-800 font-bold text-lg">My Orders</h2>
                    <span className="bg-orange-100 text-[#d07e20] text-xs font-bold px-3 py-1 rounded-full">{ORDERS.length} orders</span>
                  </div>
                  {ORDERS.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    ORDERS.map((o, idx) => (
                      <ScrollReveal key={o.id} delay={idx * 100}>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-orange-100 transition-all">
                        <img src={o.img} alt="Order" className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-gray-500 text-[10px] font-semibold uppercase">{o.id}</p>
                              <p className="text-gray-800 font-bold text-sm mt-0.5 line-clamp-1">{o.items}</p>
                              <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                                <Clock size={11} />
                                <span className="text-[10px]">{o.date}</span>
                              </div>
                            </div>
                            <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${o.statusColor}`}>
                              {o.status === 'Delivered' ? <><CheckCircle size={10} className="inline mr-0.5" />{o.status}</> : o.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                            <span className="text-gray-900 font-black text-sm">₹{o.amount}</span>
                            <div className="flex gap-2">
                              <button onClick={() => showToast('Invoice download coming soon!')} className="text-xs font-semibold text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-[#d07e20] hover:text-[#d07e20] transition-colors">Invoice</button>
                              {o.status === 'Delivered' && <button onClick={() => showToast('Reorder coming soon!')} className="text-xs font-semibold bg-[#d07e20] text-white px-2.5 py-1 rounded-lg hover:bg-orange-600 transition-colors">Reorder</button>}
                            </div>
                          </div>
                        </div>
                      </div>
                      </ScrollReveal>
                    ))
                  )}
                </div>
              )}

              {/* ── WISHLIST TAB ── */}
              {activeTab === 'Wishlist' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-gray-800 font-bold text-lg">My Wishlist</h2>
                    <span className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full">{wishlistItems.length} items</span>
                  </div>
                  {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="text-6xl mb-4">❤️</div>
                      <p className="text-gray-700 font-bold text-lg">Your wishlist is empty</p>
                      <p className="text-gray-400 text-sm mt-1">Heart products to save them here</p>
                    </div>
                  ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {wishlistItems.map((item, idx) => (
                      <ScrollReveal key={item.id} delay={idx * 100}>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <img src={item.img} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-bold text-xs md:text-sm leading-snug line-clamp-2">{item.name}</p>
                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-gray-900 font-black text-sm">₹{item.price}</span>
                            <span className="text-gray-400 text-[10px] line-through">₹{item.mrp}</span>
                            <span className="text-green-600 text-[10px] font-bold">{item.off}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => addToCart(item)}
                              className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all ${isInCart(item.id) ? 'bg-green-600 text-white' : 'bg-[#d07e20] text-white hover:bg-orange-600'}`}>
                              <ShoppingBag size={11} />
                              {isInCart(item.id) ? 'Added ✓' : 'Add to Cart'}
                            </button>
                            <button onClick={() => removeFromWishlist(item.id)} className="p-1.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors">
                              <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                      </ScrollReveal>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {/* ── MY PETS TAB ── */}
              {activeTab === 'My Pets' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-gray-800 font-bold text-lg">My Pets</h2>
                    <button onClick={() => setIsAddPetModalOpen(true)} className="flex items-center gap-1.5 text-[#d07e20] text-xs font-bold border border-[#d07e20] px-4 py-2 rounded-full hover:bg-[#d07e20] hover:text-white transition-all">
                      <Plus size={13} /> Add New Pet
                    </button>
                  </div>
                  {myPets.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-500 text-sm">You haven't added any pets yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myPets.map((p, idx) => (
                        <ScrollReveal key={p.id} delay={idx * 100} className="h-full">
                        <div className="rounded-2xl border overflow-hidden shadow-sm product-card h-full flex flex-col relative group" style={{ backgroundColor: p.color, borderColor: p.border }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setMyPets(myPets.filter(pet => pet.id !== p.id));
                              showToast('Pet removed.');
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-5xl">{p.e}</div>
                              <div>
                                <p className="text-gray-800 font-black text-xl">{p.n}</p>
                                <p className="text-gray-500 text-sm">{p.t}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {[
                                { label: 'Age', value: p.age },
                                { label: 'Weight', value: p.weight },
                                { label: 'Diet', value: p.diet },
                                { label: 'Vaccine', value: p.vaccine },
                              ].map(d => (
                                <div key={d.label} className="bg-white/60 rounded-xl p-2.5">
                                  <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">{d.label}</p>
                                  <p className="text-gray-700 text-xs font-bold mt-0.5">{d.value}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-auto">
                              <button onClick={() => navigate('/category')} className="w-full bg-white/70 hover:bg-white text-gray-700 text-xs font-bold py-2 rounded-xl border border-white/50 transition-all">
                                Shop for {p.n} →
                              </button>
                            </div>
                          </div>
                        </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── NOTIFICATIONS TAB ── */}
              {activeTab === 'Notifications' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-gray-800 font-bold text-lg">Notifications</h2>
                    <button className="text-xs text-[#d07e20] font-bold hover:underline">Mark all as read</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {[
                      { title: 'Order Shipped!', desc: 'Your order #ORD-8483 has been shipped and is on its way.', time: '2 hours ago', icon: Package, color: '#d07e20', unread: true },
                      { title: 'New Reward Unlocked', desc: 'You have reached Silver tier! Enjoy 5% off on your next purchase.', time: '1 day ago', icon: Gift, color: '#F59E0B', unread: true },
                      { title: 'Flash Sale: Dog Toys', desc: 'Get up to 50% off on all chew toys this weekend only.', time: '3 days ago', icon: Star, color: '#6366F1', unread: false },
                      { title: 'Welcome to Prime Pets!', desc: 'Thank you for joining. Set up your pet profiles to get started.', time: '1 week ago', icon: PawPrint, color: '#10B981', unread: false },
                    ].map((notif, idx) => {
                      const Icon = notif.icon;
                      return (
                        <div key={idx} className={`p-4 border-b border-gray-50 flex gap-4 ${notif.unread ? 'bg-orange-50/30' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${notif.color}15` }}>
                            <Icon size={18} style={{ color: notif.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm ${notif.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{notif.title}</h4>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
                          </div>
                          {notif.unread && <div className="w-2 h-2 rounded-full bg-[#d07e20] self-center"></div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── REWARDS & COUPONS TAB ── */}
              {activeTab === 'Rewards & Coupons' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-gray-800 font-bold text-lg mb-4">My Rewards</h2>
                    <div className="bg-gradient-to-br from-[#5c3110] via-[#8b4513] to-[#d07e20] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 opacity-20">
                        <Gift size={120} />
                      </div>
                      <div className="relative z-10">
                        <p className="text-orange-200 text-sm font-semibold uppercase tracking-widest mb-1">Total Points</p>
                        <h3 className="text-4xl font-black mb-1">1,240</h3>
                        <p className="text-orange-100 text-sm mb-6">Value: ₹124 (Redeemable on next order)</p>
                        
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm">Silver Tier</span>
                            <span className="text-xs">760 pts to Gold</span>
                          </div>
                          <div className="w-full bg-black/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-gray-800 font-bold text-lg mb-4">Available Coupons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { code: 'WELCOME10', desc: '10% off your first order', min: 'Min. spend ₹500', expires: 'Ends in 2 days', color: '#EC4899' },
                        { code: 'PETLOVE', desc: 'Flat ₹200 off on pet food', min: 'Min. spend ₹1499', expires: 'Ends in 5 days', color: '#10B981' },
                        { code: 'FREESHIP', desc: 'Free shipping on all items', min: 'No min. spend', expires: 'Ends in 1 week', color: '#6366F1' },
                      ].map((c, i) => (
                        <div key={i} className="bg-white rounded-2xl border-2 border-dashed p-5 relative overflow-hidden group" style={{ borderColor: `${c.color}40` }}>
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200"></div>
                          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200"></div>
                          
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-black text-lg tracking-wider" style={{ color: c.color }}>{c.code}</span>
                            <button className="text-xs font-bold px-3 py-1 rounded-lg border transition-colors hover:text-white" style={{ borderColor: c.color, color: c.color }} onMouseEnter={e => e.currentTarget.style.backgroundColor = c.color} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>COPY</button>
                          </div>
                          <p className="text-gray-800 font-bold text-sm mb-1">{c.desc}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                            <span>{c.min}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {c.expires}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── HELP & SUPPORT TAB ── */}
              {activeTab === 'Help & Support' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-gray-800 font-bold text-lg">Help & Support</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Chat with Us', desc: 'Get instant answers', icon: HelpCircle, color: '#0EA5E9' },
                      { title: 'Call Us', desc: '+91 1800-123-4567', icon: Bell, color: '#10B981' },
                      { title: 'Email', desc: 'support@primepets.com', icon: Package, color: '#F59E0B' },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
                          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}15` }}>
                            <Icon size={24} style={{ color: item.color }} />
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-bold text-gray-800">Frequently Asked Questions</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[
                        { q: 'How do I track my order?', a: 'You can track your order in the "My Orders" tab. Click on any order to see real-time status updates.' },
                        { q: 'What is the return policy?', a: 'We offer a 7-day no-questions-asked return policy for unused products in their original packaging.' },
                        { q: 'How are rewards points calculated?', a: 'You earn 1 point for every ₹1 spent. 10 points equals ₹1 in value for future purchases.' },
                      ].map((faq, idx) => (
                        <div key={idx} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                          <h4 className="font-semibold text-sm text-gray-800 mb-1">{faq.q}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRIVACY & SECURITY TAB ── */}
              {activeTab === 'Privacy & Security' && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-gray-800 font-bold text-lg mb-4">Privacy & Security</h2>
                  
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Account Security</h3>
                        <p className="text-xs text-gray-500">Manage your password and authentication</p>
                      </div>
                    </div>
                    <div className="space-y-3 pl-12 border-t border-gray-50 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Change Password</span>
                        <button className="text-xs font-bold text-[#d07e20] bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">Update</button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">Two-Factor Authentication</span>
                          <span className="text-[10px] text-gray-400">Add an extra layer of security</span>
                        </div>
                        <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <Settings size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Data Preferences</h3>
                        <p className="text-xs text-gray-500">Manage how we use your data</p>
                      </div>
                    </div>
                    <div className="space-y-4 pl-12 border-t border-gray-50 pt-4 mt-2">
                      {[
                        { label: 'Marketing Emails', desc: 'Receive offers, updates, and news' },
                        { label: 'Personalized Ads', desc: 'Allow us to show you relevant products' },
                        { label: 'Analytics Cookies', desc: 'Help us improve the app experience' },
                      ].map((pref, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">{pref.label}</span>
                            <span className="text-[10px] text-gray-400">{pref.desc}</span>
                          </div>
                          <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${idx === 0 ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${idx === 0 ? 'left-5' : 'left-1'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                     <button className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors border border-transparent hover:border-red-100">
                       Delete Account
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </main>

      <div className="h-20 md:hidden" />

      {/* Add Pet Modal */}
      {isAddPetModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                <PawPrint size={20} className="text-[#d07e20]" /> Add New Pet
              </h3>
              <button onClick={() => setIsAddPetModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddPetSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pet Name *</label>
                <input required type="text" placeholder="e.g. Max" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pet Type *</label>
                  <select required value={newPet.type} onChange={e => setNewPet({...newPet, type: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm">
                    <option value="Dog">Dog 🐶</option>
                    <option value="Cat">Cat 🐱</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Small Pet">Small Pet 🐹</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Breed / Specifics</label>
                  <input type="text" placeholder="e.g. Golden Retriever" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.1" placeholder="e.g. 2" value={newPet.age} onChange={e => setNewPet({...newPet, age: e.target.value})} className="w-full pr-12 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">YRS</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Weight</label>
                  <div className="relative">
                    <input type="number" min="0" step="0.1" placeholder="e.g. 15" value={newPet.weight} onChange={e => setNewPet({...newPet, weight: e.target.value})} className="w-full pr-12 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">KG</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-[#d07e20] text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                  Add to My Pets
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
