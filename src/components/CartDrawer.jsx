import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { trackFacebookEvent } from '../utils/metaPixel';

export default function CartDrawer() {
  const {
    cartOpen, setCartOpen,
    cartItems, cartTotal, cartCount,
    removeFromCart, updateQty, clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const savings = cartItems.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);

  if (!cartOpen && !checkoutOpen) return null;

  const handleOrderSuccess = (orderId) => {
    trackFacebookEvent('Purchase', {
      value: cartTotal,
      currency: 'INR',
      content_ids: cartItems.map(item => item.id),
      content_type: 'product',
      num_items: cartCount,
      order_id: orderId
    }, user?.email);

    setCheckoutOpen(false);
    setCartOpen(false);
    clearCart();
  };

  return (
    <>
      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-sm md:max-w-md bg-white z-[100] flex flex-col shadow-2xl"
            style={{ animation: 'slideInRight 0.3s ease' }}>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#d07e20] to-[#a65d14] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-white" />
                <div>
                  <p className="text-white font-black text-lg leading-tight">My Cart</p>
                  <p className="text-orange-100 text-xs">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button onClick={clearCart}
                    className="text-orange-100 text-xs font-semibold hover:text-white transition-colors border border-white/20 px-2.5 py-1 rounded-full">
                    Clear All
                  </button>
                )}
                <button onClick={() => setCartOpen(false)}
                  className="bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-colors">
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Coupon strip */}
            <div className="bg-green-50 border-b border-green-100 px-5 py-2.5 flex items-center gap-2">
              <Tag size={14} className="text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-xs font-semibold flex-1">Apply coupon for extra savings!</p>
              <button className="text-green-600 text-xs font-bold hover:underline">Apply →</button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-7xl mb-4">🛒</div>
                  <p className="text-gray-700 font-bold text-lg">Your cart is empty!</p>
                  <p className="text-gray-400 text-sm mt-1">Add some products for your fur babies 🐾</p>
                  <button
                    onClick={() => { setCartOpen(false); navigate('/category'); }}
                    className="mt-6 bg-[#d07e20] text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2">
                    <ShoppingBag size={16} /> Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#d07e20] font-semibold uppercase tracking-wide">{item.brand}</p>
                      <p className="text-gray-800 text-xs font-bold leading-snug line-clamp-2">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-gray-900 font-black text-sm">₹{item.price}</span>
                        {item.mrp && <span className="text-gray-400 text-[10px] line-through">₹{item.mrp}</span>}
                        {item.tag && <span className="text-green-600 text-[9px] font-bold bg-green-50 px-1.5 py-0.5 rounded">{item.tag}</span>}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-800">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-orange-50 text-[#d07e20] transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-gray-500 text-xs">= <span className="font-bold text-gray-700">₹{item.price * item.qty}</span></span>
                        <button onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer: summary + checkout */}
            {cartItems.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 space-y-3">
                {/* Savings */}
                {savings > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-green-600 text-sm">🎉</span>
                    <p className="text-green-700 text-xs font-semibold">
                      You're saving <span className="font-black">₹{savings}</span> on this order!
                    </p>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                    <span className="text-gray-700 font-semibold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (18%)</span>
                    <span className="text-gray-700 font-semibold">₹{Math.round(cartTotal * 0.18)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-gray-700 font-semibold">
                      ₹{(cartTotal >= 499 ? 0 : 49) + (cartCount * 100)}
                    </span>
                  </div>
                  {cartTotal < 499 && (
                    <p className="text-orange-500 text-[10px] font-medium">
                      Add ₹{499 - cartTotal} more for FREE base delivery!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="text-gray-800 font-bold">Total</span>
                    <span className="text-gray-900 font-black text-lg">
                      ₹{cartTotal + Math.round(cartTotal * 0.18) + (cartTotal >= 499 ? 0 : 49) + (cartCount * 100)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => { 
                    setCheckoutOpen(true); 
                    setCartOpen(false); 
                    trackFacebookEvent('InitiateCheckout', {
                      num_items: cartCount,
                      value: cartTotal,
                      currency: 'INR',
                      content_ids: cartItems.map(item => item.id),
                      content_type: 'product',
                      contents: cartItems.map(item => ({ id: item.id, quantity: item.qty }))
                    }, user?.email);
                  }}
                  className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <button onClick={() => setCartOpen(false)}
                  className="w-full text-gray-500 text-xs font-semibold py-1 hover:text-[#d07e20] transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onOrderSuccess={handleOrderSuccess}
      />

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
