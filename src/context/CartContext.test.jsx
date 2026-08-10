import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';

function TestComponent() {
  const { 
    cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, isInCart,
    wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist, toastMsg 
  } = useCart();

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="wishlist-count">{wishlistItems.length}</div>
      <div data-testid="toast-msg">{toastMsg}</div>
      
      <button data-testid="add-item-1" onClick={() => addToCart({ id: 1, name: 'Product 1', price: 100 })}>Add 1</button>
      <button data-testid="add-item-2" onClick={() => addToCart({ id: 2, name: 'Product 2', price: 200 })}>Add 2</button>
      <button data-testid="remove-item-1" onClick={() => removeFromCart(1)}>Remove 1</button>
      <button data-testid="update-qty-1" onClick={() => updateQty(1, 1)}>Inc 1</button>
      <button data-testid="clear-cart" onClick={clearCart}>Clear Cart</button>
      
      <div data-testid="is-in-cart-1">{isInCart(1) ? 'Yes' : 'No'}</div>
      
      <button data-testid="toggle-wishlist-1" onClick={() => toggleWishlist({ id: 1, name: 'Product 1' })}>Toggle Wishlist 1</button>
      <button data-testid="remove-wishlist-1" onClick={() => removeFromWishlist(1)}>Remove Wishlist 1</button>
      <div data-testid="is-wishlisted-1">{isWishlisted(1) ? 'Yes' : 'No'}</div>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides initial cart state', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
  });

  it('adds items to cart and calculates count and total correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-item-1').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('100');
    
    // Add same item again to test qty increment
    act(() => {
      screen.getByTestId('add-item-1').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('200');

    // Add different item
    act(() => {
      screen.getByTestId('add-item-2').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('3');
    expect(screen.getByTestId('cart-total').textContent).toBe('400');
  });

  it('removes items from cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-item-1').click();
      screen.getByTestId('add-item-2').click();
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('2');

    act(() => {
      screen.getByTestId('remove-item-1').click();
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('is-in-cart-1').textContent).toBe('No');
  });

  it('updates item quantity', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-item-1').click(); // qty 1
    });

    act(() => {
      screen.getByTestId('update-qty-1').click(); // qty 2
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('200');
  });

  it('clears cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-item-1').click();
      screen.getByTestId('add-item-2').click();
    });

    act(() => {
      screen.getByTestId('clear-cart').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('toggles wishlist items', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('toggle-wishlist-1').click();
    });

    expect(screen.getByTestId('wishlist-count').textContent).toBe('1');
    expect(screen.getByTestId('is-wishlisted-1').textContent).toBe('Yes');

    // Toggle again removes it
    act(() => {
      screen.getByTestId('toggle-wishlist-1').click();
    });

    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
    expect(screen.getByTestId('is-wishlisted-1').textContent).toBe('No');
  });

  it('shows toast message and clears it after timeout', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByTestId('add-item-1').click();
    });

    expect(screen.getByTestId('toast-msg').textContent).toContain('added to cart');

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.getByTestId('toast-msg').textContent).toBe('');
  });

  it('throws an error if useCart is used outside CartProvider', () => {
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => render(<TestComponent />)).toThrow('useCart must be used inside CartProvider');
    
    console.error = originalError;
  });
});
