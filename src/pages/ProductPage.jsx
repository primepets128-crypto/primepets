import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ChevronRight, Share2, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { trackFacebookEvent } from '../utils/metaPixel';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  
  const { user } = useAuth();
  const product = products.find(p => String(p.id) === String(id));
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      trackFacebookEvent('ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        content_type: 'product',
        value: product.price,
        currency: 'INR'
      }, user?.email);
    }
  }, [id, product, user]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
          <button onClick={() => navigate('/category')} className="bg-[#d07e20] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#b96c1a] transition-colors">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const gallery = [product.img, ...(product.images || [])];

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pb-24 md:pb-12 pt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Breadcrumbs */}
          <ScrollReveal>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/" className="hover:text-[#d07e20] transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/category" state={{ category: product.category }} className="hover:text-[#d07e20] transition-colors">{product.category}</Link>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-semibold truncate">{product.name}</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Image Gallery */}
            <ScrollReveal>
              <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 flex-shrink-0 hide-scrollbar">
                  {gallery.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-[#d07e20] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <MediaDisplay src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-gray-50" />
                    </button>
                  ))}
                </div>
                
                {/* Main Image */}
                <div className="flex-1 bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden relative aspect-square md:aspect-auto md:h-[500px]">
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm z-10">
                      {product.tag}
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 transition-all z-10"
                    onClick={() => toggleWishlist(product)}>
                    <Heart size={20} className={isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <MediaDisplay src={gallery[activeImage]} alt={product.name} className="w-full h-full object-contain p-8 mix-blend-multiply" />
                </div>
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <ScrollReveal delay={100}>
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="text-[#d07e20] font-semibold text-sm tracking-wider uppercase">{product.brand}</span>
                </div>
                <h1 className="text-xl md:text-4xl font-black text-gray-900 leading-tight mb-3 md:mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-700 text-sm">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-800 transition-colors">
                    {product.reviews} reviews
                  </span>
                </div>

                <div className="flex items-end gap-3 mb-5 md:mb-8">
                  <span className="text-2xl md:text-3xl font-black text-gray-900">₹{product.price}</span>
                  <span className="text-base md:text-lg text-gray-400 line-through font-medium mb-0.5">₹{product.mrp}</span>
                  {product.tag && <span className="ml-auto text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-lg">{product.tag}</span>}
                </div>

                {/* Dummy Variants / Quantity */}
                <div className="mb-8 border-t border-b border-gray-100 py-6">
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-gray-700">Quantity</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"><Minus size={16}/></button>
                      <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"><Plus size={16}/></button>
                    </div>
                  </div>
                </div>

                {/* Actions — visible on desktop, hidden on mobile (sticky bar used instead) */}
                <div className="hidden md:flex gap-3 mb-8">
                  <button 
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addToCart(product);
                    }}
                    className="flex-1 bg-white border-2 border-[#d07e20] text-[#d07e20] py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addToCart(product);
                      window.alert("Proceeding to checkout...");
                    }}
                    className="flex-1 bg-[#d07e20] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b96c1a] hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Value Props */}
                <div className="grid grid-cols-3 gap-4 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#d07e20]">
                      <Truck size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">Free Delivery<br/>over ₹999</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">100% Genuine<br/>Products</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <RotateCcw size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">7 Days<br/>Return Policy</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Details Tabs */}
          <ScrollReveal delay={200}>
            <div className="mt-16 pt-10 border-t border-gray-100">
              <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto hide-scrollbar">
                {['description', 'specifications', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-[#d07e20] text-[#d07e20]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p>Provide your beloved pet with the optimal nutrition they deserve. Formulated by veterinary experts, this premium product ensures a balanced diet packed with essential vitamins, minerals, and high-quality ingredients.</p>
                    <p>Designed specifically for {product.petType}, this product aids in better digestion, boosts immunity, and promotes a shiny, healthy coat. Your furry friend will love the taste, and you'll love the results!</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                      <li>100% natural ingredients with no artificial preservatives.</li>
                      <li>Rich in Omega 3 & 6 for optimal skin health.</li>
                      <li>Highly digestible formula tailored for daily consumption.</li>
                      <li>Recommended by top veterinarians worldwide.</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-800">Brand</span>
                      <span>{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-800">Category</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-800">Pet Type</span>
                      <span>{product.petType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-800">Life Stage</span>
                      <span>All Stages</span>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl font-black text-gray-900">{product.rating}</div>
                      <div>
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={16} className={i <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">Based on {product.reviews} reviews</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-gray-800">Rahul M.</span>
                          <span className="text-xs text-gray-400">2 days ago</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-sm">My pet absolutely loves this! The packaging was great and delivery was extremely fast. Will definitely order again.</p>
                      </div>
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-gray-800">Sneha K.</span>
                          <span className="text-xs text-gray-400">1 week ago</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                          <Star size={12} className="fill-gray-200 text-gray-200" />
                        </div>
                        <p className="text-sm">Good quality product, but the price is slightly on the higher side. Otherwise, no complaints.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <ScrollReveal delay={300}>
              <div className="mt-16 pt-10 border-t border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-8">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((p, idx) => (
                    <div key={idx} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer group">
                      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square mb-3">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <p className="text-xs font-bold text-[#d07e20] mb-1">{p.brand}</p>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#d07e20] transition-colors">{p.name}</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-gray-900">₹{p.price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </main>

      {/* Sticky Mobile ATC Bar — floats above the glass nav pill */}
      <div
        className="md:hidden fixed left-4 right-4 z-[70] bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.14)] flex flex-col gap-3 px-4 py-3 rounded-2xl"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs text-gray-500 truncate">{product.name}</p>
            <p className="font-black text-gray-900 text-lg leading-tight">₹{product.price} <span className="text-xs text-gray-400 line-through font-normal">₹{product.mrp}</span></p>
          </div>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0 h-10">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-500 active:bg-gray-100 transition-colors"><Minus size={14}/></button>
            <span className="w-8 text-center font-bold text-gray-800 text-sm">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-500 active:bg-gray-100 transition-colors"><Plus size={14}/></button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { for(let i=0; i<quantity; i++) addToCart(product); }}
            className="flex-1 bg-white text-[#d07e20] border border-[#d07e20] py-2.5 rounded-xl font-bold text-sm active:bg-orange-50 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
          <button
            onClick={() => { 
              for(let i=0; i<quantity; i++) addToCart(product);
              window.alert("Proceeding to checkout...");
            }}
            className="flex-1 bg-[#d07e20] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#b96c1a] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
