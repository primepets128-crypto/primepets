import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CategoryPage from './CategoryPage';
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

describe('CategoryPage', () => {
  it('renders shop by category header', () => {
    renderWithContext(<CategoryPage />);
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
  });

  it('renders products', () => {
    renderWithContext(<CategoryPage />);
    expect(screen.getAllByText(/Royal Canin Adult Dog/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Whiskas Dry Cat Food/i)[0]).toBeInTheDocument();
  });

  it('can switch pet tabs', () => {
    renderWithContext(<CategoryPage />);
    const dogsTab = screen.getAllByText(/Dogs/i)[0];
    fireEvent.click(dogsTab);
    expect(screen.getAllByText(/Royal Canin Adult Dog/i)[0]).toBeInTheDocument();
  });
});
