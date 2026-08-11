import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockSetCartOpen = vi.fn();
const mockClearCart = vi.fn();

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cartOpen: true,
    setCartOpen: mockSetCartOpen,
    cartItems: [{ id: 1, name: 'Dog Food', price: 500, qty: 1 }],
    cartTotal: 500,
    cartCount: 1,
    removeFromCart: vi.fn(),
    updateQty: vi.fn(),
    clearCart: mockClearCart,
  }),
}));

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    frontendSettings: {
      razorpayKeyId: 'rzp_test_123',
    },
  }),
}));

import CartDrawer from '../../components/CartDrawer';

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart drawer when open', () => {
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    expect(screen.getByText('My Cart')).toBeTruthy();
    expect(screen.getByText('Dog Food')).toBeTruthy();
  });

  it('opens checkout modal on Proceed to Checkout', () => {
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    const proceedBtn = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(proceedBtn);
    expect(screen.getByText(/Delivery Details/i)).toBeTruthy(); // from CheckoutModal
  });

  it('clears cart when clicking Clear All', () => {
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    const clearBtn = screen.getByText(/Clear All/i);
    fireEvent.click(clearBtn);
    expect(mockClearCart).toHaveBeenCalled();
  });
});
