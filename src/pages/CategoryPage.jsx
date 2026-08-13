import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingBag, Heart, ChevronRight, ArrowRight, LayoutGrid, List } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { ProductCardSkeleton } from '../components/Skeleton';


export default function CategoryPage() {
  const location = useLocation();
  const [activePet, setActivePet] = useState(location.state?.pet || 'All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Popular');

  React.useEffect(() => {
    if (location.state) {
      if (location.state.category !== undefined) setActiveCategory(location.state.category || 'All');
      if (location.state.pet !== undefined) setActivePet(location.state.pet || 'All');
      // Reset other filters when navigating from elsewhere
      setActiveBrand('All');
      setActivePrice('All');
      if (location.state.searchQuery !== undefined) {
        setSearchQuery(location.state.searchQuery);
      } else if (location.state.category || location.state.pet) {
        setSearchQuery('');
      }
    }
  }, [location.state]);
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();
  const { categories: ALL_CATEGORIES, products: PRODUCTS, loading } = useData();
  const PET_TABS = ['All', 'Dogs', 'Cats', 'Small Pets', 'Birds'];

  const BRANDS = ['All', ...new Set((PRODUCTS || []).map(p => p.brand).filter(Boolean))];

  // Filtering
  let filteredProducts = [...PRODUCTS];
  if (searchQuery.trim() !== '') {
    const fuse = new Fuse(filteredProducts, {
      keys: ['name', 'brand', 'category', 'tag'],
      threshold: 0.4,
      distance: 100,
    });
    filteredProducts = fuse.search(searchQuery).map(result => result.item);
  }

  if (activePet !== 'All') {
    const petQuery = activePet === 'Dogs' ? 'dog' : 
                     activePet === 'Cats' ? 'cat' : 
                     activePet === 'Small Pets' ? 'small' : 
                     activePet === 'Birds' ? 'bird' : '';
    if (petQuery) {
      filteredProducts = filteredProducts.filter(p => 
        (p.petType && p.petType === activePet) || 
        p.name.toLowerCase().includes(petQuery)
      );
    }
  }

  if (activeBrand !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.brand === activeBrand);
  }

  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (activePrice === 'Under ₹500') {
    filteredProducts = filteredProducts.filter(p => p.price < 500);
  } else if (activePrice === '₹500 – ₹1000') {
    filteredProducts = filteredProducts.filter(p => p.price >= 500 && p.price <= 1000);
  } else if (activePrice === '₹1000 – ₹2000') {
    filteredProducts = filteredProducts.filter(p => p.price > 1000 && p.price <= 2000);
  } else if (activePrice === 'Above ₹2000') {
    filteredProducts = filteredProducts.filter(p => p.price > 2000);
  }
  
  // Sorting
  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pb-24 md:pb-8">
        {/* Page hero */}
        <ScrollReveal>
        <div className="bg-gradient-to-r from-[#d07e20] to-[#FF9A3C]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <h1 className="text-white font-black text-xl md:text-3xl lg:text-4xl">Shop by Category</h1>
            <p className="text-orange-100 text-sm md:text-base mt-1">Explore 500+ products for your beloved pets</p>
            <div className="flex items-center gap-2 mt-3 md:mt-4 max-w-xl">
              <div className="flex-1 flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 gap-2">
                <Search size={15} className="text-white flex-shrink-0" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories, brands, products..." 
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/60 outline-none" 
                />
              </div>
              <button onClick={(e) => { e.preventDefault(); }} className="bg-white text-[#d07e20] text-sm font-bold px-4 py-2 rounded-xl hover:shadow-md transition-all">Search</button>
            </div>
          </div>
        </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Desktop: sidebar + products | Mobile: stacked */}
          <div className="flex gap-6 mt-6">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:block w-60 flex-shrink-0 desktop-sidebar">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Pet type */}
                <div className="p-4 border-b border-gray-50">
                  <p className="text-gray-700 font-bold text-sm mb-3">Pet Type</p>
                  {PET_TABS.map(t => (
                    <button key={t} onClick={() => setActivePet(t)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all mb-1 ${activePet === t ? 'bg-[#d07e20] text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-[#d07e20]'}`}>
                      {t === 'Dogs' ? '🐕' : t === 'Cats' ? '🐈' : t === 'Small Pets' ? '🐹' : t === 'Birds' ? '🐦' : '🐾'} {t}
                    </button>
                  ))}
                </div>

                {/* Brands */}
                <div className="p-4 border-b border-gray-50">
                  <p className="text-gray-700 font-bold text-sm mb-3">Brand</p>
                  {BRANDS.filter(b => b !== 'All').map(b => (
                    <label key={b} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                      <input type="checkbox" checked={activeBrand === b} onChange={() => setActiveBrand(activeBrand === b ? 'All' : b)}
                        className="w-4 h-4 accent-orange-500 rounded" />
                      <span className="text-sm text-gray-600 group-hover:text-[#d07e20] transition-colors">{b}</span>
                    </label>
                  ))}
                </div>

                {/* Price */}
                <div className="p-4">
                  <p className="text-gray-700 font-bold text-sm mb-3">Price Range</p>
                  {['All', 'Under ₹500', '₹500 – ₹1000', '₹1000 – ₹2000', 'Above ₹2000'].map(r => (
                    <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                      <input type="radio" name="price" checked={activePrice === r} onChange={() => setActivePrice(r)} className="w-4 h-4 accent-orange-500" />
                      <span className="text-sm text-gray-600 group-hover:text-[#d07e20] transition-colors">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-w-0">
              {/* Mobile tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4 lg:hidden">
                {PET_TABS.map(t => (
                  <button key={t} onClick={() => setActivePet(t)}
                    className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${activePet === t ? 'bg-[#d07e20] text-white border-[#d07e20]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#d07e20]'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Brand pills */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
                {BRANDS.map(b => (
                  <button key={b} onClick={() => setActiveBrand(b)}
                    className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${activeBrand === b ? 'bg-[#5c3110] text-white border-[#5c3110]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5c3110]'}`}>
                    {b}
                  </button>
                ))}
              </div>

              {/* Category emoji grid — 4-col mobile, 8-col md */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-800 font-bold text-sm">All Categories</p>
                  {activeCategory !== 'All' && (
                    <button onClick={() => setActiveCategory('All')} className="text-xs text-orange-500 font-bold hover:underline">Clear</button>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {ALL_CATEGORIES.map((cat, i) => (
                    <ScrollReveal key={cat.label || i} delay={(i % 8) * 50} className="h-full">
                    <button onClick={() => setActiveCategory(cat.label)}
                      className={`w-full h-full flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all group ${activeCategory === cat.label ? 'shadow-md border-[#d07e20] ring-2 ring-orange-500/20' : 'hover:border-[#d07e20] hover:shadow-md'}`}
                      style={{ backgroundColor: cat.bg || cat.color || '#fdf7f1', borderColor: activeCategory === cat.label ? '#d07e20' : (cat.bg || cat.border || '#e6c8a8') }}>
                      <div className="text-xl md:text-2xl">{cat.emoji}</div>
                      <p className="text-[8px] md:text-[9px] font-bold text-gray-700 text-center leading-tight group-hover:text-[#d07e20] line-clamp-2">{cat.label}</p>
                    </button>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
                <p className="text-gray-500 text-xs md:text-sm font-medium">{filteredProducts.length} products found</p>
                <div className="flex items-center gap-2">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-xs md:text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#d07e20]">
                    {['Popular', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#d07e20] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <LayoutGrid size={15} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-[#d07e20] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product grid: 2-col mobile → 3-col md → 4-col lg */}
              {loading && PRODUCTS.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-5xl mb-4">🐾</p>
                  <p className="text-gray-500 font-semibold">No products found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'
                  : 'flex flex-col gap-3'}>
                  {filteredProducts.map((p, idx) => (
                    <ScrollReveal key={p.id} delay={(idx % 8) * 100} className="h-full">
                    {viewMode === 'grid' ? (
                      <Link to={`/product/${p.id}`} className="product-card block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer group h-full flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-[#d07e20]/30 transition-all">
                        <div className="relative bg-gray-50 overflow-hidden flex-shrink-0" style={{ height: 160 }}>
                          <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 left-2 bg-[#d07e20] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">{p.tag}</div>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                            <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-0.5">
                            <span className="text-[9px] font-bold text-gray-700">{p.badge}</span>
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-[10px] text-[#d07e20] font-semibold uppercase">{p.brand}</p>
                          <p className="text-gray-800 text-xs font-bold leading-tight mt-0.5 line-clamp-2">{p.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex items-center bg-green-600 rounded px-1 py-0.5 gap-0.5">
                              <Star size={8} className="text-white fill-white" />
                              <span className="text-white text-[9px] font-bold">{p.rating}</span>
                            </div>
                            <span className="text-gray-400 text-[9px]">({p.reviews.toLocaleString()})</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-gray-900 font-black text-sm">₹{p.price}</span>
                            <span className="text-gray-400 text-[10px] line-through">₹{p.mrp}</span>
                          </div>
                          <div className="mt-auto pt-2">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                              className={`w-full text-[11px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all ${isInCart(p.id) ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-[#d07e20] text-white hover:bg-[#E06900] shadow-orange-500/20 hover:shadow-orange-500/40'}`}>
                              <ShoppingBag size={11} />
                              {isInCart(p.id) ? 'Added ✓' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    ) : (
                    // List view
                      <Link to={`/product/${p.id}`} className="product-card block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer flex items-center gap-4 p-3 md:p-4 h-full hover:shadow-xl hover:-translate-y-1 hover:border-[#d07e20]/30 transition-all">
                        <div className="relative bg-gray-50 rounded-xl overflow-hidden flex-shrink-0" style={{ width: 90, height: 90 }}>
                          <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-[#d07e20] text-white text-[8px] font-black px-1 py-0.5 rounded">{p.tag}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#d07e20] font-semibold uppercase">{p.brand}</p>
                          <p className="text-gray-800 text-sm font-bold leading-tight line-clamp-1">{p.name}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">{p.badge}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-gray-900 font-black text-base">₹{p.price}</span>
                            <span className="text-gray-400 text-xs line-through">₹{p.mrp}</span>
                            <div className="flex items-center bg-green-600 rounded px-1.5 py-0.5 gap-0.5 ml-1">
                              <Star size={9} className="text-white fill-white" />
                              <span className="text-white text-[10px] font-bold">{p.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }} className="bg-white border border-gray-200 rounded-xl p-2 hover:border-red-200 transition-colors">
                            <Heart size={15} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                          </button>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                            className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all ${isInCart(p.id) ? 'bg-green-600 text-white' : 'bg-[#d07e20] text-white'}`}>
                            <ShoppingBag size={12} />
                            {isInCart(p.id) ? '✓' : 'Add'}
                          </button>
                        </div>
                      </Link>
                    )}
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="h-20 md:hidden" />
    </div>
  );
}
