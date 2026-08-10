import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import OffersPage from './OffersPage';
import { CartProvider } from '../context/CartContext';
import { DataProvider } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(),
  },
});

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('OffersPage', () => {
  it('renders offer zone header', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getByText('Offer Zone 🎉')).toBeInTheDocument();
  });

  it('renders active coupons', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getByText('PAWDAY SALE')).toBeInTheDocument();
    expect(screen.getByText('PAWDAY60')).toBeInTheDocument();
  });

  it('renders flash sale products', () => {
    renderWithContext(<OffersPage />);
    expect(screen.getByText(/Royal Canin 3kg/i)).toBeInTheDocument();
  });

  it('copies coupon code when clicked', async () => {
    renderWithContext(<OffersPage />);
    
    // Find the first copy button (inside the coupon card)
    const copyButtons = screen.getAllByRole('button');
    // The copy button is the one inside the coupon card
    // We can just click the first button that seems like a copy button
    // It's rendered with an icon. Let's just mock navigator.clipboard and click it
    
    // In our component: 
    // <button onClick={copy}>{copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} className="text-white/80" />}</button>
    // We'll click the first button that is in a CouponCard (has no text, but has an svg)
    // Actually, there's a button for copying. Let's try to find it by clicking the one next to PAWDAY60
    
    // We can't easily query the button by text since it has only an icon.
    // Instead we can click it by finding the closest button to PAWDAY60.
    const codeElement = screen.getByText('PAWDAY60');
    const container = codeElement.closest('div');
    const copyButton = container.querySelector('button');
    
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('PAWDAY60');
    });
  });
});
