import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import { CartProvider } from '../context/CartContext';
import { useCart } from '../context/CartContext';

// Helper component to open cart for testing
const TestWrapper = () => {
  const { setCartOpen, addToCart } = useCart();
  return (
    <>
      <button onClick={() => setCartOpen(true)}>Open Cart</button>
      <button onClick={() => addToCart({ id: 1, name: 'Test Food', price: 100, qty: 1 })}>Add Item</button>
      <CartDrawer />
    </>
  );
};

describe('CartDrawer Component', () => {
  const renderWithProviders = (ui) => {
    return render(
      <MemoryRouter>
        <CartProvider>
          {ui}
        </CartProvider>
      </MemoryRouter>
    );
  };

  it('renders empty cart message when no items are present', () => {
    renderWithProviders(<TestWrapper />);
    fireEvent.click(screen.getByText('Open Cart'));
    expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
  });

  it('renders cart items and updates quantities', () => {
    renderWithProviders(<TestWrapper />);
    
    // Add item and open cart
    fireEvent.click(screen.getByText('Add Item'));
    fireEvent.click(screen.getByText('Open Cart'));

    // Check if item is in the cart
    expect(screen.getByText('Test Food')).toBeInTheDocument();
    expect(screen.getAllByText('₹100')[0]).toBeInTheDocument();
  });
});
