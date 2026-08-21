import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminOffers from './AdminOffers';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';

// Mock window.confirm
window.confirm = vi.fn().mockReturnValue(true);

describe('AdminOffers', () => {
  it('renders Offer Zone Manager header and tabs', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminOffers />
        </CartProvider>
      </DataProvider>
    );
    expect(screen.getByText('Offer Zone Manager')).toBeInTheDocument();
    expect(screen.getByText('🏷️ Coupons')).toBeInTheDocument();
    expect(screen.getByText('🔥 Deal Categories')).toBeInTheDocument();
  });

  it('can switch tabs to Deal Categories and open add form', async () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminOffers />
        </CartProvider>
      </DataProvider>
    );

    // Switch to Deal Categories tab
    fireEvent.click(screen.getByText('🔥 Deal Categories'));
    
    // Wait for the tab to switch
    await waitFor(() => {
      expect(screen.getByText('Add Category')).toBeInTheDocument();
    });

    // Open add category form
    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Save Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. DOG FOOD')).toBeInTheDocument();
  });
});
