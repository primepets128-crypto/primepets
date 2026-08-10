import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDeals from './AdminDeals';
import { DataProvider } from '../../context/DataContext';
import { CartProvider } from '../../context/CartContext';

describe('AdminDeals', () => {
  it('renders manage deals header', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminDeals />
        </CartProvider>
      </DataProvider>
    );
    expect(screen.getByText('Deals & Offers')).toBeInTheDocument();
    expect(screen.getByText('Add Deal')).toBeInTheDocument();
  });

  it('can open add deal modal', () => {
    render(
      <DataProvider>
        <CartProvider>
          <AdminDeals />
        </CartProvider>
      </DataProvider>
    );
    fireEvent.click(screen.getByText('Add Deal'));
    expect(screen.getByText('Add New Deal')).toBeInTheDocument();
  });
});
