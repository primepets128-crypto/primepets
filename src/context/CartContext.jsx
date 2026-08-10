import React, { createContext, useContext, useState, useCallback } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems]       = useState([]);   // [{...product, qty}]
  const [wishlistItems, setWishlistItems] = useState([]); // [...product]
  const [cartOpen, setCartOpen]         = useState(false);
  const [toastMsg, setToastMsg]         = useState('');

  /* ── Toast helper ── */
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  }, []);

  /* ── CART ── */
  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 "${product.name}" added to cart!`);
    setCartOpen(true);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCartItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
      return next.filter(i => i.qty > 0);
    });
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const isInCart  = useCallback((id) => cartItems.some(i => i.id === id), [cartItems]);

  /* ── WISHLIST ── */
  const toggleWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const has = prev.some(i => i.id === product.id);
      if (has) {
        showToast(`💔 Removed from wishlist`);
        return prev.filter(i => i.id !== product.id);
      }
      showToast(`❤️ "${product.name}" saved to wishlist!`);
      return [...prev, product];
    });
  }, [showToast]);

  const isWishlisted = useCallback((id) => wishlistItems.some(i => i.id === id), [wishlistItems]);
  const removeFromWishlist = useCallback((id) => setWishlistItems(prev => prev.filter(i => i.id !== id)), []);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQty, clearCart, isInCart,
      wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist,
      toastMsg, showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
