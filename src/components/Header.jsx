import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, Menu, X, ChevronDown,
  MapPin, Phone, User, Tag, BookOpen, Grid3X3, Home
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Fuse from 'fuse.js';

const NAV_LINKS = [
  { label: 'Home',      path: '/' },
  { label: 'Shop',      path: '/category', hasDropdown: true },
  { label: 'Offer Zone',path: '/offers' },
  { label: 'Prime Pets Hub',  path: '/hub' },
  { label: 'Account',   path: '/account' },
];

const SHOP_DROPS = [
  { label: '🐕 Dogs',     sub: 'Food, Treats, Toys & More' },
  { label: '🐈 Cats',     sub: 'Food, Litter, Accessories' },
  { label: '🐹 Small Pets',sub: 'Hamsters, Rabbits & More' },
  { label: '🐦 Birds',    sub: 'Feed, Cages & Accessories' },
  { label: '🐟 Fish',     sub: 'Tanks, Food & Decor' },
  { label: '✂️ Grooming', sub: 'Tools, Shampoos & Spa' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistItems, setCartOpen } = useCart();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { products, frontendSettings } = useData();
  const settings = frontendSettings || {};
  const wishlistCount = wishlistItems.length;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen,       setShopOpen]       = useState(false);
  const [query,          setQuery]          = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = React.useMemo(() => {
    if (!query.trim() || !products) return [];
    const fuse = new Fuse(products, {
      keys: ['name', 'brand', 'category'],
      threshold: 0.4,
      distance: 100
    });
    return fuse.search(query).slice(0, 5).map(r => r.item);
  }, [query, products]);
  
  const handleSearch = () => {
    if (query.trim()) {
      navigate('/category', { state: { searchQuery: query } });
      setMobileMenuOpen(false);
      setShopOpen(false);
      setShowSuggestions(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── UTILITY BAR (desktop) ── */}
      <div className="hidden md:block bg-[#5c3110] text-white text-xs">
        <div className="max-w-[1600px] mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-orange-200">
            <span className="flex items-center gap-1.5"><Phone size={11} /> 1800-123-{settings.storeName || 'Prime Pets'}</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> 100+ Stores across India</span>
          </div>
          <div className="flex items-center gap-4 text-orange-200">
            <span>🚚 Free Delivery above ₹499</span>
            <span>|</span>
            <span>↩️ 7-day Easy Returns</span>
            <span>|</span>
            <button onClick={() => navigate('/offers')} className="text-yellow-300 font-semibold hover:text-white transition-colors">
              🏷️ Today's Deals
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center gap-4">

          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex-shrink-0 flex items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden shimmer-loop rounded-full border border-gray-100 shadow-sm p-1">
              <img src={settings.logoBase64 || "/MA_logo.png"} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none text-left hidden sm:flex">
              <span className="text-[#d07e20] font-black text-base md:text-xl tracking-tight">{settings.storeName || 'Prime Pets'}</span>
              <span className="text-[8px] md:text-[10px] text-gray-400 font-medium tracking-widest uppercase">{settings.tagline || 'Premium Store'}</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => !link.hasDropdown && navigate(link.path)}
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                  className={`desk-nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-[#d07e20] active'
                      : 'text-gray-600 hover:text-[#d07e20] hover:bg-orange-50'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60" />}
                </button>

                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                    className={`absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                      shopOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="p-2">
                      {SHOP_DROPS.map(d => (
                        <button
                          key={d.label}
                          onClick={() => { navigate('/category', { state: { pet: d.label.split(' ').slice(1).join(' ') } }); setShopOpen(false); }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-left group"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{d.label.split(' ')[0]}</span>
                          <div>
                            <p className="text-gray-800 font-semibold text-sm group-hover:text-[#d07e20] transition-colors">
                              {d.label.substring(d.label.indexOf(' ') + 1)}
                            </p>
                            <p className="text-gray-400 text-xs">{d.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="bg-orange-50 px-4 py-2.5 border-t border-orange-100">
                      <button onClick={() => { navigate('/category'); setShopOpen(false); }}
                        className="text-[#d07e20] text-xs font-bold hover:underline">
                        View All Categories →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search bar */}
          <div className="flex-1 min-w-0 max-w-xs md:max-w-lg lg:max-w-xl">
            <div className="search-bar relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 transition-all duration-200">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search for 'Wet Food', 'Dog Toys'..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0 font-medium"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-gray-400 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
              <button onClick={handleSearch} className="hidden md:flex items-center gap-1.5 bg-[#d07e20] rounded-lg px-3 py-1 flex-shrink-0">
                <Search size={13} className="text-white" />
                <span className="text-white text-xs font-semibold">Search</span>
              </button>
              <button onClick={handleSearch} className="md:hidden bg-[#d07e20] rounded-lg p-1.5 flex-shrink-0">
                <Search size={14} className="text-white" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && query.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setShowSuggestions(false);
                            setQuery('');
                          }}
                        >
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-md flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 truncate">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No results found for "{query}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Find Store (desktop) */}
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              <MapPin size={18} className="text-[#d07e20]" />
              <span className="text-xs font-semibold text-gray-600">Find Store</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/account')}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-gray-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart — opens drawer */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={22} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d07e20] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center badge-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Sign In (desktop) */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="hidden md:flex items-center gap-2 ml-1 px-3 py-2 bg-[#d07e20]/10 hover:bg-[#d07e20]/20 text-[#d07e20] rounded-xl transition-colors"
              >
                <User size={16} />
                <span className="text-sm font-semibold">{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 ml-1 px-3 py-2 bg-[#d07e20] hover:bg-[#E06900] text-white rounded-xl transition-colors"
              >
                <User size={16} />
                <span className="text-sm font-semibold">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop category strip */}
        <div className="hidden md:block border-t border-gray-50 bg-white">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
              {[
                { label: '🐕 Dog Food', category: 'Dog Food' },
                { label: '🐈 Cat Food', category: 'Cat Food' },
                { label: '🦴 Dog Treats', category: 'Dog Treats' },
                { label: '🐟 Cat Treats', category: 'Cat Treats' },
                { label: '✂️ Grooming', category: 'Grooming' },
                { label: '🎾 Toys', category: 'Dog Toys' },
                { label: '🛏️ Beds', category: 'Pet Beds' },
                { label: '💊 Health', category: 'Health' },
                { label: '🌧️ Monsoon Wear', category: 'Monsoon Wear' },
                { label: '🏠 Accessories', category: 'Leashes' },
              ].map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => navigate('/category', { state: { category: item.category } })}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                    i === 0
                      ? 'bg-[#d07e20] text-white border-[#d07e20]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#d07e20] hover:text-[#d07e20] hover:bg-orange-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile category pills */}
        <div className="md:hidden flex gap-2 px-4 pb-2 pt-2 overflow-x-auto scrollbar-hide border-t border-gray-50">
          {[
            { label: 'Dog', pet: 'Dogs' },
            { label: 'Cat', pet: 'Cats' },
            { label: 'Small Pet', pet: 'Small Pets' },
            { label: 'Bird', pet: 'Birds' },
            { label: 'Fish', pet: 'Fish' },
            { label: 'Offers', path: '/offers' }
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  navigate('/category', { state: { pet: item.pet } });
                }
              }}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                i === 0
                  ? 'bg-[#d07e20] text-white border-[#d07e20]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#d07e20] hover:text-[#d07e20]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

    </>
  );
}
